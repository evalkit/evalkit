import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import fs from "fs/promises";
import path from "path";
import { HTMLReporter } from "../html.reporter";
import { EvaluationExecutionReport } from "../../report.service";

jest.mock("fs/promises");
jest.mock("path");

describe("HTMLReporter", () => {
  let reporter: HTMLReporter;
  const mockReport: EvaluationExecutionReport = {
    startTime: 1000,
    endTime: 2000,
    duration: 1000,
    items: [
      {
        metricName: "BiasMetric",
        params: { text: "test text" },
        result: {
          passed: true,
          score: 0.8,
          reasons: ["Low bias detected"]
        }
      },
      {
        metricName: "BiasMetric",
        params: { text: "biased text" },
        result: {
          passed: false,
          score: 0.3,
          reasons: ["High bias detected", "Contains stereotypes"]
        }
      },
      {
        metricName: "HallucinationMetric",
        params: {
          reference: "ground truth",
          generated: "model output"
        },
        result: {
          passed: true,
          score: 0.9,
          reasons: ["Output matches reference"]
        }
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    reporter = new HTMLReporter({ outputDir: "./test-reports" });
  });

  it("should create output directory if it doesn't exist", async () => {
    await reporter.write(mockReport);
    expect(fs.mkdir).toHaveBeenCalledWith("./test-reports", { recursive: true });
  });

  it("should write HTML file with correct content", async () => {
    await reporter.write(mockReport);
    
    const writeFileCalls = (fs.writeFile as jest.Mock).mock.calls;
    expect(writeFileCalls.length).toBe(1);
    
    const [filePath, content] = writeFileCalls[0] as [string, string];
    expect(path.join).toHaveBeenCalled();
    
    // Verify HTML structure
    expect(content).toContain("<!DOCTYPE html>");
    expect(content).toContain("<title>EvalKit Report</title>");
    
    // Check summary stats
    expect(content).toContain("66.7%"); // Pass rate (2/3)
    expect(content).toContain("1.00s"); // Duration
    
    // Check metric specific content
    expect(content).toContain("BiasMetric");
    expect(content).toContain("HallucinationMetric");
    
    // Check evaluation details
    expect(content).toContain("Low bias detected");
    expect(content).toContain("High bias detected");
    expect(content).toContain("Contains stereotypes");
    expect(content).toContain("Output matches reference");
  });

  it("should generate correct summary statistics", async () => {
    await reporter.write(mockReport);
    
    const writeFileCalls = (fs.writeFile as jest.Mock).mock.calls;
    expect(writeFileCalls.length).toBeGreaterThan(0);
    
    const firstCall = writeFileCalls[0];
    expect(firstCall).toBeDefined();
    
    // Type assertion after we've verified it exists
    const [_, content] = firstCall as [string, string];
    
    // Total evaluations
    expect(content).toContain('class="stat-value">3<');
    
    // BiasMetric stats
    expect(content).toContain("BiasMetric");
    expect(content).toContain("✓ 1 passed");
    expect(content).toContain("✗ 1 failed");
    expect(content).toContain("Score: 0.55");
    
    // HallucinationMetric stats
    expect(content).toContain("HallucinationMetric");
    expect(content).toContain("✓ 1 passed");
    expect(content).toContain("✗ 0 failed");
    expect(content).toContain("Score: 0.90");
  });
}); 