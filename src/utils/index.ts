import { RecipeDetail } from '@/types';

export function formatRecipeText(recipe: RecipeDetail): string {
  const ingredients = recipe.ingredients
    .map((ing) => `- ${ing.name}${ing.amount ? ` (${ing.amount})` : ''}`)
    .join('\n');

  const steps = recipe.steps.map((step, i) => `${i + 1}. ${step}`).join('\n\n');

  return [
    `📝 ${recipe.name}`,
    '',
    '🛒 Bahan-Bahan',
    ingredients,
    '',
    '👨‍🍳 Cara Memasak',
    steps,
  ].join('\n');
}

export function getYoutubeUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
