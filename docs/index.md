---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "十二个人博客"
  text: "把学到的前端知识，整理成体系化的笔记"
  tagline: "CSS · React · 可视化绘图 · 工程架构 · 性能优化，记录前端进阶路上的每一步"
  actions:
    - theme: brand
      text: 开始阅读
      link: /css/Animation/Animation
    - theme: alt
      text: 绘图实战
      link: /Canvas/canvas
    - theme: alt
      text: GitHub
      link: https://github.com/sunaosa/front_node
      target: _blank

features:
  - icon: 🎨
    title: CSS 基础
    details: Animation 动画、Grid / Flex 布局等核心知识点与实战案例
    link: /css/Animation/Animation
    linkText: 查看笔记
  - icon: ⚛️
    title: React
    details: 渲染流程、Hooks 原理解析，以及可在线运行的原生 React Demo
    link: /React/react
    linkText: 查看笔记
  - icon: 🖌️
    title: Canvas / SVG
    details: 两种主流前端绘图方式的使用场景与实现细节
    link: /Canvas/canvas
    linkText: 查看笔记
  - icon: 🧊
    title: WebGL / Three.js
    details: 3D 渲染入门，以及合并几何体、实例化等模型性能优化实践
    link: /WebGL/webgl
    linkText: 查看笔记
  - icon: 🏗️
    title: 架构 / Monorepo
    details: Lerna + Monorepo 多包管理与前端工程化实践
    link: /Architecture/monorepo
    linkText: 查看笔记
  - icon: ⚡
    title: 性能优化
    details: Web Worker 多线程等页面性能提升方案
    link: /Optimization/Worker/worker
    linkText: 查看笔记
---
