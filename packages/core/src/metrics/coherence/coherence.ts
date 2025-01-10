import { OpenAI } from "openai";

export interface CoherenceContext {
  openai: OpenAI;
}

enum Label {
  Coherent = "Coherent",
  Incoherent = "Incoherent",
}

/**
 * Evaluates the coherence of the generated text, logical flow and consistency of the paragraph.
 * The coherence score is calculated by evaluating the transition between two consecutive statements.
 *
 * @param output - The generated text to be evaluated.
 * @returns A promise that resolves to a number indicating the coherence score.
 */
export async function evaluateCoherence(
  this: CoherenceContext,
  output: string,
): Promise<{ score: number; reason: string }> {
  let coherentStatements = 0;
  const statements = output
    .split(".")
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  // Evaluate the coherence of each section of the text
  for (let i = 0; i < statements.length - 1; i++) {
    const currentStatement = statements[i];
    const nextStatement = statements[i + 1];

    const response = await this.openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
		        Evaluate the coherence between two consecutive statements. Consider if the transition is logically supported by evidence or if it makes an unsupported leap. Assess if the second statement follows naturally from the first, or if it introduces generalizations that lack grounding in the first statement.
		        Return JSON response with schema: { label: 'Coherent', 'Incoherent'; score: float between 1-0 relative to label (so incoherent can also get 0.9); reason: string (1 liner) }
            `,
        },
        {
          role: "user",
          content: `Does the statement "${nextStatement}" logically follow from "${currentStatement}"?`,
        },
      ],
      max_tokens: 80,
      model: "gpt-4o-mini",
    });

    if (!response.choices[0]?.message?.content) {
      return {
        score: 0,
        reason: "Failed to get valid response from OpenAI",
      };
    }

    try {
      const result = JSON.parse(response.choices[0].message.content);
      if (!result || typeof result.label !== 'string' || typeof result.score !== 'number' || typeof result.reason !== 'string') {
        return {
          score: 0,
          reason: "Invalid response format from OpenAI",
        };
      }

      if (result.label === Label.Incoherent && result.score >= 0.8) {
        return {
          score: 0,
          reason: result.reason,
        };
      }

      if (result.label === Label.Coherent && result.score >= 0.8) {
        coherentStatements++;
      }
    } catch (error) {
      return {
        score: 0,
        reason: "Failed to parse OpenAI response",
      };
    }
  }

  return {
    score: coherentStatements / statements.length,
    reason: "The text demonstrates a coherent logical flow.",
  };
}
