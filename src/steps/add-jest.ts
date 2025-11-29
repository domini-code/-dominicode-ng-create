import { join } from 'path';
import chalk from 'chalk';
import { runCommand } from '../utils/run-command.js';
import { modifyJson } from '../utils/modify-json.js';
import type { UserAnswers } from '../types.js';

/**
 * Añade y configura Jest en el proyecto Angular.
 *
 * @param projectRoot - Directorio raíz del proyecto
 * @param answers - Respuestas del usuario
 */
export async function addJest(
  projectRoot: string,
  answers: UserAnswers
): Promise<void> {
  const projectPath = join(projectRoot, answers.projectName);

  console.log(chalk.blue('🧪 Configurando Jest...'));

  try {
    // Instalar Jest y dependencias
    await runCommand(
      'npm install -D jest @types/jest jest-preset-angular ts-jest',
      { cwd: projectPath }
    );

    // Crear archivo de configuración jest.config.ts
    const jestConfigPath = join(projectPath, 'jest.config.ts');
    const fs = await import('fs/promises');
    const jestConfig = `import type { Config } from 'jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.d.ts',
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, {
    prefix: '<rootDir>/',
  }),
};

export default config;
`;

    await fs.writeFile(jestConfigPath, jestConfig, 'utf-8');

    // Crear archivo de setup para tests
    const testSetupPath = join(projectPath, 'src/test-setup.ts');
    const testSetup = `import 'jest-preset-angular/setup-jest';
`;

    await fs.writeFile(testSetupPath, testSetup, 'utf-8');

    // Modificar package.json para añadir scripts de test
    const packageJsonPath = join(projectPath, 'package.json');
    modifyJson(packageJsonPath, (pkg: any) => {
      pkg.scripts = pkg.scripts || {};
      pkg.scripts.test = 'jest';
      pkg.scripts['test:watch'] = 'jest --watch';
      pkg.scripts['test:coverage'] = 'jest --coverage';
      return pkg;
    });

    console.log(chalk.green('✓ Jest configurado\n'));
  } catch (error) {
    console.error(chalk.red('Error al configurar Jest:'), error);
    throw error;
  }
}

