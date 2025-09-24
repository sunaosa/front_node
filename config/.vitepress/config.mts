import { defineConfig } from 'vitepress'

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
      { text: 'CSS Node', link: '/css/Animation' }
    ],

    sidebar: [
      {
        text: 'CSS Node',
        items: [
          { text: 'Animation', link: '/css/Animation' },
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
  }
})
