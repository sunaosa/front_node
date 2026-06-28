import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  root: '.',
  server: {
    port: 3001,
    open: '/mergeBufferGeometries.html'
  },
  build: {
    outDir: '../../config/.vitepress/dist/threejs-demo',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'mergeBufferGeometries.html'),
        lod2: resolve(__dirname, 'LOD2.html'),
        chunck: resolve(__dirname, 'chunck.html'),
        instanced: resolve(__dirname, 'instanced.html'),
        demo: resolve(__dirname, 'demo.html'),
        frame: resolve(__dirname, 'frame.html')
      }
    }
  }
})