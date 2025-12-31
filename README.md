<h1 align="center">
EvalKit
</h1>
<p align="center">The TypeScript LLM Evaluations Library</p>
<hr />

<p align="center">
  <strong>
    EvalKit is an open-source library designed for TypeScript developers to evaluate and improve the performance of large language models (LLMs) with confidence. Ensure your AI models are reliable, accurate, and trustworthy.
  </strong><br/><br/>
</p>

<p align="center">
<a href="https://opensource.org/licenses/Apache-2.0">
  <img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License">
</a>
<a href="https://www.npmjs.com/package/evalkit-ollama" target="_blank">
  <img src="https://img.shields.io/badge/npm-evalkit--ollama-green">
</a>
</p>


# 🚀 Features, Metrics and Docs

[Click here to navigate to the Official EvalKit Documentation](https://docs.evalkit.ai/)

In the documentation, you can find information on how to use EvalKit, its architecture, including tutorials and recipes for various use cases and LLM providers.

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Availability</th>
      <th>
        <a href="https://docs.evalkit.ai">Docs</a>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Bias Detection Metric</td>
      <td align="center">✅</td>
      <td align="center">
        <a href="https://docs.evalkit.ai/evaluations/metrics/bias-detection">🔗</a>
      </td>
    </tr>
    <tr>
      <td>Coherence Metric</td>
      <td align="center">✅</td>
      <td align="center">
        <a href="https://docs.evalkit.ai/evaluations/metrics/coherence">🔗</a>
      </td>
    </tr>
    <tr>
      <td>Dynamic Metric (G-Eval)</td>
      <td align="center">✅</td>
      <td align="center">
        <a href="https://docs.evalkit.ai/evaluations/metrics/dynamic">🔗</a>
      </td>
    </tr>
    <tr>
      <td>Faithfulness Metric</td>
      <td align="center">✅</td>
      <td align="center">
        <a href="https://docs.evalkit.ai/evaluations/metrics/faithfulness">🔗</a>
      </td>
    </tr>
    <tr>
      <td>Hallucination Metric</td>
      <td align="center">✅</td>
      <td align="center">
        <a href="https://docs.evalkit.ai/evaluations/metrics/hallucination">🔗</a>
      </td>
    </tr>
    <tr>
      <td>Intent Detection Metric</td>
      <td align="center">✅</td>
      <td align="center">
        <a href="https://docs.evalkit.ai/evaluations/metrics/intent-detection">🔗</a>
      </td>
    </tr>
    <tr>
      <td>Semantic Similarity Metric</td>
      <td align="center">✅</td>
      <td align="center">
        <a href="https://docs.evalkit.ai/evaluations/metrics/relevancy">🔗</a>
      </td>
    </tr>
    <tr>
      <td>Semantic Similarity Metric</td>
      <td align="center">✅</td>
      <td align="center">
        <a href="https://docs.evalkit.ai/evaluations/metrics/semantic-similarity">🔗</a>
      </td>
    </tr>
    <tr>
      <td>Reporting</td>
      <td align="center">✅</td>
      <td align="center">
        <a href="https://docs.evalkit.ai/evaluations/reporting">🔗</a>
      </td>
    </tr>
  </tbody>
</table>

Looking for a metric/feature that's not listed here? [Open an issue](https://github.com/evalkit/evalkit/issues/new) and let us know!

# Getting Started - Quickstart

## Prerequisites

- Node.js 18+
- OpenAI API Key

## Installation

EvalKit currently exports a core package that includes all evaluation related functionalities. Install the package by running the following command:

```bash
npm install --save-dev evalkit-ollama
```

## Configuration

EvalKit supports multiple LLM providers through the `configure()` function. You can configure your preferred provider before running evaluations.

### OpenAI

```typescript
import { configure, evaluate, RelevancyMetric } from 'evalkit-ollama';

configure({
  apiKey: 'your-openai-api-key',
  model: 'gpt-4o-mini',  // optional, defaults to 'gpt-4o-mini'
});

const result = await evaluate(
  { input: 'What is the capital of France?', output: 'Paris is the capital of France.' },
  [RelevancyMetric]
);
```

### Ollama (Local LLM)

EvalKit supports Ollama and other OpenAI-compatible providers:

```typescript
import { configure, evaluate, RelevancyMetric } from 'evalkit-ollama';

configure({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama',  // Ollama doesn't require a real key
  model: 'llama3.2',
  embeddingModel: 'nomic-embed-text',  // for SemanticSimilarityMetric
});

const result = await evaluate(
  { input: 'What is the capital of France?', output: 'Paris is the capital of France.' },
  [RelevancyMetric]
);
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `apiKey` | API key for the LLM provider | - |
| `baseURL` | Custom API endpoint URL | - |
| `model` | Model name for chat completions | `gpt-4o-mini` |
| `embeddingModel` | Model name for embeddings | `text-embedding-ada-002` |

# Contributing

We welcome contributions from the community! Please feel free to submit pull requests or create issues for bugs or feature suggestions.

# License

This repository's source code is available under the [Apache 2.0 License](LICENSE).

# Acknowledgments

This project is forked from [EvalKit](https://github.com/evalkit/evalkit) and is licensed under the Apache 2.0 License.
