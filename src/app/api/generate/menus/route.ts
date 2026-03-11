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
    const { ingredients, category } = await req.json();

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'Ingredients tidak boleh kosong' },
        { status: 400 },
      );
    }

    const categoryFilter =
      category && category !== 'Semua'
        ? `Fokus pada masakan ${category}.`
        : 'Boleh dari masakan Indonesia, Western, Chinese, atau Japanese.';

    const prompt = `
Kamu adalah asisten memasak yang membantu merekomendasikan menu masakan.

Pengguna memiliki bahan-bahan berikut di rumah:
${ingredients.map((i: string) => `- ${i}`).join('\n')}

${categoryFilter}

Rekomendasikan tepat 4 menu masakan yang BISA dibuat dari bahan-bahan tersebut (boleh tambah bumbu dasar seperti garam, minyak, bawang).

Balas HANYA dengan JSON valid berikut, tanpa penjelasan, tanpa markdown:
{
  "menus": [
    {
      "id": "menu_1",
      "name": "Nama Menu",
      "emoji": "🍳",
      "category": "Indonesia",
      "estimatedTime": "20 mnt",
      "difficulty": "Mudah",
      "shortDesc": "Deskripsi singkat 1 kalimat yang menggugah selera.",
      "matchedIngredients": ["bahan1", "bahan2"]
    }
  ]
}

Aturan:
- difficulty harus salah satu dari: "Mudah", "Sedang", "Sulit"
- estimatedTime format: "X mnt" atau "X jam"
- matchedIngredients hanya isi bahan yang ada di list pengguna
- emoji yang relevan dengan makanannya
- Balas HANYA JSON, tidak ada teks lain
    `.trim();

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const rawText = response.text ?? '';
    const cleaned = rawText.replace(/```json|```/g, '').trim();

    try {
      const parsed = JSON.parse(cleaned);
      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json(
        {
          error: 'AI memberikan response tidak valid',
          errorType: 'parse_error',
        },
        { status: 422 },
      );
    }
  } catch (error: unknown) {
    console.error('Error di /api/generate/menus:', error);

    const errMsg = error instanceof Error ? error.message : '';

    if (
      errMsg.includes('429') ||
      errMsg.toLowerCase().includes('quota') ||
      errMsg.toLowerCase().includes('rate')
    ) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', errorType: 'rate_limit' },
        { status: 429 },
      );
    }
    if (errMsg.includes('403') || errMsg.toLowerCase().includes('api key')) {
      return NextResponse.json(
        { error: 'API key tidak valid', errorType: 'api_error' },
        { status: 400 },
      );
    }
    if (errMsg.toLowerCase().includes('fetch')) {
      return NextResponse.json(
        { error: 'Tidak bisa menghubungi AI', errorType: 'network_error' },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: 'Terjadi kesalahan tidak diketahui', errorType: 'unknown' },
      { status: 500 },
    );
  }
}
