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


## useEffect
`useEffect` 是 React 中用于处理**副作用（Side Effects）**的 Hook。

在 React 中，主要的渲染任务是单纯地根据 `props` 和 `state` 计算并返回 UI。而那些与 UI 渲染无关的额外操作（例如：发起网络请求、直接操作 DOM、设置定时器、订阅事件等）都被称为**副作用**。

`useEffect` 允许我们在组件**渲染完成并将 DOM 变动绘制到屏幕之后**，去执行这些副作用操作，并允许在下次执行或组件卸载前运行“清理逻辑”。

### 底层运行原理

`useEffect` 的底层原理与 `useState` 类似，也依赖于 Fiber 节点的 Hook 链表。它在底层的工作流可以概括为以下四个关键机制：

1. **链表存储与队列**：在 Fiber 节点中，每个 `useEffect` 也会占用一个 Hook 对象，保存在单向链表中。它的触发函数（create）、清理函数（destroy）和依赖项（deps）会被打包成一个 `effect` 对象，并挂载到 Fiber 节点的 `updateQueue`（副作用队列）中。
2. **依赖比对（浅比较）**：在组件更新（重新渲染）时，React 会使用 `Object.is()` 遍历比较新旧依赖数组。如果所有依赖项都未改变，此次 Effect 虽然会被创建，但不会被打上“需要执行”的标记（Tag），从而在后续阶段被跳过。
3. **异步执行时机**：React 将 `useEffect` 定义为**被动副作用（Passive Effect）**。它不会阻塞浏览器的绘制（Paint），而是在 React 的 Commit 阶段（DOM 已更新）结束后，通过异步任务（类似 `setTimeout` 或 `MessageChannel` 后台执行）调用。*(如果是需要同步阻塞浏览器绘制的更新，应使用 `useLayoutEffect`)*
4. **清理函数的闭包性**：如果 effect 伴随一个返回的清理函数（cleanup），React 内部会保存对其引用。当下一次处理（由于依赖更新）或者组件卸载前，React 会**先执行上一次留下的清理函数**，再执行本次的副作用函数。

### 使用
1. 没有传依赖项（不写 deps）：
这种情况下每次重新渲染都会触发 Effect，因此在每次执行新 Effect 之前，都会先执行上一次 render 留下的清理函数。
2. 依赖项为空数组 []：
Effect 函数本身只在组件挂载后执行一次。清理函数 (Cleanup) 只在组件卸载前执行一次。
3. 依赖项有特定的值（例如 [userId]）：
只有当 userId 发生变化，导致 React 决定需要再次运行 Effect 时，才会先执行旧 userId 对应的清理函数。如果重新渲染是因为其他状态改变（userId 没变），Effect 不会执行，清理函数也就不会执行。

### 清理函数 (Cleanup function)
清理函数不仅仅是在组件卸载时执行，**每次依赖项变化 -> 组件重新渲染 -> 执行上一次 Effect 的清理函数 -> 执行本次 Effect**。

这在处理订阅、定时器或取消网络请求时非常关键：

```js
useEffect(() => {
  const timer = setInterval(() => { console.log('Tick') }, 1000);
  
  // 必须返回清理函数
  return () => clearInterval(timer); 
}, [someDep]); // 每次 someDep 变化，都会先 clear 旧 timer，再开新 timer
```

### useEffect vs useLayoutEffect

- **useEffect**: 渲染更新 DOM -> 浏览器绘制 -> **异步执行**副作用。（推荐，不阻塞用户看到界面）
- **useLayoutEffect**: 渲染更新 DOM -> **同步执行**副作用 -> 浏览器绘制。（仅在需要测量 DOM 尺寸或避免画面闪烁时使用）

