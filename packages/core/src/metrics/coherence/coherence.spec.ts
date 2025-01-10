// @ts-ignore
import { evaluateCoherence } from './coherence';
import { OpenAI } from 'openai';


describe('evaluateCoherence', () => {
	let invoker: any;
	beforeAll(() => {
		invoker = (output: string) => {
			const openAI = new OpenAI({
				apiKey: process.env['OPENAI_API_KEY'] ?? "",
			});
			return evaluateCoherence.call({ openai: openAI }, output);
		}
	})
	describe('coherent statement', () => {
		it('should return a score higher than threshold', async () => {
			const output = 'First, ensure all data is encrypted. Subsequently, verify the integrity of the encryption algorithms.';
			const { score } = await invoker(output);
			expect(score).toBeGreaterThanOrEqual(0.5);
		})
	})

	describe('incoherent statement', () => {
		it('should return a score lower than threshold', async () => {
			const output = 'Begin, encrypted all first ensure is data. Then verify algorithms subsequently, integrity of encryption the.';
			const { score } = await invoker(output);
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

		const result = await evaluateCoherence.call(
			{ openai: mockOpenAI },
			"First statement. Second statement."
		);

		expect(result.score).toBe(0);
		expect(result.reason).toBe("Failed to parse OpenAI response");
	});
})
