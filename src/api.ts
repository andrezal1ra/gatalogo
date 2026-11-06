export type Breed = {
  id: string;
  name: string;
  origin: string;
  temperament: string;
  description: string;
  life_span: string;
  wikipedia_url?: string;
  reference_image_id?: string;
  image?: { url?: string };
  adaptability?: number;
  affection_level?: number;
  child_friendly?: number;
  energy_level?: number;
  intelligence?: number;
};

const BASE_URL = 'https://api.thecatapi.com/v1';

export async function fetchBreeds(): Promise<Breed[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${BASE_URL}/breeds`, { signal: controller.signal });
    if (!response.ok) throw new Error(`Falha na API (${response.status})`);
    const data: unknown = await response.json();
    if (!Array.isArray(data)) throw new Error('Resposta inesperada da API');
    return (data as Breed[]).filter((breed) => breed.id && breed.name).sort((a, b) => a.name.localeCompare(b.name));
  } finally {
    clearTimeout(timeout);
  }
}

export function breedImage(breed: Breed): string | undefined {
  return breed.image?.url || (breed.reference_image_id
    ? `https://cdn2.thecatapi.com/images/${encodeURIComponent(breed.reference_image_id)}.jpg`
    : undefined);
}
