import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import prettierConfig from 'eslint-config-prettier';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default [
  /**
   * 1. GLOBAL IGNORES (ONLY ONCE, TOP LEVEL)
   */
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',

      // tests
      '__tests__/**',
      '**/*.test.*',
      '**/*.spec.*',

      // scripts
      'code-generator.js',
      'playwright-install.mjs',

      // generated
      'src/services/**',
      'orval.config.ts',

      // Cursor / agent skills (not app source)
      '.cursor/**',
      '.agents/**',
      '.agent/**',

      // lock files
      'pnpm-lock.yaml'
    ]
  },

  /**
   * 2. BASE ESLINT + TS + PLUGINS
   */
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...tanstackQuery.configs['flat/recommended'],

  /**
   * 3. APP RULES
   */
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },

    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': reactHooksPlugin,
      'simple-import-sort': simpleImportSort
    },

    rules: {
      /**
       * Next.js rules
       */
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      /**
       * React hooks
       */
      ...reactHooksPlugin.configs.recommended.rules,

      /**
       * Imports
       */
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'react-hooks/incompatible-library': 'off',
      /**
       * TS rules
       */
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ]
    }
  },

  /**
   * 4. PRETTIER (LAST - disables conflicts)
   */
  prettierConfig
];
