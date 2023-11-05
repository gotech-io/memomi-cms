module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['./packages/*/tsconfig.json', './tsconfig.json', 'docs/tsconfig.json'],
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'require-extensions'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:playwright/recommended',
    'plugin:require-extensions/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['dist', '.eslintrc.js', 'scripts/*.mjs', 'docs/docusaurus.config.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-floating-promises': 'error',
    semi: 0,
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-unreachable': 'warn',
    'playwright/no-focused-test': 'warn',
  },
  overrides: {
    files: ['docs/**/*.tsx', 'docs/**/*.js'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
}
