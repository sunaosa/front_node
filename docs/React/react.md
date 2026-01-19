# React

## JSX和JS区别

jsx是由facebook提出的规范，允许在js中使用html的标记。

支持在不限于React中使用。通过babel可转换成js语法。

```js
// JSX - 自定义组件
<MyComponent name="Alice" age={25} />

// 转换为 (注意:组件名是变量,不是字符串)
React.createElement(MyComponent, {
  name: 'Alice',
  age: 25
})
```

## useState

### useState的批量更新机制

在React中以下情况中，会将所有的setState收集放入对列。待所有收集完毕时，一次性执行，每个对列只会导致函数组件重新渲染一次。

| 场景                      | React 17   | React 18 (createRoot) | 说明             |
| ------------------------- | ---------- | --------------------- | ---------------- |
| **onClick 等 React 事件** | ✅ 批量     | ✅ 批量                | 同步代码块       |
| **setTimeout**            | ❌ 不批量   | ✅ 批量                | 异步宏任务       |
| **setInterval**           | ❌ 不批量   | ✅ 批量                | 异步宏任务       |
| **Promise.then**          | ❌ 不批量   | ✅ 批量                | 异步微任务       |
| **async/await**           | ❌ 不批量   | ✅ 批量                | 异步微任务       |
| **原生事件监听器**        | ❌ 不批量   | ✅ 批量                | addEventListener |
| **requestAnimationFrame** | ❌ 不批量   | ✅ 批量                | 动画帧           |
| **flushSync 包裹**        | ❌ 强制同步 | ❌ 强制同步            | 立即更新         |

【注】除以上会导致多次渲染外，StrictMode 也会导致渲染两边，项目中需做判断，该标签作用。

| ✅ 发现不纯的组件      | ❌ console.log 输出两次 |
| --------------------- | ---------------------- |
| ✅ 检测过时的 API      | ❌ useEffect 执行两次   |
| ✅ 提前发现副作用问题  | ❌ API 请求发送两次     |
| ✅ 为 React 18+ 做准备 | ❌ 调试时看到双重行为   |
| ✅ 只在开发环境生效    | ❌ 初学者容易困惑       |

### 函数式更新 vs 直接更新

在React中由于批量更新原因，定义的字段是个闭包的字段一次渲染中永远读取的是当前渲染的值，一般等到下一次渲染时才会更新对应值。

一般情况下：

函数式更新需要用到前一次计算值的时候使用；

```js
const [count, setCount] = useState(0);

function handleClick() {
  console.log('1. 点击前 count:', count); // 0
  
  setCount(prev => prev + 1);
  setCount(prev => prev + 1);
  
  console.log('2. setState后 count:', count); // 还是 0！
  
  // 此时：
  // - count 还是 0（旧值）
  // - React 只是记录了"要更新到 2"
  // - 还没重新渲染
  // 异步重新渲染之后count赋予2
}
```

直接更新一般赋予一个固定值时使用

```js
const [flag, setFlag] = useState(false);

function handleClick() {
  console.log(flag); // false
  setFlag(true)
  
  console.log(flag); // 还是 false！
  
  // 此时：
  // - flag仍然是false，还没有重新渲染
  // 渲染后变为true
}
```

