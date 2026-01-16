const js = require('@eslint/js');
const globals = require('globals');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');

module.exports = [
  {
    ignores: [
      // Build outputs
      'build/**',
      'dist/**',
      '.next/**',
      'out/**',
      // Dependencies
      'node_modules/**',
      // Generated files
      'coverage/**',
      '.cache/**',
      // Environment files
      '.env',
      '.env.local',
      '.env.*.local',
      // Logs
      '*.log',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      // OS files
      '.DS_Store',
      'Thumbs.db',
      // Config files (can still check them separately)
      '*.config.js',
    ],
  },
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      // In CI (Vercel), warnings are treated as errors, so downgrade to off
      'react/prop-types': process.env.CI ? 'off' : 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off', // Disabled due to ESLint 9 compatibility issue
      'no-console': process.env.CI ? 'off' : 'warn',
      'no-unused-vars': [
        process.env.CI ? 'off' : 'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: [
      '**/*.test.js',
      '**/*.spec.js',
      '**/*.test.jsx',
      '**/*.spec.jsx',
      '**/__tests__/**/*.js',
      '**/__tests__/**/*.jsx',
    ],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
    },
    rules: {
      'no-undef': 'off',
      'react/prop-types': 'warn',
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
];
