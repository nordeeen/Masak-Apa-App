import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AIErrorType,
  AppStep,
  AppStore,
  Category,
  SavedRecipe,
} from '../types';

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
  retryAfter: null,
  errorType: null as AIErrorType | null,
  savedRecipes: [],
  hasHydrated: false,
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => {
        if (step === 1) {
          return set({
            step: 1,
            error: null,
            errorType: null,
            retryAfter: null,
            menuSuggestions: [],
            selectedMenu: null,
            recipeDetail: null,
          });
        }
        return set({ step, error: null, errorType: null, retryAfter: null });
      },

      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),

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

      setError: (message, errorType, retryAfter = null) =>
        set({
          error: message,
          errorType: message ? (errorType ?? null) : null,
          retryAfter: message ? retryAfter : null,
          isLoading: false,
        }),

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
          retryAfter: null,
        }),
    }),
    {
      name: 'masakapa-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        savedRecipes: state.savedRecipes,
        step: state.step,
        menuSuggestions: state.menuSuggestions,
        selectedMenu: state.selectedMenu,
        recipeDetail: state.recipeDetail,
        ingredients: state.ingredients,
        selectedCategory: state.selectedCategory,
      }),
    },
  ),
);
