// @ts-ignore
import { classifyIntent } from './intent';
import { OpenAI } from 'openai';


describe('classifyIntent', () => {
	let invoker: any;

	beforeAll(() => {
		invoker = (input: string, expectedIntents: string[]) => {
			const openAI = new OpenAI({
				apiKey: process.env['OPENAI_API_KEY'] ?? "",
			});
			// @ts-ignore
			return classifyIntent.bind({ openai: openAI })(
				input,
				expectedIntents,
			)
		}
	})

	it('should return high score when intents detected match expected', async () => {
		const input = 'I would like to schedule a flight for 2 people.'
		const {score} = await invoker(input, ['flight booking']);
		expect(score).toBeGreaterThan(0.5);
	})

	it('should return low score when intents detected match expected', async () => {
		const input = 'I would like to schedule a flight for 2 people.'
		const {score} = await invoker(input, ['car purchasing']);
		expect(score).toBeLessThan(0.5);
	})

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

		const result = await classifyIntent.call(
			{ openai: mockOpenAI },
			"Test input",
			["test intent"]
		);

		expect(result.score).toBe(0);
		expect(result.reasons).toContain("Failed to parse OpenAI response");
	});
})
