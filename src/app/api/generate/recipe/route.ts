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
    const { menuName, ingredients, category } = await req.json();

    if (!menuName) {
      return NextResponse.json(
        { error: 'menuName tidak boleh kosong' },
        { status: 400 },
      );
    }

    const prompt = `
Kamu adalah chef profesional yang menulis resep masakan lengkap.

Buatkan resep lengkap untuk: "${menuName}" (masakan ${category ?? 'Indonesia'})

Bahan yang dimiliki pengguna: ${ingredients?.join(', ') ?? 'tidak diketahui'}

Balas HANYA dengan JSON valid berikut, tanpa penjelasan, tanpa markdown:
{
  "recipe": {
    "menuId": "menu_detail",
    "name": "${menuName}",
    "emoji": "🍳",
    "description": "Deskripsi 2-3 kalimat yang menggugah selera tentang menu ini.",
    "servings": 2,
    "estimatedTime": "25 mnt",
    "difficulty": "Mudah",
    "category": "${category ?? 'Indonesia'}",
    "ingredients": [
      {
        "name": "Nama bahan",
        "amount": "jumlah dan satuan, misal: 200 gram atau 2 butir",
        "isUserHave": true
      }
    ],
    "steps": [
      "Langkah 1 yang jelas dan detail.",
      "Langkah 2...",
      "Langkah 3..."
    ],
    "tips": "Satu tips singkat dari chef untuk hasil terbaik.",
    "youtubeSearchQuery": "query pencarian youtube untuk resep ini dalam bahasa Indonesia"
  }
}

Aturan:
- difficulty: "Mudah", "Sedang", atau "Sulit"
- isUserHave: true jika bahan ada di list pengguna, false jika perlu beli
- steps minimal 5 langkah yang detail dan mudah diikuti
- youtubeSearchQuery: query yang natural, misal "cara membuat nasi goreng spesial"
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
    console.error('Error di /api/generate/recipe:', error);

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
