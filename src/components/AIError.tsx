'use client';

import {
  badgeMap,
  colorMap,
  ERROR_CONFIG,
  MANUAL_SUGGESTIONS,
} from '@/constants';
import { AIErrorProps } from '@/types';
import { useRouter } from 'next/navigation';

export default function AIError({ type, onRetry, onBack }: AIErrorProps) {
  const config = ERROR_CONFIG[type];
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 animate-fade-up">
      <div
        className={`w-full max-w-md border rounded-2xl p-8 mb-6 ${colorMap[config.color]}`}
      >
        <div className="text-5xl mb-4 text-center">{config.emoji}</div>
        <h2 className="font-display text-2xl font-bold text-text-primary text-center mb-3">
          {config.title}
        </h2>
        <p className="text-text-secondary text-sm text-center leading-relaxed mb-6">
          {config.desc}
        </p>

        {/* Tips */}
        <div className="space-y-2 mb-6">
          {config.tips.map((tip, i) => (
            <div
              key={i}
              className="flex items-start gap-3 text-sm text-text-secondary"
            >
              <span
                className={`mt-0.5 px-1.5 py-0.5 rounded text-xs font-bold border ${badgeMap[config.color]}`}
              >
                {i + 1}
              </span>
              {tip}
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          {onRetry && (
            <button onClick={onRetry} className="btn-primary">
              🔄 Coba Lagi
            </button>
          )}
          <button
            onClick={onBack ?? (() => router.push('/'))}
            className="btn-secondary justify-center"
          >
            ← Kembali & Ganti Bahan
          </button>
        </div>
      </div>

      {/* Manual fallback */}
      <div className="w-full max-w-md">
        <p className="text-xs text-text-muted text-center mb-3 uppercase tracking-wider">
          Sementara itu, cari resep manual di YouTube
        </p>
        <div className="grid grid-cols-2 gap-2">
          {MANUAL_SUGGESTIONS.map((s) => (
            <a
              key={s.query}
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(s.query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-3 bg-surface border border-border rounded-xl
                         text-sm text-text-secondary hover:text-text-primary
                         hover:border-accent/40 transition-all duration-200 group card-shadow"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {s.emoji}
              </span>
              <span className="font-medium text-xs">{s.label}</span>
            </a>
          ))}
        </div>

        <p className="text-xs text-text-muted text-center mt-4">
          Atau buka{' '}
          <a
            href="https://cookpad.com/id"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Cookpad
          </a>{' '}
          /{' '}
          <a
            href="https://www.masakapahariini.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Masak Apa Hari Ini
          </a>{' '}
          untuk resep manual.
        </p>
      </div>
    </div>
  );
}
