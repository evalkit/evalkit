import fs from "fs/promises";
import path from "path";
import { BaseReporter, ReporterConfig } from "./base.reporter";
import { EvaluationExecutionReport } from "../report.service";

export class JSONReporter extends BaseReporter {
  constructor(config?: ReporterConfig) {
    super(config);
  }

  async write(report: EvaluationExecutionReport): Promise<void> {
    const outputPath = path.join(this.config.outputDir!, `${this.config.filename}.json`);
    
    // Ensure directory exists
    await fs.mkdir(this.config.outputDir!, { recursive: true });
    
    // Generate summary
    const summary = this.generateSummary(report);
    
    await fs.writeFile(outputPath, JSON.stringify({ summary, ...report }, null, 2));
  }

  private generateSummary(report: EvaluationExecutionReport) {
    const totalEvaluations = report.items.length;
    const passedEvaluations = report.items.filter(item => item.result.passed).length;
    const averageScore = report.items.reduce((acc, item) => acc + item.result.score, 0) / totalEvaluations;

    const metricSummary = report.items.reduce((acc, item) => {
      if (!acc[item.metricName]) {
        acc[item.metricName] = {
          passed: 0,
          failed: 0,
          totalScore: 0,
          count: 0
        };
      }
      
      const metricData = acc[item.metricName];
      if (!metricData) return acc;

      metricData.count++;
      metricData.totalScore += item.result.score;
      if (item.result.passed) {
        metricData.passed++;
      } else {
        metricData.failed++;
      }
      
      return acc;
    }, {} as Record<string, { passed: number; failed: number; totalScore: number; count: number }>);

    return {
      totalEvaluations,
      passedEvaluations,
      failedEvaluations: totalEvaluations - passedEvaluations,
      averageScore,
      duration: report.duration,
      startTime: report.startTime,
      endTime: report.endTime,
      metrics: Object.entries(metricSummary).reduce((acc, [metric, data]) => {
        acc[metric] = {
          passed: data.passed,
          failed: data.failed,
          averageScore: data.totalScore / data.count
        };
        return acc;
      }, {} as Record<string, { passed: number; failed: number; averageScore: number }>)
    };
  }
} 