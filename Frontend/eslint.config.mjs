import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

/** Next 16 ships flat configs, so they are composed directly. */
const config = [
  ...coreWebVitals,
  ...typescript,
  {
    /* scripts are one-off tooling and verification harnesses, not app code */
    ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts', 'scripts/**'],
  },
  {
    /*
     * src/components is produced by scripts/dc-to-jsx.mjs from the original
     * console template. Style rules are relaxed there because the fix belongs
     * in the codemod, not in a file that gets regenerated.
     */
    files: ['src/components/**/*.tsx'],
    rules: {
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    /*
     * The per-phase pack builders are a verbatim port that reads unvalidated
     * model JSON; see the header comment in each file.
     */
    files: ['src/features/console/view-model/packs/**/*.ts'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['src/app/layout.tsx'],
    rules: {
      /* App Router loads the family in the layout head, not pages/_document. */
      '@next/next/no-page-custom-font': 'off',
    },
  },
];

export default config;
