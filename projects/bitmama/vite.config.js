import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname),
  build: {
    emptyOutDir: false, // Evita la cancellazione della cartella
    outDir: path.resolve(__dirname, '../../dist/bitmama'), // Percorso corretto
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/main.js'),
      },
    },
  },
});