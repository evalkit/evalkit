import { OpenAI } from "openai";

export interface FaithfulnessContext {
  openai: OpenAI;
}

enum Label {
  Faithful = "faithful",
  Contradicting = "contradicting",
}

/**
 * Evaluates faithfulness of the generated text by checking the number of truthful statements against the total number of statements.
 *
 * @param output - The generated text to be evaluated.
 * @param context - The context from which to draw conclusions
 * @returns A promise that resolves to a number indicating the faithfulness score.
 */
export async function evaluateFaithfulness(
  this: FaithfulnessContext,
  output: string,
  context: string,
): Promise<number> {
  const statements = output
    .split(".")
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  let truthfulStatements = 0;

  for (const statement of statements) {
    const response = await this.openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
						Given the context: "${context}". Assess whether the following user statement accurately reflects the context without introducing any inaccuracies or distortions. Consider both direct claims and implied meanings.
						Return JSON response with schema: { label: ${Object.values(Label).join(",")}; score: float between 1-0 }
            `,
        },
        { role: "user", content: statement },
      ],
      max_tokens: 80,
      model: "gpt-4o-mini",
    });

    if (!response.choices[0]?.message?.content) {
      return 0;
    }

    try {
      const result = JSON.parse(response.choices[0].message.content);
      if (!result || typeof result.label !== 'string' || typeof result.score !== 'number') {
        return 0;
      }
      
      if (result.label === Label.Faithful && result.score >= 0.8) {
        truthfulStatements++;
      }
    } catch (error) {
      return 0;
    }
  }

  // Calculate faithfulness score
  return truthfulStatements / statements.length;
}
