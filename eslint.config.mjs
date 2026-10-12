import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.cjs'],
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Allow pragmatic `any` (e.g. Express error extras) but surface it as a warning.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Ignore intentionally-unused args/vars prefixed with `_` (Express error handlers use them).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      // Throwing string literals loses stack traces; require Error instances.
      'no-throw-literal': 'error',
      'no-console': 'warn',
    },
  },
  // Disable stylistic rules that conflict with Prettier.
  prettier,
);
