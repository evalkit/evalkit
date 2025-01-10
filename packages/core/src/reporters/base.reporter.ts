import { EvaluationExecutionReport } from "../report.service";

export interface ReporterConfig {
  outputDir?: string;
  filename?: string;
}

export abstract class BaseReporter {
  protected config: ReporterConfig;

  constructor(config: ReporterConfig = {}) {
    this.config = {
      outputDir: "./eval-reports",
      filename: `evalkit-report-${Date.now()}`,
      ...config,
    };
  }

  abstract write(report: EvaluationExecutionReport): Promise<void>;
} 