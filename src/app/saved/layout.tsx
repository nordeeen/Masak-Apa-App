import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resep Favorit — MasakApa',
  description: 'Lihat dan kelola resep masakan favorit yang sudah kamu simpan.',
};

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
