import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl'; // Solo si usas shaders

export default defineConfig({
    base: '/evil-spider/', // Ruta base de tu CDN
    plugins: [glsl()], // Plugin para importar shaders
    build: {
        assetsInlineLimit: 0, // Para evitar inline de assets grandes
        rollupOptions: {
            output: {
                assetFileNames: 'assets/[name]-[hash][extname]',
                entryFileNames: 'js/[name]-[hash].js'
            }
        }
    }
});