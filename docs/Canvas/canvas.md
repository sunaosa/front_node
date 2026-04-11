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

### 1.3 坐标系 (Coordinate System)

Canvas 使用的是 **默认的栅格坐标系统 (Grid)**，这与数学中的直角坐标系略有不同（Y轴方向相反）。

1.  **原点 (0, 0)**: 位于画布的**左上角**。
2.  **X 轴**: 水平向**右**延伸（正值向右）。
3.  **Y 轴**: 垂直向**下**延伸（正值向下）。
    *   *注意*: 这与常规数学坐标系（Y轴向上）是相反的！
4.  **单位**: 默认情况下，1个单位 = 1个屏幕像素。

**示意图**:
```
(0,0)  X轴 ----------> (+)
  |
  |    (x, y)
  |      +
  |
  v
 Y轴 (+)
```

> **进阶提示**: 虽然默认坐标系是固定的，但我们可以通过 `translate` (移动原点), `rotate` (旋转轴), `scale` (缩放网格) 来改变当前绘图上下文的坐标系。这就是为什么在前面的例子中 `translate(150, 0)` 能让原本画在 (50,50) 的三角形跑到右边的原因——实际上是**整个世界（坐标网格）**被移动了。

### 1.4 尺寸陷阱：Canvas 单位是 px 吗？
这又是一个常见面试坑点。

**答案**: 默认情况下，**1 单位 = 1 CSS 像素**。但是！Canvas 有两套“尺寸”：

1.  **画布尺寸 (Drawing Buffer Size)**:
    *   通过 `<canvas width="500" height="500">` 属性设置。
    *   这是画布实际拥有的**物理像素**数量（内存里的那张大白纸有多大）。
    *   **坐标系以此为准**。如果我们画 `ctx.rect(0,0,500,500)`，它会正好填满内存里的这张纸。

2.  **显示尺寸 (CSS Display Size)**:
    *   通过 CSS `style="width: 250px; height: 250px;"` 设置。
    *   这是画布在**屏幕上占据的区域**（浏览器把刚才那张纸缩放后贴在网页上）。

**如果两者不一致会发生什么？**
浏览器会自动缩放画布以适应 CSS 大小。
*   **例子**: 画布 `width=500`，CSS `width=250px`。
*   **结果**: 画布会被**缩小** 0.5 倍显示。
*   **此时单位**: 你在代码里写的 `100` 单位，在屏幕上看起来只有 `50px` 大。所有图形都会变清晰（也就是高清屏的处理原理）。
*   **反之**: 如果画布小，CSS 大，图形就会被**拉伸模糊** (马赛克)。

> **结论**: 坐标系的“单位”是相对于**画布尺寸**的。如果 CSS 尺寸等于画布属性尺寸，那么 1 单位 ≈ 1 屏幕像素。

## 2. 核心绘制 API

### 2.1 路径 (Path) 系统详解
Canvas 的绘图核心是 **路径 (Path)**。它更像是一个“图形录制”过程：先用代码“规划”好要画什么（录制路径），最后再决定是用线条画出来（stroke）还是填满颜色（fill）。

#### 1. 核心流程控制
-   **`beginPath()`**: **开启新篇章 (至关重要)**
    -   **作用**：清空之前的路径列表，开始绘制新的形状。
    -   **原理**：如果你不调用它，Canvas 会认为你想把新的线条和之前的线条连在一起。当你再次调用 `stroke()` 时，之前画过的所有线条都会被**重绘**一遍（导致颜色叠加变深、性能几何级下降）。
    -   *记忆*：每次画新图形前，第一件事就是 `beginPath()`。

-   **`closePath()`**: **自动闭合**
    -   **作用**：尝试从**当前点**画一条直线回到**当前路径的起始点**。
    -   **注意**：它**不是**结束绘制（那是 `stroke` 的事），它只是为了封闭形状（例如画了三边形的前两边，它帮你补第三边）。

#### 2. 移动与绘制
-   **`moveTo(x, y)`**: **提笔移动**
    -   **作用**：将“画笔”悬空移动到指定坐标 `(x, y)`，期间**不留痕迹**。
    -   **场景**：确定图形的起笔点，或者在一个画布上画多个不相连的图形时跳转。

-   **`lineTo(x, y)`**: **下笔划线**
    -   **作用**：从当前位置画一条直线到 `(x, y)`。
    -   **注意**：此时画布上还**没有任何东西**！这只是在内存里定义了一条线段的数据。

