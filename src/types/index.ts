import { AIErrorType } from '@/lib/api';

export type Category =
  | 'Semua'
  | 'Indonesia'
  | 'Western'
  | 'Chinese'
  | 'Japanese';

export interface MenuSuggestion {
  id: string;
  name: string;
  emoji: string;
  category: string;
  estimatedTime: string; // e.g. "20 mnt"
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  imageUrl: string;
  imageUrlFallback: string;
  shortDesc: string;
  matchedIngredients: string[]; // bahan dari user yang cocok
}

export interface RecipeDetail {
  menuId: string;
  name: string;
  emoji: string;
  description: string;
  servings: number;
  estimatedTime: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  category: string;
  ingredients: Ingredient[];
  steps: string[];
  tips?: string;
  youtubeSearchQuery: string; // query untuk YouTube search URL
}

export interface Ingredient {
  name: string;
  amount: string; // e.g. "2 butir", "200 gram"
  isUserHave?: boolean; // apakah user sudah punya bahan ini
}

export type AppStep = 1 | 2 | 3;

export interface AppState {
  step: AppStep;
  ingredients: string[];
  selectedCategory: Category;
  menuSuggestions: MenuSuggestion[];
  selectedMenu: MenuSuggestion | null;
  recipeDetail: RecipeDetail | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

export interface GeminiMenuResponse {
  menus: MenuSuggestion[];
}

export interface GeminiRecipeResponse {
  recipe: RecipeDetail;
}

export interface SavedRecipe {
  id: string;
  name: string;
  emoji: string;
  category: string;
  estimatedTime: string;
  savedAt: string; // ISO date string
  recipeDetail: RecipeDetail;
}

export interface AIErrorProps {
  type:
    | 'rate_limit'
    | 'api_error'
    | 'parse_error'
    | 'network_error'
    | 'unknown';
  onRetry?: () => void;
  onBack?: () => void;
}

export interface LoadingStateProps {
  message?: string;
  messages?: string[];
  sub?: string;
}

export interface Props {
  recipe: RecipeDetail;
  menu: MenuSuggestion;
}

export interface AppStore {
  step: AppStep;
  ingredients: string[];
  selectedCategory: Category;
  menuSuggestions: MenuSuggestion[];
  selectedMenu: MenuSuggestion | null;
  recipeDetail: RecipeDetail | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  errorType: AIErrorType | null;
  savedRecipes: SavedRecipe[];

  setStep: (step: AppStep) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setCategory: (category: Category) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setError: (error: string | null, errorType?: AIErrorType) => void;
  setMenuSuggestions: (menus: MenuSuggestion[]) => void;
  selectMenu: (menu: MenuSuggestion) => void;
  setRecipeDetail: (recipe: RecipeDetail) => void;
  saveRecipe: (recipe: RecipeDetail, menu: MenuSuggestion) => void;
  unsaveRecipe: (menuId: string) => void;
  isRecipeSaved: (menuId: string) => boolean;
  reset: () => void;
}
