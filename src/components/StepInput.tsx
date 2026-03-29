import CategoryFilter from './CategoryFilter';
import IngredientInput from './IngredientInput';

export default function StepInput({
  ingredients,
  onSubmit,
}: {
  ingredients: string[];
  onSubmit: () => void;
}) {
  return (
    <section
      style={{ animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both' }}
    >
      <div className="mb-10">
        <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-text-primary mb-4">
          Bingung mau
          <br />
          masak <em className="text-md text-accent not-italic">apa?</em>
        </h1>
        <p className="leading-relaxed max-w-md text-text-secondary">
          Masukkan bahan yang ada di dapurmu, AI akan carikan ide menu lengkap
          dengan cara masak dan video tutorialnya.
        </p>
      </div>

      <div
        className="mb-5"
        style={{
          animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.1s both',
        }}
      >
        <p className="text-xs text-text-muted uppercase tracking-wider mb-3">
          Kategori Masakan
        </p>
        <CategoryFilter />
      </div>

      <div
        className="mb-6"
        style={{
          animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.2s both',
        }}
      >
        <p className="text-xs text-text-muted uppercase tracking-wider mb-3">
          Bahan yang Kamu Punya
        </p>
        <IngredientInput />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={ingredients.length === 0}
        className="w-full flex items-center justify-center gap-2 
    px-4 sm:px-6 
    py-2.5 sm:py-4 
    text-sm sm:text-base
    bg-accent hover:bg-accent-light text-white font-semibold rounded-2xl 
    transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 
    disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
      >
        Cari Menu
        {ingredients.length > 0 && (
          <span
            className="bg-white/20 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full"
            style={{ animation: 'fadeIn 0.2s ease both' }}
          >
            {ingredients.length} bahan
          </span>
        )}
      </button>

      {ingredients.length === 0 && (
        <p
          className="text-center text-xs text-text-muted mt-3"
          style={{ animation: 'fadeIn 0.3s ease both' }}
        >
          Tambahkan minimal 1 bahan untuk mulai
        </p>
      )}
    </section>
  );
}
