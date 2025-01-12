import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import fs from "fs/promises";
import path from "path";
import { JSONReporter } from "../json.reporter";
import { EvaluationExecutionReport } from "../../report.service";

jest.mock("fs/promises");
jest.mock("path");

describe("JSONReporter", () => {
  let reporter: JSONReporter;
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
      }
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    reporter = new JSONReporter({ outputDir: "./test-reports" });
  });

  it("should create output directory if it doesn't exist", async () => {
    await reporter.write(mockReport);
    expect(fs.mkdir).toHaveBeenCalledWith("./test-reports", { recursive: true });
  });

  it("should write JSON file with correct content", async () => {
    await reporter.write(mockReport);
    
    const writeFileCalls = (fs.writeFile as jest.Mock).mock.calls;
    expect(writeFileCalls.length).toBe(1);
    
    const [filePath, content] = writeFileCalls[0] as [string, string];
    expect(path.join).toHaveBeenCalled();
    
    const parsedContent = JSON.parse(content);
    
    // Check report structure
    expect(parsedContent).toHaveProperty("summary");
    expect(parsedContent).toHaveProperty("startTime", 1000);
    expect(parsedContent).toHaveProperty("endTime", 2000);
    expect(parsedContent).toHaveProperty("duration", 1000);
    expect(parsedContent).toHaveProperty("items");
    
    // Check summary
    expect(parsedContent.summary).toEqual({
      totalEvaluations: 2,
      passedEvaluations: 1,
      failedEvaluations: 1,
      averageScore: 0.55,
      duration: 1000,
      startTime: 1000,
      endTime: 2000,
      metrics: {
        BiasMetric: {
          passed: 1,
          failed: 1,
          averageScore: 0.55
        }
      }
    });
  });

  it("should format numbers correctly in JSON", async () => {
    await reporter.write(mockReport);
    
    const writeFileCalls = (fs.writeFile as jest.Mock).mock.calls;
    expect(writeFileCalls.length).toBeGreaterThan(0);
    
    const firstCall = writeFileCalls[0];
    expect(firstCall).toBeDefined();
    
    // Type assertion after we've verified it exists
    const [_, content] = firstCall as [string, string];
    const parsedContent = JSON.parse(content);
    
    // Check number formatting
    expect(typeof parsedContent.summary.averageScore).toBe("number");
    expect(parsedContent.summary.averageScore).toBeCloseTo(0.55);
    expect(parsedContent.summary.metrics.BiasMetric.averageScore).toBeCloseTo(0.55);
  });
}); 