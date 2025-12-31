import { OpenAI } from "openai";
import { loadConfig } from "./config-loader";
import { EvalKitConfig } from "./types/config";

const DEFAULT_CHAT_MODEL = 'gpt-4o-mini';
const DEFAULT_EMBEDDING_MODEL = 'text-embedding-ada-002';

export interface OpenAIConfig {
  apiKey?: string;
  baseURL?: string;
  apiVersion?: string;
  deploymentName?: string;
  model?: string;
  embeddingModel?: string;
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
  private runtimeConfig?: OpenAIConfig;

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

  /**
   * Runtime configuration method
   * Allows programmatic configuration without file-based config
   */
  configure(options: OpenAIConfig): void {
    this.runtimeConfig = options;
    // Reset OpenAI client so it's recreated with new config
    this.openAIClient = undefined;
  }

  /**
   * Reset configuration to defaults (useful for testing)
   */
  reset(): void {
    this.runtimeConfig = undefined;
    this.openAIClient = undefined;
  }

  async init(): Promise<void> {
    // Only load file config if no runtime config has been set
    if (!this.runtimeConfig) {
      this.config = await loadConfig();
    }
    // Reset OpenAI client so it's recreated with new config
    this.openAIClient = undefined;
  }

  /**
   * Get the effective OpenAI config (runtime takes precedence over file)
   */
  private getEffectiveOpenAIConfig(): OpenAIConfig {
    if (this.runtimeConfig) {
      return this.runtimeConfig;
    }
    return this.config.openai || {};
  }

  getOpenAIClient(): OpenAI {
    if (!this.openAIClient) {
      const openai = this.getEffectiveOpenAIConfig();

      // For standard OpenAI with just an API key, create a default client
      if (!openai || Object.keys(openai).length === 0) {
        this.openAIClient = new OpenAI();
        return this.openAIClient;
      }

      // If only apiKey is set (and optionally model configs), treat it as standard OpenAI
      const nonModelKeys = Object.keys(openai).filter(
        k => k !== 'model' && k !== 'embeddingModel'
      );
      if (nonModelKeys.length === 1 && openai.apiKey) {
        this.openAIClient = new OpenAI({ apiKey: openai.apiKey });
        return this.openAIClient;
      }
      if (nonModelKeys.length === 0) {
        this.openAIClient = new OpenAI();
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

  /**
   * Get the chat completion model name
   */
  getModel(): string {
    const openai = this.getEffectiveOpenAIConfig();
    return openai.model || DEFAULT_CHAT_MODEL;
  }

  /**
   * Get the embedding model name
   */
  getEmbeddingModel(): string {
    const openai = this.getEffectiveOpenAIConfig();
    return openai.embeddingModel || DEFAULT_EMBEDDING_MODEL;
  }

  getReportingConfig() {
    return this.config.reporting;
  }
}

export const config = ConfigManager.getInstance();

/**
 * Configure EvalKit with custom OpenAI settings
 * Runtime configuration takes precedence over file-based config
 *
 * @example
 * // Ollama configuration
 * configure({
 *   baseURL: 'http://localhost:11434/v1',
 *   apiKey: 'ollama',
 *   model: 'llama3.2',
 *   embeddingModel: 'nomic-embed-text'
 * });
 *
 * @example
 * // OpenAI with explicit API key
 * configure({
 *   apiKey: 'sk-xxxxx',
 *   model: 'gpt-4o'
 * });
 */
export function configure(options: OpenAIConfig): void {
  config.configure(options);
}
