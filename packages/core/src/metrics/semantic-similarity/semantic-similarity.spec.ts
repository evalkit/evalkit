// @ts-ignore
import { evaluateSemanticSimilarity } from './semantic-similarity';
import { OpenAI } from 'openai';


describe('evaluateSemanticSimilarity', () => {
	let invoker: any;

	beforeAll(() => {
		invoker = (text1: string, text2: string) => {
			const openAI = new OpenAI({
				apiKey: process.env['OPENAI_API_KEY'] ?? "",
			});
			// @ts-ignore
			return evaluateSemanticSimilarity.bind({ openai: openAI })(
				text1,
				text2,
			)
		}
	})

	it('should return a higher score for similar texts', async () => {
		const similarityScore = await invoker('I like cats', 'I like dogs');
		const differenceScore = await invoker('I like cats', 'A plan is a detailed proposal for doing or achieving something.');
		expect(similarityScore).toBeGreaterThan(differenceScore);
	})
})
