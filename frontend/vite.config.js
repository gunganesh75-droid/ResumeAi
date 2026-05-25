import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // ResumeTemplate.jsx is intentionally large (8 full A4 templates).
    // Raise the warning threshold to avoid false-positive build warnings.
    chunkSizeWarningLimit: 1800,
  },
})
