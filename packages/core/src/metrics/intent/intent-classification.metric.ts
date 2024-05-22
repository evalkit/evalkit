import { BaseMetric, EvaluationStepsResult } from "../base.metric";
import { classifyIntent } from "./intent";

export interface IntentClassificationMetricParams {
  input: string;
  expectedIntents: string[];
}

export class IntentClassificationMetric extends BaseMetric<IntentClassificationMetricParams> {
  override evaluationParams: IntentClassificationMetricParams;

  constructor(evaluationParams: IntentClassificationMetricParams) {
    super(
      "Intent Classification Evaluation",
      "Classify the intent behind the given text and evaluate against the expected intent",
      evaluationParams,
    );
  }

  override async evaluateSteps(): Promise<EvaluationStepsResult> {
    const { input, expectedIntents } = this.evaluationParams;

    const { score, reasons } = await classifyIntent.bind(this)(
      input,
      expectedIntents,
    );

    return { score, reasons };
  }
}
