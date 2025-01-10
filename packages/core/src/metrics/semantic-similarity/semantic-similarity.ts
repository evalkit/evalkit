import { OpenAI } from "openai";
import { calculateCosineSimilarity } from "../../utils/helpers";

export interface SemanticSimilarityContext {
  openai: OpenAI;
}

/**
 * Evaluates semantic similarity between two texts using embeddings.
 *
 * @param text1 - The first text to compare.
 * @param text2 - The second text to compare.
 * @returns A promise that resolves to a number indicating the semantic similarity score.
 */
export async function evaluateSemanticSimilarity(
  this: SemanticSimilarityContext,
  text1: string,
  text2: string,
): Promise<number> {
  try {
    const { data } = await this.openai.embeddings.create({
      input: [text1, text2],
      model: "text-embedding-ada-002",
    });

    if (!data?.[0]?.embedding || !data?.[1]?.embedding) {
      return 0;
    }

    return calculateCosineSimilarity(data[0].embedding, data[1].embedding);
  } catch (error) {
    return 0;
  }
}
