import { OpenAI } from "openai";
import { evaluateDynamic } from "./dynamic";

describe("evaluateDynamic", () => {
  // ... existing tests ...

  it("should handle invalid OpenAI responses", async () => {
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
    expect(result[0]?.reason).toBe("Failed to parse OpenAI response");
    expect(result[0]?.passed).toBe(false);
  });
}); 