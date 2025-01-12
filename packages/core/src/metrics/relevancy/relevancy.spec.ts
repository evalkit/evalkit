// @ts-ignore
import { evaluateRelevancy } from './relevancy';
import { OpenAI } from 'openai';


describe('evaluateRelevancy', () => {
	let invoker: any;
	const input = 'Tell me about Seattle, Washington'

	beforeAll(() => {
		invoker = (output: string) => {
			const openAI = new OpenAI({
				apiKey: process.env['OPENAI_API_KEY'] ?? "",
			});
			// @ts-ignore
			return evaluateRelevancy.bind({ openai: openAI })(
				input,
				output,
			)
		}
	})

	describe('relevant response', () => {
		it('should return a score higher than threshold', async () => {
			const output = 'Seattle is a city in Washington state. Known for proximity to Microsoft headquarters';
			const score = await invoker(output);
			expect(score).toBeGreaterThanOrEqual(0.5);
		})
	})

	describe('irrelevant response', () => {
		it('should return a score lower than threshold', async () => {
			const output = 'Paris is the capital of France';
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

		const result = await evaluateRelevancy.call(
			{ openai: mockOpenAI },
			"Test question",
			"Test answer"
		);

		expect(result).toBe(0);
	});
})
