// Minimal ESLint flat config to avoid FlatCompat compatibility issues across
// different @eslint/eslintrc versions in this monorepo.
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Import parsers/plugins as modules so the flat config can reference the actual
// plugin objects (ESLint expects plugin objects, not string names).
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import tsEslintPlugin from '@typescript-eslint/eslint-plugin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default [
  // ignore common generated folders
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**', '.next/**', 'Pods/**', '.turbo/**'],
  },
  // basic rules and settings; you can expand this if you prefer the full
  // recommended configs, but keep this minimal to avoid FlatCompat issues.
  {
    // Register actual plugin objects so rules like "react-hooks/rules-of-hooks"
    // can be resolved when ESLint loads this flat config from package contexts.
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': tsEslintPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
]
