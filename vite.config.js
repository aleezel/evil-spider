import glsl from 'vite-plugin-glsl'; // Solo si usas shaders
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    plugins: [glsl()], // Plugin para importar shaders

  build: {
    lib: {
      // Pass your index.js file here
      entry: resolve(__dirname, 'src/main.js'),
      // The name of the global variable if used in a browser via a script tag
      name: 'MyBundle',
      // The output filename format
      fileName: (format) => `main.${format}.js`,
    },
    // Optional: Choose fallback formats like 'es' (ES Modules) or 'iife' (for plain script tags)
    formats: ['es', 'iife']
  },
});
