export function handleApiError(error: unknown): {
  error: string;
  errorType: string;
} {
  const msg = error instanceof Error ? error.message : '';

  if (msg.includes('429') || /quota|rate/i.test(msg)) {
    return {
      error: 'Rate limit exceeded. Coba lagi dalam beberapa detik.',
      errorType: 'rate_limit',
    };
  }
  if (msg.includes('403') || /api key/i.test(msg)) {
    return {
      error: 'API key tidak valid atau expired',
      errorType: 'api_error',
    };
  }
  if (/fetch/i.test(msg)) {
    return {
      error: 'Tidak bisa menghubungi AI. Cek koneksi internet.',
      errorType: 'network_error',
    };
  }

  return { error: 'Terjadi kesalahan tidak diketahui', errorType: 'unknown' };
}

export function getErrorStatus(error: unknown): number {
  const msg = error instanceof Error ? error.message : '';
  if (msg.includes('429') || /quota|rate/i.test(msg)) return 429;
  if (msg.includes('403') || /api key/i.test(msg)) return 400;
  if (/fetch/i.test(msg)) return 503;
  return 500;
}
