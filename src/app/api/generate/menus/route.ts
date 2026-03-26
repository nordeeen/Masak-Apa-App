import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import {
  buildPrompt,
  buildCategoryFilter,
  clampMenuCount,
  generateMenuText,
} from '@/lib/menusApi';
import { getErrorStatus, handleApiError } from '@/lib/apiError';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY belum diset di .env.local' },
      { status: 500 },
    );
  }

  const { ingredients, category, count } = await req.json().catch(() => ({}));

  if (!ingredients?.length) {
    return NextResponse.json(
      { error: 'Ingredients tidak boleh kosong' },
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
    } catch {
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