### 伪代码
```js
// 模拟 Fiber 节点保存 Hooks 的状态
let hookIndex = 0;   // 当前执行到的 hook 索引
const hooks = [];    // 模拟 Fiber.memoizedState 链表/数组

function useEffect(callback, deps) {
  const currentIndex = hookIndex;
  const currentHook = hooks[currentIndex];

  // 1. 检查依赖是否发生变化
  let hasChanged = true;
  if (currentHook && currentHook.deps && deps) {
    // 使用 Object.is 进行浅比较
    hasChanged = !deps.every((dep, i) => Object.is(dep, currentHook.deps[i]));
  }

  // 2. 如果依赖改变，或没有传依赖，则需要执行副作用
  if (hasChanged) {
    // React 实际在 commit 阶段之后通过调度器异步执行副作用
    // 这里使用 setTimeout 宏任务模拟异步、不阻塞渲染的特性
    setTimeout(() => {
      // 3. 执行前，如果存在上一次的 cleanup 函数，先执行清理
      if (currentHook && currentHook.cleanup) {
        currentHook.cleanup();
      }

      // 4. 执行当前的副作用回调，并获取可能返回的 cleanup 清理函数
      const cleanup = callback();

      // 5. 将最新的依赖和清理函数持久化到当前 hook 节点中
      hooks[currentIndex] = {
        deps: deps,
        cleanup: typeof cleanup === 'function' ? cleanup : undefined
      };
    }, 0);
  }

  // 指针移动到下一个 Hook
  hookIndex++;
}

// ============== 模拟组件执行过程 ==============
// React 每次 render 前会重置索引： hookIndex = 0;
```

### 依赖项陷阱 (useEffect 的常见坑)

在开发中，副作用管理不当最容易导致 Bug。以下是两个经典的反面教材和对应的解决思路。

#### 1. 闭包陷阱 (Stale Closure)
如果你在 `useEffect` 或 `useCallback` 中使用了某个 state，但忘记把它加入依赖数组，就会导致函数内部一直读取到**组件初次渲染时的旧值**。

```js
// ❌ 错误示范：runSearch 依赖了 query 但没写依赖，导致内部永远读到 query=""
const runSearch = useCallback(
  debounce(() => {
    console.log("Stale Closure Search:", query) 
  }, 1000),
  [] // ⚠️ 漏写依赖项 query
);

useEffect(() => {
  if (query) runSearch(); // 虽然 query 变了触发 runSearch，但 runSearch 实际上是旧函数
}, [query]);
```

#### 2. 函数重建导致的失效
为了解决闭包问题，你把 `query` 加入了 `useCallback` 的依赖，结果导致防抖失效。原因在于**每次 query 变 -> runSearch 重新生成 -> debounce 内部状态重置**。

```js
// ❌ 错误示范：虽然没闭包问题，但每次输入都会创建全新的 debounce 函数，导致防抖失效
const runSearch = useCallback(
  debounce(() => {
    console.log("Search:", query) 
  }, 1000),
  [query] // ⚠️ 虽然 query 变了应该更新，但这导致了函数实例更换
);
```

#### ✅ 正确解法：事件驱动或 useRef

**方案 A（推荐）：事件驱动**
直接在 onChange 事件中处理逻辑，数据推入，不依赖 useEffect 监听。

```js
const debouncedSearch = useCallback(
  debounce((nextVal) => { console.log(nextVal) }, 1000), 
  [] // 永远不重建
);

const onChange = (e) => {
  setQuery(e.target.value);
  debouncedSearch(e.target.value); // 把最新值传进去
}
```

**方案 B：useEffect 内部清理**
不使用第三方 debounce，利用 useEffect 的 cleanup 特性。

```js
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Search:', query);
  }, 1000);
  
  // 每次 query 变之前，清除上一次的定时器
  return () => clearTimeout(timer);
}, [query]);
```

## useCallback
`useCallback` 是 React 提供的一个 Hook，**它的核心作用是“缓存函数引用”**。

在 React 函数组件中，每次组件重新渲染（render）时，组件内部定义的函数（比如 `handleClick`）默认都会**重新创建**一个新的函数实例。

### 为什么需要 useCallback？

通常情况下，函数重新创建并非性能瓶颈（JS 创建函数非常快）。但是，当这个函数作为 props 传递给子组件时，问题就来了：

1.  **导致不必要的子组件渲染**：如果子组件使用了 `React.memo` 进行优化（只在 props 变化时才重新渲染），但父组件每次传进去的 `onClick` 函数都是新的（引用变了），`React.memo` 就会认为 props 变了，从而导致子组件无意义地重新渲染。
2.  **打破依赖链稳定性**：如果这个函数被用作 `useEffect` 的依赖项（`[func]`），函数变了会导致 Effect 频繁执行。

