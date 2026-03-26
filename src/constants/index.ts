import { AppStep, Category } from '@/types';

export const ERROR_CONFIG = {
  rate_limit: {
    emoji: '⏳',
    title: 'Limit AI Hari Ini Habis',
    desc: 'Gemini API gratis punya batas request harian. Kamu bisa coba lagi besok, atau gunakan resep manual dari sumber lain.',
    color: 'amber',
    tips: [
      'Coba lagi besok — limit reset setiap tengah malam',
      'Sementara itu, kamu bisa cari resep manual di bawah',
    ],
  },
  api_error: {
    emoji: '🔧',
    title: 'AI Sedang Bermasalah',
    desc: 'Server Gemini sedang tidak bisa dihubungi. Ini bukan salah kamu coba beberapa saat lagi.',
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

export const MANUAL_SUGGESTIONS = [
  { emoji: '🥚', query: 'resep telur sederhana', label: 'Resep dari Telur' },
  { emoji: '🍗', query: 'resep ayam mudah', label: 'Resep dari Ayam' },
  { emoji: '🥦', query: 'resep sayuran sehat', label: 'Resep Sayuran' },
  { emoji: '🍚', query: 'resep nasi goreng', label: 'Nasi Goreng' },
  { emoji: '🥩', query: 'resep daging sapi', label: 'Resep Daging' },
  { emoji: '🫘', query: 'resep tempe tahu', label: 'Tempe & Tahu' },
];

export const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'Semua', label: '🍽 Semua' },
  { value: 'Indonesia', label: '🇮🇩 Indonesia' },
  { value: 'Western', label: '🍝 Western' },
  { value: 'Chinese', label: '🥢 Chinese' },
  { value: 'Japanese', label: '🍱 Japanese' },
];

export const QUICK_ADD = [
  { label: '🍗 Ayam', value: 'Ayam' },
  { label: '🥚 Telur', value: 'Telur' },
  { label: '🧊 Tahu', value: 'Tahu' },
  { label: '🟫 Tempe', value: 'Tempe' },
  { label: '🍚 Nasi', value: 'Nasi' },
  { label: '🥩 Daging', value: 'Daging' },
];

export const STEPS: { id: AppStep; label: string; icon: string }[] = [
  { id: 1, label: 'Pilih Bahan', icon: '🥬' },
  { id: 2, label: 'Pilih Menu', icon: '🍽' },
  { id: 3, label: 'Lihat Resep', icon: '📖' },
];

export const DEFAULT_MESSAGES = [
  'Menganalisis bahan...',
  'Mencari kombinasi menu...',
  'Menyiapkan rekomendasi...',
  'Hampir selesai...',
];

export const colorMap: Record<string, string> = {
  amber: 'border-amber-300/40 bg-amber-50',
  red: 'border-red-300/40 bg-red-50',
  orange: 'border-orange-300/40 bg-orange-50',
  blue: 'border-blue-300/40 bg-blue-50',
  gray: 'border-border bg-card2',
};

export const badgeMap: Record<string, string> = {
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  red: 'bg-red-100 text-red-700 border-red-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  gray: 'bg-card2 text-text-secondary border-border',
};
