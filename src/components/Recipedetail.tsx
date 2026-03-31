'use client';
import { Copy01Icon, CheckmarkSquare01Icon } from 'hugeicons-react';
import { useRecipeActions } from '@/hooks/useRecipeAction';
import type { RecipeDetail, Props } from '../types';
import StatBox from './StatBox';

export default function RecipeDetail({ recipe, menu }: Props) {
  const { saved, copied, handleCopy, toggleSave, youtubeUrl, reset } =
    useRecipeActions(recipe, menu);

  return (
    <div className="w-full">
      <div className="bg-surface border border-border rounded-2xl p-6 mb-4 flex gap-5 items-start card-shadow">
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-3xl font-bold text-text-primary leading-tight mb-2 text-center">
            {recipe.name ?? '-'}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {recipe.description ?? '-'}
          </p>
          <div className="flex flex-row justify-between gap-5 sm:justify-evenly sm:gap-3">
            <StatBox label="Waktu" value={`⏱ ${recipe.estimatedTime ?? '-'}`} />
            <StatBox label="Porsi" value={`${recipe.servings ?? '-'} porsi`} />
            <StatBox label="Level" value={recipe.difficulty ?? '-'} />
          </div>
        </div>
      </div>

      {/* Bahan + Langkah */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-4 mb-4">
        <div className="bg-surface border border-border rounded-2xl p-5 card-shadow">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
            🛒 Bahan-Bahan
          </h3>
          <ul className="space-y-0">
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-center gap-3 py-2.5 border-b border-border/60 last:border-none text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="flex-1 text-text-primary">{ing.name}</span>
                <span className="text-text-muted text-xs">{ing.amount}</span>
                {ing.isUserHave && (
                  <span className="text-[10px] font-semibold text-secondary">
                    ✓ punya
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Langkah */}
        <div className="bg-surface border border-border rounded-2xl p-5 card-shadow">
          <div className="flex justify-between">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              📝 Cara Memasak
            </h3>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={
                copied ? 'Langkah berhasil disalin' : 'Salin langkah memasak'
              }
              className={`shrink-0 cursor-pointer transition-all duration-200 bg-transparent border-none p-2 
                rounded-lg hover:bg-card2 active:scale-90 ${copied ? 'text-green-500' : 'text-text-muted hover:text-accent'}`}>
              <span className="relative flex items-center justify-center">
                <Copy01Icon
                  className={`h-5 w-5 absolute transition-all duration-200  ${copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                />
                <CheckmarkSquare01Icon
                  className={`h-5 w-5 transition-all duration-200 ${copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
                />
              </span>
            </button>
          </div>
          <ol className="space-y-4">
            {recipe.steps.map((step, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Tips */}
      {recipe.tips && (
        <div className="flex gap-3 items-start p-4 bg-accent/5 border border-accent/15 rounded-xl mb-4 text-sm text-text-secondary leading-relaxed">
          <span className="text-base shrink-0">💡</span>
          <span>{recipe.tips}</span>
        </div>
      )}

      {/* YouTube */}
      <a
        href={youtubeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-4 bg-surface border border-border rounded-xl hover:border-red-400/40 
        hover:-translate-y-0.5 transition-all duration-200 mb-4 no-underline group card-shadow">
        <div className="w-20 h-14 bg-card2 rounded-lg flex items-center justify-center text-2xl border border-border shrink-0">
          ▶️
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary mb-1 truncate">
            Tutorial: {recipe.name}
          </p>
          <p className="text-xs text-text-muted">
            Klik untuk tonton cara memasak di YouTube
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg shrink-0">
          ▶ YouTube
        </div>
      </a>

      {/* Actions */}
      <div className="flex gap-3 items-center">
        <button
          type="button"
          onClick={toggleSave}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
            saved
              ? 'border-red-400/40 text-red-500 bg-red-50'
              : 'border-border text-text-secondary bg-surface hover:border-red-400/40 hover:text-red-500 card-shadow'
          }`}>
          {saved ? '♥ Tersimpan' : '♡ Simpan Resep'}
        </button>
        <button
          type="button"
          onClick={reset}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-accent cursor-pointer
           hover:bg-accent-light text-white font-semibold text-sm rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20">
          Cari Menu Baru
        </button>
      </div>
    </div>
  );
}
