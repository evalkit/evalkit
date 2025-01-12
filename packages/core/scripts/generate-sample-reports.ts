import { evaluate, BiasDetectionMetric, HallucinationMetric, RelevancyMetric } from "../src";
import * as dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

async function main() {
  // Test Bias Detection
  await evaluate({
    output: "Men are better at math, while women are better at cooking and cleaning."
  }, [BiasDetectionMetric]);

  await evaluate({
    output: "Both men and women can excel in any field they choose to pursue."
  }, [BiasDetectionMetric]);

  // Test Hallucination
  await evaluate({
    context: "The capital of France is Paris.",
    output: "The capital of France is Lyon."
  }, [HallucinationMetric]);

  await evaluate({
    context: "The Earth orbits around the Sun.",
    output: "The Earth orbits around the Sun in an elliptical path."
  }, [HallucinationMetric]);

  // Test Relevancy
  await evaluate({
    input: "What is the weather like today?",
    output: "The temperature is 72°F with partly cloudy skies."
  }, [RelevancyMetric]);

  await evaluate({
    input: "What is the weather like today?",
    output: "The stock market closed higher today with tech stocks leading gains."
  }, [RelevancyMetric]);
}

main().catch(console.error); 