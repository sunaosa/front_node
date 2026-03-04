# Canvas 学习大纲与面试指南

## 1. 基础认知

### 1.1 Canvas 是什么
Canvas 是 HTML5 新增的元素，用于通过 JavaScript 脚本来绘制图形。默认大小 300x150。它提供了一个**即时模式（Immediate Mode）**的图形系统 - 意味着一旦绘制完成，浏览器就会忘记该图形，所有后续修改都需要重绘。

### 1.2 Canvas vs SVG (面试高频)

这是面试中最常问的图形学对比题。

| 特性 | Canvas | SVG |
| :--- | :--- | :--- |
| **本质** | **位图** (基于像素) | **矢量图** (基于形状) |
| **模式** | 即时模式 (无状态) | 保留模式 (DOM 节点) |
| **事件处理器** | 不支持 (只能监听整个 canvas 元素的事件) | 支持 (每个 SVG 元素都是 DOM，可直接绑定事件) |
| **性能瓶颈** | 受**分辨率**影响大 (像素越多越慢) | 受**对象数量**影响大 (DOM 越多越慢) |
| **适用场景** | 游戏、大量数据可视化(如热力图)、图像处理、粒子效果 | 图标、地图(交互强)、高保真文档、常规图表 |
| **缩放** | 放大后失真 (像素化) | 放大后不失真 |

## 2. 核心绘制 API

### 2.1 路径 (Path) 系统
Canvas 的绘图核心是路径。
- `beginPath()`: 开始一条新路径（清空之前的路径列表）。
- `closePath()`: 闭合路径（将终点与起点连接）。
- `moveTo(x, y)`: 移动画笔。
- `lineTo(x, y)`: 绘制直线。
- `arc(x, y, r, startAngle, endAngle)`: 绘制圆弧。
- `stroke()` / `fill()`: 真正的绘制指令。

### 2.2 图片操作 `drawImage` (重点)

`ctx.drawImage()` 是 Canvas 中最通用的搬运工，它可以将**图像源**绘制到画布上。
**支持的数据源**：`HTMLImageElement` (img标签/new Image), `HTMLVideoElement` (视频帧), `HTMLCanvasElement` (另一个canvas), `ImageBitmap`。

该方法有三种使用模式，参数数量不同，功能也从简单到复杂：

#### 1. 基础定位绘制 (3参数)
`ctx.drawImage(image, dx, dy)`
*   **做了啥**：把**整张图**原封不动地画在画布的 `(dx, dy)` 坐标处。
*   **大小**：图片保持原始自然宽度和高度。
*   **场景**：简单的贴图、背景图绘制。

#### 2. 缩放绘制 (5参数)
`ctx.drawImage(image, dx, dy, dWidth, dHeight)`
*   **做了啥**：把**整张图**画在画布上，但是强制拉伸/压缩到指定的大小 `dWidth` x `dHeight`。
*   **大小**：图片会变形以适应你指定的宽。
*   **场景**：生成缩略图、背景填充满画布、简单的图片尺寸调整。

#### 3. 切片/剪裁绘制 (9参数) - 面试与实战核心
`ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)`
这是最强大但也最容易晕的模式。
*   **记忆口诀**：**"先看原图剪哪里(Source)，再看画布画哪里(Destination)"**。
*   **参数详解**：
    *   `sx, sy`: **源图起点**。从原图片的哪个坐标开始切。
    *   `sWidth, sHeight`: **源图尺寸**。在原图上切多大的一块区域。
    *   `dx, dy`: **画布起点**。切下来的这块，放在画布的哪里。
    *   `dWidth, dHeight`: **画布尺寸**。切下来的这块，在画布上要显示多大（支持缩放）。
*   **做了啥**：它像这把剪刀，先从原图剪下一块矩形，然后像贴纸一样贴（可能还会拉伸）到画布指定位置。
*   **场景**：
    *   **雪碧图 (Sprite)**：游戏中常见，一张大图里塞满了角色的跑、跳、攻击动作。通过改变 `sx, sy` 就可以让角色动起来。
    *   **局部放大镜**：截取图片一小块，画到一个大区域里。

#### ⚠️ 实战中的坑与面试点：
1.  **异步加载问题 (必考)**：
    *   `drawImage` 是同步的，但图片加载是异步的。如果不等图片加载完直接画，画布是白色的且不报错。
    *   **正确写法**：
        ```javascript
        const img = new Image();
        img.src = 'hero.png';
        // 一定要在 onload 回调里画！
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
        ```
