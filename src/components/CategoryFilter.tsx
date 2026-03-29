'use client';
import { CATEGORIES } from '@/constants';
import { useAppStore } from '../store/useAppStore';

export default function CategoryFilter() {
  const { selectedCategory, setCategory } = useAppStore();

  return (
    <div className="flex gap-2 overflow-x-auto sm:flex-wrap whitespace-nowrap sm:whitespace-normal pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <button
          type="button"
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={`shrink-0 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 cursor-pointer
        ${
          selectedCategory === cat.value
            ? 'border-accent bg-accent text-white shadow-sm shadow-accent/20'
            : 'border-border bg-surface text-text-secondary hover:border-accent/40 hover:text-accent'
        }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
