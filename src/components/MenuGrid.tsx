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
      className={`relative bg-card rounded-2xl p-5 cursor-pointer border transition-all duration-200 overflow-hidden
        hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30
        ${
          selected
            ? 'border-accent shadow-lg shadow-accent/10 bg-accent/5'
            : 'border-border hover:border-accent/30'
        }`}
    >
      {/* top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 bg-accent transition-transform duration-200 origin-left ${
          selected ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
        }`}
      />

      {/* category badge */}
      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-surface text-text-muted mb-3">
        {menu.category}
      </span>

      {/* emoji + name */}
      <div className="text-3xl mb-2">{menu.emoji}</div>
      <h3 className="font-display text-lg text-text-primary mb-1 leading-tight">
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
              className="px-2 py-0.5 rounded-full text-[10px] bg-green-500/8 border border-green-500/20 text-green-400"
            >
              ✓ {ing}
            </span>
          ))}
        </div>
      )}

      {/* selected check */}
      {selected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center text-black text-xs font-bold">
          ✓
        </div>
      )}
    </div>
  );
}
