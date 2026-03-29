import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  buildPrompt,
  buildCategoryFilter,
  clampMenuCount,
  generateMenuText,
} from '@/lib/menusApi';
import { getErrorStatus, handleApiError } from '@/lib/apiError';
import { ratelimit } from '@/lib/ratelimit';
import { INGREDIENT_REGEX } from '@/constants';

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
    const resetIn = Math.ceil((reset - Date.now()) / 1000); // detik
    return NextResponse.json(
      {
        error: 'Terlalu banyak request. Coba lagi sebentar.',
        errorType: 'rate_limit',
        retryAfter: resetIn,
      },
      { status: 429 },
    );
  }

  const { ingredients, category, count } = await req.json().catch(() => ({}));

  if (!ingredients?.length) {
    return NextResponse.json(
      { error: 'Bahan tidak boleh kosong' },
      { status: 400 },
    );
  }

  const invalidIngredient = ingredients.find(
    (ing: string) => !INGREDIENT_REGEX.test(ing.trim()),
  );

  if (invalidIngredient) {
    return NextResponse.json(
      { error: 'Nama bahan tidak valid' },
      { status: 400 },
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const menuCount = clampMenuCount(count);
    const categoryFilter = buildCategoryFilter(category);
    const prompt = buildPrompt(ingredients, categoryFilter, menuCount);

    let menus;
    try {
      menus = await generateMenuText(ai, prompt);
      // console.log('=== MENUS OK ===', menus);
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

    return NextResponse.json({
      menus,
      meta: {
        totalMenus: menus.length,
        ingredientsUsed: ingredients.length,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error('Error di /api/generate/menus:', error);
    return NextResponse.json(handleApiError(error), {
      status: getErrorStatus(error),
    });
  }
}
