import chalk from 'chalk';
import type { UserAnswers } from '../types.js';
import { runCommand } from '../utils/run-command.js';

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

  // Construir comando ng new
  // Angular CLI v18+ soporta nativamente --style=tailwind
  const ngNewArgs = [
    projectName,
    '--skip-git',
    '--skip-install',
    '--package-manager=npm',
    `--style=${styles}`,
    '--routing',
    '--standalone',
  ];

  if (answers.testRunner === 'vitest') {
    ngNewArgs.push('--test-runner=vitest');
  } else if (answers.testRunner === 'none') {
    ngNewArgs.push('--skip-tests');
  }
  // Si es 'jest', dejamos que se genere con el default (probablemente vitest)
  // y luego addJest se encargará de reconfigurar.
  // O podríamos usar --skip-tests y que addJest genere los specs, pero
  // addJest probablemente solo configura el entorno.
  
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

