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
			return evaluateSemanticSimilarity.bind({ openai: openAI, embeddingModel: 'text-embedding-ada-002' })(
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

	it("should handle invalid OpenAI responses", async () => {
		const mockOpenAI = {
			embeddings: {
				create: jest.fn().mockResolvedValue({
					data: [{ embedding: null }, { embedding: null }]
				})
			}
		} as unknown as OpenAI;

		const result = await evaluateSemanticSimilarity.call(
			{ openai: mockOpenAI, embeddingModel: 'text-embedding-ada-002' },
			"Test text 1",
			"Test text 2"
		);

		expect(result).toBe(0);
	});
})
