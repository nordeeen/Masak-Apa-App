'use client';
import { useAppStore } from '../store/useAppStore';
import { STEPS } from '@/constants';

export default function StepIndicator() {
  const step = useAppStore((state) => state.step);

  return (
    <div className="flex items-center justify-center gap-0 my-6 md:my-8">
      {STEPS.map((s, idx) => {
        const isDone = s.id < step;
        const isActive = s.id === step;

        return (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center gap-1.5 md:gap-2 px-3 py-2 md:px-5 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-accent text-white shadow-md shadow-accent/20'
                  : isDone
                    ? 'text-secondary'
                    : 'text-text-muted'
              }`}
            >
              <span
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shrink-0 ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : isDone
                      ? 'bg-secondary text-white'
                      : 'bg-border text-text-muted'
                }`}
              >
                {isDone ? '✓' : s.id}
              </span>
              {/* Label: hidden on very small screens, visible from xs up */}
              <span className="hidden xs:inline sm:inline">{s.label}</span>
            </div>

            {idx < STEPS.length - 1 && (
              <div
                className={`w-4 md:w-8 h-px transition-all duration-500 ${
                  s.id < step ? 'bg-secondary/40' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
