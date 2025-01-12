import { OpenAI } from "openai";
import { EvaluationStepsResult } from "../base.metric";

export interface DynamicContext {
  openai: OpenAI;
}

export interface DynamicEvaluationCriteria {
  type: string;
}

export type DynamicEvaluationStepResult = Omit<EvaluationStepsResult, 'reasons'> & { criteria: string; reason: string; passed: boolean }

/**
 * Evaluates the dynamic alignment of actual output with the expected output based on specified criteria.
 * Utilizes OpenAI's model to generate a reasoning-based evaluation of the provided texts.
 *
 * @param {string} input - The original input question or statement provided to generate the outputs.
 * @param {string} actualOutput - The actual output generated in response to the input.
 * @param {string} expectedOutput - The expected output that ideally should be generated from the input.
 * @param {DynamicEvaluationCriteria[]} criteria - An array of criteria used to evaluate the output. Each criterion should describe an aspect of evaluation such as accuracy, relevance, etc.
 * @returns {Promise<{score: number, reasons: string[]}[]>} A promise that resolves to an array of objects containing a numerical score and an array of reasons supporting the score for each criterion.
 */
export async function evaluateDynamic(
  this: DynamicContext,
  input: string,
  actualOutput: string,
  expectedOutput: string,
  criteria: DynamicEvaluationCriteria[],
): Promise<DynamicEvaluationStepResult[]> {
  // Generate a detailed prompt for evaluation
  const prompt = `
	    Evaluate the following input, actual response and expected response based on a given set of criteria.
	    For each criterion, provide it's own score object.
	    Respond with a JSON of the following format: {
	      criteria: string - corresponds to the criteria being evaluated;
	      score: number - the score between 0 to 1 assigned to the actual output based on the criterion;
	      reason: string - an array of reasons supporting the score assigned to the actual output (1 liner).
	    }
    `;

  const results: DynamicEvaluationStepResult[] = [];
  for (const criterion of criteria) {
    // Use OpenAI API to evaluate the prompt
    const response = await this.openai.chat.completions.create({
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: `
					Input: ${input}
			    Expected Output: ${expectedOutput}
			    Actual Output: ${actualOutput}
			    Criteria: ${criterion.type}
				`,
        },
      ],
      max_tokens: 250,
      model: "gpt-4o-mini",
    });

    if (!response.choices[0]?.message?.content) {
      results.push({
        criteria: criterion.type,
        score: 0,
        reason: "Failed to get valid response from OpenAI",
        passed: false,
      });
      continue;
    }

    try {
      const result = JSON.parse(response.choices[0].message.content);
      if (!result || typeof result.score !== 'number' || typeof result.reason !== 'string') {
        results.push({
          criteria: criterion.type,
          score: 0,
          reason: "Invalid response format from OpenAI",
          passed: false,
        });
        continue;
      }

      results.push({
        ...result,
        criteria: criterion.type,
        passed: result.score >= 0.8,
      });
    } catch (error) {
      results.push({
        criteria: criterion.type,
        score: 0,
        reason: "Failed to parse OpenAI response",
        passed: false,
      });
    }
  }

  return results;
}