### 核心语法

```js
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b], // 依赖项数组
);
```

*   **如果 `[a, b]` 没有变**：`useCallback` 会返回**上一次**在这个位置创建的那个函数引用。
*   **如果 `[a, b]` 变了**：`useCallback` 会返回**新的**函数引用。

## useMemo
`useMemo` 用于缓存**计算结果**。

### 核心区别对比

| 特性 | **useCallback** | **useMemo** |
| :--- | :--- | :--- |
| **缓存对象** | **缓存函数本身** (Function Identity) | **缓存函数的返回值** (Calculated Value) |
| **适用场景** | 防止函数地址变化导致子组件重渲染 | 防止昂贵的计算逻辑重复执行 |
| **返回值** | `fn` (函数引用) | `result` (函数执行后的结果) |


```js
// useCallback (缓存动作)
const handleClick = useCallback(() => { ... }, []);

// useMemo (缓存结果)
const expensiveValue = useMemo(() => {
  return a * b + 100; 
}, [a, b]);
```

### useMemo vs Vue computed
`useMemo` 和 Vue 的 `computed` 非常相似，核心目的都是“缓存计算结果”。

*   **Vue `computed`**：**自动追踪依赖**（响应式系统自动收集），是一种默认的最佳实践。
*   **React `useMemo`**：**手动声明依赖**（需要写依赖数组 `[]`），只建议在昂贵计算或需要稳定引用时使用，不要滥用。

## React 更新流程 (Fiber 架构)

React 的更新流程（Reconciliation）主要分为两个阶段：**Render 阶段** 和 **Commit 阶段**。

### 1. Render 阶段 (计算阶段)
**目标**：计算出哪些组件需要更新，以及如何更新。
- **纯净 (Pure)**：不进行任何 DOM 操作或副作用。
- **可中断**：React 可能会因为高优先级任务（如用户输入）插队而暂停、废弃或重新开始这个阶段的任务。
- **工作内容**：
    1.  调用 `Function Component` 函数体（或 `Class.render`）。
    2.  构造新的 Fiber 树（WorkInProgress Tree）。
    3.  Diff 算法对比新旧 Fiber 节点（Reconcile）。
    4.  标记 Effect Tag（增删改、Ref 变动等）。

### 2. Commit 阶段 (提交阶段)
**目标**：将 Render 阶段计算的结果应用到真实 DOM，并执行副作用。
- **不可中断**：一旦开始，必须一口气执行完，否则页面 UI 会不一致。
- **三个子阶段**：

    **A. Before Mutation (变动前)**
    - 处理 DOM 变动前的逻辑。
    - 调用 `getSnapshotBeforeUpdate` (Class Component)。
    - **注意：** 这里还看不到 DOM 变化。

    **B. Mutation (变动中)**
    - **真正操作 DOM**：React 执行 `appendChild`, `removeChild`, `setAttribute` 等操作。
    - **Ref 更新**：这是解除旧 Ref、赋值新 Ref 的时机。
    - **注意：** 此时 JS 内存中的 DOM 已经变了，但浏览器还没绘制（Paint）。

    **C. Layout (布局/变动后)**
    - **同步执行 `useLayoutEffect`** 的回调。
    - **同步执行 `componentDidMount` / `componentDidUpdate`**。
    - **Ref 最终确认**。
    - **注意：** 这里是 JS 阻塞的最后一环，执行完后，JS 线程交还给浏览器，浏览器开始绘制 (Paint)。

### 3. Passive Context (被动副作用)
**目标**：执行那些不影响 UI 的副作用（异步）。
- **时机**：浏览器 Paint 之后（通过 Scheduler 调度，通常是宏任务或微任务）。
- **工作内容**：
    - **执行 `useEffect` 的清理函数 (cleanup)**。
    - **执行 `useEffect` 的回调 (create)**。
    - 触发新的更新（如果在 Effect 里调用了 setState）。

### 流程图解
```text
[触发更新] -> [Render阶段 (Diff)] -> [Commit: Mutation (改DOM)] -> [Commit: Layout (同步Effect)] -> [浏览器绘制 Paint] -> [Passive: useEffect]