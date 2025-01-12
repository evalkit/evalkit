import { BaseMetric, EvaluationStepsResult } from "../base.metric";
import { evaluateCoherence } from "./coherence";

export interface CoherenceMetricParams {
  output: string;
}

export class CoherenceMetric extends BaseMetric<CoherenceMetricParams> {
  constructor(evaluationParams: CoherenceMetricParams) {
    super(
      "Coherence Evaluation",
      "Evaluate the logical flow and consistency of the paragraph",
      evaluationParams,
    );
  }

  override async evaluateSteps(): Promise<EvaluationStepsResult> {
    const { output } = this.evaluationParams;

    const { score, reason } = await evaluateCoherence.bind(this)(output);

    return { score, reasons: [reason] };
  }
}
