import { SavedRecipe } from '@/types';

export default function SavedCard({
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
