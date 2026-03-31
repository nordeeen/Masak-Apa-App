# 🍳 MasakApa — AI Recipe Finder

Temukan ide menu masakan dari bahan yang ada di rumah, powered by AI.

**Live:** [masakapa-app.vercel.app](https://masakapa-app.vercel.app)

## Preview

![MasakApa App](docs/ss-page.png)

---

## Tech Stack

- **Next.js 16.2.1** (App Router)
- **TypeScript**
- **Tailwind CSS v4**
- **Google Gemini AI** (`@google/genai`) — saran menu & resep
- **Zustand v5** — state management
- **Upstash Redis + Ratelimit** — rate limiting API
- **Vercel** — deployment

---

## Cara Pakai

1. **Pilih Bahan** — masukkan bahan yang tersedia di rumah
2. **Pilih Menu** — AI menyarankan beberapa pilihan menu
3. **Lihat Resep** — tampil resep lengkap dengan langkah memasak

---

## Menjalankan Lokal

```bash
git clone https://github.com/nordeeen/Masak-Apa-App.git
cd Masak-Apa-App
npm install
cp .env.example .env.local  # isi API keys
npm run dev
```
