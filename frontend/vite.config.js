import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true
            }
        }
    },
    build: {
        // Production build optimizations
        target: 'es2015',
        minify: 'esbuild',  // Use built-in esbuild minifier
        rollupOptions: {
            output: {
                // Code splitting for better caching
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    three: ['three', '@react-three/fiber', '@react-three/drei']
                }
            }
        },
        // Increase chunk size warning limit for Three.js
        chunkSizeWarningLimit: 1000,
        sourcemap: mode === 'development'
    },
    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom']
    }
}))
