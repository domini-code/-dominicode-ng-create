import { join } from 'path';
import chalk from 'chalk';
import { runCommand } from '../utils/run-command.js';
import type { UserAnswers } from '../types.js';

/**
 * Crea un nuevo proyecto Angular usando @angular/cli.
 *
 * @param answers - Respuestas del usuario
 * @param projectRoot - Directorio raíz donde crear el proyecto
 */
export async function createAngularApp(
  answers: UserAnswers,
  projectRoot: string
): Promise<void> {
  const { projectName, projectType, styles } = answers;

  // Si el usuario selecciona Tailwind CSS, usar CSS como preprocesador base
  const stylePreprocessor = styles === 'tailwind' ? 'css' : styles;

  // Construir comando ng new
  const ngNewArgs = [
    projectName,
    '--skip-git',
    '--skip-install',
    '--package-manager=npm',
    `--style=${stylePreprocessor}`,
    '--routing',
    '--standalone',
  ];

  if (projectType === 'ssr') {
    ngNewArgs.push('--ssr');
  }

  const command = `npx -y @angular/cli@21 new ${ngNewArgs.join(' ')}`;

  try {
    await runCommand(command, { cwd: projectRoot });
    console.log(chalk.green(`✓ Proyecto Angular creado: ${projectName}\n`));
  } catch (error) {
    console.error(chalk.red('Error al crear el proyecto Angular:'), error);
    throw error;
  }
}

