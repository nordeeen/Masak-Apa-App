'use client';
import { useEffect, useState } from 'react';
import { useServiceWorker } from '../hooks/useServiceWorker';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAProvider() {
  useServiceWorker();

  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (isDismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  }

  function handleDismiss() {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  }

  if (!showBanner || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 animate-[fadeUp_0.4s_ease]">
      <div className="bg-card border border-border rounded-2xl p-4 shadow-2xl shadow-black/50 flex items-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl shrink-0">
          🍳
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary">
            Install MasakApa
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            Akses cepat dari homescreen, bisa dibuka offline
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstall}
            className="px-3 py-1.5 bg-accent text-black text-xs font-bold rounded-lg hover:bg-accent-light transition-colors cursor-pointer"
          >
            Install
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="px-3 py-1.5 text-text-muted text-xs hover:text-text-secondary transition-colors text-center cursor-pointer"
          >
            Nanti
          </button>
        </div>
      </div>
    </div>
  );
}
