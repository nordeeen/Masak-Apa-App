import {
  CONSONANT_CLUSTER_REGEX,
  INGREDIENT_REGEX,
  REPEATED_CHAR_REGEX,
} from '@/constants';
import { RecipeDetail } from '@/types';

export function hasEnoughVowels(value: string): boolean {
  const letters = value.replace(/\s/g, '');
  const vowels = letters.match(/[aiueoàáâãäåæèéêëìíîïòóôõöùúûü]/gi) ?? [];
  return vowels.length / letters.length >= 0.2;
}

export function isValidIngredient(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (!INGREDIENT_REGEX.test(trimmed)) return false;
  if (!/\p{L}/u.test(trimmed)) return false;
  if (REPEATED_CHAR_REGEX.test(trimmed)) return false;
  if (CONSONANT_CLUSTER_REGEX.test(trimmed)) return false;
  if (!hasEnoughVowels(trimmed)) return false;
  return true;
}

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
