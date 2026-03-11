'use client';
import { useAppStore } from '../store/useAppStore';
import { fetchMenuSuggestions, fetchRecipeDetail, AIError } from '../lib/api';
import Navbar from '../components/Navbar';
import StepIndicator from '../components/Stepindicator';
import IngredientInput from '../components/IngredientInput';
import CategoryFilter from '../components/CategoryFilter';
import LoadingState from '../components/LoadingState';
import AIError_Component from '../components/AIError';
import MenuGrid from '../components/MenuGrid';
import RecipeDetail from '../components/Recipedetail';

export default function Home() {
  const {
    step,
    ingredients,
    selectedCategory,
    menuSuggestions,
    selectedMenu,
    recipeDetail,
    isLoading,
    loadingMessage,
    error,
    errorType,
    setStep,
    setLoading,
    setMenuSuggestions,
    setRecipeDetail,
    setError,
  } = useAppStore();

  // ── STEP 1 → 2: cari menu ──
  async function handleFindMenus() {
    setLoading(true, 'AI sedang menganalisis bahanmu...');
    try {
      const menus = await fetchMenuSuggestions(ingredients, selectedCategory);
      setMenuSuggestions(menus);
      setStep(2);
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

  // ── STEP 2 → 3: lihat resep ──
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

  // ── RENDER: loading ──
  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="max-w-2xl mx-auto px-6">
          <StepIndicator />
          <LoadingState message={loadingMessage} />
        </main>
      </>
    );
  }

  // ── RENDER: error ──
  if (error && errorType) {
    return (
      <>
        <Navbar />
        <main className="max-w-2xl mx-auto px-6">
          <StepIndicator />
          <AIError_Component
            type={errorType}
            onRetry={step === 2 ? handleFindMenus : handleGetRecipe}
            onBack={() => {
              setError(null);
              setStep(step > 1 ? ((step - 1) as 1 | 2) : 1);
            }}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pb-24">
        <StepIndicator />

        {/* ── STEP 1: INPUT BAHAN ── */}
        {step === 1 && (
          <section className="animate-[fadeUp_0.4s_ease]">
            {/* Hero */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-accent text-[11px] font-semibold uppercase tracking-wider mb-5">
                ✦ Powered by Gemini AI
              </div>
              <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight text-text-primary mb-4">
                Bingung mau
                <br />
                masak <em className="italic text-accent">apa?</em>
              </h1>
              <p className=" text-base leading-relaxed max-w-md">
                Masukkan bahan yang ada di dapur — AI akan carikan ide menu
                lengkap dengan cara masak dan video tutorialnya.
              </p>
            </div>

            {/* Filter kategori */}
            <div className="mb-5">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3">
                Kategori Masakan
              </p>
              <CategoryFilter />
            </div>

            {/* Input bahan */}
            <div className="mb-6">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-3">
                Bahan yang Kamu Punya
              </p>
              <IngredientInput />
            </div>

            {/* CTA */}
            <button
              onClick={handleFindMenus}
              disabled={ingredients.length === 0}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent-light text-black font-semibold rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              🔍 Carikan Menu untuk Aku
              {ingredients.length > 0 && (
                <span className="bg-black/20 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {ingredients.length} bahan
                </span>
              )}
            </button>

            {ingredients.length === 0 && (
              <p className="text-center text-xs text-text-muted mt-3">
                Tambahkan minimal 1 bahan untuk mulai
              </p>
            )}
          </section>
        )}

        {/* ── STEP 2: PILIH MENU ── */}
        {step === 2 && (
          <section className="animate-[fadeUp_0.4s_ease]">
            <button
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
            >
              ← Ganti Bahan
            </button>
            <h2 className="font-display text-3xl text-text-primary mb-2">
              Pilih menu yang mau dimasak
            </h2>
            <p className="text-sm text-text-secondary mb-8">
              AI menemukan {menuSuggestions.length} menu dari{' '}
              {ingredients.length} bahan yang kamu punya.
            </p>
            <MenuGrid />
            <button
              onClick={handleGetRecipe}
              disabled={!selectedMenu}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent-light text-black font-semibold rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-6"
            >
              Lihat Cara Memasak →
            </button>
          </section>
        )}

        {/* ── STEP 3: DETAIL RESEP ── */}
        {step === 3 && recipeDetail && (
          <section className="animate-[fadeUp_0.4s_ease]">
            <button
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
            >
              ← Pilih Menu Lain
            </button>
            <RecipeDetail recipe={recipeDetail} menu={selectedMenu!} />
          </section>
        )}
      </main>
    </>
  );
}
