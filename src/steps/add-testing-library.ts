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

  console.log(chalk.blue('🧪 Instalando Angular Testing Library...'));

  try {
    await runCommand(
      'npm install -D @testing-library/angular @testing-library/user-event @testing-library/jest-dom',
      { cwd: projectPath }
    );

    console.log(chalk.green('✓ Angular Testing Library instalado\n'));
  } catch (error) {
    console.error(chalk.red('Error al instalar Angular Testing Library:'), error);
    throw error;
  }
}

