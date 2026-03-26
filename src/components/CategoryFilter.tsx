'use client';
import { CATEGORIES } from '@/constants';
import { useAppStore } from '../store/useAppStore';

export default function CategoryFilter() {
  const { selectedCategory, setCategory } = useAppStore();

  return (
    <div className="flex gap-2 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setCategory(cat.value)}
          className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 cursor-pointer 
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
