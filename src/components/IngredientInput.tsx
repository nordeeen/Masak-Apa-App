'use client';

import { useState, type KeyboardEvent } from 'react';
import { useAppStore } from '../store/useAppStore';

const QUICK_ADD = [
  { label: '🍗 Ayam', value: 'Ayam' },
  { label: '🥚 Telur', value: 'Telur' },
  { label: '🧊 Tahu', value: 'Tahu' },
  { label: '🟫 Tempe', value: 'Tempe' },
  { label: '🍚 Nasi', value: 'Nasi' },
  { label: '🥩 Daging', value: 'Daging' },
];

export default function IngredientInput() {
  const [value, setValue] = useState('');
  const { ingredients, addIngredient, removeIngredient } = useAppStore();

  function handleAdd() {
    const trimmed = value.trim();
    if (!trimmed) return;
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    addIngredient(capitalized);
    setValue('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd();
  }

  return (
    <div className="space-y-4">
      {/* Input box */}
      <div className="bg-surface border border-border rounded-2xl p-5 card-shadow focus-within:border-accent/40 focus-within:shadow-[0_0_0_3px_rgba(255,107,53,0.08)] transition-all duration-200">
        <div className="flex gap-3 items-center">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik nama bahan, misal: ayam, tomat..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-muted font-body"
          />
          <button
            onClick={handleAdd}
            disabled={!value.trim()}
            className="bg-accent hover:bg-accent-light disabled:opacity-30 disabled:cursor-not-allowed text-white font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-150 hover:-translate-y-0.5 whitespace-nowrap"
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent/8 border border-accent/20 rounded-lg text-xs font-medium text-accent-dark animate-[popIn_0.18s_ease]"
              >
                {ing}
                <button
                  onClick={() => removeIngredient(ing)}
                  className="text-text-muted hover:text-danger text-sm leading-none transition-colors"
                  aria-label={`Hapus ${ing}`}
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Quick add */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-text-muted uppercase tracking-wider">
          Cepat tambah:
        </span>
        {QUICK_ADD.map((q) => (
          <button
            key={q.value}
            onClick={() => addIngredient(q.value)}
            disabled={ingredients.includes(q.value)}
            className="px-3 py-1.5 rounded-full border border-border bg-surface text-xs font-medium text-text-secondary hover:border-accent/50 hover:text-accent hover:bg-accent/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
          >
            {q.label}
          </button>
        ))}
      </div>
    </div>
  );
}
