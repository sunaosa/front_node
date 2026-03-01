# React

## JSX和JS区别

JSX是由Facebook提出的规范，允许在JS中使用HTML的标记。

不限于在React中使用，通过Babel可转换成JS语法。

```js
// JSX - 自定义组件
<MyComponent name="Alice" age={25} />

// 转换为 (注意:组件名是变量,不是字符串)
React.createElement(MyComponent, {
  name: 'Alice',
  age: 25
})

// JSX Fragment - 避免额外的DOM节点
<>
  <div>Item 1</div>
  <div>Item 2</div>
</>

// 转换为
React.createElement(React.Fragment, null,
  React.createElement('div', null, 'Item 1'),
  React.createElement('div', null, 'Item 2')
)
```

## useState

### useState的批量更新机制

在React中，以下情况会将所有的setState收集放入各自hook的队列。待所有收集完毕时，一次性执行，一批更新只会导致函数组件重新渲染一次。**以下情况下会进行批处理：**

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

**React 17 中的手动批处理：**

在React 17中，如果需要在异步代码中实现批处理，可以使用`unstable_batchedUpdates`：

```js
import { unstable_batchedUpdates } from 'react-dom';

setTimeout(() => {
  unstable_batchedUpdates(() => {
    setCount(c => c + 1);
    setFlag(f => !f);
    // 这两个更新会被批处理，只触发一次渲染
  });
}, 1000);
```

【注】除以上批处理情况外，StrictMode 也会导致渲染两次，这是该标签在开发环境中的预期行为。

| ✅ 发现不纯的组件      | ❌ console.log 输出两次 |
| --------------------- | ---------------------- |
| ✅ 检测过时的 API      | ❌ useEffect 执行两次   |
| ✅ 提前发现副作用问题  | ❌ API 请求发送两次     |
| ✅ 为 React 18+ 做准备 | ❌ 调试时看到双重行为   |
| ✅ 只在开发环境生效    | ❌ 初学者容易困惑       |

### 函数式更新 vs 直接更新

在React中由于批量更新机制，state变量在一次渲染中是闭包捕获的值，永远读取的是当前渲染时的快照值，只有在下一次渲染时才会更新为新值。

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

### useState在Fiber中的执行

在React中，每个函数组件都有一个完整的Fiber节点。Fiber通过fiber.memoizedState作为链表的头节点，根据hook创建顺序形成一个单向链表。

每个hook都有以下属性：

- `queue`：执行队列
- `next`：指向下一个hook
- `memoizedState`：当前状态值

如下：

```js
fiber.memoizedState -> hook1 -> hook2 -> ...


// 基本代码实现
function Hook(initial) {
    this.memoizedState = initial;   // 当前 state 值（useState 返回的值）
    this.queue = { pending: null }; // 更新循环链表（setState 入队）
    this.next = null;               // 指向下一个 hook
}

const firstHook = new Hook(0);
const secondHook = new Hook('A');
firstHook.next = secondHook;

const fiber = { memoizedState: firstHook }; // fiber.memoizedState -> firstHook

console.log(fiber.memoizedState.memoizedState); // 0
console.log(fiber.memoizedState.next.memoizedState); // 'A'
```

所以当调用setState时，实际流程是：update加入队列 → 触发重新render → render时根据fiber依次处理每个hook的队列并清空。

**为什么不能在条件语句中使用Hook？**

由于Hook是通过链表顺序来维护状态的，React依赖Hook的调用顺序来正确匹配state。如果在条件语句中使用Hook，会破坏链表结构：

```js
// ❌ 错误示例
function Component({ condition }) {
  if (condition) {
    const [count, setCount] = useState(0); // 条件性调用会破坏顺序
  }
  const [name, setName] = useState(''); // 链表位置不固定
}

// ✅ 正确示例
function Component({ condition }) {
  const [count, setCount] = useState(0); // 始终调用
  const [name, setName] = useState('');  // 顺序固定
  
  if (condition) {
    // 可以在这里使用count
  }
}
```

这就是React的两大Hook规则之一：**只在函数组件顶层调用Hook，不要在循环、条件或嵌套函数中调用。**

*【注意】为什么多次调用`setCount(count + 1)`最后只加了1？因为批处理只是收集更新操作，每次传入的都是同一个闭包中的count值（如0），所以实际都是`setCount(0 + 1)`，最终结果为1。要实现累加，应使用函数式更新`setCount(prev => prev + 1)`。*

