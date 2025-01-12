import { existsSync } from 'fs';
import { resolve } from 'path';
import { defaultConfig, EvalKitConfig } from './types/config';

const CONFIG_FILE_NAMES = [
  'evalkit.config.ts',
  'evalkit.config.js',
  'evalkit.config.mjs',
  'evalkit.config.cjs',
];

/**
 * Loads and validates the EvalKit configuration
 */
export async function loadConfig(): Promise<Required<EvalKitConfig>> {
  const configPath = findConfigFile();
  
  if (!configPath) {
    return defaultConfig;
  }

  try {
    // Dynamic import works for both ESM and CJS
    const userConfig = (await import(configPath)).default;
    return mergeWithDefaultConfig(userConfig);
  } catch (error) {
    console.warn(`Failed to load config from ${configPath}, using default config`);
    console.warn(error);
    return defaultConfig;
  }
}

function findConfigFile(): string | undefined {
  const cwd = process.cwd();
  
  for (const fileName of CONFIG_FILE_NAMES) {
    const filePath = resolve(cwd, fileName);
    if (existsSync(filePath)) {
      return filePath;
    }
  }
  
  return undefined;
}

function mergeWithDefaultConfig(userConfig: Partial<EvalKitConfig>): Required<EvalKitConfig> {
  return {
    openai: {
      ...defaultConfig.openai,
      ...userConfig.openai,
    },
    reporting: {
      ...defaultConfig.reporting,
      ...userConfig.reporting,
    },
  };
} 