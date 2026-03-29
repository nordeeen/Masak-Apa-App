'use client';

import { ERROR_CONFIG } from '@/constants';
import { AIErrorType } from '@/types';
import { useEffect, useState } from 'react';

export default function AIError_Component({
  type,
  retryAfter,
  onRetry,
  onBack,
}: {
  type: AIErrorType;
  retryAfter?: number | null;
  onRetry: () => void;
  onBack: () => void;
}) {
  const [countdown, setCountdown] = useState<number>(retryAfter ?? 0);
  const config = ERROR_CONFIG[type];

  useEffect(() => {
    if (!retryAfter) return;
    setCountdown(retryAfter);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [retryAfter]);

  const isRetryDisabled = type === 'rate_limit' && countdown > 0;

  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
      <span className="text-5xl">{config.emoji}</span>
      <h2 className="font-bold text-xl text-text-primary">{config.title}</h2>
      <p className="text-text-secondary text-sm max-w-xs">{config.desc}</p>

      {type === 'rate_limit' && countdown > 0 && (
        <p className="text-yellow-500 text-sm font-medium">
          Coba lagi dalam {countdown} detik...
        </p>
      )}

      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-border text-text-secondary text-sm hover:bg-surface transition cursor-pointer"
        >
          ← Kembali
        </button>
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetryDisabled}
          className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-light transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {isRetryDisabled ? `Tunggu ${countdown}s` : 'Coba Lagi'}
        </button>
      </div>
    </div>
  );
}
