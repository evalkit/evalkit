import { OpenAI } from "openai";

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
  private openAIConfig?: OpenAIConfig;

  private constructor() {}

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  setOpenAIConfig(config: OpenAIConfig) {
    this.openAIConfig = config;
  }

  createOpenAIClient(): OpenAI {
    // For standard OpenAI with just an API key, create a default client
    if (!this.openAIConfig) {
      return new OpenAI();
    }

    // If only apiKey is set, treat it as standard OpenAI
    if (Object.keys(this.openAIConfig).length === 1 && this.openAIConfig.apiKey) {
      return new OpenAI({ apiKey: this.openAIConfig.apiKey });
    }

    // For custom configurations (Azure or custom OpenAI endpoints)
    const config: OpenAIClientConfig = {
      apiKey: this.openAIConfig.apiKey,
      baseURL: this.openAIConfig.baseURL,
      defaultHeaders: this.openAIConfig.apiVersion ? {
        'api-version': this.openAIConfig.apiVersion,
      } : undefined,
      defaultQuery: this.openAIConfig.deploymentName ? {
        'deployment-id': this.openAIConfig.deploymentName,
      } : undefined,
    };

    return new OpenAI(config);
  }
}

export const config = ConfigManager.getInstance(); 