import { BaseReporter, ReporterConfig } from "./base.reporter";
import { EvaluationExecutionReport } from "../report.service";
import chalk from "chalk";

export class ConsoleReporter extends BaseReporter {
  constructor(config?: ReporterConfig) {
    super(config);
  }

  async write(report: EvaluationExecutionReport): Promise<void> {
    const totalEvaluations = report.items.length;
    const passedEvaluations = report.items.filter(item => item.result.passed).length;
    const failedEvaluations = totalEvaluations - passedEvaluations;
    
    console.log("\n📊 EvalKit Report Summary");
    console.log("========================");
    
    // Overall stats
    console.log(`\n🕒 Duration: ${(report.duration / 1000).toFixed(2)}s`);
    console.log(`📝 Total Evaluations: ${totalEvaluations}`);
    console.log(`✅ Passed: ${chalk.green(String(passedEvaluations))}`);
    console.log(`❌ Failed: ${chalk.red(String(failedEvaluations))}`);
    
    // Metrics breakdown
    console.log("\n📈 Metrics Breakdown");
    console.log("------------------");
    
    const metricGroups = report.items.reduce((acc, item) => {
      if (!acc[item.metricName]) {
        acc[item.metricName] = [];
      }
      acc[item.metricName]!.push(item);
      return acc;
    }, {} as Record<string, typeof report.items>);

    Object.entries(metricGroups).forEach(([metricName, items]) => {
      const passed = items.filter(i => i.result.passed).length;
      const failed = items.length - passed;
      const avgScore = items.reduce((acc, i) => acc + i.result.score, 0) / items.length;
      
      console.log(`\n${metricName}:`);
      console.log(`  Score: ${chalk.cyan(avgScore.toFixed(2))}`);
      console.log(`  Passed: ${chalk.green(String(passed))} Failed: ${chalk.red(String(failed))}`);
      
      // Show failed evaluations reasons
      const failedItems = items.filter(i => !i.result.passed);
      if (failedItems.length > 0) {
        console.log("  Failed Evaluations:");
        failedItems.forEach(item => {
          console.log(`    - Score: ${chalk.red(item.result.score.toFixed(2))}`);
          item.result.reasons.forEach(reason => {
            console.log(`      ${chalk.gray(reason)}`);
          });
        });
      }
    });
  }
} 