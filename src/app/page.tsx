'use client';
import { useAppStore } from '../store/useAppStore';
import { useHomeActions } from '@/hooks/useHomeAction';
import LoadingState from '../components/LoadingState';
import PageShell from '@/components/ShellPage';
import dynamic from 'next/dynamic';

const StepInput = dynamic(() => import('@/components/StepInput'));
const StepMenuPicker = dynamic(() => import('@/components/StepMenuPicker'));
const StepRecipe = dynamic(() => import('@/components/StepRecipe'));
const AIError_Component = dynamic(() => import('@/components/AIError'));

export default function Home() {
  const {
    step,
    ingredients,
    menuSuggestions,
    selectedMenu,
    recipeDetail,
    isLoading,
    loadingMessage,
    error,
    errorType,
    setStep,
    retryAfter,
    hasHydrated,
  } = useAppStore();

  const { handleFindMenus, handleGetRecipe, handleBack } = useHomeActions();

  if (!hasHydrated) {
    return (
      <PageShell>
        <LoadingState message="Memuat..." />
      </PageShell>
    );
  }

  if (isLoading) {
    return (
      <PageShell>
        <LoadingState message={loadingMessage} />
      </PageShell>
    );
  }

  if (error && errorType) {
    return (
      <PageShell>
        <AIError_Component
          type={errorType}
          retryAfter={retryAfter}
          onRetry={step === 2 ? handleFindMenus : handleGetRecipe}
          onBack={handleBack}
        />
      </PageShell>
    );
  }

  return (
    <PageShell>
      {step === 1 && (
        <StepInput ingredients={ingredients} onSubmit={handleFindMenus} />
      )}

      {step === 2 && (
        <StepMenuPicker
          menuCount={menuSuggestions.length}
          ingredientCount={ingredients.length}
          selectedMenu={selectedMenu}
          onBack={() => setStep(1)}
          onConfirm={handleGetRecipe}
        />
      )}

      {step === 3 && recipeDetail && (
        <StepRecipe
          recipe={recipeDetail}
          menu={selectedMenu!}
          onBack={() => setStep(2)}
        />
      )}
    </PageShell>
  );
}
