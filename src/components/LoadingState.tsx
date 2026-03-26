'use client';
import { DEFAULT_MESSAGES } from '@/constants';
import { LoadingStateProps } from '@/types';
import { useEffect, useState } from 'react';

export default function LoadingState({
  message,
  messages = DEFAULT_MESSAGES,
  sub = 'Sebentar ya ...',
}: LoadingStateProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const list = message ? [message] : messages;

  useEffect(() => {
    if (list.length <= 1) return;

    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % list.length);
        setVisible(true);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [list.length]);

  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-up">
      {/* Spinner */}
      <div className="relative mb-8">
        <div className="w-16 h-16 rounded-full border-2 border-border border-t-accent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🍳
        </div>
      </div>

      {/* Rotating message */}
      <p
        className="font-display text-xl font-semibold text-text-primary mb-2 transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {list[index]}
      </p>
      <p className="text-sm text-text-secondary">{sub}</p>

      {/* Progress dots */}
      <div className="flex gap-1.5 mt-6">
        {list.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-4 bg-accent' : 'w-1.5 bg-accent/25'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
