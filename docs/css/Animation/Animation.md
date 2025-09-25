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
| animation-timing-function | 动画时间函数 | **linear**: 匀速<br>**ease**: 慢速开始，然后变快，然后慢速结束<br>**ease-in**: 慢速开始<br>**ease-out**: 慢速结束<br>**ease-in-out**: 慢速开始和结束<br>**cubic-bezier(x1, y1, x2, y2)**: 自定义贝塞尔曲线 | ease | ❌ |
| animation-delay | 动画延迟时间 | 时间值（s/ms），可为负值 | 0s | ❌ |
| animation-iteration-count | 动画重复次数 | **数字**: 指定播放次数，小数时播放到指定比例<br>**infinite**: 无限循环 | 1 | ❌ |
| animation-direction | 动画播放方向 | **normal**: 正常播放<br>**reverse**: 反向播放<br>**alternate**: 交替播放（正向→反向→正向...）<br>**alternate-reverse**: 反向交替播放（反向→正向→反向...） | normal | ❌ |
| animation-fill-mode | 动画填充模式 | **none**: 执行前不改变元素样式，动画结束后元素回到初始状态<br>**forwards**: 保持动画结束时的状态<br>**backwards**: 在动画延迟期间，应用动画开始时的状态<br>**both**: 同时应用 forwards 和 backwards 的效果 | none | ❌ |
| animation-play-state | 动画播放状态 | **running**: 播放动画<br>**paused**: 暂停动画 | running | ❌ | 
#### 使用
<preview path="./components/cssAnimation.vue"></preview>
### Transition(过度)

## JS动画 

## SVG动画

## Canvas动画

## WebGL动画
