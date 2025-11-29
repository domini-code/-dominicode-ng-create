export interface UserAnswers {
  projectName: string;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  projectType: 'spa' | 'ssr';
  styles: 'css' | 'scss' | 'tailwind';
  testRunner: 'jest' | 'vitest' | 'none';
  testingLibrary: boolean;
  linter: 'eslint' | 'none';
  husky: boolean;
  aiEditorConfig: boolean;
}

