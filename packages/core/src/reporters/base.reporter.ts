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

  // eslint-disable-next-line no-unused-vars
  abstract write(report: EvaluationExecutionReport): Promise<void>;
} 