import globals from 'globals';
import pluginJs from '@eslint/js';

import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  {
    ignores: ['dist/', 'node_modules/', 'public/', 'functions/lib/', 'src/generated/'],
  },
  pluginJs.configs.recommended,
  ...compat
    .extends('plugin:lit/recommended')
    .map((config) => ({ ...config, files: ['src/**/*.ts'] })),
  ...compat
    .extends('plugin:wc/recommended')
    .map((config) => ({ ...config, files: ['src/**/*.ts'] })),
  {
    files: ['src/**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['functions/src/**/*.{js,mjs,cjs,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['scripts/**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.node },
  }
];
