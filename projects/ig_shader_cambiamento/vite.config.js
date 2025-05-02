import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import path from 'path';

export default defineConfig({
  plugins:[glsl()],
  root: path.resolve(__dirname),
  base: '/projects/ig_shader_cambiamento/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html')
    },
  },
});