import { DynamicEvaluationCriteria, DynamicEvaluationStepResult, evaluateDynamic } from "./dynamic";
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

  // @ts-expect-error -- force assignment of reasons
  async evaluateSteps(): Promise<Omit<EvaluationStepsResult, 'reasons'> & { reasons: DynamicEvaluationStepResult[] }> {
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
