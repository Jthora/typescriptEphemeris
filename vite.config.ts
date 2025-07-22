import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: './src/index.ts'
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js'
      }
    }
  },
  server: {
    port: 3000,
    open: false
  },
  optimizeDeps: {
    include: ['astronomy-engine']
  },
  esbuild: {
    target: 'es2022'
  }
});
