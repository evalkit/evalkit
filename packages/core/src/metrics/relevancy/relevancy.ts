/**
 * Evaluates the relevancy of the generated text in response to a given question.
 * Relevancy measures how well the answer addresses the question, focusing on contextual appropriateness.
 *
 * @param input - The question posed.
 * @param output - The answer to be evaluated.
 * @returns A promise that resolves to a boolean indicating whether the answer is relevant to the question.
 */
export async function evaluateRelevancy(
  input: string,
  output: string,
): Promise<number> {
  const response = await this.openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
            Given The expected user question, asses the relevancy of the answer given.
            Return JSON response with schema: { score: float between 1-0 }
          `,
      },
      { role: "user", content: `Question: ${input}. Answer: ${output}` },
    ],
    max_tokens: 80,
    model: "gpt-3.5-turbo",
  });

  const { score } = JSON.parse(response.choices[0].message.content);

  return score;
}
