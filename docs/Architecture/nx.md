
[← 返回 Monorepo](./monorepo.md)

# Nx


## 基础

Nx 是一个高级的 Monorepo 工具，由 Nrwl 团队开发，专注于**增量构建、依赖图分析和强大的缓存机制**。支持 TypeScript、React、Angular、Next.js 等多种框架。

## 核心概念

- **Dependency Graph**：可视化展示项目内各模块的依赖关系
- **Affected Commands**：只对受影响的模块执行命令，大幅提升 CI/CD 效率
- **Computation Caching**：缓存构建/测试结果，相同输入直接返回缓存结果
- **Code Generators**：代码生成器，快速创建组件、库、模块

## 常用命令

```bash
# 初始化
npx create-nx-workspace@latest myorg --preset=react

# 运行命令
npx nx build myapp        # 构建指定应用
npx nx run-many --target=build  # 构建所有项目
npx nx affected --target=build # 只构建受影响的

# 查看依赖图
npx nx graph

# 生成代码
npx nx generate @nrwl/react:library mylib
npx nx generate @nrwl/react:component MyComponent --project=mylib

# 测试
npx nx test myapp
npx nx e2e myapp
```

## workspace.json 配置

```json
{
  "version": 2,
  "projects": {
    "myapp": {
      "root": "apps/myapp",
      "targets": {
        "build": { "executor": "@nrwl/node:build" },
        "serve": { "executor": "@nrwl/node:execute" }
      }
    },
    "mylib": {
      "root": "libs/mylib",
      "targets": {
        "build": { "executor": "@nrwl/angular:package" }
      }
    }
  }
}
```

## 适用场景

- 大型企业级 Monorepo 项目
- 需要精细的任务依赖控制
- 多框架混合项目（React + Node + Angular）
- 需要完整 Dev Experience 的团队

## 面试常问

### Q1：Nx 和 Lerna 的区别？

| | Nx | Lerna |
|---|---|---|
| 定位 | 完整的企业级 Monorepo 平台 | 多包管理工具 |
| 依赖图 | 强大的可视化依赖分析 | 基础 |
| 缓存 | 本地+远程（Nx Cloud） | 需配合 Nx |
| 增量构建 | 原生支持 | 靠 Nx 集成 |
| 代码生成 | 强大的 generators | 无 |
| 学习成本 | 高 | 低 |

**关系**：Lerna v6+ 内置集成 Nx，两者已深度融合。

---

### Q2：Nx 的缓存机制原理？

Nx 通过 ** Computation Caching** 实现：
1. 对任务的 inputs（源码、依赖、环境变量）计算 hash
2. hash 一致时，直接读取缓存的 outputs（构建产物）
3. 缓存命中则跳过执行，省时省资源

**清除缓存**：`npx nx reset`

---

### Q3：Nx affected 命令原理？

1. 对比当前 commit 和 base commit 的文件变化
2. 根据 `project.json` 的 `implicitDependencies` 推导受影响范围
3. 只对受影响的项目执行目标任务

适合 CI/CD：避免全量构建，只构建真正有改动的部分。

---

### Q4：Nx 适合哪些团队？

- 大型企业（100+个项目）
- 多框架混合（React + Angular + Node）
- 需要强大代码生成和架构约束
- 有预算使用 Nx Cloud 远程缓存
