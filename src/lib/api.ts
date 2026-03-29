import { AIErrorType, Category, MenuSuggestion, RecipeDetail } from '../types';

export class AIError extends Error {
  constructor(
    public errorType: AIErrorType,
    message: string,
    public retryAfter?: number,
  ) {
    super(message);
    this.name = 'AIError';
  }
}

// Map HTTP status / errorType string from server to AIErrorType
function resolveErrorType(status: number, serverType?: string): AIErrorType {
  if (serverType === 'rate_limit' || status === 429) return 'rate_limit';
  if (serverType === 'api_error' || status === 400 || status === 403)
    return 'api_error';
  if (serverType === 'parse_error' || status === 422) return 'parse_error';
  if (serverType === 'network_error' || status === 503) return 'network_error';
  return 'unknown';
}

// FETCH MENU SUGGESTIONS
export async function fetchMenuSuggestions(
  ingredients: string[],
  category: Category,
): Promise<MenuSuggestion[]> {
  try {
    const res = await fetch('/api/generate/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, category }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new AIError(
        resolveErrorType(res.status, data?.errorType),
        data?.error ?? 'Gagal mengambil menu',
        data?.retryAfter,
      );
    }

    return data.menus as MenuSuggestion[];
  } catch (err) {
    if (err instanceof AIError) throw err;
    throw new AIError('network_error', 'Tidak ada koneksi internet');
  }
}

// FETCH RECIPE DETAIL
export async function fetchRecipeDetail(
  menuName: string,
  ingredients: string[],
  category: string,
): Promise<RecipeDetail> {
  try {
    const res = await fetch('/api/generate/recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ menuName, ingredients, category }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new AIError(
        resolveErrorType(res.status, data?.errorType),
        data?.error ?? 'Gagal mengambil resep',
        data?.retryAfter,
      );
    }

    return data.recipe as RecipeDetail;
  } catch (err) {
    if (err instanceof AIError) throw err;
    throw new AIError('network_error', 'Tidak ada koneksi internet');
  }
}
