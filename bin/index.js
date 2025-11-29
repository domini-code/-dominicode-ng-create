#!/usr/bin/env node

import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolver la ruta al archivo compilado
const distPath = join(__dirname, '../dist/cli.js');
const distPathUrl = pathToFileURL(distPath).href;

// Importar y ejecutar el CLI
import(distPathUrl).then((module) => {
  if (module.default) {
    module.default();
  } else if (typeof module === 'function') {
    module();
  }
}).catch((error) => {
  console.error('Error al ejecutar el CLI:', error);
  console.error('Asegúrate de haber ejecutado "npm run build" primero.');
  process.exit(1);
});

