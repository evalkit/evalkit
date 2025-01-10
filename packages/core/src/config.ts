import { OpenAI } from "openai";
import { loadConfig } from "./config-loader";
import { EvalKitConfig } from "./types/config";

export interface OpenAIConfig {
  apiKey?: string;
  baseURL?: string;
  apiVersion?: string;
  deploymentName?: string;
}

interface OpenAIClientConfig {
  apiKey?: string;
  baseURL?: string;
  defaultHeaders?: Record<string, string>;
  defaultQuery?: Record<string, string>;
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: Required<EvalKitConfig>;
  private openAIClient?: OpenAI;

  private constructor() {
    // Initialize with default config, will be updated when init() is called
    this.config = {
      openai: {},
      reporting: {
        outputFormats: [],
        outputDir: './eval-reports'
      }
    };
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  async init(): Promise<void> {
    this.config = await loadConfig();
    // Reset OpenAI client so it's recreated with new config
    this.openAIClient = undefined;
  }

  getOpenAIClient(): OpenAI {
    if (!this.openAIClient) {
      const { openai } = this.config;

      // For standard OpenAI with just an API key, create a default client
      if (!openai || Object.keys(openai).length === 0) {
        this.openAIClient = new OpenAI();
        return this.openAIClient;
      }

      // If only apiKey is set, treat it as standard OpenAI
      if (Object.keys(openai).length === 1 && openai.apiKey) {
        this.openAIClient = new OpenAI({ apiKey: openai.apiKey });
        return this.openAIClient;
      }

      // For custom configurations (Azure or custom OpenAI endpoints)
      const clientConfig: OpenAIClientConfig = {
        apiKey: openai.apiKey,
        baseURL: openai.baseURL,
        defaultHeaders: openai.apiVersion ? {
          'api-version': openai.apiVersion,
        } : undefined,
        defaultQuery: openai.deploymentName ? {
          'deployment-id': openai.deploymentName,
        } : undefined,
      };

      this.openAIClient = new OpenAI(clientConfig);
    }

    return this.openAIClient;
  }

  getReportingConfig() {
    return this.config.reporting;
  }
}

export const config = ConfigManager.getInstance(); 