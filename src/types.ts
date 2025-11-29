export interface UserAnswers {
  projectName: string;
  packageManager: 'npm' | 'pnpm' | 'yarn' | 'bun';
  packageManagerCmd?: string;
  projectType: 'spa' | 'ssr';
  styles: 'css' | 'scss' | 'tailwind';
  testRunner: 'jest' | 'vitest' | 'none';
  testingLibrary: boolean;
  linter: 'eslint' | 'none';
  husky: boolean;
  aiEditorConfig: boolean;
}
