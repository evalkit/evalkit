// @ts-ignore
import { classifyIntent } from './intent';
import { OpenAI } from 'openai';


describe('classifyIntent', () => {
	let invoker: any;
	const context = 'Renewable energy includes sources like solar and wind power.'

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
})
