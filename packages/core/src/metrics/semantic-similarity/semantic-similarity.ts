import { calculateCosineSimilarity } from "../../utils/helpers";

/**
 * Evaluates the semantic similarity between two texts using embeddings and cosine calculation.
 *
 * @param text1 - First text in comparison
 * @param text2 - Second text in comparison
 * @returns A promise that resolves to a number indicating the cosine similarity.
 */
export async function evaluateSemanticSimilarity(
  text1: string,
  text2: string,
): Promise<number> {
  const { data } = await this.openai.embeddings.create({
    input: [text1, text2],
    model: "text-embedding-ada-002",
  });

  return calculateCosineSimilarity(data[0].embedding, data[1].embedding);
}
