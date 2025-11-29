import { join } from 'path';
import chalk from 'chalk';
import { runCommand } from '../utils/run-command.js';
import type { UserAnswers } from '../types.js';

/**
 * Añade Angular Testing Library al proyecto.
 *
 * @param projectRoot - Directorio raíz del proyecto
 * @param answers - Respuestas del usuario
 */
export async function addTestingLibrary(
  projectRoot: string,
  answers: UserAnswers
): Promise<void> {
  const projectPath = join(projectRoot, answers.projectName);
  const pmCmd = answers.packageManagerCmd || answers.packageManager;
  const pm = answers.packageManager;

  console.log(chalk.blue('🧪 Instalando Angular Testing Library...'));

  try {
    const installCmd = pm === 'npm' ? 'install' : 'add';
    const devFlag = pm === 'npm' ? '-D' : '-D';

    await runCommand(
      `${pmCmd} ${installCmd} ${devFlag} @testing-library/angular @testing-library/user-event @testing-library/jest-dom`,
      { cwd: projectPath }
    );

    console.log(chalk.green('✓ Angular Testing Library instalado\n'));
  } catch (error) {
    console.error(chalk.red('Error al instalar Angular Testing Library:'), error);
    throw error;
  }
}

