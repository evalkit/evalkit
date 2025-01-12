import { describe, expect, it, jest, beforeEach, afterEach } from "@jest/globals";
import fs from "fs/promises";
import path from "path";
import { ReportService } from "../report.service";
import { BaseMetric } from "../metrics/base.metric";

// Mock fs and path modules
jest.mock("fs/promises");
jest.mock("path");

const mockedFs = jest.mocked(fs);
const mockedPath = jest.mocked(path);

mockedFs.mkdir.mockResolvedValue(undefined);
mockedFs.writeFile.mockResolvedValue(undefined);
mockedPath.join.mockImplementation((...args: string[]) => args.join("/"));

// Mock metrics for testing
class MockBiasMetric extends BaseMetric<{ text: string }> {
  constructor(params: { text: string }) {
    super("BiasMetric", "Test bias detection", params);
  }

  async evaluateSteps() {
    return {
      score: this.evaluationParams.text.includes("bias") ? 0.3 : 0.8,
      reasons: [
        this.evaluationParams.text.includes("bias") 
          ? "High bias detected" 
          : "Low bias detected"
      ]
    };
  }
}

class MockHallucinationMetric extends BaseMetric<{ reference: string; generated: string }> {
  constructor(params: { reference: string; generated: string }) {
    super("HallucinationMetric", "Test hallucination detection", params);
  }

  async evaluateSteps() {
    return {
      score: this.evaluationParams.reference === this.evaluationParams.generated ? 0.9 : 0.2,
      reasons: [
        this.evaluationParams.reference === this.evaluationParams.generated
          ? "Output matches reference"
          : "Output differs from reference"
      ]
    };
  }
}

describe("Reporting Integration", () => {
  const TEST_OUTPUT_DIR = "./test-reports";
  
  beforeEach(() => {
    jest.clearAllMocks();
    ReportService.resetInstance();
  });

  afterEach(() => {
    ReportService.resetInstance();
  });

  it("should generate reports for multiple metrics", async () => {
    const reportService = ReportService.getInstance({ outputDir: TEST_OUTPUT_DIR });
    
    // Start evaluation
    reportService.reportEvaluationStart();

    // Run bias metric evaluations
    const biasMetric1 = new MockBiasMetric({ text: "normal text" });
    await biasMetric1.executeEvaluation();

    const biasMetric2 = new MockBiasMetric({ text: "biased text" });
    await biasMetric2.executeEvaluation();

    // Run hallucination metric evaluation
    const hallMetric = new MockHallucinationMetric({
      reference: "test",
      generated: "test"
    });
    await hallMetric.executeEvaluation();

    // End evaluation and generate reports
    await reportService.reportEvaluationEnd();

    // Verify reports were generated
    expect(mockedFs.mkdir).toHaveBeenCalledWith(TEST_OUTPUT_DIR, { recursive: true });
    
    const writeFileCalls = mockedFs.writeFile.mock.calls;
    console.log('Write file calls:', writeFileCalls);
    expect(writeFileCalls.length).toBe(2); // JSON and HTML reports

    // Verify JSON report
    const jsonCall = writeFileCalls.find(call => typeof call[0] === 'string' && call[0].endsWith(".json"));
    expect(jsonCall).toBeDefined();
    const jsonReport = JSON.parse(jsonCall![1] as string);
    console.log('JSON report:', jsonReport);

    expect(jsonReport.summary.totalEvaluations).toBe(3);
    expect(jsonReport.summary.passedEvaluations).toBe(2);
    expect(jsonReport.summary.failedEvaluations).toBe(1);
    
    expect(jsonReport.summary.metrics.BiasMetric.passed).toBe(1);
    expect(jsonReport.summary.metrics.BiasMetric.failed).toBe(1);
    expect(jsonReport.summary.metrics.HallucinationMetric.passed).toBe(1);
    expect(jsonReport.summary.metrics.HallucinationMetric.failed).toBe(0);

    // Verify HTML report
    const htmlCall = writeFileCalls.find(call => typeof call[0] === 'string' && call[0].endsWith(".html"));
    expect(htmlCall).toBeDefined();
    const htmlReport = htmlCall![1] as string;

    expect(htmlReport).toContain("66.7%"); // Pass rate
    expect(htmlReport).toContain("BiasMetric");
    expect(htmlReport).toContain("HallucinationMetric");
    expect(htmlReport).toContain("High bias detected");
    expect(htmlReport).toContain("Low bias detected");
    expect(htmlReport).toContain("Output matches reference");
  });
}); 