#### 3. 绘制圆弧 `arc`
-   **语法**：`ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)`
-   **参数关键**：
    -   `x, y`: 圆心坐标。
    -   `radius`: 半径。
    -   `startAngle`: **起始弧度**（0 是 3 点钟方向/x轴正方向）。
    -   `endAngle`: **结束弧度**。
    -   `anticlockwise`: （可选 bool）是否逆时针，默认为 `false`（顺时针）。
-   **难点 - 弧度制**：Canvas 不使用角度（0-360），而是弧度（0-2π）。
    -   **公式**：`弧度 = 角度 * Math.PI / 180`
    -   `Math.PI` = 180° (半圆)
    -   `2 * Math.PI` = 360° (整圆)
    -   `0.5 * Math.PI` = 90°

#### 4. 上色指令 (真正让图形显形)
-   **`stroke()`**: **描边**
    -   基于当前的 `strokeStyle`（颜色）、`lineWidth`（线宽）等样式，沿着刚才规划的路径画各种线条。
-   **`fill()`**: **填充**
    -   基于当前的 `fillStyle`，将路径内部区域填满颜色。
    -   **注意**：如果有未闭合的路径，`fill()` 会**自动**将其闭合（就像调用了 `closePath` 一样）然后填充，但 `stroke()` 不会帮你闭合。

#### 📝 代码示例
```javascript
const ctx = canvas.getContext('2d');

// 1. 绘制蓝色三角形 (描边)
ctx.beginPath();           // 必须！清空路径
ctx.moveTo(50, 50);        // 起点
ctx.lineTo(150, 50);       // 线条1
ctx.lineTo(100, 150);      // 线条2
ctx.closePath();           // 闭合路径（自动画线条3回到起点）
ctx.lineWidth = 5;
ctx.strokeStyle = 'blue';
ctx.stroke();              // 真正绘制出来！

// 2. 绘制红色圆形 (填充)
ctx.beginPath();           // 必须！否则会把上面的三角形重画一遍
// x=250, y=100, 半径=40, 0~2PI(整圆)
ctx.arc(250, 100, 40, 0, 2 * Math.PI); 
ctx.fillStyle = 'red';
ctx.fill();                // 填充颜色！
```
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

#### ❓ 疑问：真的要“全部”重画吗？
**是的，通常情况下是全部重画。**

这是 Canvas **即时模式** 的核心特征。
1.  **为什么？**
    *   Canvas 不知道“圆形”移动了，它只知道那里有一堆红色的像素。
    *   如果你只画新位置的圆，旧位置的圆（残影）还在那里。
    *   如果你擦掉旧位置的圆（`clearRect`），那么旧位置下面的**背景图片**或其他图形也会被擦掉，变成透明的。
    *   **结论**：为了画面正确，最简单的做法就是：**清空整个画布 -> 画背景 -> 画所有物体的新位置**。
2.  **这性能扛得住吗？**
    *   Canvas 渲染速度极快（GPU 加速），对于几千个简单图形，每秒 60 帧全量重绘毫无压力。
3.  **怎么优化？** (如果实在画不动了)
    *   **分层渲染**: 静态背景画在一个 canvas 上，动的物体画在另一个透明 canvas 上（只重绘上层）。
    *   **脏矩形 (Dirty Rectangle)**: 只算出发生变化的局部区域，只擦除和重绘那一小块（算法复杂，引擎常用）。

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

### 5.1 图形复用方案性能大比拼 (实战推荐)

在开发中复用图形（如粒子系统、游戏角色）时，性能从高到低排序：

1.  **👑 王者方案: Path2D 对象 + 坐标变换 (translate)**
    *   **原理**: 路径只被“录制”和解析一次 (构造函数里)，绘制时直接调用缓存的路径数据，配合 `translate` 移动视图。
    *   **适用**: 形状固定、只是位置/角度/缩放改变的物体 (如子弹、小行星)。
    *   **性能**: ⭐⭐⭐⭐⭐ (最快，极大减少 CPU 解析路径的时间)。

2.  **🥈 标准方案: 离屏 Canvas (Offscreen)**
    *   **原理**: `path` 太复杂（如带阴影、渐变的复杂矢量图）时，先把它画在一个看不见的小 canvas 上（变成一张位图），然后用 `drawImage` 贴图。
    *   **适用**: 极其复杂的静态图形，或者需要频繁绘制的文本。
    *   **性能**: ⭐⭐⭐⭐ (位图光栅化通常比实时画矢量图快，但有内存开销)。

