import { join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { runCommand } from '../utils/run-command.js';
import { modifyJson, readJson } from '../utils/modify-json.js';
import type { UserAnswers } from '../types.js';

/**
 * Añade y configura Tailwind CSS en el proyecto Angular.
 *
 * @param projectRoot - Directorio raíz del proyecto
 * @param answers - Respuestas del usuario
 */
export async function addTailwind(
  projectRoot: string,
  answers: UserAnswers
): Promise<void> {
  const projectPath = join(projectRoot, answers.projectName);

  console.log(chalk.blue('🎨 Configurando Tailwind CSS...'));

  try {
    // Instalar Tailwind CSS
    await runCommand('npm install -D tailwindcss postcss autoprefixer', {
      cwd: projectPath,
    });

    // Inicializar Tailwind
    await runCommand('npx tailwindcss init -p', { cwd: projectPath });

    // Modificar tailwind.config.js
    const tailwindConfigPath = join(projectPath, 'tailwind.config.js');
    if (existsSync(tailwindConfigPath)) {
      // Leer y modificar la configuración
      // Por ahora, solo logueamos que se instaló
    }

    // Modificar styles.css para incluir las directivas de Tailwind
    const stylesPath = join(projectPath, 'src/styles.css');
    if (existsSync(stylesPath)) {
      const fs = await import('fs/promises');
      const content = await fs.readFile(stylesPath, 'utf-8');
      const tailwindDirectives = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n`;
      if (!content.includes('@tailwind')) {
        await fs.writeFile(stylesPath, tailwindDirectives + content, 'utf-8');
      }
    }

    console.log(chalk.green('✓ Tailwind CSS configurado\n'));
  } catch (error) {
    console.error(chalk.red('Error al configurar Tailwind CSS:'), error);
    throw error;
  }
}

