import chalk from 'chalk';
import { readFileSync, writeFileSync } from 'fs';

/**
 * Lee un archivo JSON y retorna su contenido parseado.
 *
 * @param filePath - Ruta al archivo JSON
 * @returns Objeto parseado
 */
export function readJson<T = unknown>(filePath: string): T {
  try {
    const content = readFileSync(filePath, 'utf-8');
    // Eliminar comentarios simples (//) y de bloque (/* */) antes de parsear
    // Nota: Esto es una limpieza básica y puede fallar si hay URLs o strings con // dentro.
    // Para mayor robustez en el futuro, considerar usar 'jsonc-parser'.
    const jsonContent = content.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g1) => g1 ? "" : m);
    
    return JSON.parse(jsonContent) as T;
  } catch (error) {
    console.error(chalk.red(`Error reading ${filePath}:`), error);
    throw error;
  }
}

/**
 * Escribe un objeto como JSON en un archivo.
 *
 * @param filePath - Ruta al archivo JSON
 * @param data - Datos a escribir
 * @param indent - Indentación (por defecto 2)
 */
export function writeJson<T = unknown>(
  filePath: string,
  data: T,
  indent: number = 2
): void {
  try {
    const content = JSON.stringify(data, null, indent);
    writeFileSync(filePath, content + '\n', 'utf-8');
  } catch (error) {
    console.error(chalk.red(`Error escribiendo ${filePath}:`), error);
    throw error;
  }
}

/**
 * Modifica un archivo JSON aplicando una función de transformación.
 *
 * @param filePath - Ruta al archivo JSON
 * @param transformer - Función que transforma el objeto
 */
export function modifyJson<T = unknown>(
  filePath: string,
  transformer: (data: T) => T
): void {
  const data = readJson<T>(filePath);
  const modified = transformer(data);
  writeJson(filePath, modified);
}

/**
 * Añade o actualiza propiedades en un archivo JSON.
 *
 * @param filePath - Ruta al archivo JSON
 * @param updates - Objeto con las propiedades a actualizar
 */
export function updateJson<T extends Record<string, unknown>>(
  filePath: string,
  updates: Partial<T>
): void {
  modifyJson<T>(filePath, (data) => ({
    ...data,
    ...updates,
  }));
}

