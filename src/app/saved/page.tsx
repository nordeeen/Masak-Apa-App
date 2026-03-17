'use client';

import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import Navbar from '@/components/Navbar';
import RecipeDetail from '@/components/Recipedetail';
import type { SavedRecipe } from '@/types';

export default function SavedPage() {
  const { savedRecipes, unsaveRecipe } = useAppStore();
  const [viewing, setViewing] = useState<SavedRecipe | null>(null);

  if (viewing) {
    return (
      <>
        <Navbar />
        <main className="max-w-2xl mx-auto px-6 pb-24 pt-10">
          <button
            onClick={() => setViewing(null)}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent mb-6 transition-colors"
          >
            ← Kembali ke Favorit
          </button>
          <RecipeDetail
            recipe={viewing.recipeDetail}
            menu={{
              id: viewing.id,
              name: viewing.name,
              emoji: viewing.emoji,
              category: viewing.category,
              estimatedTime: viewing.estimatedTime,
              difficulty: 'Mudah',
              shortDesc: '',
              matchedIngredients: [],
              imageUrl: '',
              imageUrlFallback: '',
            }}
          />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 pb-24 pt-10">
        <h1 className="font-display text-4xl font-bold text-text-primary mb-2">
          Resep Favorit
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          {savedRecipes.length > 0
            ? `${savedRecipes.length} resep tersimpan`
            : 'Belum ada resep yang disimpan'}
        </p>

        {savedRecipes.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🍳</div>
            <p className="font-display text-xl font-semibold text-text-primary mb-2">
              Belum ada resep favorit
            </p>
            <p className="text-sm text-text-secondary mb-6">
              Simpan resep yang kamu suka saat memasak
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 bg-accent text-white font-semibold text-sm rounded-xl hover:bg-accent-light transition-colors"
            >
              Cari Resep Sekarang
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedRecipes.map((r) => (
              <SavedCard
                key={r.id}
                item={r}
                onView={() => setViewing(r)}
                onDelete={() => unsaveRecipe(r.id)}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function SavedCard({
  item,
  onView,
  onDelete,
}: {
  item: SavedRecipe;
  onView: () => void;
  onDelete: () => void;
}) {
  const savedDate = new Date(item.savedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 hover:border-accent/30 transition-all duration-200 group card-shadow card-shadow-hover">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl">{item.emoji}</span>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-lg font-semibold text-text-primary leading-tight mb-1 truncate">
            {item.name}
          </h3>
          <div className="flex gap-2 text-[11px] text-text-muted">
            <span>{item.category}</span>
            <span>·</span>
            <span>⏱ {item.estimatedTime}</span>
          </div>
        </div>
      </div>
      <p className="text-[11px] text-text-muted mb-4">Disimpan {savedDate}</p>
      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 py-2 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-light transition-colors"
        >
          Lihat Resep
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-2 border border-border text-text-muted text-xs rounded-lg hover:border-red-400/40 hover:text-red-500 transition-colors"
          aria-label="Hapus dari favorit"
        >
          ♥
        </button>
      </div>
    </div>
  );
}
