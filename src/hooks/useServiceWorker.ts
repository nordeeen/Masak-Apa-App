'use client';

import { useEffect } from 'react';

export function useServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') return;

    if (typeof window === 'undefined' || !('serviceWorker' in navigator))
      return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              console.log(
                'MasakApa: Update tersedia, refresh untuk versi terbaru.',
              );
            }
          });
        });

        console.log('MasakApa: Service Worker registered.');
      } catch (err) {
        console.error('MasakApa: Service Worker registration failed:', err);
      }
    };

    if (document.readyState === 'complete') {
      register();
    } else {
      window.addEventListener('load', register);
    }

    return () => window.removeEventListener('load', register);
  }, []);
}
