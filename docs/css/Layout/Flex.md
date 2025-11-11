## Flex 布局（弹性盒）笔记

### 简介
Flex（Flexible Box）是一种用于在容器中分配空间并对齐项目的 CSS 布局模块。它可以简化常见的响应式布局问题，例如垂直居中、等间距分布和可伸缩的网格。

适用场景：导航栏、工具栏、水平/垂直列表、响应式卡片/缩略图布局等。

### 基本概念
- 容器（flex container）：设置了 `display: flex` 或 `display: inline-flex` 的元素。
- 项目（flex items）：容器的直接子元素，参与弹性布局。

容器为主轴（main axis）和交叉轴（cross axis）。默认主轴为水平方向（从左到右），交叉轴为垂直方向。

### 容器常用属性
- display: flex | inline-flex
- flex-direction: row | row-reverse | column | column-reverse  （主轴方向）
- flex-wrap: nowrap | wrap | wrap-reverse （是否换行）
- justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly （沿主轴对齐）
- align-items: stretch | flex-start | flex-end | center | baseline （沿交叉轴对齐，影响单行内项目）
- align-content: stretch | flex-start | flex-end | center | space-between | space-around （多行时控制行与行之间的对齐）
- gap / row-gap / column-gap: 控制项目间距（现代替代 margin 调整）

### 项目（子元素）常用属性
- order: 数字，控制项目的视觉顺序（默认 0，越小越靠前）
- flex-grow: 放大比例，决定剩余空间如何分配（默认为 0）
- flex-shrink: 缩小比例，当空间不足时如何收缩（默认为 1）
- flex-basis: 项目的初始主轴大小（可用 px / % / auto）
- 简写：flex: [flex-grow] [flex-shrink] [flex-basis]
- align-self: auto | stretch | flex-start | flex-end | center | baseline （覆盖容器的 align-items，用于单个项目）

### 常见组合与使用场景

1) 水平导航（左中右三列）

示例：一行三部分，左/右固定，中央自动占满并水平居中内容。

```html
<!-- HTML -->
<nav class="nav">
	<div class="nav-left">Logo</div>
	<div class="nav-center">菜单</div>
	<div class="nav-right">按钮</div>
</nav>

/* CSS */
.nav { display: flex; align-items: center; gap: 12px; padding: 12px; }
.nav-left { flex: 0 0 auto; }
.nav-center { flex: 1 1 auto; text-align: center; }
.nav-right { flex: 0 0 auto; }
```

说明：`.nav-center` 使用 `flex: 1` 拉伸占据中间剩余空间；左右元素不伸缩。

2) 纵向列布局（页面布局常见）

示例：让某一列随窗口高度伸展（如侧栏 + 主内容）。

```html
<div class="layout">
	<aside class="sidebar">侧栏</aside>
	<main class="content">主内容</main>
</div>

/* CSS */
.layout { display: flex; height: 100vh; }
.sidebar { width: 240px; flex-shrink: 0; background: #f5f5f5; }
.content { flex: 1 1 auto; overflow: auto; padding: 16px; }
```

3) 居中（水平与垂直居中）

最常见用途：把一个子元素在父容器中完全居中。

```html
<div class="box">
	<div class="center">居中内容</div>
</div>

/* CSS */
.box { display: flex; justify-content: center; align-items: center; height: 200px; background: #eee; }
.center { padding: 12px 20px; background: #fff; border-radius: 6px; }
```

4) 响应式换行的画廊/卡片布局

使用 `flex-wrap: wrap` 与 `gap` 可以方便地实现类似 Masonry 的网格（非等高时可配合列或 JS）。

```html
<div class="gallery">
	<div class="card">1</div>
	<div class="card">2</div>
	<div class="card">3</div>
	<div class="card">4</div>
	<div class="card">5</div>
</div>

/* CSS */
.gallery { display: flex; flex-wrap: wrap; gap: 12px; }
.card { flex: 1 1 200px; min-width: 150px; background:#fff; padding:12px; box-shadow:0 1px 3px rgba(0,0,0,.08); }
```

说明：`.card` 使用 `flex-basis: 200px` 作为首选宽度，`flex-grow:1` 允许放大填充行内剩余空间，`min-width` 防止太小。

### 进阶提示与常见坑
- 默认情况下 `align-items: stretch` 会把子元素在交叉轴拉伸至相同高度，如果不希望被拉伸，请设置 `align-items: flex-start` 或给子元素 `align-self`。
- 使用 `gap` 比在子元素上用 margin 更干净；当需要兼容老旧浏览器（例如旧版 IE），可能需要回退方案。
- `flex` 的简写顺序重要：`flex: 1` 实际上等同于 `flex: 1 1 0%`（在现代浏览器中），但也可以明确写成 `flex: 1 0 auto` 等。
- 当使用百分比宽度或高度时，注意父元素是否有确定的尺寸（例如 height 需要父高度确定才有效）。

### 小结
Flex 是一个非常强大的布局工具，适合一维布局（单行或单列）。对于复杂的二维网格（行与列都需要控制），建议考虑 CSS Grid。实际开发中，常把 Flex 与媒体查询结合用于响应式布局。

---


