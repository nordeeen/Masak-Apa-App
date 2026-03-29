export type AIErrorType =
  | 'rate_limit'
  | 'api_error'
  | 'parse_error'
  | 'network_error'
  | 'unknown';

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
  estimatedTime: string;
  difficulty: 'Mudah' | 'Sedang' | 'Sulit';
  imageUrl: string;
  imageUrlFallback: string;
  shortDesc: string;
  matchedIngredients: string[];
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
  youtubeSearchQuery: string;
}

export interface Ingredient {
  name: string;
  amount: string;
  isUserHave?: boolean;
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
  savedAt: string;
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
  retryAfter: number | null;
  hasHydrated: boolean;

  // actions
  setHasHydrated: (hasHydrated: boolean) => void;
  setStep: (step: AppStep) => void;
  addIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  clearIngredients: () => void;
  setCategory: (category: Category) => void;
  setLoading: (loading: boolean, message?: string) => void;
  setError: (
    message: string | null,
    errorType?: AIErrorType,
    retryAfter?: number | null,
  ) => void;
  setMenuSuggestions: (menus: MenuSuggestion[]) => void;
  selectMenu: (menu: MenuSuggestion) => void;
  setRecipeDetail: (recipe: RecipeDetail) => void;
  saveRecipe: (recipe: RecipeDetail, menu: MenuSuggestion) => void;
  unsaveRecipe: (menuId: string) => void;
  isRecipeSaved: (menuId: string) => boolean;
  reset: () => void;
}
