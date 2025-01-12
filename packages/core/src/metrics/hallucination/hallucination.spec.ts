// @ts-ignore
import { evaluateHallucination } from './hallucination';
import { OpenAI } from 'openai';


describe('evaluateHallucination', () => {
	let invoker: any;
	const context = 'Renewable energy includes sources like solar and wind power.'

	beforeAll(() => {
		invoker = (output: string) => {
			const openAI = new OpenAI({
				apiKey: process.env['OPENAI_API_KEY'] ?? "",
			});
			// @ts-ignore
			return evaluateHallucination.bind({ openai: openAI })(
				output,
				context,
			)
		}
	})

	describe('hallucination free statement', () => {
		it('should return a score lower than threshold', async () => {
			const output = 'Solar and wind power are forms of renewable energy.';
			const score = await invoker(output);
			expect(score).toBeLessThan(0.5);
		})
	})

	describe('hallucination statement', () => {
		it('should return a score higher than threshold', async () => {
			const output = 'Investing in renewable energy can lead to bad bad stuff';
			const score = await invoker(output);
			expect(score).toBeGreaterThanOrEqual(0.5);
		})
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

		const result = await evaluateHallucination.call(
			{ openai: mockOpenAI },
			"Test statement.",
			"Test context"
		);

		expect(result).toBe(0);
	});
})
