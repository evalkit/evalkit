import { EvaluationExecutionResult } from "./metrics/base.metric";
import { BaseReporter } from "./reporters/base.reporter";
import { JSONReporter } from "./reporters/json.reporter";
import { HTMLReporter } from "./reporters/html.reporter";
import { ConsoleReporter } from "./reporters/console.reporter";
import { config } from "./config";

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
  private static instance: ReportService | undefined;
  private results: EvaluationExecutionReportItem[] = [];
  private startTime = 0;
  private endTime = 0;
  private reporters: BaseReporter[];

  private constructor() {
    const { outputFormats = [], outputDir = './eval-reports' } = config.getReportingConfig();
    
    // Console reporter is always included
    this.reporters = [new ConsoleReporter()];
    
    // Add file reporters based on config
    if (outputFormats.includes('json')) {
      this.reporters.push(new JSONReporter({ outputDir }));
    }
    if (outputFormats.includes('html')) {
      this.reporters.push(new HTMLReporter({ outputDir }));
    }
  }

  public static getInstance(): ReportService {
    if (!ReportService.instance) {
      ReportService.instance = new ReportService();
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
