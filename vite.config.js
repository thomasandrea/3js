import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  build: {
    outDir: 'dist', // Cartella di output
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'), // Includi index.html
        bitmama: path.resolve(__dirname, 'projects/bitmama/index.html'), // Progetto bitmama
        morphing: path.resolve(__dirname, 'projects/morphing/index.html'), // Progetto morphing
      },
      output: {
        // Mantieni la struttura delle cartelle
        entryFileNames: 'projects/[name]/assets/[name].[hash].js',
        chunkFileNames: 'projects/[name]/assets/[name].[hash].js',
        assetFileNames: 'projects/[name]/assets/[name].[hash].[ext]',
      },
    },
  },
  plugins: [
    {
      name: 'copy-index',
      closeBundle() {
        // Copia index.html nella root di dist
        fs.copyFileSync(
          path.resolve(__dirname, 'index.html'),
          path.resolve(__dirname, 'dist/index.html')
        );
      },
    },
  ],
});