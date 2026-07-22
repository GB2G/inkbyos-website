import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed to Vercel, served from the domain root.
export default defineConfig({
  base: '/',
  plugins: [react()],
})
