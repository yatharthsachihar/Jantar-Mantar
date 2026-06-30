import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Pinned to 5174 so it never collides with the Axiomcropsciences client (5173).
// strictPort makes Vite fail loudly instead of silently hopping to another port.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
  },
})
