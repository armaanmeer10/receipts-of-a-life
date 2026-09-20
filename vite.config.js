import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // rolldown (Vite 8) requires manualChunks as a function, not an object
        manualChunks(id) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/') ||
            id.includes('node_modules/react-router-dom/')
          ) {
            return 'react-core'
          }
          if (id.includes('node_modules/framer-motion/')) {
            return 'framer-motion'
          }
        },
      },
    },
  },
})