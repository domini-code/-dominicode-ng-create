import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readJson, writeJson, modifyJson, updateJson } from './modify-json.js';
import * as fs from 'fs';

// Mock fs module
vi.mock('fs', () => ({
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
}));

describe('modify-json utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('readJson', () => {
    it('should read and parse JSON file', () => {
      const mockData = { test: 'data' };
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(mockData));

      const result = readJson('test.json');
      expect(result).toEqual(mockData);
      expect(fs.readFileSync).toHaveBeenCalledWith('test.json', 'utf-8');
    });

    it('should handle JSON with comments', () => {
      const jsonWithComments = `{
        // This is a comment
        "test": "data" /* block comment */
      }`;
      vi.mocked(fs.readFileSync).mockReturnValue(jsonWithComments);

      const result = readJson<{ test: string }>('test.json');
      expect(result).toEqual({ test: 'data' });
    });
  });

  describe('writeJson', () => {
    it('should write object to JSON file', () => {
      const mockData = { test: 'data' };
      
      writeJson('test.json', mockData);
      
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'test.json', 
        JSON.stringify(mockData, null, 2) + '\n', 
        'utf-8'
      );
    });
  });

  describe('modifyJson', () => {
    it('should read, modify and write JSON file', () => {
      const initialData = { count: 1 };
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(initialData));
      
      modifyJson<{ count: number }>('test.json', (data) => {
        data.count++;
        return data;
      });

      expect(fs.readFileSync).toHaveBeenCalledWith('test.json', 'utf-8');
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'test.json',
        JSON.stringify({ count: 2 }, null, 2) + '\n',
        'utf-8'
      );
    });
  });

  describe('updateJson', () => {
    it('should update specific fields in JSON file', () => {
      const initialData = { name: 'test', version: '1.0.0' };
      vi.mocked(fs.readFileSync).mockReturnValue(JSON.stringify(initialData));
      
      updateJson('package.json', { version: '1.1.0' });

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        'package.json',
        JSON.stringify({ name: 'test', version: '1.1.0' }, null, 2) + '\n',
        'utf-8'
      );
    });
  });
});

