import { defineConfig } from 'vitepress'
import {
  containerPreview,
  componentPreview,
} from '@vitepress-demo-preview/plugin';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "..\\docs",
  base: "/front_node/",
  title: "十二个人博客",
  description: "十二前端个人总结",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'CSS Node', link: '/css/Animation/Animation' },
      {  text: '绘图', link: '/Canvas/canvas' },
      { text: '框架', link: '/React/react' },
    ],

    sidebar: [
      {
        text: 'CSS',
        items: [
          { text: 'Animation', link: '/css/Animation/Animation' },
          { 
            text: 'Layout', 
            items: [
              { text: 'Grid', link: '/css/Layout/Grid' },
              { text: 'Flex', link: '/css/Layout/Flex' },
            ]
          },
        ]
      },
      {
        text: '绘图',
        items: [
          { text: 'Canvas', link: '/Canvas/canvas' },
          { text: 'SVG', link: '/SVG/svg' },
          { text: 'WebGL', link: '/WebGL/webgl' },
        ]
      },
      {
        text: '框架',
        items: [
          { text: 'React', link: '/React/react' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sunaosa/front_node' }
    ]
  },
  markdown: {
    config(md: any) {
      md.use(containerPreview);
      md.use(componentPreview);
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {}
      }
    }
  }
})
