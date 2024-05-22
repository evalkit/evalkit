export function calculateCosineSimilarity(vecA: number[], vecB: number[]) {
  const dotProduct = vecA.reduce(
    (acc, current, idx) => acc + current * vecB[idx],
    0,
  );
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
