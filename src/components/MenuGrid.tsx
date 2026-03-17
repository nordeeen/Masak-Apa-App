'use client';
import { useAppStore } from '../store/useAppStore';
import { MenuSuggestion } from '../types';

export default function MenuGrid() {
  const { menuSuggestions, selectedMenu, selectMenu } = useAppStore();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {menuSuggestions.map((menu) => (
        <MenuCard
          key={menu.id}
          menu={menu}
          selected={selectedMenu?.id === menu.id}
          onSelect={() => selectMenu(menu)}
        />
      ))}
    </div>
  );
}

function MenuCard({
  menu,
  selected,
  onSelect,
}: {
  menu: MenuSuggestion;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`relative bg-surface rounded-2xl p-5 cursor-pointer border transition-all duration-200 overflow-hidden card-shadow card-shadow-hover
        hover:-translate-y-1
        ${
          selected
            ? 'border-accent shadow-lg shadow-accent/10 ring-2 ring-accent/20'
            : 'border-border hover:border-accent/30'
        }`}
    >
      {/* top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-accent to-accent-light transition-transform duration-200 origin-left ${
          selected ? 'scale-x-100' : 'scale-x-0'
        }`}
      />

      {/* category badge */}
      <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-card2 text-text-secondary mb-3">
        {menu.category}
      </span>

      {/* emoji + name */}
      <img
        src={menu.imageUrl}
        alt={menu.name}
        className="h-10 w-10 object-contain"
      />
      <h3 className="font-display text-lg font-semibold text-text-primary mb-1 leading-tight">
        {menu.name}
      </h3>

      {/* meta */}
      <div className="flex gap-3 text-[11px] text-text-muted mb-3">
        <span>⏱ {menu.estimatedTime}</span>
        <span>📊 {menu.difficulty}</span>
      </div>

      {/* desc */}
      <p className="text-xs text-text-secondary leading-relaxed mb-3">
        {menu.shortDesc}
      </p>

      {/* matched ingredients */}
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

      {/* selected check */}
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-white text-xs font-bold">
          ✓
        </div>
      )}
    </div>
  );
}