3.  **🥉 简单方案: 函数封装 (立即绘制)**
    *   **原理**: 每次调用函数，CPU 都要重新计算所有点坐标 -> `moveTo` -> `lineTo`。
    *   **适用**: 形状本身会变形的物体 (如波浪、史莱姆)，或者非常简单的图形 (只有3-4个点)。
    *   **性能**: ⭐⭐⭐ (最慢，但对于简单图形差异不明显)。

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

```js
export class CanvasDemo {
    private ctx: CanvasRenderingContext2D | null = null;
    // 方式1：使用 Path2D 对象存储路径 (推荐用于复用复杂路径)
    private trianglePath: Path2D = new Path2D();
    
    // 动画状态
    private x = 0;
    private speed = 2;
    private animationId: number | null = null;
    private width = 0;
    private height = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.initPath();
    }

    private initPath() {
        // 初始化三角形路径一次
        this.trianglePath.moveTo(50, 50);
        this.trianglePath.lineTo(150, 50);
        this.trianglePath.lineTo(100, 150);
        this.trianglePath.closePath();
    }

    /**
     * 启动动画循环
     */
    public animate() {
        if (!this.ctx) return;
        
        const loop = () => {
            // ❌ 方案1 (全量清除): 简单粗暴，但会把背景也擦掉，需要重绘背景
            // this.ctx!.clearRect(0, 0, this.width, this.height);

            // ✅ 方案2 (局部擦除 - 脏矩形): 只擦掉上一帧的紫色方块位置
            // 注意：这里擦的是上一帧的位置（还没有加 speed 之前的位置）
            // 缺点：擦除后那一块变透明了，如果下面有背景图，背景图就破了个洞
            // 但如果下面是纯白背景，这样做性能最高！
            
            // 擦除上一帧的位置 (如果不擦，就会变成长长的贪吃蛇)
            // 稍微扩大一点范围(x-1, width+2)防止留下细微残影
            this.ctx!.clearRect(50 + this.x - 1, 200 - 1, 50 + 2, 50 + 2);

            // 2. 更新状态
            this.x += this.speed;
            if (this.x > this.width - 50 || this.x < 0) {
                this.speed = -this.speed;
            }

            // 3. 只重绘紫色方块 (静态背景不用动！)
            this.ctx!.fillStyle = 'purple';
            this.ctx!.fillRect(50 + this.x, 200, 50, 50);

            // 4. 循环
            this.animationId = requestAnimationFrame(loop);
        };
        
        // 先画一次静态背景 (只画一次！以后再也不用重绘了)
        this.ctx.clearRect(0, 0, this.width, this.height); // 先全清空一次
        this.drawStaticBackground(); // 画背景

        loop();
    }

    public stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * 将原来的 drawFrame 拆分
     * 专门画不动的背景
     */
    private drawStaticBackground() {
        if (!this.ctx) return;

        // --- 1. 原地复用路径 (蓝三角) ---
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = 'blue';
        this.ctx.stroke(this.trianglePath);

        // --- 2. 异地复用 (绿三角) ---
        this.ctx.save();
        this.ctx.translate(150, 0); 
        this.ctx.fillStyle = 'green';
        this.ctx.fill(this.trianglePath);
        this.ctx.restore();

        // --- 3. 函数封装 (橙三角) ---
        this.drawCustomTriangle(350, 50, 'orange');

        // --- 4. 红圆 ---
        this.ctx.beginPath();
        this.ctx.arc(550, 100, 40, 0, 2 * Math.PI); 
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
    }

    // 保留给外部调用看初始状态用
    public draw() {
        this.drawStaticBackground();
        // 画个初始位置的方块
        this.ctx!.fillStyle = 'purple';
        this.ctx!.fillRect(50, 200, 50, 50);
    }

    /**
     * 方式3：函数封装
     * 适合需要动态改变参数(如大小、坐标)的情况
     */
    private drawCustomTriangle(x: number, y: number, color: string) {
        if (!this.ctx) return;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x + 100, y);
        this.ctx.lineTo(x + 50, y + 100);
        this.ctx.closePath();
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }
}
```
<preview path="./components/canvas.vue"></preview>
