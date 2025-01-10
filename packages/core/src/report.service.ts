import { EvaluationExecutionResult } from "./metrics/base.metric";
import { BaseReporter } from "./reporters/base.reporter";
import { JSONReporter } from "./reporters/json.reporter";
import { HTMLReporter } from "./reporters/html.reporter";
import { ConsoleReporter } from "./reporters/console.reporter";

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

export interface ReportServiceConfig {
  reporters?: BaseReporter[];
  outputDir?: string;
}

export class ReportService {
  private static instance: ReportService | undefined;
  private results: EvaluationExecutionReportItem[] = [];
  private startTime = 0;
  private endTime = 0;
  private reporters: BaseReporter[];

  private constructor(config: ReportServiceConfig = {}) {
    const { reporters = [], outputDir = "./eval-reports" } = config;
    
    // Default reporters if none provided
    this.reporters = reporters.length > 0 ? reporters : [
      new JSONReporter({ outputDir }),
      new HTMLReporter({ outputDir }),
      new ConsoleReporter()
    ];
  }

  public static getInstance(config?: ReportServiceConfig): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService(config);
    }
    return ReportService.instance;
  }

  public static resetInstance(): void {
    ReportService.instance = undefined;
  }

  reportEvaluationStart(): void {
    this.startTime = Date.now();
  }

  async reportEvaluationEnd(): Promise<void> {
    this.endTime = Date.now();
    await this.writeReports();
  }

  reportEvaluation(result: EvaluationExecutionReportItem): void {
    this.results.push(result);
  }

  formatResults(
    params: EvaluationExecutionReportItem,
  ): EvaluationExecutionReportItem {
    return params;
  }

  getFinalReport(): EvaluationExecutionReport {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      items: this.results,
      duration: this.endTime - this.startTime,
    };
  }

  private async writeReports(): Promise<void> {
    const report = this.getFinalReport();
    await Promise.all(
      this.reporters.map(reporter => reporter.write(report))
    );
  }
}
