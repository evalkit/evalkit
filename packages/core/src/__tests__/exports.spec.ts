/**
 * Integration test to verify that the exports mentioned in issue #9 work correctly
 * 
 * This test primarily validates TypeScript compilation - if the types are not exported,
 * this file will fail to compile.
 */

import { describe, it, expect } from '@jest/globals';

describe('Package Exports (Issue #9)', () => {
  it('should allow EvalKitConfig type to be imported', () => {
    // This test verifies that EvalKitConfig type can be imported
    // The import at compile time is the real test - if it compiles, the export works
    
    // We use a type-only import to avoid runtime issues
    type EvalKitConfig = import('../types/config').EvalKitConfig;
    
    const testConfig: EvalKitConfig = {
      openai: {
        apiKey: 'test-key',
      },
      reporting: {
        outputFormats: ['json'],
        outputDir: './test-reports',
      },
    };
    
    expect(testConfig).toBeDefined();
    expect(testConfig.openai).toBeDefined();
    expect(testConfig.reporting).toBeDefined();
  });

  it('should allow OpenAIConfig type to be imported', () => {
    // This test verifies that OpenAIConfig type can be imported
    type OpenAIConfig = import('../config').OpenAIConfig;
    
    const testOpenAIConfig: OpenAIConfig = {
      apiKey: 'test-key',
      baseURL: 'https://api.openai.com/v1',
      apiVersion: '2023-05-15',
      deploymentName: 'test-deployment',
    };
    
    expect(testOpenAIConfig).toBeDefined();
    expect(testOpenAIConfig.apiKey).toBe('test-key');
    expect(testOpenAIConfig.baseURL).toBe('https://api.openai.com/v1');
  });

  it('should allow config instance to be imported', async () => {
    // We use dynamic import to avoid the chalk import issue
    const { config } = await import('../config');
    
    expect(config).toBeDefined();
    expect(typeof config.init).toBe('function');
    expect(typeof config.getOpenAIClient).toBe('function');
    expect(typeof config.getReportingConfig).toBe('function');
  });
});
