import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';

const execAsync = promisify(exec);

export interface RunCommandOptions {
  cwd?: string;
  silent?: boolean;
}

/**
 * Ejecuta un comando en la terminal y retorna el resultado.
 *
 * @param command - Comando a ejecutar
 * @param options - Opciones adicionales (cwd, silent)
 * @returns Promise con stdout y stderr
 */
export async function runCommand(
  command: string,
  options: RunCommandOptions = {}
): Promise<{ stdout: string; stderr: string }> {
  const { cwd = process.cwd(), silent = false } = options;

  if (!silent) {
    console.log(chalk.gray(`▶ ${command}`));
  }

  try {
    const result = await execAsync(command, {
      cwd,
      maxBuffer: 1024 * 1024 * 10, // 10MB
    });

    return result;
  } catch (error: unknown) {
    if (error instanceof Error && 'stdout' in error && 'stderr' in error) {
      const execError = error as { stdout: string; stderr: string; code?: number };
      if (!silent) {
        console.error(chalk.red(`✗ Error ejecutando: ${command}`));
        console.error(chalk.red(execError.stderr));
      }
      throw execError;
    }
    throw error;
  }
}

