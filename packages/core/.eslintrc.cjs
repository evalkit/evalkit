module.exports = {
  extends: ['../../.eslintrc.js'],
  env: {
    jest: true,
    node: true
  },
  ignorePatterns: ['**/*.spec.ts', '**/*.test.ts', '**/__tests__/**', 'coverage/**', 'dist/**'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    'turbo/no-undeclared-env-vars': ['warn', {
      allowList: ['OPENAI_API_KEY']
    }]
  }
} 