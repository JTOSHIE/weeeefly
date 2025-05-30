module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // Target modern browsers for smaller bundle size
        targets: {
          browsers: [
            '>0.2%',
            'not dead',
            'not op_mini all',
            'not ie 11'
          ]
        },
        // Use native ES modules
        modules: false,
        // Only include necessary polyfills
        useBuiltIns: 'usage',
        corejs: {
          version: 3,
          proposals: false
        },
        // Enable loose mode for smaller output
        loose: true,
        // Exclude transforms handled by esbuild
        exclude: ['transform-typeof-symbol']
      }
    ],
    [
      '@babel/preset-react',
      {
        // Use automatic JSX runtime for smaller bundles
        runtime: 'automatic',
        // Enable development helpers only in dev
        development: process.env.NODE_ENV === 'development',
        // Import source for better debugging
        importSource: 'react'
      }
    ]
  ],
  plugins: [
    // Runtime helpers to reduce duplication
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
        version: '^7.24.0'
      }
    ],
    // Class properties
    '@babel/plugin-proposal-class-properties',
    // Optional chaining
    '@babel/plugin-proposal-optional-chaining',
    // Nullish coalescing
    '@babel/plugin-proposal-nullish-coalescing-operator',
    // Dynamic imports
    '@babel/plugin-syntax-dynamic-import',
    // Production optimizations
    process.env.NODE_ENV === 'production' && [
      'transform-react-remove-prop-types',
      {
        removeImport: true
      }
    ],
    // Remove console logs in production
    process.env.NODE_ENV === 'production' && [
      'transform-remove-console',
      {
        exclude: ['error', 'warn']
      }
    ]
  ].filter(Boolean),
  // Environment-specific configuration
  env: {
    production: {
      // Minify in production
      compact: true,
      // Remove comments
      comments: false,
      // Additional production plugins
      plugins: [
        '@babel/plugin-transform-react-constant-elements',
        '@babel/plugin-transform-react-inline-elements'
      ]
    },
    development: {
      // Keep code readable in development
      compact: false,
      // Preserve comments for debugging
      comments: true
    },
    test: {
      // Use CommonJS for tests
      presets: [
        [
          '@babel/preset-env',
          {
            targets: {
              node: 'current'
            },
            modules: 'commonjs'
          }
        ],
        '@babel/preset-react'
      ]
    }
  },
  // Ignore node_modules except specific packages that need transpilation
  ignore: [
    /node_modules\/(?!(axios|some-es6-package))/
  ],
  // Cache configuration for faster builds
  cacheDirectory: true,
  // Source maps for debugging
  sourceMaps: process.env.NODE_ENV === 'development' ? 'inline' : false
};