import { join } from 'path';
import chalk from 'chalk';
import { runCommand } from '../utils/run-command.js';
import { modifyJson } from '../utils/modify-json.js';
import type { UserAnswers } from '../types.js';

/**
 * Añade y configura Vitest en el proyecto Angular.
 *
 * @param projectRoot - Directorio raíz del proyecto
 * @param answers - Respuestas del usuario
 */
export async function addVitest(
  projectRoot: string,
  answers: UserAnswers
): Promise<void> {
  const projectPath = join(projectRoot, answers.projectName);

  console.log(chalk.blue('⚡ Configurando Vitest...'));

  try {
    // Instalar Vitest y dependencias
    await runCommand(
      'npm install -D vitest @vitest/ui @angular/build/vite-plugin jsdom @vitest/coverage-v8',
      { cwd: projectPath }
    );

    // Crear archivo de configuración vitest.config.ts
    const vitestConfigPath = join(projectPath, 'vitest.config.ts');
    const fs = await import('fs/promises');
    const vitestConfig = `import { defineConfig } from 'vitest/config';
import angular from '@angular/build/vite-plugin';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
`;

    await fs.writeFile(vitestConfigPath, vitestConfig, 'utf-8');

    // Crear archivo de setup para tests
    const testSetupPath = join(projectPath, 'src/test-setup.ts');
    const testSetup = `import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/angular';

afterEach(() => {
  cleanup();
});
`;

    await fs.writeFile(testSetupPath, testSetup, 'utf-8');

    // Modificar package.json para añadir scripts de test
    const packageJsonPath = join(projectPath, 'package.json');
    modifyJson(packageJsonPath, (pkg: any) => {
      pkg.scripts = pkg.scripts || {};
      pkg.scripts.test = 'vitest';
      pkg.scripts['test:ui'] = 'vitest --ui';
      pkg.scripts['test:coverage'] = 'vitest --coverage';
      return pkg;
    });

    console.log(chalk.green('✓ Vitest configurado\n'));
  } catch (error) {
    console.error(chalk.red('Error al configurar Vitest:'), error);
    throw error;
  }
}

