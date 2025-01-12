import { ReportService } from "../report.service";
import { OpenAI } from "openai";
import { config } from "../config";

export interface EvaluationStepsResult {
  score: number;
  reasons: string[];
}

export interface EvaluationExecutionResult {
  passed: boolean;
  score: number;
  reasons: string[];
}

export class BaseMetric<TParams> {
  name: string;
  criteria: string;
  evaluationParams: TParams;
  threshold: number;
  evaluationsReporter: ReportService;
  openai: OpenAI;

  constructor(
    name: string,
    criteria: string,
    evaluationParams: TParams,
    threshold = 0.5,
  ) {
    this.openai = config.getOpenAIClient();
    this.name = name;
    this.criteria = criteria;
    this.evaluationParams = evaluationParams;
    this.threshold = threshold;
    this.evaluationsReporter = ReportService.getInstance();
  }

  async evaluateSteps(): Promise<EvaluationStepsResult> {
    throw new Error("evaluateSteps() must be implemented by subclasses");
  }

  async executeEvaluation(): Promise<EvaluationExecutionResult> {
    const { score, reasons } = await this.evaluateSteps();
    const passed = score >= this.threshold;
    this.reportEvaluation({ passed, score, reasons });
    return { passed, score, reasons };
  }

  reportEvaluation(result: EvaluationExecutionResult): void {
    const report = this.evaluationsReporter.formatResults({
      result,
      metricName: this.name,
      params: this.evaluationParams,
    });
    this.evaluationsReporter.reportEvaluation(report);
  }
}
