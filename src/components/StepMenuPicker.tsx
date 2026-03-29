import BackButton from './BackButton';
import MenuGrid from './MenuGrid';

export default function StepMenuPicker({
  menuCount,
  ingredientCount,
  selectedMenu,
  onBack,
  onConfirm,
}: {
  menuCount: number;
  ingredientCount: number;
  selectedMenu: unknown;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <section
      style={{ animation: 'slideDown 0.4s cubic-bezier(0.22,1,0.36,1) both' }}
    >
      <BackButton label="Ganti Bahan" onClick={onBack} />
      <h2 className="font-display text-3xl font-bold text-text-primary mb-2">
        Pilih menu yang mau dimasak
      </h2>
      <p className="text-sm text-text-secondary mb-8">
        AI menemukan {menuCount} menu dari {ingredientCount} bahan yang kamu
        punya.
      </p>
      <div
        style={{
          animation: 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) 0.15s both',
        }}
      >
        <MenuGrid />
      </div>

      {/* <MenuGrid /> */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={!selectedMenu}
        style={{
          animation: 'fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) 0.25s both',
        }}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-accent hover:bg-accent-light text-white font-semibold rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-6 cursor-pointer"
      >
        Lihat Cara Memasak →
      </button>
    </section>
  );
}
