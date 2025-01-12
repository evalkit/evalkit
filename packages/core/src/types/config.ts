import { OpenAIConfig } from '../config';

export interface EvalKitConfig {
  /**
   * OpenAI configuration options
   */
  openai?: OpenAIConfig;

  /**
   * Reporting configuration options
   */
  reporting?: {
    /**
     * Which report formats to output
     * @default []
     */
    outputFormats?: ('json' | 'html')[];
    
    /**
     * Directory where reports will be saved
     * @default './eval-reports'
     */
    outputDir?: string;
  };
}

export const defaultConfig: Required<EvalKitConfig> = {
  openai: {},
  reporting: {
    outputFormats: [],
    outputDir: './eval-reports'
  }
}; 