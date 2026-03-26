import { GoogleGenAI } from '@google/genai';
import { MenuSuggestion, RecipeDetail } from '@/types';

export function clampMenuCount(count?: number): number {
  return Math.min(Math.max(Number(count) || 6, 4), 10);
}

export function buildCategoryFilter(category?: string): string {
  return category && category !== 'Semua'
    ? `Fokus pada masakan ${category}.`
    : 'Variasikan dari masakan Indonesia, Western, Chinese, dan Japanese.';
}

export function buildPrompt(
  ingredients: string[],
  categoryFilter: string,
  menuCount: number,
): string {
  return `
Kamu adalah asisten memasak profesional yang membantu merekomendasikan menu masakan.

Pengguna memiliki bahan-bahan berikut di rumah:
${ingredients.map((i) => `- ${i}`).join('\n')}

${categoryFilter}

Rekomendasikan tepat ${menuCount} menu masakan yang BISA dibuat dari bahan-bahan tersebut (boleh tambah bumbu dasar seperti garam, minyak, bawang, bawang putih, bawang merah).

Balas HANYA dengan JSON valid berikut, tanpa penjelasan, tanpa markdown:
{
  "menus": [
    {
      "id": "menu_1",
      "name": "Nama Menu",
      "nameEn": "English Name",
      "emoji": "🍳",
      "category": "Indonesia",
      "estimatedTime": "20 mnt",
      "difficulty": "Mudah",
      "calories": "350 kkal",
      "servings": "2 porsi",
      "shortDesc": "Deskripsi singkat 1 kalimat yang menggugah selera.",
      "keyTechnique": "Teknik masak utama, contoh: Tumis, Goreng, Rebus",
      "matchedIngredients": ["bahan1", "bahan2"],
      "missingIngredients": ["bahan yang perlu dibeli"],
      "tags": ["Gurih", "Pedas"]
    }
  ]
}

Aturan:
- difficulty harus salah satu dari: "Mudah", "Sedang", "Sulit"
- estimatedTime format: "X mnt" atau "X jam Y mnt"
- calories perkiraan kalori per porsi
- matchedIngredients hanya isi bahan yang ada di list pengguna
- missingIngredients bahan tambahan yang diperlukan selain bumbu dasar
- tags maksimal 3 dari: ["Pedas", "Gurih", "Manis", "Asam", "Sehat", "Berkuah", "Crispy", "Creamy", "Vegetarian", "High Protein"]
- Balas HANYA JSON, tidak ada teks lain
  `.trim();
}

export async function generateMenuText(
  ai: GoogleGenAI,
  prompt: string,
): Promise<MenuSuggestion[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { temperature: 0.7, topP: 0.9 },
  });

  const raw = response.text ?? '';
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned) as { menus: MenuSuggestion[] };

  return parsed.menus;
}

// ── Recipe Helpers ──────────────────

export function buildRecipePrompt(
  menuName: string,
  category: string,
  ingredients: string[],
): string {
  return `
Kamu adalah chef profesional yang menulis resep masakan lengkap.

Buatkan resep lengkap untuk: "${menuName}" (masakan ${category})

Bahan yang dimiliki pengguna: ${ingredients.length ? ingredients.join(', ') : 'tidak diketahui'}

Balas HANYA dengan JSON valid berikut, tanpa penjelasan, tanpa markdown:
{
  "recipe": {
    "menuId": "menu_detail",
    "name": "${menuName}",
    "emoji": "🍳",
    "description": "Deskripsi 2-3 kalimat yang menggugah selera tentang menu ini.",
    "servings": 2,
    "estimatedTime": "25 mnt",
    "difficulty": "Mudah",
    "category": "${category}",
    "ingredients": [
      {
        "name": "Nama bahan",
        "amount": "jumlah dan satuan, misal: 200 gram atau 2 butir",
        "isUserHave": true
      }
    ],
    "steps": [
      "Langkah 1 yang jelas dan detail.",
      "Langkah 2...",
      "Langkah 3..."
    ],
    "tips": "Satu tips singkat dari chef untuk hasil terbaik.",
    "youtubeSearchQuery": "query pencarian youtube untuk resep ini dalam bahasa Indonesia"
  }
}

Aturan:
- difficulty: "Mudah", "Sedang", atau "Sulit"
- isUserHave: true jika bahan ada di list pengguna, false jika perlu beli
- steps minimal 5 langkah yang detail dan mudah diikuti
- youtubeSearchQuery: query yang natural, misal "cara membuat nasi goreng spesial"
- Balas HANYA JSON, tidak ada teks lain
  `.trim();
}

export async function generateRecipeText(
  ai: GoogleGenAI,
  prompt: string,
): Promise<RecipeDetail> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  const raw = response.text ?? '';
  const cleaned = raw.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned) as { recipe: RecipeDetail };

  return parsed.recipe;
}
