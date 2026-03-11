'use client';

interface LoadingStateProps {
  message?: string;
  sub?: string;
}

export default function LoadingState({
  message = 'AI sedang berpikir...',
  sub = 'Sebentar ya 🔍',
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-fade-up">
      {/* Spinner */}
      <div className="relative mb-8">
        <div className="w-16 h-16 rounded-full border-2 border-border border-t-accent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-2xl">
          🍳
        </div>
      </div>

      <p className="font-display text-xl text-text-primary mb-2">{message}</p>
      <p className="text-sm text-text-secondary">{sub}</p>

      {/* Animated dots */}
      <div className="flex gap-1.5 mt-6">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
