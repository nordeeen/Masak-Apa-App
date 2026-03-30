import { MenuSuggestion } from '@/types';

export default function MenuCard({
  menu,
  selected,
  onSelect,
}: {
  menu: MenuSuggestion;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative bg-surface rounded-2xl p-5 cursor-pointer border transition-all duration-200 overflow-hidden card-shadow card-shadow-hover text-left w-full
        hover:-translate-y-1
        ${
          selected
            ? 'border-accent shadow-lg shadow-accent/10 ring-2 ring-accent/20'
            : 'border-border hover:border-accent/30'
        }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-accent to-accent-light transition-transform duration-200 origin-left ${
          selected ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-accent text-white mb-3">
        {menu.category ?? '-'}
      </span>
      <h3 className="font-display text-lg font-semibold text-text-primary mb-1 leading-tight">
        {menu.name ?? '-'}
      </h3>
      <div className="flex gap-3 text-[11px] text-text-muted mb-3">
        <span aria-label={`Waktu: ${menu.estimatedTime ?? '-'}`}>⏱ {menu.estimatedTime ?? '-'}</span>
        <span aria-label={`Kesulitan: ${menu.difficulty ?? '-'}`}>📊 {menu.difficulty ?? '-'}</span>
      </div>
      <p className="text-xs text-text-secondary leading-relaxed mb-3">
        {menu.shortDesc ?? '-'}
      </p>
      {menu.matchedIngredients.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {menu.matchedIngredients.map((ing) => (
            <span
              key={ing}
              className="px-2 py-0.5 rounded-full text-[10px] bg-secondary/8 border border-secondary/20 text-secondary font-medium"
            >
              ✓ {ing}
            </span>
          ))}
        </div>
      )}
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold" aria-hidden="true">
          ✓
        </div>
      )}
    </button>
  );
}
