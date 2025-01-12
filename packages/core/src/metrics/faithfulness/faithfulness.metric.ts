import { BaseMetric, EvaluationStepsResult } from "../base.metric";
import { evaluateFaithfulness } from "./faithfulness";

export interface FaithfulnessMetricParams {
  output: string;
  context: string;
}

export class FaithfulnessMetric extends BaseMetric<FaithfulnessMetricParams> {
  constructor(evaluationParams: FaithfulnessMetricParams) {
    super(
      "Faithfulness Evaluation",
      "Evaluate the accuracy of the generated text compared to the source text",
      evaluationParams,
    );
  }

  override async evaluateSteps(): Promise<EvaluationStepsResult> {
    const { context, output } = this.evaluationParams;

    const faithfulnessScore = await evaluateFaithfulness.bind(this)(
      output,
      context,
    );
    const reasons =
      faithfulnessScore === 1
        ? ["All statements in the generated text are truthful."]
        : [`Faithfulness score: ${faithfulnessScore}`];

    const score = faithfulnessScore;
    return { score, reasons };
  }
}
