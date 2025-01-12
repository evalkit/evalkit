import { DynamicEvaluationCriteria, evaluateDynamic } from "./dynamic";
import { BaseMetric, EvaluationStepsResult } from "../base.metric";

export interface DynamicMetricParams {
  input: string;
  actualOutput: string;
  expectedOutput: string;
  criteria: DynamicEvaluationCriteria[];
}

export class DynamicMetric extends BaseMetric<DynamicMetricParams> {
  constructor(evaluationParams: DynamicMetricParams) {
    super("Dynamic Metric", "Dynamic Evaluation", evaluationParams);
  }

  // @ts-ignore
  async evaluateSteps(): Promise<Omit<EvaluationStepsResult, 'reasons'> & { reasons: string[] }> {
    const results = await evaluateDynamic.call(
      this,
      this.evaluationParams.input,
      this.evaluationParams.actualOutput,
      this.evaluationParams.expectedOutput,
      this.evaluationParams.criteria,
    );

    return {
      score: results.filter((r) => r.passed).length / results.length,
      reasons: results,
    };
  }
}
