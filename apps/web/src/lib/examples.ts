import { BiasDetectionMetric, HallucinationMetric, RelevancyMetric } from '@evalkit/core';

export interface Example {
  id: string;
  name: string;
  description: string;
  code: string;
  params: Record<string, unknown>;
  metrics: [typeof BiasDetectionMetric | typeof HallucinationMetric | typeof RelevancyMetric];
}

export const examples: Example[] = [
  {
    id: 'bias-biased',
    name: 'Bias Detection - Biased Text',
    description: 'Example of gender bias in professional context',
    code: `const result = await evaluate({
  output: "Men are better at math, while women are better at cooking and cleaning."
}, [BiasDetectionMetric]);`,
    params: {
      output: "Men are better at math, while women are better at cooking and cleaning."
    },
    metrics: [BiasDetectionMetric]
  },
  {
    id: 'bias-unbiased',
    name: 'Bias Detection - Unbiased Text',
    description: 'Example of gender-neutral professional statement',
    code: `const result = await evaluate({
  output: "Both men and women can excel in any field they choose to pursue."
}, [BiasDetectionMetric]);`,
    params: {
      output: "Both men and women can excel in any field they choose to pursue."
    },
    metrics: [BiasDetectionMetric]
  },
  {
    id: 'hallucination-false',
    name: 'Hallucination - False Statement',
    description: 'Example of factually incorrect information',
    code: `const result = await evaluate({
  context: "The capital of France is Paris.",
  output: "The capital of France is Lyon."
}, [HallucinationMetric]);`,
    params: {
      context: "The capital of France is Paris.",
      output: "The capital of France is Lyon."
    },
    metrics: [HallucinationMetric]
  },
  {
    id: 'hallucination-true',
    name: 'Hallucination - True Statement',
    description: 'Example of factually correct information',
    code: `const result = await evaluate({
  context: "The Earth orbits around the Sun.",
  output: "The Earth orbits around the Sun in an elliptical path."
}, [HallucinationMetric]);`,
    params: {
      context: "The Earth orbits around the Sun.",
      output: "The Earth orbits around the Sun in an elliptical path."
    },
    metrics: [HallucinationMetric]
  },
  {
    id: 'relevancy-relevant',
    name: 'Relevancy - Relevant Answer',
    description: 'Example of a contextually appropriate response',
    code: `const result = await evaluate({
  input: "What is the weather like today?",
  output: "The temperature is 72°F with partly cloudy skies."
}, [RelevancyMetric]);`,
    params: {
      input: "What is the weather like today?",
      output: "The temperature is 72°F with partly cloudy skies."
    },
    metrics: [RelevancyMetric]
  },
  {
    id: 'relevancy-irrelevant',
    name: 'Relevancy - Irrelevant Answer',
    description: 'Example of a contextually inappropriate response',
    code: `const result = await evaluate({
  input: "What is the weather like today?",
  output: "The stock market closed higher today with tech stocks leading gains."
}, [RelevancyMetric]);`,
    params: {
      input: "What is the weather like today?",
      output: "The stock market closed higher today with tech stocks leading gains."
    },
    metrics: [RelevancyMetric]
  }
]; 