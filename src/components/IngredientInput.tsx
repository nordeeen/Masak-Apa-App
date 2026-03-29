'use client';
import { useAppStore } from '../store/useAppStore';
import { QUICK_ADD } from '@/constants';
import { useIngredientInput } from '@/hooks/useIngredientInput';

export default function IngredientInput() {
  const { ingredients, addIngredient, removeIngredient } = useAppStore();
  const { value, error, handleAdd, handleChange, handleKeyDown } =
    useIngredientInput();

  return (
    <div className="space-y-4">
      <div
        className={`bg-surface border rounded-2xl p-5 card-shadow focus-within:shadow-[0_0_0_3px_rgba(255,107,53,0.08)] transition-all duration-200 ${
          error
            ? 'border-danger/50 focus-within:border-danger/50'
            : 'border-border focus-within:border-accent/40'
        }`}
      >
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ketik nama bahan, misal: ayam, tomat..."
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted font-body"
          />

          <button
            type="button"
            onClick={handleAdd}
            disabled={!value.trim()}
            className={`shrink-0 bg-accent hover:bg-accent-light disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold 
    text-xs sm:text-sm px-3 sm:px-4 py-2 rounded-xl transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap ${
      error ? 'bg-danger cursor-not-allowed' : 'bg-accent cursor-pointer'
    }`}
          >
            + Tambah
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-4 min-h-7">
          {ingredients.length === 0 ? (
            <span className="text-xs text-text-muted">
              Belum ada bahan ditambahkan
            </span>
          ) : (
            ingredients.map((ing) => (
              <span
                key={ing}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/8 border border-accent/20 rounded-lg 
                text-xs font-medium text-accent-dark animate-[popIn_0.18s_ease]"
              >
                {ing}
                <button
                  onClick={() => removeIngredient(ing)}
                  className="text-text-muted hover:text-danger text-sm leading-none transition-colors cursor-pointer"
                  aria-label={`Hapus ${ing}`}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {error && (
        <p className="text-xs text-danger mt-2 animate-[fadeUp_0.2s_ease]">
          {error}
        </p>
      )}

      {/* Quick add */}
      <div className="flex items-center gap-2 overflow-x-auto sm:flex-wrap whitespace-nowrap sm:whitespace-normal pb-2 scrollbar-hide">
        {QUICK_ADD.map((q) => (
          <button
            type="button"
            key={q.value}
            onClick={() => addIngredient(q.value)}
            disabled={ingredients.includes(q.value)}
            className="shrink-0 px-3 py-1.5 rounded-full border border-border bg-surface text-xs font-medium text-text-secondary 
        hover:border-accent/50 hover:text-accent hover:bg-accent/5 
        disabled:opacity-30 disabled:cursor-not-allowed 
        transition-all duration-150 cursor-pointer"
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
