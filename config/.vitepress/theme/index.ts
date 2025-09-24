// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'

// 引入 Ant Design Vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

export default {
  ...Theme,
  // @ts-ignore
  enhanceApp({ app }) {
    app.use(Antd);
  }
}