import { join } from 'path';
import { existsSync } from 'fs';
import chalk from 'chalk';
import { runCommand } from '../utils/run-command.js';
import { modifyJson } from '../utils/modify-json.js';
import type { UserAnswers } from '../types.js';

/**
 * Adds and configures Jest in the Angular project.
 *
 * @param projectRoot - Root directory of the project
 * @param answers - User answers
 */
export async function addJest(
  projectRoot: string,
  answers: UserAnswers
): Promise<void> {
  const projectPath = join(projectRoot, answers.projectName);
  const pm = answers.packageManager;
  const pmCmd = answers.packageManagerCmd || pm;

  console.log(chalk.blue('🧪 Setting up Jest...'));

  try {
    // 1. Remove Vitest (since it comes by default in Angular 21)
    console.log(chalk.blue('  Removing Vitest dependencies...'));
    
    // Lista de posibles paquetes de Vitest/Karma/Jasmine a eliminar
    const packagesToRemove = [
      'vitest',
      '@vitest/ui', 
      '@angular/build/vite-plugin', 
      'jsdom', 
      '@vitest/coverage-v8',
      'karma',
      'karma-chrome-launcher',
      'karma-coverage',
      'karma-jasmine',
      'karma-jasmine-html-reporter',
      'jasmine-core'
    ];

    // Método 1: Intentar remover via comando del package manager
    const removeCmd = pm === 'npm' ? 'uninstall' : 'remove';
    try {
      // Unir todos en un solo comando puede fallar si uno no existe en yarn/pnpm
      // Así que intentamos removerlos del package.json directamente primero para asegurar limpieza
      const packageJsonPath = join(projectPath, 'package.json');
      
      await modifyJson(packageJsonPath, (pkg: any) => {
        if (pkg.devDependencies) {
          packagesToRemove.forEach(pkgName => {
            delete pkg.devDependencies[pkgName];
          });
        }
        return pkg;
      });
      
      // Opcional: Ejecutar comando para limpiar node_modules y lockfile
      // Pero dado que vamos a instalar Jest justo después, el install de Jest sincronizará todo.
      
    } catch (e) {
      console.warn(chalk.yellow('  Warning: Could not remove some Vitest dependencies automatically.'));
    }

    // Remove Vitest configuration file
    const fs = await import('fs/promises');
    const vitestConfigPath = join(projectPath, 'vitest.config.ts');
    if (existsSync(vitestConfigPath)) {
      await fs.unlink(vitestConfigPath);
    }

    // 2. Install Jest and dependencies
    console.log(chalk.blue('  Installing Jest dependencies...'));
    const installCmd = pm === 'npm' ? 'install' : 'add';
    const installDevFlag = pm === 'yarn' || pm === 'pnpm' || pm === 'bun' ? '-D' : '--save-dev';
    
    // Fix for peer dependency conflict with Angular 21
    let extraFlags = '';
    if (pm === 'npm') {
        extraFlags = ' --legacy-peer-deps';
    }

    await runCommand(
      `${pmCmd} ${installCmd} ${installDevFlag} jest @types/jest jest-preset-angular ts-jest${extraFlags}`,
      { cwd: projectPath }
    );

    // Create jest.config.ts
    const jestConfigPath = join(projectPath, 'jest.config.ts');
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

    // Create test setup file
    const testSetupPath = join(projectPath, 'src/test-setup.ts');
    const testSetup = `import 'jest-preset-angular/setup-jest';
`;

    await fs.writeFile(testSetupPath, testSetup, 'utf-8');

    // Modify package.json to add test scripts
    const packageJsonPath = join(projectPath, 'package.json');
    modifyJson(packageJsonPath, (pkg: any) => {
      pkg.scripts = pkg.scripts || {};
      pkg.scripts.test = 'ng test';
      pkg.scripts['test:watch'] = 'ng test --watch';
      pkg.scripts['test:coverage'] = 'ng test --coverage';
      return pkg;
    });
    
    // Modify angular.json to use @angular-builders/jest
    const angularJsonPath = join(projectPath, 'angular.json');
    if (existsSync(angularJsonPath)) {
      modifyJson(angularJsonPath, (config: any) => {
        const projectName = Object.keys(config.projects)[0];
        const project = config.projects[projectName];
        
        if (project && project.architect && project.architect.test) {
          project.architect.test = {
            builder: '@angular-builders/jest:run',
            options: {
              tsConfig: 'tsconfig.spec.json',
            }
          };
        }
        return config;
      });
    }
    
    // Update tsconfig.spec.json to include 'jest' types instead of 'jasmine' or 'vitest'
    const tsconfigSpecPath = join(projectPath, 'tsconfig.spec.json');
    if (existsSync(tsconfigSpecPath)) {
      modifyJson(tsconfigSpecPath, (config: any) => {
        if (config.compilerOptions && config.compilerOptions.types) {
            // Filter out vitest/jasmine and add jest
            config.compilerOptions.types = config.compilerOptions.types
                .filter((t: string) => t !== 'vitest' && t !== 'jasmine');
            if (!config.compilerOptions.types.includes('jest')) {
                config.compilerOptions.types.push('jest');
            }
        } else if (config.compilerOptions) {
            config.compilerOptions.types = ['jest'];
        }
        return config;
      });
    }

    console.log(chalk.green('✓ Jest configured successfully\n'));
  } catch (error) {
    console.error(chalk.red('Error configuring Jest:'), error);
    throw error;
  }
}

