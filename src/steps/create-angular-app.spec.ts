import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { UserAnswers } from '../types.js';
import { runCommand } from '../utils/run-command.js';
import { createAngularApp } from './create-angular-app.js';

// Mock runCommand
vi.mock('../utils/run-command.js', () => ({
  runCommand: vi.fn(),
}));

describe('createAngularApp', () => {
  const mockProjectRoot = '/test/root';
  
  const defaultAnswers: UserAnswers = {
    projectName: 'test-app',
    packageManager: 'npm',
    projectType: 'spa',
    styles: 'css',
    testRunner: 'vitest',
    testingLibrary: true,
    linter: 'eslint',
    husky: true,
    aiEditorConfig: true,
    packageManagerCmd: 'npm'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Style configuration', () => {
    it('should configure Tailwind CSS when user selects tailwind', async () => {
      const answers: UserAnswers = {
        ...defaultAnswers,
        styles: 'tailwind'
      };

      await createAngularApp(answers, mockProjectRoot);

      expect(runCommand).toHaveBeenCalledTimes(1);
      const commandCall = vi.mocked(runCommand).mock.calls[0][0];
      
      // Verifica que el flag correcto esté presente
      expect(commandCall).toContain('--style=tailwind');
      // Verifica que otros flags de estilo NO estén presentes
      expect(commandCall).not.toContain('--style=css');
      expect(commandCall).not.toContain('--style=scss');
    });

    it('should configure SCSS when user selects scss', async () => {
      const answers: UserAnswers = {
        ...defaultAnswers,
        styles: 'scss'
      };

      await createAngularApp(answers, mockProjectRoot);

      const commandCall = vi.mocked(runCommand).mock.calls[0][0];
      expect(commandCall).toContain('--style=scss');
      expect(commandCall).not.toContain('--style=tailwind');
    });

    it('should configure CSS when user selects css', async () => {
      const answers: UserAnswers = {
        ...defaultAnswers,
        styles: 'css'
      };

      await createAngularApp(answers, mockProjectRoot);

      const commandCall = vi.mocked(runCommand).mock.calls[0][0];
      expect(commandCall).toContain('--style=css');
    });
  });
});

