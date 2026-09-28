import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Actions supplies the repository-aware path. Relative paths keep local preview portable.
  base: process.env.VITE_BASE_PATH || './',
})
