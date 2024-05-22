import { BaseMetric, EvaluationStepsResult } from "../base.metric";
import { evaluateHallucination } from "./hallucination";

export interface HallucinationMetricParams {
  output: string;
  context: string;
}

export class HallucinationMetric extends BaseMetric<HallucinationMetricParams> {
  override evaluationParams: HallucinationMetricParams;

  constructor(evaluationParams: HallucinationMetricParams) {
    super(
      "Hallucination Evaluation",
      "Evaluate hallucinations in the generated text using different strategies",
      evaluationParams,
    );
  }

  override async evaluateSteps(): Promise<EvaluationStepsResult> {
    const { context, output } = this.evaluationParams;

    const score = await evaluateHallucination.bind(this)(output, context);
    const reasons =
      score === 1
        ? ["All statements in the generated text are truthful."]
        : [`Hallucination score: ${score}`];

    return { score, reasons };
  }
}
