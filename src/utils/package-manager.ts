import chalk from 'chalk';
import { runCommand } from './run-command.js';

/**
 * Verifica si el gestor de paquetes está disponible globalmente.
 * Si no lo está, devuelve una versión prefijada con npx (excepto para npm).
 * 
 * @param pm Nombre del gestor de paquetes (npm, yarn, pnpm, bun)
 * @returns El comando ejecutable (ej: 'yarn' o 'npx yarn')
 */
export async function getPackageManagerCommand(pm: string): Promise<string> {
  if (pm === 'npm') return 'npm';

  console.log(chalk.blue(`🔍 Verifying ${pm}...`));
  try {
    await runCommand(`${pm} --version`, { silent: true });
    return pm;
  } catch (error) {
    console.log(chalk.yellow(`⚠️  ${pm} not found globally. Using 'npx ${pm}' instead.`));
    return `npx ${pm}`;
  }
}