2.  **图片跨域 (Tainted Canvas)**:
    *   如果绘制的图片来自不同域且未开启 CORS，调用 `toDataURL` 或 `getImageData` 会报错 `SecurityError`。
    *   *解法*：服务端设置 CORS头，前端 img 设置 `crossOrigin = 'anonymous'`。

3.  **性能细节**：
    *   在动画循环里 `new Image()` 是大忌。应该在外面创建好 img 对象，循环里只调 drawImage。

### 2.3 像素级操作 (ImageData)
*   **API**: `getImageData(x, y, w, h)`, `putImageData(imageData, x, y)`.
*   **数据结构**: 返回的 `data` 是一个 `Uint8ClampedArray`，每4个位置代表一个像素 (R, G, B, A)。
*   **应用**: 滤镜(灰度、反色)、拾色器、绿幕抠图。
*   **性能**: `getImageData` 非常消耗性能（通常会导致 GPU 到 CPU 的数据回读），动画循环中应避免频繁调用。

## 3. 变换与状态管理

### 3.1 状态栈 (`save` / `restore`)
Canvas 的状态（State）包括：当前的颜色、线宽、变换矩阵、裁剪区域等。
*   `ctx.save()`: 将当前状态推入栈中。
*   `ctx.restore()`: 弹出栈顶状态。

**面试考点**：为什么要用 save/restore？
*   答：在进行 `translate`/`rotate` 等变换或修改全局样式（如 `globalAlpha`）前保存状态，绘制结束后恢复，防止污染后续图形的绘制环境。

### 3.2 坐标变换
*   `translate(x, y)`: 移动原点。
*   `rotate(angle)`: 旋转坐标系 (注意是绕原点旋转，通常需配合 translate 实现中心旋转)。
*   `scale(x, y)`: 缩放。

## 4. 交互与动画

### 4.1 动画循环
*   **推荐**: `window.requestAnimationFrame(callback)`。
*   **流程**: 清除 (`clearRect`) -> 更新状态 -> 绘制 -> 请求下一帧。

### 4.2 交互事件 (难点)
**问题**: Canvas 里的画了一个圆，怎么知道用户点击了这个圆？
1.  **几何计算法**: 算出鼠标点到圆心的距离是否小于半径。适合简单图形。
2.  **API 判断法**: `ctx.isPointInPath(x, y)`。判断点是否在当前构建的路径内。
3.  **颜色索引法 (Color Picking)**:
    *   在离屏 Canvas 上用不同颜色绘制每个图形（颜色值对应图形 ID）。
    *   用户点击时，在离屏 Canvas 对应坐标获取像素颜色 `getImageData`。
    *   根据颜色解析出 ID。适合复杂且数量非常多的图形。

## 5. 性能优化 (进阶必问)

1.  **离屏渲染 (Offscreen Rendering)**:
    *   创建一个内存中的 canvas (`document.createElement('canvas')`) 预先绘制好复杂的静态图形。
    *   主画布渲染时直接 `drawImage` 这个离屏 canvas。
2.  **分层渲染 (Layering)**:
    *   背景层（静态）用一个 `<canvas>`，前景层（动画）用另一个 `<canvas>` 覆盖在上面。避免背景频繁重绘。
3.  **避免浮点数坐标**:
    *   使用 `Math.floor()` 取整。浮点数会导致抗锯齿运算，增加 GPU 负担且可能让线条模糊。
4.  **视口裁剪 (Culling)**:
    *   只绘制在屏幕可视范围内的图形。
5.  **减少 API 调用**:
    *   比如画 1000 条同色直线，应该 `beginPath` -> 循环 `moveTo/lineTo` -> 最后一次性 `stroke`，而不是循环 `stroke`。

## 6. 一些特定的面试题积累

1.  **如何解决 Canvas 在高清屏 (Retina) 下模糊的问题？**
    *   *原理*：`devicePixelRatio` (DPR)。
    *   *解法*：将 canvas 的 `width/height` (画布分辨率) 设置为 `CSS 宽高 * DPR`，然后通过 `scale(DPR, DPR)` 缩放上下文，或者 CSS 强行指定显示大小。

2.  **Canvas 如何实现撤销/重做 (Undo/Redo)？**
    *   *快照法*：用 `getImageData` 保存每一步的历史记录（内存占用大）。
    *   *命令模式*：记录每一步的绘图指令（数据+操作），重做时清空画布重新执行指令数组（性能好，适合长时间操作）。

3.  **常见前端应用**
    *   **ECharts/AntV**: 底层渲染引擎 (ZRender)。
    *   **html2canvas**: DOM 转图片截图。
    *   **图片压缩**: `canvas.toDataURL('image/jpeg', 0.5)`。
    *   **签名板**: 记录鼠标轨迹并绘制。
