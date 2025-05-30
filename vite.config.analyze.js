// Vite configuration for bundle analysis
// Run with: ANALYZE=true npm run build -- --config vite.config.analyze.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import compression from 'vite-plugin-compression';
import legacy from '@vitejs/plugin-legacy';

export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime', { useESModules: true }]
        ]
      }
    }),
    // Generate bundle visualization
    visualizer({
      filename: './dist/stats.html',
      open: true,
      template: 'treemap', // or 'sunburst', 'network'
      gzipSize: true,
      brotliSize: true,
      sourcemap: true
    }),
    // Gzip compression
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240, // Only compress files larger than 10kb
      deleteOriginFile: false
    }),
    // Brotli compression
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 10240,
      deleteOriginFile: false
    }),
    // Legacy browser support (optional)
    legacy({
      targets: ['defaults', 'not IE 11'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all'
      ]
    })
  ],
  
  build: {
    outDir: 'dist',
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Fine-grained chunking strategy
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('axios')) {
              return 'http-client';
            }
            if (id.includes('@babel') || id.includes('core-js')) {
              return 'polyfills';
            }
            // Group other small libraries
            return 'vendor';
          }
          // Split components into their own chunk
          if (id.includes('/src/components/')) {
            return 'components';
          }
          // Split utilities and hooks
          if (id.includes('/src/utils/') || id.includes('/src/hooks/')) {
            return 'utils';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
      // Tree-shaking optimizations
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      }
    },
    chunkSizeWarningLimit: 500, // Lower limit for analysis
    minify: 'terser',
    terserOptions: {
      parse: {
        ecma: 2020
      },
      compress: {
        ecma: 5,
        comparisons: false,
        inline: 2,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.trace'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      output: {
        ecma: 5,
        comments: false,
        ascii_only: true
      }
    },
    cssCodeSplit: true,
    cssMinify: 'lightningcss', // Faster CSS minification
    assetsInlineLimit: 4096,
    target: 'es2015',
    reportCompressedSize: true
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'axios'],
    exclude: [],
    esbuildOptions: {
      target: 'es2015',
      define: {
        global: 'globalThis'
      }
    }
  },
  
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    __DEV__: false,
    __PROD__: true
  },
  
  esbuild: {
    legalComments: 'none',
    drop: ['console', 'debugger'],
    target: 'es2015',
    minify: true,
    treeShaking: true,
    pure: ['console.log', 'console.info']
  }
});