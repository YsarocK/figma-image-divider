import typescript from '@rollup/plugin-typescript';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { IndentStyle } from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  input: 'src/index.ts',
  output: {
    file: 'code.js',
    format: 'es',
  },
  plugins: [
    typescript({
      tsconfig: resolve(__dirname, 'tsconfig.json'), // Utiliser resolve pour obtenir le chemin absolu
    }),
  ],
};
