import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY belum diset di .env.local' },
      { status: 500 },
    );
  }

  try {
    const { ingredients, category, count = 6 } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Ingredients tidak boleh kosong' },
        { status: 400 },
      );
    }

    const menuCount = Math.min(Math.max(Number(count) || 6, 4), 10);

    const categoryFilter =
      category && category !== 'Semua'
        ? `Fokus pada masakan ${category}.`
        : 'Variasikan dari masakan Indonesia, Western, Chinese, dan Japanese.';

    const ai = new GoogleGenAI({ apiKey });

    // ─── Step 1: Generate menu list via Gemini text ───────────────────────────
    const prompt = `
Kamu adalah asisten memasak profesional yang membantu merekomendasikan menu masakan.

Pengguna memiliki bahan-bahan berikut di rumah:
${ingredients.map((i: string) => `- ${i}`).join('\n')}

${categoryFilter}

Rekomendasikan tepat ${menuCount} menu masakan yang BISA dibuat dari bahan-bahan tersebut (boleh tambah bumbu dasar seperti garam, minyak, bawang, bawang putih, bawang merah).

Balas HANYA dengan JSON valid berikut, tanpa penjelasan, tanpa markdown:
{
  "menus": [
    {
      "id": "menu_1",
      "name": "Nama Menu",
      "nameEn": "English Name",
      "emoji": "🍳",
      "category": "Indonesia",
      "estimatedTime": "20 mnt",
      "difficulty": "Mudah",
      "calories": "350 kkal",
      "servings": "2 porsi",
      "shortDesc": "Deskripsi singkat 1 kalimat yang menggugah selera.",
      "keyTechnique": "Teknik masak utama, contoh: Tumis, Goreng, Rebus",
      "matchedIngredients": ["bahan1", "bahan2"],
      "missingIngredients": ["bahan yang perlu dibeli"],
      "tags": ["Gurih", "Pedas"],
      "imagePrompt": "professional food photography of [nama menu in english], beautifully plated on elegant ceramic, overhead shot, soft natural lighting, restaurant quality, photorealistic"
    }
  ]
}

Aturan:
- difficulty harus salah satu dari: "Mudah", "Sedang", "Sulit"
- estimatedTime format: "X mnt" atau "X jam Y mnt"
- calories perkiraan kalori per porsi
- matchedIngredients hanya isi bahan yang ada di list pengguna
- missingIngredients bahan tambahan yang diperlukan selain bumbu dasar
- tags maksimal 3 dari: ["Pedas", "Gurih", "Manis", "Asam", "Sehat", "Berkuah", "Crispy", "Creamy", "Vegetarian", "High Protein"]
- imagePrompt dalam bahasa Inggris, deskripsi visual spesifik dan menggugah selera untuk generate foto makanan realistis
- Balas HANYA JSON, tidak ada teks lain
    `.trim();

    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.7, topP: 0.9 },
    });

    const rawText = textResponse.text ?? '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    let parsed: {
      menus: Array<{
        id: string;
        name: string;
        nameEn?: string;
        category: string;
        tags: string[];
        imagePrompt?: string;
        [key: string]: unknown;
      }>;
    };

    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        {
          error: 'AI memberikan response tidak valid',
          errorType: 'parse_error',
        },
        { status: 422 },
      );
    }

    // ─── Step 2: Generate food images via Imagen 3 ────────────────────────────
    // Run in parallel untuk semua menu sekaligus
    const enrichedMenus = await Promise.all(
      parsed.menus.map(async (menu) => {
        try {
          const imagePrompt =
            menu.imagePrompt ??
            `professional food photography of ${menu.nameEn ?? menu.name}, beautifully plated, soft natural lighting, restaurant quality, photorealistic`;

          const imageResponse = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: imagePrompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '4:3',
            },
          });

          const imageBytes =
            imageResponse.generatedImages?.[0]?.image?.imageBytes ?? null;

          return {
            ...menu,
            // Data URL base64 - langsung pakai di <img src="..."> tanpa upload ke mana pun
            imageUrl: imageBytes
              ? `data:image/jpeg;base64,${imageBytes}`
              : null,
            imageSource: imageBytes ? 'imagen3' : 'none',
          };
        } catch (imgErr) {
          console.warn(`Gagal generate gambar untuk "${menu.name}":`, imgErr);
          return {
            ...menu,
            imageUrl: null,
            imageSource: 'none',
          };
        }
      }),
    );

    return NextResponse.json({
      menus: enrichedMenus,
      meta: {
        totalMenus: enrichedMenus.length,
        ingredientsUsed: ingredients.length,
        withGeneratedImage: enrichedMenus.filter(
          (m) => m.imageSource === 'imagen3',
        ).length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error('Error di /api/generate/menus:', error);

    const errMsg = error instanceof Error ? error.message : '';

    if (
      errMsg.includes('429') ||
      errMsg.toLowerCase().includes('quota') ||
      errMsg.toLowerCase().includes('rate')
    ) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Coba lagi dalam beberapa detik.',
          errorType: 'rate_limit',
        },
        { status: 429 },
      );
    }
    if (errMsg.includes('403') || errMsg.toLowerCase().includes('api key')) {
      return NextResponse.json(
        { error: 'API key tidak valid atau expired', errorType: 'api_error' },
        { status: 400 },
      );
    }
    if (errMsg.toLowerCase().includes('fetch')) {
      return NextResponse.json(
        {
          error: 'Tidak bisa menghubungi AI. Cek koneksi internet.',
          errorType: 'network_error',
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan tidak diketahui', errorType: 'unknown' },
      { status: 500 },
    );
  }
}

