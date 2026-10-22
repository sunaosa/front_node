# Monorepo

## 基础

Monorepo（单体仓库）是一种代码管理策略，指将多个项目集中存放在一个代码仓库中。

## 核心特征

- **单一仓库**：多个包/项目共存于一个 Git 仓库
- **统一版本控制**：所有代码共享同一提交历史
- **共享依赖**：依赖可以跨项目复用，避免重复下载

## 常见 Monorepo 工具

| 工具 | 说明 |
|---|---|
| **[Lerna](./lerna.md)** | 最老牌，通过 `lerna.json` 管理包，常与 yarn/npm workspaces 配合 |
| **[Nx](./nx.md)** | 高级缓存、依赖图分析、增量构建 |
| **[Turborepo](./turborepo.md)** | Vercel 出品，轻量、极速、配置简单 |
| **[Pnpm + workspaces](./pnpm-workspaces.md)** | 原生 workspace 支持，节省磁盘空间 |

## Monorepo vs Multirepo

| | Monorepo | Multirepo |
|---|---|---|
| 代码共享 | ✅ 容易 | ❌ 需要发布 npm 包 |
| 一致性 | ✅ 统一代码风格、版本 | ❌ 各 repo 独立 |
| 权限管理 | ❌ 粗粒度 | ✅ 精细化 |
| 克隆时间 | ❌ 仓库大 | ✅ 按需克隆 |

## 典型目录结构

```
my-project/
├── packages/
│   ├── utils/       # 公共工具库
│   ├── ui/          # 组件库
│   └── app/         # 主应用
├── lerna.json
└── package.json
```

## 适用场景

- **组件/工具库开发**：多个前端项目共用一套 UI 组件
- **微前端/微服务**：代码高度关联的项目
- **BFF（Backend for Frontend）**：前后端都在同一仓库管理

## Lerna 常用命令

```bash
lerna init          # 初始化
lerna bootstrap     # 安装依赖并链接
lerna publish        # 发布所有包
lerna run build      # 并行执行所有包的 build 脚本
lerna changed        # 查看有变动的包
```

## 优缺点总结

### 优点

1. **代码复用**：公共代码直接引用，无需发版
2. **统一开发体验**：统一工具链、代码规范、CI/CD
3. **跨项目调试**：无需切换仓库，直接打断点
4. **依赖管理简单**：只需维护一份 lock 文件

### 缺点

1. **仓库体积膨胀**：git 历史增长，克隆时间长
2. **权限控制弱**：无法细粒度控制谁可以访问哪些包
3. **CI/CD 复杂度增加**：需区分哪些包需要构建
4. **学习成本**：新成员需要理解整个仓库结构
