/* eslint-disable */
// @ts-ignore
import type { EvalKitConfig } from '@evalkit/core';

const config: EvalKitConfig = {
  openai: {
    // Your OpenAI API key
    apiKey: process.env.OPENAI_API_KEY,
    
    // Optional: For Azure OpenAI
    // baseURL: 'https://your-resource.openai.azure.com',
    // apiVersion: '2023-05-15',
    // deploymentName: 'your-deployment',
  },
  
  reporting: {
    // Which report formats to generate ('json' and/or 'html')
    // Leave empty for console-only output
    outputFormats: ['json', 'html'],
    
    // Where to save the report files
    outputDir: './eval-reports'
  }
} satisfies EvalKitConfig;

export default config;