import { useState, useEffect, useCallback, useRef } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../App.css'

// 简单的防抖辅助函数
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: any;
  return function (this: any, ...args: Parameters<T>) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function Home() {
  const [query, setQuery] = useState('')
  const [log, setLog] = useState<string[]>([])

  // ==========================================
  // ✅ 解决方法 2：事件驱动 (Event Driven) - 你的建议！
  // ==========================================
  
  // 1. 创建一个稳定的防抖函数，专门负责"脏活累活" (API请求/日志)
  // 注意：我们通过参数接收最新的值，而不是在函数内部读取 state
  const debouncedSearch = useCallback(
    debounce((nextValue: string) => {
      const message = `[Debounce执行] 搜索值: "${nextValue}"`
      console.log(message)
      setLog(prev => [...prev, message])
    }, 1000),
    [] // 依赖为空，保证函数引用永远不变，timeout 才能在多次调用间共享
  )

  // 2. 处理 Change 事件
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    
    // A. 立即更新 UI (受控组件必须这样做，否则输入框会卡顿)
    setQuery(newValue)
    
    // B. 将最新值传递给防抖函数
    debouncedSearch(newValue)
  }

  /* 
  ❌ 旧的错误代码已移除
  不再需要额外的 useEffect 来监听 query 变化
  */

  // ==========================================
  // [对比] ❌ 错误示范：useEffect + 错误依赖监听
  // ==========================================
  /*
  const runSearch = useCallback(
    debounce(() => {
      // 这里的 query 永远是初始值 ""
      console.log("Stale Closure Search:", query) 
    }, 1000),
    [] // ⚠️ 缺少依赖项 query，导致函数永远不更新
  )

  useEffect(() => {
    // 虽然这里正确监听了 query，但 runSearch 是旧的闭包
    if (query) {
      runSearch()
    }
  }, [query])
  */

  // ==========================================
  // [对比] ❌ 错误示范：useCallback 依赖 query
  // ==========================================
  /*
  // 这种写法会导致防抖失效，每次输入都是新的函数实例
  const runSearchCorrectDep = useCallback(
    debounce(() => {
      console.log("Search:", query) 
    }, 1000),
    [query] // 虽然没导致闭包问题，但导致了函数重建问题
  )
  */

  return (
    <div className="home-container">
      <h1>Debounce Best Practice</h1>
      <div className="card">
        <label>
          搜索框 (事件监听模式):
          <br/>
          <input
            type="text"
            value={query}
            onChange={handleInputChange} 
            style={{ padding: '8px', fontSize: '16px', marginTop: '10px' }}
            placeholder="请输入内容..."
          />
        </label>
        
        <div style={{ textAlign: 'left', marginTop: '20px', background: '#f0f0f0', padding: '10px', borderRadius: '4px', minHeight: '100px', color: '#333' }}>
          <strong>控制台日志:</strong>
          <ul>
            {log.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </div>

        <p>
          问题原因：<code>useCallback</code> 的依赖数组是空的 <code>[]</code>，导致 debounce 函数内部闭包捕获的是旧的 <code>query</code> 状态。
        </p>
      </div>
    </div>
  )
}

export default Home