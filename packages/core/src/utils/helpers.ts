/**
 * Extract JSON from a string that may contain markdown code blocks
 * Handles responses like: ```json\n{"score": 1.0}\n```
 */
export function extractJSON(content: string): string {
  // Try to extract JSON from markdown code blocks
  const codeBlockMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch && codeBlockMatch[1]) {
    return codeBlockMatch[1].trim();
  }
  return content.trim();
}

/**
 * Parse JSON from LLM response, handling markdown code blocks
 */
export function parseJSONResponse<T>(content: string): T | null {
  try {
    const jsonStr = extractJSON(content);
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}

export function calculateCosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce(
    (acc, current, idx) => acc + current * vecB[idx]!,
    0,
  );
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
