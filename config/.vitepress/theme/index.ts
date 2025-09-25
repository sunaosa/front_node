// https://vitepress.dev/guide/custom-theme
import Theme from 'vitepress/theme'
import {
  AntDesignContainer,
  ElementPlusContainer,
  NaiveUIContainer,
} from '@vitepress-demo-preview/component';
import '@vitepress-demo-preview/component/dist/style.css';

// 引入 Ant Design Vue
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';

export default {
  ...Theme,
  // @ts-ignore
  enhanceApp({ app }) {
    app.use(Antd);
    app.component('demo-preview', AntDesignContainer);
  }
}