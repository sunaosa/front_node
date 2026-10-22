[← 返回 Monorepo](./monorepo.md)

# Lerna


## 基础

Lerna 是一个老牌的 Monorepo 工具，用于管理包含多个包的 JavaScript/TypeScript 项目。它通过 `lerna.json` 配置文件来管理包之间的依赖关系。

## 核心概念

- **Independent 模式**：每个包独立管理版本
- **Fixed/Locked 模式**：所有包共用同一版本号
- **Bootstrapping**：自动将本地包链接到 node_modules

## Lerna + Nx 集成

**Lerna v6+ 内置集成了 Nx** 作为任务执行引擎，获得了以下能力：

| 特性 | 说明 |
|---|---|
| **增量构建** | 只重新构建受影响的包，依赖图分析 |
| **任务缓存** | 本地缓存构建结果，相同输入直接复用 |
| **任务编排** | 基于依赖图的智能任务调度 |
| **并行执行** | 无依赖的任务自动并行 |
| **Remote Cache** | 可对接 Vercel/Nx Cloud 远程缓存（需配置） |

### 无需额外安装

```json
{
  "devDependencies": {
    "lerna": "^8.x"    // Nx 已内置，无需单独装 nx
  }
}
```

### project.json 配置

Lerna 使用 Nx 的 `project.json` 管理每个包的任务：

```json
{
  "name": "@lerna-demo/utils",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "targets": {
    "build": { "executor": "nx:run-commands" },
    "test": { "executor": "nx:run-commands" }
  }
}
```

### 常用命令

```bash
lerna run build              # 批量构建（走 Nx 增量）
lerna run test --scope=my-package   # 只测指定包
lerna affected --target=build       # 只构建受影响的包
```

> **注意**：Lerna v7 移除了 `bootstrap` 命令，依赖链接由包管理器（pnpm/yarn）接管。

## 面试常问

### Q1：Monorepo 和 Multirepo 的区别？

| | Monorepo | Multirepo |
|---|---|---|
| 仓库数量 | 单一 | 多个 |
| 代码共享 | 直接引用，无需发版 | 需要发布 npm 包 |
| 版本管理 | 统一或独立 | 各仓库独立 |
| CI/CD | 需区分受影响范围 | 按仓库独立 |
| 权限控制 | 粗粒度 | 精细化 |
| 适用场景 | 微前端、组件库、BFF | 独立产品、私有服务 |

**主流趋势**：前端倾向于 Monorepo（如 Nx/Turborepo），后端倾向于 Multirepo。

---

### Q2：Lerna 和 Turborepo/Nx 的区别？

| | Lerna | Turborepo | Nx |
|---|---|---|---|
| 任务缓存 | ❌ 无（靠 Nx） | ✅ 本地+远程 | ✅ 本地+远程 |
| 增量构建 | ❌ 无（靠 Nx） | ✅ | ✅ |
| 依赖图 | ❌ | ✅ 简易 | ✅ 强大可视化 |
| 配置复杂度 | 低 | 低 | 高 |
| 适用场景 | 简单多包管理 | 追求速度的轻量方案 | 企业级复杂项目 |

**结论**：Lerna 适合入门和简单场景；Nx 适合大型企业；Turborepo 适合追求极致速度的现代项目。

---

### Q3：pnpm workspaces vs Lerna？

- **pnpm workspaces**：包管理器原生功能，只解决依赖安装和链接
- **Lerna**：完整的包管理方案（安装+链接+发布+版本控制）
- **最佳实践**：`pnpm workspaces` + `Lerna` 配合使用，pnpm 管依赖，Lerna 管发布

---

### Q4：Monorepo 的缺点？如何解决？

| 问题 | 解决方案 |
|---|---|
| 仓库体积大 | Git Shallow Clone、`--depth 1` 克隆 |
| 权限控制弱 | 使用 Path-based 权限插件（如 Bitbucket） |
| CI/CD 慢 | `lerna affected` / `nx affected` 只构建受影响部分 |
| 依赖版本统一困难 | Independent 模式独立版本，或使用 `syncpack` 统一依赖版本 |
| 学习成本高 | 规范文档、CI/CD 模板、标准化脚手架 |

## 常用命令

```bash
# 初始化
lerna init              # 创建 lerna.json，默认 Fixed 模式
lerna init --independent # Independent 模式

# 安装与链接
lerna bootstrap          # 安装所有依赖并链接本地包
lerna bootstrap --force   # 强制重新链接

# 发布
lerna publish            # 发布所有有改动的包
lerna publish --conventional-commits  # 基于 conventional commit 生成 changelog

# 批量操作
lerna run build          # 并行执行所有包的 build 脚本
lerna run test --scope=my-package  # 只对指定包运行测试

# 查看变更
lerna changed            # 查看自上次发布以来有变化的包
lerna list               # 列出所有包
lerna diff [packageName] # 查看某个包的改动
```

## lerna.json 配置

```json
{
  "version": "1.0.0",
  "npmClient": "yarn",
  "packages": ["packages/*"],
  "command": {
    "publish": {
      "ignoreChanges": ["*.md", "test/**"]
    },
    "bootstrap": {
      "ignore": "component-*",
      "npmClientArgs": ["--no-package-lock"]
    }
  }
}
```

## 适用场景

- 需要管理多个相互依赖的 npm 包
- 组件库、工具库需要统一发布管理
- 与 yarn workspaces / npm workspaces 配合使用
