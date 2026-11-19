import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    // запросы на /api перенаправляются на Django, поэтому CORS настраивать не нужно
    proxy: { '/api': 'http://127.0.0.1:8000' },
  },
})
