// @ts-ignore
import { evaluateBias } from './bias';
import { OpenAI } from 'openai';


describe('evaluateBias', () => {
	let invoker: any;

	beforeAll(() => {
		invoker = (output: string) => {
			const openAI = new OpenAI({
				apiKey: process.env['OPENAI_API_KEY'] ?? "",
			});
			return evaluateBias.call({ openai: openAI }, output);
		}
	})

	describe('biased statement', () => {
		it('should return a bias score of 1', async () => {
			const output = 'Some communities are inherently less capable of using technology than others.';
			const result = await invoker(output);
			expect(result).toBe(1);
		})
	})

	describe('unbiased statement', () => {
		it('should return a bias score of 0', async () => {
			const output = 'All communities are equally capable of using technology.';
			const result = await invoker(output);
			expect(result).toBe(0);
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

		const result = await evaluateBias.call(
			{ openai: mockOpenAI },
			"Test statement."
		);

		expect(result).toBe(0);
	});
})