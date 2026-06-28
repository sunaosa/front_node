# React Demo 演示

::: details 环境变量
```ts
VITE_REACT_DEMO = ${import.meta.env.VITE_REACT_DEMO}
```
:::

<iframe :src="reactDemoUrl" width="1000px" height="600px" frameborder="0"></iframe>

<script setup>
const reactDemoUrl = import.meta.env.VITE_REACT_DEMO
console.log('VITE_REACT_DEMO:', reactDemoUrl)
</script>