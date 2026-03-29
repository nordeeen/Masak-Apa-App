import { useAppStore } from '../store/useAppStore';
import { fetchMenuSuggestions, fetchRecipeDetail, AIError } from '../lib/api';

export function useHomeActions() {
  const {
    step,
    ingredients,
    selectedCategory,
    selectedMenu,
    setStep,
    setLoading,
    setMenuSuggestions,
    setRecipeDetail,
    setError,
  } = useAppStore();

  async function handleFindMenus() {
    setLoading(true, 'AI sedang menganalisis bahanmu...');
    try {
      const menus = await fetchMenuSuggestions(ingredients, selectedCategory);
      setMenuSuggestions(menus);
      setStep(2);
    } catch (err) {
      if (err instanceof AIError) {
        setError(err.message, err.errorType, err.retryAfter ?? null);
      } else {
        setError('Terjadi kesalahan tidak diketahui', 'unknown');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGetRecipe() {
    if (!selectedMenu) return;
    setLoading(true, 'Menyiapkan resep lengkap...');
    try {
      const recipe = await fetchRecipeDetail(
        selectedMenu.name,
        ingredients,
        selectedMenu.category,
      );
      setRecipeDetail(recipe);
      setStep(3);
    } catch (err) {
      if (err instanceof AIError) {
        setError(err.message, err.errorType);
      } else {
        setError('Terjadi kesalahan tidak diketahui', 'unknown');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleBack() {
    setError(null);
    setStep(step > 1 ? ((step - 1) as 1 | 2) : 1);
  }

  return { handleFindMenus, handleGetRecipe, handleBack };
}
