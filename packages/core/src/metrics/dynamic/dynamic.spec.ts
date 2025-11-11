import { OpenAI } from "openai";
import { evaluateDynamic } from "./dynamic";

describe("evaluateDynamic", () => {
  // ... existing tests ...

  it("should handle invalid JSON in OpenAI response with detailed error", async () => {
    const mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: "invalid json" } }]
          })
        }
      }
    } as unknown as OpenAI;

    const result = await evaluateDynamic.call(
      { openai: mockOpenAI },
      "Test input",
      "Test actual",
      "Test expected",
      [{ type: "test-criteria" }]
    );

    expect(result[0]?.score).toBe(0);
    expect(result[0]?.reason).toContain("Failed to parse OpenAI response:");
    expect(result[0]?.reason).toContain("Raw response: invalid json");
    expect(result[0]?.passed).toBe(false);
  });

  it("should handle invalid response format with detailed error", async () => {
    const mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: { content: '{"score": "high", "reason": "Good job"}' } }]
          })
        }
      }
    } as unknown as OpenAI;

    const result = await evaluateDynamic.call(
      { openai: mockOpenAI },
      "Test input",
      "Test actual",
      "Test expected",
      [{ type: "test-criteria" }]
    );

    expect(result[0]?.score).toBe(0);
    expect(result[0]?.reason).toContain("Invalid response format from OpenAI");
    expect(result[0]?.reason).toContain('Expected {score: number, reason: string}, but received:');
    expect(result[0]?.reason).toContain('"score": "high"');
    expect(result[0]?.passed).toBe(false);
  });

  it("should handle missing content with appropriate error", async () => {
    const mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: {} }]
          })
        }
      }
    } as unknown as OpenAI;

    const result = await evaluateDynamic.call(
      { openai: mockOpenAI },
      "Test input",
      "Test actual",
      "Test expected",
      [{ type: "test-criteria" }]
    );

    expect(result[0]?.score).toBe(0);
    expect(result[0]?.reason).toBe("Failed to get valid response from OpenAI");
    expect(result[0]?.passed).toBe(false);
  });
}); 