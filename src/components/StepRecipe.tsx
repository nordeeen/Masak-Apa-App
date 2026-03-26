import BackButton from './BackButton';
import RecipeDetail from './Recipedetail';
import type {
  RecipeDetail as RecipeDetailType,
  MenuSuggestion,
} from '../types';

export default function StepRecipe({
  recipe,
  menu,
  onBack,
}: {
  recipe: RecipeDetailType;
  menu: MenuSuggestion;
  onBack: () => void;
}) {
  return (
    <section className="animate-[fadeUp_0.4s_ease]">
      <BackButton label="Pilih Menu Lain" onClick={onBack} />
      <RecipeDetail recipe={recipe} menu={menu} />
    </section>
  );
}
