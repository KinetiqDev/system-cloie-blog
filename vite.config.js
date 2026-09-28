import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // VITE_BASE is set by the Pages deploy workflow to steps.pages.outputs.base_path
  // ("/CLOIE-Blog" on the fallback github.io URL, "" once a custom domain exists).
  // Default to "/" so local dev and non-Pages builds are unaffected.
  base: process.env.VITE_BASE || '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
  },
})
