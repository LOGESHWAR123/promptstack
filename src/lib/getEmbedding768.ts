import { generateEmbedding } from '@/lib/gemini';

// Downscale a vector to 768 dimensions by averaging chunks
export function downscaleEmbeddingTo768(vector: number[]): number[] {
  const chunkSize = Math.floor(vector.length / 768);
  if (chunkSize < 1) {
    throw new Error(`Cannot downscale embedding of length ${vector.length} to 768`);
  }

  const downscaled = Array.from({ length: 768 }, (_, i) => {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, vector.length);
    const chunk = vector.slice(start, end);
    const avg = chunk.reduce((sum, val) => sum + val, 0) / chunk.length;
    return avg;
  });

  return normalizeVector(downscaled);
}

// Normalize the vector to unit length
export function normalizeVector(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map((val) => val / (norm || 1));
}

// Always return a 768-dimensional embedding
export async function getEmbedding768(text: string): Promise<number[]> {
  const embedding = await generateEmbedding(text);
  if (embedding.length === 768) {
    return embedding;
  }
  console.warn(`⚠️ Resizing embedding from ${embedding.length} to 768`);
  return downscaleEmbeddingTo768(embedding);
}
