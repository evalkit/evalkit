import { OpenAI } from "openai";
import { parseJSONResponse } from "../../utils/helpers";

export interface IntentContext {
  openai: OpenAI;
  model: string;
}

/**
 * Classifies the intent behind a given text.
 *
 * @param input - The text to classify.
 * @param expectedIntents - The expected intent(s) to evaluate against.
 * @returns A promise that resolves to an object containing the detected intent and its confidence score.
 */
export async function classifyIntent(
  this: IntentContext,
  input: string,
  expectedIntents: string[],
): Promise<{ score: number; reasons: string[] }> {
  const response = await this.openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `
            Given the user question to follow, classify the intent behind the text and evaluate against the expected intent(s).
            Expected intent(s): ${expectedIntents.join(",")}
            Return JSON response with schema: Array<{
	            intent: string;
	            confidence: float between 1-0 that indicates the confidence of the detected intent;
	            similarity: {
	              inputIntent: string;
	              score: float between 1-0 that indicates the similarity between the detected intent and one of the expected intent(s)
	            }
            }>
            RETURN AN ARRAY FOR THE LIST
          `,
      },
      { role: "user", content: input },
    ],
    max_tokens: 250,
    model: this.model,
  });

  if (!response.choices[0]?.message?.content) {
    return {
      score: 0,
      reasons: ["Failed to get valid response from OpenAI"],
    };
  }

  interface IntentItem {
    intent: string;
    confidence: number;
    similarity: { inputIntent: string; score: number };
  }

  const intentsList = parseJSONResponse<IntentItem[]>(response.choices[0].message.content);
  if (!intentsList || !Array.isArray(intentsList)) {
    return {
      score: 0,
      reasons: ["Invalid response format from LLM"],
    };
  }

  let matchingIntents = 0;
  for (const intentItem of intentsList) {
    if (!intentItem?.confidence || !intentItem?.similarity?.inputIntent || !intentItem?.similarity?.score) {
      continue;
    }
    const { confidence, similarity } = intentItem;
    if (
      confidence > 0.8 &&
      expectedIntents.includes(similarity.inputIntent) &&
      similarity.score >= 0.8
    ) {
      matchingIntents++;
    }
  }

  const reasons = [
    `Detected intents: ${intentsList.map((intentItem) => intentItem.intent).join(", ")}`,
    `Matching intents: ${matchingIntents} out of ${expectedIntents.length}`,
  ];

  return {
    score: matchingIntents / expectedIntents.length,
    reasons,
  };
}
