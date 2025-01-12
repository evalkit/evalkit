import { MetricType, LLMTestCase } from "./types";
import { EvaluationExecutionReport, ReportService } from "./report.service";
import { config } from "./config";

async function evaluate<TMetrics extends MetricType[]>(
  testCase: LLMTestCase<TMetrics>,
  metrics: TMetrics,
): Promise<EvaluationExecutionReport> {
  // Initialize config from file if it exists
  await config.init();
  
  const reportService = ReportService.getInstance();
  reportService.reportEvaluationStart();
  
  for (const metricClass of metrics) {
    // @ts-expect-error -- advanced TS mechanism ends up putting an unnecessary unknown somewhere
    const metric = new metricClass(testCase);
    try {
      const result = await metric.executeEvaluation();
      console.log(`${metric.name} Passed:`, result.passed);
      console.log("Score:", result.score);
      console.log("Reasons:", result.reasons);
    } catch (error) {
      console.error(`${metric.name} Failed:`, error);
    }
  }

  await reportService.reportEvaluationEnd();
  return reportService.getFinalReport();
}

export { evaluate };
