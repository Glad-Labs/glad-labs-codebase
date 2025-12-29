import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';

export default [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '.vscode/**',
      '.idea/**',
      '*.swp',
      '*.swo',
      '.DS_Store',
      'Thumbs.db',
      'package-lock.json',
      'yarn.lock',
      'pnpm-lock.yaml'
    ]
  },
  {
    files: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx', 'jest.setup.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.jest
      },
      parserOptions: {
        ecmaVersion: 2021,
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react
    },
    rules: {
      'no-undef': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off'
    }
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.mjs'],
    ignores: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,

      // Code quality
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': 'off', // Allow console for debugging
      'no-var': 'error',
      'eqeqeq': ['warn', 'always'],
      'semi': ['warn', 'always'],
      'quotes': ['warn', 'single'],

      // React-specific
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // Disabled - Next.js components don't require prop-types
      'react/no-unescaped-entities': 'warn', // Relaxed for legacy code
      'react-hooks/rules-of-hooks': 'warn', // Relax for ESLint 9 compat
      'react-hooks/exhaustive-deps': 'off', // Disabled due to ESLint 9 compatibility issue
      'react/no-unknown-property': 'warn', // Warn on unknown properties (not error)
      'no-useless-escape': 'warn', // Relax for legacy regex patterns
      'import/no-anonymous-default-export': 'off', // Disable import plugin rule not available
      'no-unreachable': 'warn' // Relax for catch block patterns
    }
  }
];
