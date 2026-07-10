import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed to GitHub Pages under /inkbyos-website/.
// When this moves to a custom domain (e.g. inkbyos.com), change base to '/'.
export default defineConfig({
  base: '/inkbyos-website/',
  plugins: [react()],
})
