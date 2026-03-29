export default function BackButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent mb-6 transition-colors cursor-pointer"
    >
      ← {label}
    </button>
  );
}
