enum Label {
  Faithful = "Faithful",
  Hallucinated = "Hallucinated",
}

/**
 * Evaluates hallucination in the generated text by checking the presence of unsupported statements.
 *
 * @param output - The generated text to be evaluated.
 * @param context - The context from which to draw conclusions
 * @returns A promise that resolves to a number indicating the percentage of hallucinated statements.
 */
export async function evaluateHallucination(
  output: string,
  context: string,
): Promise<number> {
  const statements = output
    .split(".")
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  let hallucinatedStatements = 0;

  for (const statement of statements) {
    const response = await this.openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
                        Given the context: "${context}". Decide if a user statement is based on the context or if it introduces facts not found in the context or general knowledge.
                        Return JSON response with schema: { label: ${Object.values(Label).join(",")}; score: float between 1-0 }
                    `,
        },
        { role: "user", content: statement },
      ],
      max_tokens: 80,
      model: "gpt-3.5-turbo",
    });

    const result = JSON.parse(response.choices[0].message.content);
    if (result.label === Label.Hallucinated && result.score >= 0.8) {
      hallucinatedStatements++;
    }
  }

  return hallucinatedStatements / statements.length;
}
