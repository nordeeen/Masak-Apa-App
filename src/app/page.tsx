'use client';

import { useAppStore } from '../store/useAppStore';
import { useHomeActions } from '@/hooks/useHomeAction';
import LoadingState from '../components/LoadingState';
import AIError_Component from '../components/AIError';
import StepRecipe from '@/components/StepRecipe';
import StepMenuPicker from '@/components/StepMenuPicker';
import StepInput from '@/components/StepInput';
import PageShell from '@/components/ShellPage';

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
  } = useAppStore();

  const { handleFindMenus, handleGetRecipe, handleBack } = useHomeActions();

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
