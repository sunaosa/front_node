import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './', // 关键配置：改为相对路径，使其可以在任何子目录下部署/预览
  plugins: [react()],
  server: {
    port: 3000, // 可选：指定开发服务器端口
  }
})
