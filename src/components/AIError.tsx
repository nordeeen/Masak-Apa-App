'use client';

import { useRouter } from 'next/navigation';

interface AIErrorProps {
  type:
    | 'rate_limit'
    | 'api_error'
    | 'parse_error'
    | 'network_error'
    | 'unknown';
  onRetry?: () => void;
  onBack?: () => void;
}

const ERROR_CONFIG = {
  rate_limit: {
    emoji: '⏳',
    title: 'Limit AI Hari Ini Habis',
    desc: 'Gemini API gratis punya batas request harian. Kamu bisa coba lagi besok, atau gunakan resep manual dari sumber lain.',
    color: 'amber',
    tips: [
      'Coba lagi besok — limit reset setiap tengah malam',
      'Atau daftar API key baru di aistudio.google.com',
      'Sementara itu, kamu bisa cari resep manual di bawah',
    ],
  },
  api_error: {
    emoji: '🔧',
    title: 'AI Sedang Bermasalah',
    desc: 'Server Gemini sedang tidak bisa dihubungi. Ini bukan salah kamu — coba beberapa saat lagi.',
    color: 'red',
    tips: [
      'Tunggu 1–2 menit lalu coba lagi',
      'Cek koneksi internet kamu',
      'Kalau masih error, kemungkinan server Gemini sedang down',
    ],
  },
  parse_error: {
    emoji: '😵',
    title: 'AI Bingung Menjawab',
    desc: 'AI memberikan jawaban yang tidak bisa dibaca aplikasi. Coba lagi dengan bahan yang lebih spesifik.',
    color: 'orange',
    tips: [
      "Gunakan nama bahan yang umum, misal 'ayam' bukan 'unggas'",
      'Coba kurangi jumlah bahan',
      'Ulangi pencarian — biasanya berhasil di percobaan kedua',
    ],
  },
  network_error: {
    emoji: '📡',
    title: 'Tidak Ada Koneksi Internet',
    desc: 'Aplikasi tidak bisa menghubungi AI karena koneksi internet terputus.',
    color: 'blue',
    tips: [
      'Periksa koneksi WiFi atau data kamu',
      'Coba matikan dan nyalakan ulang WiFi',
      'Resep yang sudah disimpan tetap bisa dibuka offline',
    ],
  },
  unknown: {
    emoji: '🤔',
    title: 'Ada yang Tidak Beres',
    desc: 'Terjadi kesalahan yang tidak diketahui. Coba lagi atau refresh halaman.',
    color: 'gray',
    tips: [
      'Coba refresh halaman',
      'Coba lagi dari awal',
      'Kalau terus terjadi, cek console browser untuk detail error',
    ],
  },
};

const MANUAL_SUGGESTIONS = [
  { emoji: '🥚', query: 'resep telur sederhana', label: 'Resep dari Telur' },
  { emoji: '🍗', query: 'resep ayam mudah', label: 'Resep dari Ayam' },
  { emoji: '🥦', query: 'resep sayuran sehat', label: 'Resep Sayuran' },
  { emoji: '🍚', query: 'resep nasi goreng', label: 'Nasi Goreng' },
  { emoji: '🥩', query: 'resep daging sapi', label: 'Resep Daging' },
  { emoji: '🫘', query: 'resep tempe tahu', label: 'Tempe & Tahu' },
];

export default function AIError({ type, onRetry, onBack }: AIErrorProps) {
  const config = ERROR_CONFIG[type];
  const router = useRouter();

  const colorMap: Record<string, string> = {
    amber: 'border-amber-300/40 bg-amber-50',
    red: 'border-red-300/40 bg-red-50',
    orange: 'border-orange-300/40 bg-orange-50',
    blue: 'border-blue-300/40 bg-blue-50',
    gray: 'border-border bg-card2',
  };

  const badgeMap: Record<string, string> = {
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    red: 'bg-red-100 text-red-700 border-red-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    gray: 'bg-card2 text-text-secondary border-border',
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 animate-fade-up">
      {/* Main error card */}
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
