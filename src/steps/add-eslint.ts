import { join } from 'path';
import chalk from 'chalk';
import { runCommand } from '../utils/run-command.js';
import type { UserAnswers } from '../types.js';

/**
 * Añade y configura ESLint en el proyecto Angular.
 *
 * @param projectRoot - Directorio raíz del proyecto
 * @param answers - Respuestas del usuario
 */
export async function addESLint(
  projectRoot: string,
  answers: UserAnswers
): Promise<void> {
  const projectPath = join(projectRoot, answers.projectName);

  console.log(chalk.blue('🔍 Configurando ESLint...'));

  try {
    // Angular CLI ya incluye ESLint por defecto, pero podemos asegurarnos
    // de que esté configurado correctamente
    await runCommand(
      'npm install -D @angular-eslint/eslint-plugin @angular-eslint/template-parser @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint',
      { cwd: projectPath }
    );

    // Angular CLI ya crea eslint.config.js, pero podemos verificar y actualizar si es necesario
    const eslintConfigPath = join(projectPath, 'eslint.config.js');
    const fs = await import('fs/promises');
    const { existsSync } = await import('fs');
    
    // Solo crear si no existe (Angular CLI puede haberlo creado ya)
    if (!existsSync(eslintConfigPath)) {
      const eslintConfig = `import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {},
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
`;

      await fs.writeFile(eslintConfigPath, eslintConfig, 'utf-8');
    }

    console.log(chalk.green('✓ ESLint configurado\n'));
  } catch (error) {
    console.error(chalk.red('Error al configurar ESLint:'), error);
    throw error;
  }
}

