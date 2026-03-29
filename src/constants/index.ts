import { AIErrorType } from '@/types';
import { AppStep, Category } from '@/types';

export const ERROR_CONFIG: Record<
  AIErrorType,
  { emoji: string; title: string; desc: string }
> = {
  rate_limit: {
    emoji: '⏳',
    title: 'Terlalu Banyak Request',
    desc: 'Kamu sudah terlalu sering mencoba. Tunggu sebentar ya!',
  },
  api_error: {
    emoji: '🔑',
    title: 'Kesalahan API',
    desc: 'Terjadi masalah dengan layanan AI. Coba lagi.',
  },
  parse_error: {
    emoji: '⚠️',
    title: 'Response Tidak Valid',
    desc: 'AI memberikan jawaban yang tidak bisa dibaca. Coba lagi.',
  },
  network_error: {
    emoji: '📡',
    title: 'Tidak Ada Koneksi',
    desc: 'Periksa koneksi internetmu dan coba lagi.',
  },
  unknown: {
    emoji: '❓',
    title: 'Terjadi Kesalahan',
    desc: 'Terjadi kesalahan tidak diketahui. Coba lagi.',
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

export const INGREDIENT_REGEX = /^[\p{L}\s\-']{2,40}$/u;
export const KEYBOARD_SMASH_REGEX = /^[qwrtypsdfghjklzxcvbnm]{6,}$/i;
export const REPEATED_CHAR_REGEX = /(.)\1{2,}/i;
export const CONSONANT_CLUSTER_REGEX = /[^aiueo\s]{5,}/i;

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
