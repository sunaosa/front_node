<script setup>
import { theme, Card as ACard, Button as AButton } from 'ant-design-vue';
import { useData } from 'vitepress'
const { isDark } = useData()
</script>
<br/>
<a-button>3213213</a-button>
<a-card title="内容摘要" :bordered="true" :hoverable="true">
    <p>本节主要介绍了如何安装 Ant Design Vue 并且进行暗黑模式适配。</p>
    <p>例如这个卡片就是使用 Ant Card 实现的内容。</p>
</a-card>