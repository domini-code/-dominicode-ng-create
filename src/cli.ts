import chalk from 'chalk';
import inquirer from 'inquirer';
import { addAIEditorConfig } from './steps/add-ai-editor-config.js';
import { addESLint } from './steps/add-eslint.js';
import { addHusky } from './steps/add-husky.js';
import { addJest } from './steps/add-jest.js';
import { addTestingLibrary } from './steps/add-testing-library.js';
import { createAngularApp } from './steps/create-angular-app.js';
import type { UserAnswers } from './types.js';

async function promptUser(): Promise<UserAnswers> {
  console.log(chalk.blue.bold('\n🚀 Angular 21 Project Generator\n'));

  const answers = await inquirer.prompt<UserAnswers>([
    {
      type: 'input',
      name: 'projectName',
      message: 'What is the project name?',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Project name is required';
        }
        if (!/^[a-z0-9-]+$/.test(input)) {
          return 'Name must contain only lowercase letters, numbers, and hyphens';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'packageManager',
      message: 'Which package manager do you want to use?',
      choices: [
        { name: 'npm', value: 'npm' },
        { name: 'pnpm', value: 'pnpm' },
        { name: 'yarn', value: 'yarn' },
        { name: 'bun', value: 'bun' },
      ],
      default: 'npm',
    },
    {
      type: 'list',
      name: 'projectType',
      message: 'What type of project do you want to create?',
      choices: [
        { name: 'SPA (Single Page Application)', value: 'spa' },
        { name: 'SSR (Server-Side Rendering)', value: 'ssr' },
      ],
      default: 'spa',
    },
    {
      type: 'list',
      name: 'styles',
      message: 'Which style preprocessor do you prefer?',
      choices: [
        { name: 'CSS', value: 'css' },
        { name: 'SCSS', value: 'scss' },
        { name: 'Tailwind CSS', value: 'tailwind' },
      ],
      default: 'css',
    },
    {
      type: 'list',
      name: 'testRunner',
      message: 'Which test runner do you want to use?',
      choices: [
        { name: 'Vitest', value: 'vitest' },
        { name: 'Jest', value: 'jest' },
        { name: 'None', value: 'none' },
      ],
      default: 'vitest',
    },
    {
      type: 'confirm',
      name: 'testingLibrary',
      message: 'Do you want to install Angular Testing Library?',
      default: true,
      when: (answers: Partial<UserAnswers>) => answers.testRunner !== 'none',
    },
    {
      type: 'list',
      name: 'linter',
      message: 'Do you want to configure ESLint?',
      choices: [
        { name: 'Yes, with ESLint', value: 'eslint' },
        { name: 'No', value: 'none' },
      ],
      default: 'eslint',
    },
    {
      type: 'confirm',
      name: 'husky',
      message: 'Do you want to configure Husky for git hooks?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'aiEditorConfig',
      message: 'Do you want to configure AI settings (Cursor/VSCode)?',
      default: true,
    },
  ]);

  return answers;
}

import { runCommand } from './utils/run-command.js';

async function run(): Promise<void> {
  try {
    // Validar versión de Node
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0], 10);
    
    if (majorVersion < 20) {
      console.error(chalk.red(`❌ Node.js v20 or higher is required. Current version: ${nodeVersion}`));
      process.exit(1);
    }

    const answers = await promptUser();

    console.log(chalk.green('\n✅ Configuration received. Generating project...\n'));

    const projectRoot = process.cwd();

    // Paso 1: Crear el proyecto Angular base
    console.log(chalk.blue('📦 Creating Angular project...'));
    await createAngularApp(answers, projectRoot);

    // Paso 2: Aplicar features opcionales
    const steps = [
      {
        condition: answers.testRunner === 'jest',
        step: () => addJest(projectRoot, answers),
      },
      {
        condition: answers.testingLibrary && answers.testRunner !== 'none',
        step: () => addTestingLibrary(projectRoot, answers),
      },
      {
        condition: answers.linter === 'eslint',
        step: () => addESLint(projectRoot, answers),
      },
      {
        condition: answers.husky,
        step: () => addHusky(projectRoot, answers),
      },
      {
        condition: answers.aiEditorConfig,
        step: () => addAIEditorConfig(projectRoot, answers),
      },
    ];

    for (const { condition, step } of steps) {
      if (condition) {
        await step();
      }
    }

    console.log(chalk.green.bold('\n✨ Project generated successfully!\n'));
    
    // Instalar dependencias
    console.log(chalk.blue(`📦 Installing dependencies with ${answers.packageManager}...`));
    await runCommand(`${answers.packageManager} install`, { 
      cwd: `${projectRoot}/${answers.projectName}` 
    });

    console.log(chalk.green.bold('\n✅ Dependencies installed successfully!\n'));
    console.log(chalk.yellow(`📁 Location: ${projectRoot}/${answers.projectName}\n`));
    console.log(chalk.cyan('Next steps:'));
    console.log(chalk.white(`  cd ${answers.projectName}`));
    console.log(chalk.white(`  ${answers.packageManager} start\n`));
  } catch (error) {
    console.error(chalk.red('\n❌ Error generating project:'));
    console.error(error);
    process.exit(1);
  }
}

export default run;

