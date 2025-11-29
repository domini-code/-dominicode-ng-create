import { join } from 'path';
import chalk from 'chalk';
import { runCommand } from '../utils/run-command.js';
import { modifyJson } from '../utils/modify-json.js';
import type { UserAnswers } from '../types.js';

/**
 * Añade y configura Husky para git hooks.
 *
 * @param projectRoot - Directorio raíz del proyecto
 * @param answers - Respuestas del usuario
 */
export async function addHusky(
  projectRoot: string,
  answers: UserAnswers
): Promise<void> {
  const projectPath = join(projectRoot, answers.projectName);

  console.log(chalk.blue('🐕 Configurando Husky...'));

  try {
    // Instalar Husky, lint-staged y Prettier
    await runCommand('npm install -D husky lint-staged prettier', { cwd: projectPath });

    // Inicializar Husky
    await runCommand('npx husky init', { cwd: projectPath });

    // Crear pre-commit hook
    const huskyPath = join(projectPath, '.husky');
    const fs = await import('fs/promises');
    const preCommitPath = join(huskyPath, 'pre-commit');
    const preCommitContent = `npx lint-staged\n`;

    await fs.writeFile(preCommitPath, preCommitContent, 'utf-8');

    // Configurar lint-staged en package.json
    const packageJsonPath = join(projectPath, 'package.json');
    modifyJson(packageJsonPath, (pkg: any) => {
      pkg['lint-staged'] = {
        '*.{ts,html}': ['eslint --fix'],
        '*.{ts,html,css,scss,json,md}': ['prettier --write'],
      };
      return pkg;
    });

    console.log(chalk.green('✓ Husky configurado\n'));
  } catch (error) {
    console.error(chalk.red('Error al configurar Husky:'), error);
    throw error;
  }
}

