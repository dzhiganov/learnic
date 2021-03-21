module.exports = {
    root: true,
    extends: [
      'airbnb-typescript',
      'airbnb/hooks',
      'plugin:@typescript-eslint/recommended',
      'plugin:jest/recommended',
      'prettier',
      'prettier/react',
      'prettier/@typescript-eslint',
      'plugin:prettier/recommended',
      'plugin:cypress/recommended',
    ],
    plugins: ['react', '@typescript-eslint', 'jest', 'eslint-plugin-cypress'],
    env: {
      browser: true,
      es6: true,
      jest: true,
      'cypress/globals': true
    },
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2018,
      sourceType: 'module',
      project: './tsconfig.json',
    },
    rules: {
      'react/require-default-props': 'off',
      'quotes': ['error', 'single'],
      'linebreak-style': 'off',
      'import/extensions': ['error', 'never'],
      'no-param-reassign': ['error', {props: false}],
      'import/prefer-default-export': 'off',
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
        },
      ],
    },

    overrides: [
      {
        files: ['cypress/**/*.js'],
        rules: {
          'jest/expect-expect': 'off'
        }
      }
    ]
  };
  