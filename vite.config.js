import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    base: command === 'serve' ? '/' : '/weather/', // ← подставьте имя вашего репо
    server: {
      port: 8080,
    },
  }
})
