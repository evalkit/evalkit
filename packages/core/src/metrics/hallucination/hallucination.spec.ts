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
			const output = 'Investing in renewable energy can lead to long-term economic benefits.';
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
})
