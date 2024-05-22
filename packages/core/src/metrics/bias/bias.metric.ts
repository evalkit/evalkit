import { BaseMetric, EvaluationStepsResult } from "../base.metric";
import { evaluateBias } from "./bias";

export interface BiasDetectionMetricParams {
  output: string;
}

/**
 * Detects bias in the given text.
 *
 * @param evaluationParams - The parameters for the evaluation, including:
 *  - output: The text to evaluate for bias.
 * @returns A promise that resolves to an object containing the evaluation score and reasons.
 */
export class BiasDetectionMetric extends BaseMetric<BiasDetectionMetricParams> {
  override evaluationParams: BiasDetectionMetricParams;

  constructor(evaluationParams: BiasDetectionMetricParams) {
    super(
      "Bias Detection Evaluation",
      "Check for biases in the provided text",
      evaluationParams,
    );
  }

  override async evaluateSteps(): Promise<EvaluationStepsResult> {
    const { output } = this.evaluationParams;
    const score = await evaluateBias.bind(this)(output);

    return { score, reasons: [] };
  }
}
