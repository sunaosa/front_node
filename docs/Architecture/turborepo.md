[← 返回 Monorepo](./monorepo.md)

# Turborepo

## 基础

Turborepo 由 Vercel 开发，是一款**轻量级、高性能的 Monorepo 工具**。以其极快的速度和简洁的配置著称，特别适合现代前端项目。

**一句话总结**：Turborepo = Lerna（多包批量命令） + Nx（增量构建 + 本地缓存） + Vercel（远程缓存服务器）

## 核心概念

- **Task Pipeline**：定义任务之间的依赖关系（如 build 前必须先执行 build 自己的依赖）
- **Remote Cache**：基于云端的构建缓存，团队共享（Vercel 内置支持）
- **Incremental Builds**：增量构建，只重新构建受影响的部分
- **Zero-config**：开箱即用，智能推断任务拓扑

## 常用命令

```bash
# 初始化
npx create-turbo@latest

# 运行
turbo build          # 构建所有包
turbo test           # 测试所有包
turbo lint           # lint 所有包

# 本地缓存
turbo login          # 登录 Vercel
turbo link           # 链接远程缓存

# 查看任务关系
turbo graph          # 生成任务依赖图
```

## turbo.json 配置

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],     # ^ 表示依赖的包的 build 必须先完成
      "outputs": ["dist/**", ".next/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]
    },
    "lint": {
      "outputs": []
    }
  }
}
```

## package.json 示例

```json
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint"
  }
}
```

## Turborepo vs Lerna

| | Turborepo | Lerna |
|---|---|---|
| 缓存机制 | 本地 + 远程（云端） | 无（需自行配置） |
| 任务调度 | 智能拓扑排序 | 基础并行 |
| 配置复杂度 | 低 | 中 |
| 远程缓存 | 原生支持 | 需第三方插件 |

## 适用场景

- Next.js / Vercel 项目
- 追求极致构建速度的团队
- 轻量级 Monorepo（无需 Nx 的复杂性）
- 需要远程构建缓存的 CI/CD 流程

## 面试常问

### Q1：Turborepo 和 Nx 的区别？

| | Turborepo | Nx |
|---|---|---|
| 定位 | 轻量级构建工具 | 企业级 Monorepo 平台 |
| 配置 | 极简（turbo.json） | 复杂（project.json + nx.json） |
| 缓存 | 本地 + Vercel 远程 | 本地 + Nx Cloud 远程 |
| 依赖图 | 简易文本 | 强大可视化 |
| 代码生成 | 无 | 强大 |
| 上手难度 | 低 | 高 |
| 适用场景 | Next.js / Vercel 项目 | 复杂企业级项目 |

**选择建议**：小团队、Next.js 项目选 Turborepo；大型企业、混合框架选 Nx。

---

### Q2：Turbo Pipeline 的 `dependsOn` 规则？

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["build"] }
  }
}
```

- `"^build"`：**向上**遍历依赖链，先构建所有依赖的包
- `"build"`：**向下**遍历，只等直接依赖的 build 完成
- 无前缀：与有向无环图（DAG）无关，并行执行

---

### Q3：Remote Cache 如何工作？

**核心误解澄清**：Remote Cache 不是 npm 发布，**只是把构建产物备份到 Vercel 服务器**。

| | npm 包发布 | Remote Cache（备份） |
|---|---|---|
| 存什么 | 源码包（`.tgz`） | 构建产物（`dist/`、`build/`） |
| 目的 | 别人可以用你的代码 | 跳过重复的构建步骤 |
| 需要发版吗 | ✅ 需要 | ❌ 不需要，自动产生 |
| 存哪 | npm registry | Vercel 服务器 |

**核心原理**：

1. **Hash 计算**：任务执行前，Turborepo 根据 `inputs`（源码、环境变量、依赖锁文件）计算内容 hash
2. **本地优先**：先查本地缓存，命中则直接复用 outputs
3. **远程命中**：本地未命中时，向远程服务器查询该 hash 是否有缓存
4. **下载复用**：远程命中则下载到本地，下次本地直接复用

**架构示意**：

```
本地构建时：
  inputs (src, env, lock) → hash → 上传到 Remote Cache

团队成员/CI 构建时：
  inputs → hash → 本地缓存? → 远程缓存? → 远程命中则下载 → 直接复用
```

**配置步骤**：

```bash
# 1. 登录 Vercel（Remote Cache 提供者）
turbo login

# 2. 链接项目
turbo link

# 3. 配合 CI 使用（.github/workflows/ci.yml 示例）
- uses: actions/checkout@v4
- uses: pnpm/action-setup@v2
- run: pnpm install
- run: turbo build --filter=myapp
  env:
    TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
    TURBO_TEAM: your-team-name   # Vercel Team 名
```

**不依赖 Vercel 的方案**：

Turborepo Remote Cache 本质是 **REST API**，可对接第三方：
- **Vercel**（默认，免费 Saas）
- **Nx Cloud**（需配合 Nx 使用）
- **自建**（通过 Turborepo Remote Cache API 协议）

> 注：Remote Cache 的核心是 `turbo.json` 中 `outputs` 指定的文件目录，只有这些产物会被缓存。

---

### Q4：Turborepo 为什么快？

1. **增量构建**：只重新构建受影响的包
2. **任务并行**：根据 DAG 自动最大并行
3. **远程缓存**：团队共享构建结果
4. **文件系统感知**：跳过无变化的任务

核心：`turbo.json` 的 `outputs` 配置决定了 hash 范围，精确到文件级别。
