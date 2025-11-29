import { join } from 'path';
import chalk from 'chalk';
import type { UserAnswers } from '../types.js';

/**
 * Añade configuración para editores con IA (Cursor/VSCode).
 *
 * @param projectRoot - Directorio raíz del proyecto
 * @param answers - Respuestas del usuario
 */
export async function addAIEditorConfig(
  projectRoot: string,
  answers: UserAnswers
): Promise<void> {
  const projectPath = join(projectRoot, answers.projectName);

  console.log(chalk.blue('🤖 Configurando settings para IA...'));

  try {
    const fs = await import('fs/promises');
    const vscodePath = join(projectPath, '.vscode');

    // Crear directorio .vscode si no existe
    await fs.mkdir(vscodePath, { recursive: true });

    // Crear settings.json
    const settingsPath = join(vscodePath, 'settings.json');
    const settings = {
      'editor.formatOnSave': true,
      'editor.defaultFormatter': 'esbenp.prettier-vscode',
      'editor.codeActionsOnSave': {
        'source.fixAll.eslint': 'explicit',
      },
      'typescript.tsdk': 'node_modules/typescript/lib',
      'typescript.enablePromptUseWorkspaceTsdk': true,
      '[typescript]': {
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      },
      '[html]': {
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      },
      '[json]': {
        'editor.defaultFormatter': 'esbenp.prettier-vscode',
      },
    };

    await fs.writeFile(
      settingsPath,
      JSON.stringify(settings, null, 2) + '\n',
      'utf-8'
    );

    // Crear extensions.json
    const extensionsPath = join(vscodePath, 'extensions.json');
    const extensions = {
      recommendations: [
        'angular.ng-template',
        'esbenp.prettier-vscode',
        'dbaeumer.vscode-eslint',
        'bradlc.vscode-tailwindcss',
      ],
    };

    await fs.writeFile(
      extensionsPath,
      JSON.stringify(extensions, null, 2) + '\n',
      'utf-8'
    );

    // Crear .cursorrules o .cursorrules.yaml
    const cursorRulesPath = join(projectPath, '.cursorrules');
    const cursorRules = `# Angular + Signals | Reglas de generación y buenas prácticas

## Angular Component Generation

- Always generate **standalone** components (\`standalone: true\`).
- Default to \`ChangeDetectionStrategy.OnPush\`.
- Use the new \`input()\` **signal-based** syntax instead of \`@Input()\`.
- Always use \`withComponentInputBinding\`.
- **Do not** use **NgModules** under any circumstance.
- Use the \`inject\` function for dependencies.
- Component templates should use the new built-in control-flow syntax (\`@if\`, \`@for\`).
- Use \`NgOptimizedImage\` for all static images.
- Selector prefix should be \`app-\`.

## Angular Service Generation

- Services must be tree-shakable (\`providedIn: 'root'\`).
- Use the \`inject\` function for internal dependencies.

## State Management

- Prefer Angular **Signals** for local reactive state in components.
- Use \`input()\` signals to react to parent input changes.
- For complex or shared global state, use **NgRx SignalStore** or a custom Signal-based store.
- **Avoid** \`BehaviorSubject\`, \`ReplaySubject\` or manual observables in components.

## Testing

- Every component must have a \`.spec.ts\` file.
- Use Vitest and Angular Testing Library.
- Prefer \`createMock()\` or reusable mock factories.

## Code Style & Best Practices

- Avoid \`any\`; use \`unknown\` or specific types.
- Use \`readonly\` for properties that shouldn't change.
- Declare all public functions with explicit return types.
- Use \`as const\` for constant arrays and objects.
- Avoid hardcoded strings in templates. Extract them to constants or i18n files.
`;

    await fs.writeFile(cursorRulesPath, cursorRules, 'utf-8');

    console.log(chalk.green('✓ Configuración de IA añadida\n'));
  } catch (error) {
    console.error(chalk.red('Error al configurar settings de IA:'), error);
    throw error;
  }
}

