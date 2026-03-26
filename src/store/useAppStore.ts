import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppStep, AppStore, Category, SavedRecipe } from '../types';
import { AIErrorType } from '../lib/api';

const initialState = {
  step: 1 as AppStep,
  ingredients: [],
  selectedCategory: 'Semua' as Category,
  menuSuggestions: [],
  selectedMenu: null,
  recipeDetail: null,
  isLoading: false,
  loadingMessage: '',
  error: null,
  errorType: null as AIErrorType | null,
  savedRecipes: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ step, error: null, errorType: null }),

      addIngredient: (ingredient) => {
        const { ingredients } = get();
        if (ingredients.includes(ingredient)) return;
        set({ ingredients: [...ingredients, ingredient] });
      },
      removeIngredient: (ingredient) =>
        set((state) => ({
          ingredients: state.ingredients.filter((i) => i !== ingredient),
        })),
      clearIngredients: () => set({ ingredients: [] }),

      setCategory: (selectedCategory) => set({ selectedCategory }),

      setLoading: (isLoading, message = '') =>
        set({ isLoading, loadingMessage: message }),
      setError: (error, errorType = 'unknown') =>
        set({ error, errorType: error ? errorType : null, isLoading: false }),

      setMenuSuggestions: (menuSuggestions) => set({ menuSuggestions }),
      selectMenu: (selectedMenu) => set({ selectedMenu }),
      setRecipeDetail: (recipeDetail) => set({ recipeDetail }),

      saveRecipe: (recipe, menu) => {
        const newItem: SavedRecipe = {
          id: menu.id,
          name: menu.name,
          emoji: menu.emoji,
          category: menu.category,
          estimatedTime: menu.estimatedTime,
          savedAt: new Date().toISOString(),
          recipeDetail: recipe,
        };
        set((state) => ({
          savedRecipes: [
            newItem,
            ...state.savedRecipes.filter((s) => s.id !== menu.id),
          ],
        }));
      },
      unsaveRecipe: (menuId) =>
        set((state) => ({
          savedRecipes: state.savedRecipes.filter((s) => s.id !== menuId),
        })),
      isRecipeSaved: (menuId) =>
        get().savedRecipes.some((s) => s.id === menuId),

      reset: () =>
        set({
          step: 1,
          ingredients: [],
          selectedCategory: 'Semua',
          menuSuggestions: [],
          selectedMenu: null,
          recipeDetail: null,
          isLoading: false,
          loadingMessage: '',
          error: null,
          errorType: null,
        }),
    }),
    {
      name: 'masakapa-storage',
      partialize: (state) => ({ savedRecipes: state.savedRecipes }),
    },
  ),
);
