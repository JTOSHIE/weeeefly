import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react({
      // Use SWC for faster builds in development
      fastRefresh: true,
      // Babel config for production builds
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime', { useESModules: true }]
        ]
      }
    }),
    // Bundle analyzer - only in analyze mode
    process.env.ANALYZE && visualizer({
      filename: './dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  
  server: {
    port: 3000,
    open: true,
    // Enable HMR
    hmr: {
      overlay: true
    }
  },
  
  build: {
    outDir: 'dist',
    // Generate sourcemaps for production debugging
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : true,
    // Optimize chunk size
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'utils': ['axios']
        },
        // Use content hash for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Minification options
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      },
      format: {
        comments: false
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Asset inlining threshold
    assetsInlineLimit: 4096,
    // Target modern browsers for smaller bundles
    target: 'es2015',
    // Report compressed size
    reportCompressedSize: false,
    // Consistent chunk names for better caching
    cssMinify: true
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios'],
    // Force pre-bundling of these dependencies
    force: true
  },
  
  // Environment variable handling
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  
  // Enable esbuild optimizations
  esbuild: {
    // Remove console logs in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // Legal comments handling
    legalComments: 'none',
    // Target for syntax transformation
    target: 'es2015'
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils'
    }
  },
  
  // Preview server configuration
  preview: {
    port: 3000,
    open: true
  }
});