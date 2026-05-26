import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import { FlatCompat } from '@eslint/eslintrc';
import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier/flat';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize the official compatibility layer for Next.js legacy structures
const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default defineConfig(
  {
    ignores: ['.next', '*.js', 'orval.config.ts', 'src/services']
  },

  // 1. Official Standard Next.js Core Web Vitals Rules Setup
  ...compat.extends('next/core-web-vitals'),

  // 2. TanStack Query Recommended Rules
  ...tanstackQuery.configs['flat/recommended'],

  {
    files: ['**/*.ts', '**/*.tsx'],
    // Sanity-first recommended rules for TypeScript
    extends: [...tseslint.configs.recommended, ...tseslint.configs.stylistic],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },

  // 3. Prettier Formatting Rule Alignment
  prettierConfig,
  prettierPlugin,

  {
    plugins: {
      'simple-import-sort': simpleImportSort
    },
    rules: {
      curly: ['error', 'all'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error'
    }
  }
);
