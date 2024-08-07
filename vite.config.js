import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [reactRefresh()],
  root: 'src',
  build: {
    outDir: '../dist',
  },
  server: {
    open: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
