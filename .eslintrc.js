// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'turbo'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parserOptions: {
    project: ['./packages/*/tsconfig.json', './apps/*/tsconfig.json']
  },
  ignorePatterns: ['dist/', 'node_modules/', 'coverage/', '**/*.spec.ts', '**/*.test.ts', '**/__tests__/**']
}
