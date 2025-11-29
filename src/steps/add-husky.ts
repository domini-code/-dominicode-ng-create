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
  const pmCmd = answers.packageManagerCmd || answers.packageManager;
  const pm = answers.packageManager;

  console.log(chalk.blue('🐕 Configurando Husky...'));

  try {
    // Instalar Husky, lint-staged y Prettier
    const installCmd = pm === 'npm' ? 'install' : 'add';
    const devFlag = pm === 'npm' ? '-D' : '-D';

    await runCommand(`${pmCmd} ${installCmd} ${devFlag} husky lint-staged prettier`, { cwd: projectPath });

    // Inicializar Husky
    // husky init usa npx husky init o yarn husky init. 
    // Para compatibilidad, si usamos npx, es npx husky init.
    // Si usamos yarn, yarn husky init (si existe script) o npx husky init.
    // Mejor usar npx husky init siempre para setup inicial, o pm exec husky init
    // npm: npx husky init
    // yarn: yarn husky init (requires yarn 2+) or npx husky init
    // pnpm: pnpm husky init (requires v9+ or pnpm dlx husky init)
    // Para simplificar, usaremos el comando del PM si soporta dlx o exec, o fallback a npx.
    // Pero husky init modifica package.json.
    
    // Usaremos runCommand con npx para asegurar compatibilidad si no es npm.
    // Pero si el usuario tiene yarn global, `yarn husky init` funciona si es v2+.
    // Si es v1, necesita `npx husky-init`.
    // Asumiremos husky v9.
    
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

