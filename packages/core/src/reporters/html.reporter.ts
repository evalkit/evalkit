import fs from "fs/promises";
import path from "path";
import { BaseReporter, ReporterConfig } from "./base.reporter";
import { EvaluationExecutionReport } from "../report.service";

export class HTMLReporter extends BaseReporter {
  constructor(config?: ReporterConfig) {
    super(config);
  }

  async write(report: EvaluationExecutionReport): Promise<void> {
    const outputPath = path.join(this.config.outputDir!, `${this.config.filename}.html`);
    await fs.mkdir(this.config.outputDir!, { recursive: true });

    const summary = this.generateSummary(report);
    const html = this.generateHTML(summary, report);
    await fs.writeFile(outputPath, html);
  }

  private generateSummary(report: EvaluationExecutionReport) {
    const totalEvaluations = report.items.length;
    const passedEvaluations = report.items.filter(item => item.result.passed).length;
    const failedEvaluations = totalEvaluations - passedEvaluations;
    const averageScore = report.items.reduce((acc, item) => acc + item.result.score, 0) / totalEvaluations;

    const metricGroups = report.items.reduce((acc, item) => {
      if (!acc[item.metricName]) {
        acc[item.metricName] = {
          passed: 0,
          failed: 0,
          totalScore: 0,
          count: 0,
          items: []
        };
      }
      
      const metricData = acc[item.metricName];
      if (!metricData) return acc;

      metricData.count++;
      metricData.totalScore += item.result.score;
      metricData.items.push(item);
      
      if (item.result.passed) {
        metricData.passed++;
      } else {
        metricData.failed++;
      }
      
      return acc;
    }, {} as Record<string, {
      passed: number;
      failed: number;
      totalScore: number;
      count: number;
      items: typeof report.items;
    }>);

    return {
      totalEvaluations,
      passedEvaluations,
      failedEvaluations,
      averageScore,
      duration: report.duration,
      startTime: report.startTime,
      endTime: report.endTime,
      metrics: metricGroups
    };
  }

  // eslint-disable-next-line no-unused-vars
  private generateHTML(summary: ReturnType<typeof this.generateSummary>, _report: EvaluationExecutionReport): string {
    const passRate = (summary.passedEvaluations / summary.totalEvaluations) * 100;
    const duration = (summary.duration / 1000).toFixed(2);

    return `<!DOCTYPE html>
<html>
<head>
  <title>EvalKit Report</title>
  <style>
    :root {
      --primary: #3b82f6;
      --success: #22c55e;
      --error: #ef4444;
      --warning: #f59e0b;
      --text: #1f2937;
      --bg: #ffffff;
      --bg-alt: #f3f4f6;
    }
    
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.5;
      color: var(--text);
      background: var(--bg);
      margin: 0;
      padding: 2rem;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .title {
      font-size: 2rem;
      font-weight: 600;
      margin: 0;
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background: var(--bg-alt);
      padding: 1rem;
      border-radius: 0.5rem;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .stat-value {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 0.25rem;
    }
    
    .metric-section {
      margin-bottom: 2rem;
    }
    
    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .metric-title {
      font-size: 1.25rem;
      font-weight: 600;
    }
    
    .metric-stats {
      display: flex;
      gap: 1rem;
    }
    
    .metric-stat {
      font-size: 0.875rem;
    }
    
    .evaluation-list {
      background: var(--bg-alt);
      border-radius: 0.5rem;
      overflow: hidden;
    }
    
    .evaluation-item {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .evaluation-item:last-child {
      border-bottom: none;
    }
    
    .evaluation-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    
    .evaluation-score {
      font-weight: 600;
    }
    
    .evaluation-reasons {
      margin: 0;
      padding-left: 1.5rem;
      color: #6b7280;
    }
    
    .passed { color: var(--success); }
    .failed { color: var(--error); }
    
    .toggle-btn {
      background: none;
      border: none;
      color: var(--primary);
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
    
    .toggle-btn:hover {
      text-decoration: underline;
    }
    
    .hidden {
      display: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="title">EvalKit Report</h1>
    </header>
    
    <div class="summary">
      <div class="stat-card">
        <div class="stat-label">Pass Rate</div>
        <div class="stat-value">${passRate.toFixed(1)}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Evaluations</div>
        <div class="stat-value">${summary.totalEvaluations}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Duration</div>
        <div class="stat-value">${duration}s</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Average Score</div>
        <div class="stat-value">${summary.averageScore.toFixed(2)}</div>
      </div>
    </div>

    ${Object.entries(summary.metrics).map(([metricName, data]) => `
      <section class="metric-section">
        <div class="metric-header">
          <h2 class="metric-title">${metricName}</h2>
          <div class="metric-stats">
            <span class="metric-stat passed">&check; ${data.passed} passed</span>
            <span class="metric-stat failed">&cross; ${data.failed} failed</span>
            <span class="metric-stat">Score: ${(data.totalScore / data.count).toFixed(2)}</span>
          </div>
        </div>
        
        <div class="evaluation-list">
          ${data.items.map((item, index) => `
            <div class="evaluation-item">
              <div class="evaluation-header">
                <span class="evaluation-score ${item.result.passed ? 'passed' : 'failed'}">
                  Score: ${item.result.score.toFixed(2)}
                </span>
                <button class="toggle-btn" onclick="toggleReasons(${index})">
                  ${item.result.reasons.length} reasons
                </button>
              </div>
              <ul class="evaluation-reasons hidden" id="reasons-${index}">
                ${item.result.reasons.map(reason => `
                  <li>${reason}</li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </section>
    `).join('')}
  </div>

  <script>
    function toggleReasons(index) {
      const reasons = document.getElementById('reasons-' + index);
      reasons.classList.toggle('hidden');
    }
  </script>
</body>
</html>`;
  }
} 