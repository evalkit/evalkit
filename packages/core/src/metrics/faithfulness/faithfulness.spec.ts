// @ts-ignore
import { evaluateFaithfulness } from './faithfulness';
import { OpenAI } from 'openai';


describe('evaluateFaithfulness', () => {
	let invoker: any;
	const context = 'Renewable energy includes sources like solar and wind power.'

	beforeAll(() => {
		invoker = (output: string) => {
			const openAI = new OpenAI({
				apiKey: process.env['OPENAI_API_KEY'] ?? "",
			});
			// @ts-ignore
			return evaluateFaithfulness.bind({ openai: openAI })(
				output,
				context,
			)
		}
	})

	describe('faithful statement', () => {
		it('should return a score higher than threshold', async () => {
			const output = 'Investing in renewable energy can lead to long-term economic benefits.';
			const score = await invoker(output);
			expect(score).toBeGreaterThanOrEqual(0.5);
		})
	})

	describe('unfaithful statement', () => {
		it('should return a score lower than threshold', async () => {
			const output = 'Investing in renewable energy can lead to bad bad stuff';
			const score = await invoker(output);
			expect(score).toBeLessThan(0.5);
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

		const result = await evaluateFaithfulness.call(
			{ openai: mockOpenAI },
			"Test statement.",
			"Test context"
		);

		expect(result).toBe(0);
	});
})
