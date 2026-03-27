import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { buildRecipePrompt, generateRecipeText } from '@/lib/menusApi';
import { handleApiError, getErrorStatus } from '@/lib/apiError';
import { ratelimit } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }

  // Rate limit check
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      {
        error: 'Terlalu banyak request. Coba lagi sebentar.',
        errorType: 'rate_limit',
      },
      { status: 429 },
    );
  }

  const {
    menuName,
    ingredients = [],
    category = 'Indonesia',
  } = await req.json().catch(() => ({}));

  if (!menuName) {
    return NextResponse.json(
      { error: 'menuName tidak boleh kosong' },
      { status: 400 },
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildRecipePrompt(menuName, category, ingredients);

    let recipe;
    try {
      recipe = await generateRecipeText(ai, prompt);
    } catch {
      return NextResponse.json(
        {
          error: 'AI memberikan response tidak valid',
          errorType: 'parse_error',
        },
        { status: 422 },
      );
    }

    return NextResponse.json({ recipe });
  } catch (error: unknown) {
    console.error('Error di /api/generate/recipe:', error);
    return NextResponse.json(handleApiError(error), {
      status: getErrorStatus(error),
    });
  }
}
