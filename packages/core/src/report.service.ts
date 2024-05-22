import { EvaluationExecutionResult } from "./metrics/base.metric";

export interface EvaluationExecutionReportItem {
  metricName: string;
  params: unknown;
  result: EvaluationExecutionResult;
}

export interface EvaluationExecutionReport {
  startTime: number;
  endTime: number;
  items: EvaluationExecutionReportItem[];
  duration: number;
}

export class ReportService {
  private static instance: ReportService;
  public results: EvaluationExecutionReportItem[] = [];
  public startTime: number;
  public endTime: number;

  private constructor() {}

  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
    }

    return ReportService.instance;
  }

  reportEvaluationStart(): void {
    this.startTime = Date.now();
  }

  reportEvaluationEnd(): void {
    this.endTime = Date.now();
  }

  reportEvaluation(result: EvaluationExecutionReportItem): void {
    this.results.push(result);
  }

  formatResults(
    params: EvaluationExecutionReportItem,
  ): EvaluationExecutionReportItem {
    return params;
  }

  getFinalResult(): EvaluationExecutionReport {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      items: this.results,
      duration: this.endTime - this.startTime,
    };
  }
}
