## CSS动画
---
### Keyframes Animation（关键帧动画）
**介绍：** CSS Keyframes Animation（关键帧动画）是CSS3中最强大的动画功能之一，它允许你创建复杂的多步骤动画效果。

#### 实现
1. 定义动画（关键帧）
```css
@keyframes animation-name {
    /**比例自定义 */
    0% { /**起始状态 */ }
    50% { /**中间状态 */ }
    100% {/**结束状态 */}
}

@keyframes animation-name {
    /**比例自定义 */
    from { /**起始状态 */ }
    to { /**结束状态 */ }
}
```

2. 使用动画
```js
.element {
  animation: animation-name duration timing-function delay iteration-count direction fill-mode play-state;
}
```
| 属性 | 描述 | 可选值 | 默认值 | 必选 |
|------|------|--------|--------|------|
| animation-name | 动画名称 | @keyframes定义的名称 | none | ✅ |
| animation-duration | 动画持续时间 | 时间值（s/ms） | 0s | ✅ |
| animation-timing-function | 动画时间函数 | **linear**: 匀速<br>**ease**: 慢速开始，然后变快，然后慢速结束(慢 -> 快 -> 慢)<br>**ease-in**: 慢速开始(慢 -> 快)<br>**ease-out**: 慢速结束(快 -> 慢)<br>**ease-in-out**: 慢速开始和结束(相对ease加速减速更平缓)<br>**cubic-bezier(x1, y1, x2, y2)**: 自定义贝塞尔曲线 | ease | ❌ |
| animation-delay | 动画延迟时间 | 时间值（s/ms），可为负值 | 0s | ❌ |
| animation-iteration-count | 动画重复次数 | **数字**: 指定播放次数，小数时播放到指定比例<br>**infinite**: 无限循环 | 1 | ❌ |
| animation-direction | 动画播放方向 | **normal**: 正常播放<br>**reverse**: 反向播放<br>**alternate**: 交替播放（正向→反向→正向...）<br>**alternate-reverse**: 反向交替播放（反向→正向→反向...） | normal | ❌ |
| animation-fill-mode | 动画填充模式 | **none**: 执行前不改变元素样式，动画结束后元素回到初始状态<br>**forwards**: 保持动画结束时的状态<br>**backwards**: 执行前，应用第一帧样式<br>**both**: 同时应用 forwards 和 backwards 的效果 | none | ❌ |
| animation-play-state | 动画播放状态 | **running**: 播放动画<br>**paused**: 暂停动画 | running | ❌ | 
#### 使用
<preview path="./components/cssAnimation.vue"></preview>
### Transition(过度)
**介绍：** CSS Transition（过渡）是一种CSS3特性，它允许CSS属性值在指定的持续时间内平滑地从一个值变化到另一个值，创造出流畅的动画效果。

#### 实现
```css
.element {
  transition: property duration timing-function delay;
}

/* 或者分别设置 */
.element {
  transition-property: property;
  transition-duration: duration;
  transition-timing-function: timing-function;
  transition-delay: delay;
}
```

| 属性 | 描述 | 可选值 | 默认值 | 必选 |
|------|------|--------|--------|------|
| transition-property | 指定过渡的CSS属性 | **all**: 所有属性<br>**none**: 无属性<br>**specific**: 具体属性名（如width, height, color等） | all | ✅ |
| transition-duration | 过渡持续时间 | 时间值（s/ms） | 0s | ✅ |
| transition-timing-function | 过渡时间函数 | **linear**: 匀速<br>**ease**: 慢速开始，然后变快，然后慢速结束<br>**ease-in**: 慢速开始<br>**ease-out**: 慢速结束<br>**ease-in-out**: 慢速开始和结束<br>**cubic-bezier(x1, y1, x2, y2)**: 自定义贝塞尔曲线 | ease | ❌ |
| transition-delay | 过渡延迟时间 | 时间值（s/ms），可为负值 | 0s | ❌ |

#### 使用示例
```css
/* 基础用法 */
.button {
  background-color: #3498db;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: #e74c3c;
}

/* 多属性过渡 */
.box {
  width: 100px;
  height: 100px;
  background-color: blue;
  transition: width 0.3s ease, height 0.3s ease, background-color 0.5s linear;
}

.box:hover {
  width: 200px;
  height: 200px;
  background-color: red;
}

/* 全部属性过渡 */
.card {
  transform: scale(1);
  opacity: 1;
  transition: all 0.3s ease-in-out;
}

.card:hover {
  transform: scale(1.1);
  opacity: 0.8;
}
```

#### 注意事项
- 只有数值型属性才能使用过渡效果（如：width, height, color, opacity等）
- display属性不能使用过渡，可以使用visibility或opacity替代
- 过渡需要触发条件（如:hover, :focus, 类名变化等）
- 性能考虑：transform和opacity的过渡性能最好
<preview path="./components/cssTransition.vue"></preview>

## JS动画 
### 概念
在浏览器中，由浏览器渲染引擎或脚本代码驱动，以每秒60帧的速度通过不断改变页面元素的视觉属性（如位置、大小、颜色、透明度等），使页面呈现出随时间变化的动态效果的过程。

`js动画`即通过js结合定时器或者requestAnimationFrame来实现在每帧切换元素的位置形态等。
### 为什么需要Js动画
css动画可以满足大部分场景，但对于更复杂的场景时，需要更灵活的控制，此时可以通过特定算法自定义所需要动画。
### 案例
<preview path="./components/jsAnimation.vue"></preview>

## SVG动画
### 概念
使用svg 实现动画效果，详见: [SVG](../../SVG/svg.md)
## Canvas动画
### 概念
使用canvas实现动画效果，详见[Canvas](../../Canvas/canvas.md)
## WebGL动画
### 概念
使用WebGl实现动画效果，详见[WebGL](../../WebGL/webgl.md)
