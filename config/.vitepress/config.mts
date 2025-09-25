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
      { text: 'CSS Node', link: '/css/Animation/Animation' }
    ],

    sidebar: [
      {
        text: 'CSS Node',
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
