// @ts-ignore
import { evaluateCoherence } from './coherence';
import { OpenAI } from 'openai';


describe('evaluateCoherence', () => {
	let invoker: any;
	beforeAll(() => {
		invoker = (...args: any[]) => {
			const openAI = new OpenAI({
				apiKey: process.env['OPENAI_API_KEY'] ?? "",
			});
			return evaluateCoherence.call({ openai: openAI }, ...args);
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
})
