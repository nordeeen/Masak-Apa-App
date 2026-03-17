// ===========================
// CORE TYPES
// ===========================

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

// ===========================
// STATE TYPES
// ===========================

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

// ===========================
// API TYPES
// ===========================

export interface GeminiMenuResponse {
  menus: MenuSuggestion[];
}

export interface GeminiRecipeResponse {
  recipe: RecipeDetail;
}

// ===========================
// LOCAL STORAGE
// ===========================

export interface SavedRecipe {
  id: string;
  name: string;
  emoji: string;
  category: string;
  estimatedTime: string;
  savedAt: string; // ISO date string
  recipeDetail: RecipeDetail;
}
