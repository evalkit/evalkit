import { BaseMetric, EvaluationStepsResult } from "../base.metric";
import { evaluateSemanticSimilarity } from "./semantic-similarity";

export interface SemanticSimilarityMetricParams {
  text1: string;
  text2: string;
}

export class SemanticSimilarityMetric extends BaseMetric<SemanticSimilarityMetricParams> {
  override evaluationParams: SemanticSimilarityMetricParams;

  constructor(evaluationParams: SemanticSimilarityMetricParams) {
    super(
      "Semantic Similarity Evaluation",
      "Evaluate the semantic similarity between two texts",
      evaluationParams,
    );
  }

  override async evaluateSteps(): Promise<EvaluationStepsResult> {
    const { text1, text2 } = this.evaluationParams;

    const similarity = await evaluateSemanticSimilarity.bind(this)(
      text1,
      text2,
    );

    const reasons = [`Semantic similarity score: ${similarity}`];
    return { score: similarity.toFixed(2), reasons };
  }
}
