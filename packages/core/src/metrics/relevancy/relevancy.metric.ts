import { BaseMetric, EvaluationStepsResult } from "../base.metric";
import { evaluateRelevancy } from "./relevancy";

export interface RelevancyMetricParams {
  input: string;
  output: string;
}

export class RelevancyMetric extends BaseMetric<RelevancyMetricParams> {
  override evaluationParams: RelevancyMetricParams;

  constructor(evaluationParams: RelevancyMetricParams) {
    super(
      "Relevancy Evaluation",
      "Evaluate how well the answer addresses the question",
      evaluationParams,
    );
  }

  override async evaluateSteps(): Promise<EvaluationStepsResult> {
    const { input, output } = this.evaluationParams;

    const relevancyScore = await evaluateRelevancy.bind(this)(input, output);
    if (relevancyScore >= 0.8) {
      return {
        score: relevancyScore,
        reasons: ["The answer is relevant to the question."],
      };
    }

    return {
      score: relevancyScore,
      reasons: ["The answer is not relevant to the question."],
    };
  }
}
