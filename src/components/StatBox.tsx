import { ReactNode } from 'react';

export default function StatBox({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-0">
      <div className="w-full text-center text-[clamp(9px,2vw,12px)] text-text-muted uppercase tracking-wider mt-0.5 truncate">
        {label}
      </div>
      <div className="flex items-center gap-1 font-display font-semibold text-accent min-w-0">
        {icon && <span className="text-base sm:text-lg">{icon}</span>}
        <span className="text-[clamp(14px,2.5vw,20px)] truncate">{value}</span>
      </div>
    </div>
  );
}
