// vite.config.js
import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'
import path from 'path';

export default defineConfig({
	plugins: [glsl()], 
  build: {
    outDir: path.resolve(__dirname, '../../dist/morphing'),
    emptyOutDir: false, // Disabilita la cancellazione automatica
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'main.js'),
      },
    },
  },
});