import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname), // Assicura che index.html venga trovato
  build: {
    outDir: path.resolve(__dirname, '../../dist/projects/bitmama'), // Salva nella cartella corretta
    emptyOutDir: false, // Evita che la cartella venga cancellata
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html') // Include index.html
    },
  },
});