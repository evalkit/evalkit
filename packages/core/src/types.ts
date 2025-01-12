import { BiasDetectionMetric } from "./metrics/bias/bias.metric";
import { CoherenceMetric } from "./metrics/coherence/coherence.metric";
import { DynamicMetric } from "./metrics/dynamic/dynamic.metric";
import { FaithfulnessMetric } from "./metrics/faithfulness/faithfulness.metric";
import { HallucinationMetric } from "./metrics/hallucination/hallucination.metric";
import { IntentClassificationMetric } from "./metrics/intent/intent-classification.metric";
import { RelevancyMetric } from "./metrics/relevancy/relevancy.metric";
import { SemanticSimilarityMetric } from "./metrics/semantic-similarity/semantic-similarity.metric";

export type MetricType =
  | typeof BiasDetectionMetric
  | typeof CoherenceMetric
  | typeof DynamicMetric
  | typeof FaithfulnessMetric
  | typeof HallucinationMetric
  | typeof IntentClassificationMetric
  | typeof RelevancyMetric
  | typeof SemanticSimilarityMetric;

export type Metric =
  | BiasDetectionMetric
  | CoherenceMetric
  | DynamicMetric
  | FaithfulnessMetric
  | HallucinationMetric
  | IntentClassificationMetric
  | RelevancyMetric
  | SemanticSimilarityMetric;

// eslint-disable-next-line no-unused-vars
export type ExtractParams<T> = T extends { new (...args: unknown[]): infer R }
  ? R extends Metric
    ? R["evaluationParams"]
    : never
  : never;

export type UnionToIntersection<U> =
  (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void
    ? I
    : never;

export type IntersectionParams<TMetrics extends MetricType[]> =
  UnionToIntersection<ExtractParams<TMetrics[number]>>;

export type LLMTestCase<TMetrics extends MetricType[]> =
  IntersectionParams<TMetrics>;
