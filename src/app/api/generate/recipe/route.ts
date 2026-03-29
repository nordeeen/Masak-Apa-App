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
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'anonymous';
  const { success, reset } = await ratelimit.limit(ip);

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: 'Terlalu banyak request. Coba lagi sebentar.',
        errorType: 'rate_limit',
        retryAfter,
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
      // console.log('=== RECIPE OK ===', recipe);
    } catch (e) {
      // console.log('=== PARSE ERROR ===', e);
      const isGeminiQuota =
        e instanceof Error && e.message.includes('RESOURCE_EXHAUSTED');

      if (isGeminiQuota) {
        return NextResponse.json(
          {
            error:
              'Kuota AI sedang habis. Coba lagi besok atau dalam beberapa saat.',
            errorType: 'api_error',
          },
          { status: 429 },
        );
      }

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
