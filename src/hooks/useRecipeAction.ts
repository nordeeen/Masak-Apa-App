import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatRecipeText, getYoutubeUrl } from '@/utils';
import type { RecipeDetail, MenuSuggestion } from '../types';

export function useRecipeActions(recipe: RecipeDetail, menu: MenuSuggestion) {
  const { saveRecipe, unsaveRecipe, isRecipeSaved, reset } = useAppStore();
  const [saved, setSaved] = useState(() => isRecipeSaved(menu.id));
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = formatRecipeText(recipe);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function toggleSave() {
    if (saved) {
      unsaveRecipe(menu.id);
      setSaved(false);
    } else {
      saveRecipe(recipe, menu);
      setSaved(true);
    }
  }

  const youtubeUrl = getYoutubeUrl(recipe.youtubeSearchQuery);

  return { saved, copied, handleCopy, toggleSave, youtubeUrl, reset };
}
