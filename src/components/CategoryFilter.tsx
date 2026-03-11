'use client';
import { useAppStore } from '../store/useAppStore';
import { Category } from '../types';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'Semua', label: '🍽 Semua' },
  { value: 'Indonesia', label: '🇮🇩 Indonesia' },
  { value: 'Western', label: '🍝 Western' },
  { value: 'Chinese', label: '🥢 Chinese' },
  { value: 'Japanese', label: '🍱 Japanese' },
];

export default function CategoryFilter() {
  const { selectedCategory, setCategory } = useAppStore();

  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 ${
            selectedCategory === cat.value
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border bg-card text-text-secondary hover:border-accent/40 hover:text-text-primary'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
