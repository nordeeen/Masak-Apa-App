'use client';

import { AppStep } from '../types';
import { useAppStore } from '../store/useAppStore';

const STEPS: { id: AppStep; label: string; icon: string }[] = [
  { id: 1, label: 'Pilih Bahan', icon: '🥬' },
  { id: 2, label: 'Pilih Menu', icon: '🍽' },
  { id: 3, label: 'Lihat Resep', icon: '📖' },
];

export default function StepIndicator() {
  const step = useAppStore((state) => state.step);

  return (
    <div className="flex items-center justify-center gap-0 my-8">
      {STEPS.map((s, idx) => {
        const isDone = s.id < step;
        const isActive = s.id === step;

        return (
          <div key={s.id} className="flex items-center">
            {/* Step pill */}
            <div
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-accent text-white shadow-md shadow-accent/20'
                  : isDone
                    ? 'text-secondary'
                    : 'text-text-muted'
              }`}
            >
              {/* Number / checkmark */}
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : isDone
                      ? 'bg-secondary text-white'
                      : 'bg-border text-text-muted'
                }`}
              >
                {isDone ? '✓' : s.id}
              </span>
              {s.label}
            </div>

            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div
                className={`w-8 h-px transition-all duration-500 ${
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