// import { NextRequest, NextResponse } from 'next/server';
// import { GoogleGenAI } from '@google/genai';

// export async function POST(req: NextRequest) {
//   const apiKey = process.env.GEMINI_API_KEY;

//   if (!apiKey) {
//     return NextResponse.json(
//       { error: 'GEMINI_API_KEY belum diset di .env.local' },
//       { status: 500 },
//     );
//   }

//   try {
//     const { ingredients, category } = await req.json();

//     if (!ingredients || ingredients.length === 0) {
//       return NextResponse.json(
//         { error: 'Ingredients tidak boleh kosong' },
//         { status: 400 },
//       );
//     }

//     const categoryFilter =
//       category && category !== 'Semua'
//         ? `Fokus pada masakan ${category}.`
//         : 'Boleh dari masakan Indonesia, Western, Chinese, atau Japanese.';

//     const prompt = `
// Kamu adalah asisten memasak yang membantu merekomendasikan menu masakan.

// Pengguna memiliki bahan-bahan berikut di rumah:
// ${ingredients.map((i: string) => `- ${i}`).join('\n')}

// ${categoryFilter}

// Rekomendasikan tepat 4 menu masakan yang BISA dibuat dari bahan-bahan tersebut (boleh tambah bumbu dasar seperti garam, minyak, bawang).

// Balas HANYA dengan JSON valid berikut, tanpa penjelasan, tanpa markdown:
// {
//   "menus": [
//     {
//       "id": "menu_1",
//       "name": "Nama Menu",
//       "emoji": "🍳",
//       "category": "Indonesia",
//       "estimatedTime": "20 mnt",
//       "difficulty": "Mudah",
//       "shortDesc": "Deskripsi singkat 1 kalimat yang menggugah selera.",
//       "matchedIngredients": ["bahan1", "bahan2"]
//     }
//   ]
// }

// Aturan:
// - difficulty harus salah satu dari: "Mudah", "Sedang", "Sulit"
// - estimatedTime format: "X mnt" atau "X jam"
// - matchedIngredients hanya isi bahan yang ada di list pengguna
// - emoji yang relevan dengan makanannya
// - Balas HANYA JSON, tidak ada teks lain
//     `.trim();

//     const ai = new GoogleGenAI({ apiKey });
//     const response = await ai.models.generateContent({
//       model: 'gemini-2.5-flash',
//       contents: prompt,
//     });

//     const rawText = response.text ?? '';
//     const cleaned = rawText.replace(/```json|```/g, '').trim();

//     try {
//       const parsed = JSON.parse(cleaned);
//       return NextResponse.json(parsed);
//     } catch {
//       return NextResponse.json(
//         {
//           error: 'AI memberikan response tidak valid',
//           errorType: 'parse_error',
//         },
//         { status: 422 },
//       );
//     }
//   } catch (error: unknown) {
//     console.error('Error di /api/generate/menus:', error);

//     const errMsg = error instanceof Error ? error.message : '';

//     if (
//       errMsg.includes('429') ||
//       errMsg.toLowerCase().includes('quota') ||
//       errMsg.toLowerCase().includes('rate')
//     ) {
//       return NextResponse.json(
//         { error: 'Rate limit exceeded', errorType: 'rate_limit' },
//         { status: 429 },
//       );
//     }
//     if (errMsg.includes('403') || errMsg.toLowerCase().includes('api key')) {
//       return NextResponse.json(
//         { error: 'API key tidak valid', errorType: 'api_error' },
//         { status: 400 },
//       );
//     }
//     if (errMsg.toLowerCase().includes('fetch')) {
//       return NextResponse.json(
//         { error: 'Tidak bisa menghubungi AI', errorType: 'network_error' },
//         { status: 503 },
//       );
//     }

//     return NextResponse.json(
//       { error: 'Terjadi kesalahan tidak diketahui', errorType: 'unknown' },
//       { status: 500 },
//     );
//   }
// }
