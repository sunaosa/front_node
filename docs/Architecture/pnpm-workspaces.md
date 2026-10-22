[← 返回 Monorepo](./monorepo.md)

# Pnpm + Workspaces


## 基础

pnpm（ performant npm）是一个快速、节省磁盘空间的包管理器。其内置的 **Workspace** 功能原生支持 Monorepo，无需额外工具。

## 核心概念

- **硬链接机制**：相同的依赖只存储一份，大幅节省磁盘空间
- **Store 目录**：所有包存储在统一的 store 目录中
- **Workspace 协议**：`workspace:` 协议引用本地包
- **非扁平 node_modules**：避免幽灵依赖问题

## 常用命令

```bash
# 安装依赖
pnpm install

# 在工作区根目录运行
pnpm -r build        # -r 递归执行所有子包
pnpm --filter=myapp build  # 只构建指定包

# 添加依赖
pnpm --filter=myapp add react  # 给指定包添加依赖
pnpm add -w -D typescript       # 给根目录添加 dev 依赖

# 链接本地包
pnpm add mylib --filter=myapp  # 将 mylib 链接到 myapp
```

## pnpm-workspace.yaml 配置

```yaml
packages:
  - 'packages/*'      # 所有子包
  - 'apps/*'         # 应用目录
  - '!packages/**/*.test'  # 排除测试目录
```

## package.json 配置

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["packages/*", "apps/*"]
}
```

## 依赖协议

```json
{
  "dependencies": {
    "mylib": "workspace:*",     # 使用最新版本
    "mylib": "workspace:^1.0.0" // 使用符合 semver 范围的最新版本
  }
}
```

## 项目结构示例

```
my-monorepo/
├── pnpm-workspace.yaml
├── package.json
├── apps/
│   ├── web/
│   │   └── package.json
│   └── mobile/
│       └── package.json
└── packages/
    ├── utils/
    │   └── package.json
    └── ui/
        └── package.json
```

## Pnpm vs Yarn workspaces

| | Pnpm | Yarn workspaces |
|---|---|---|
| 磁盘空间 | ✅ 极致节省（硬链接） | ❌ 复制模式 |
| node_modules 结构 | 非扁平，更安全 | 扁平 |
| 依赖提升 | 自动处理 | 可能产生幽灵依赖 |
| monorepo 支持 | 原生，配置简单 | 原生，需配合 Lerna 使用 |

## 适用场景

- 追求极致磁盘空间利用的团队
- 已有 npm/yarn 项目迁移到 Monorepo
- 不需要 Nx/Turborepo 的高级功能
- 与 Lerna 配合使用（pnpm 管理依赖 + Lerna 管理发布）

## 面试常问

### Q1：pnpm 为什么节省磁盘空间？

pnpm 使用 **硬链接（Hard Link）**：
- 相同版本的包只存储一份
- 各项目通过硬链接指向 store 中的同一份文件
- 删除包时，store 引用计数归零才真正删除

```
~/.pnpm-store/           # 全局 store
├── node_modules/
│   ├── .pnpm/
│   │   ├── react@18.0.0/
│   │   └── lodash@4.0.0/
node_modules/            # 各项目硬链接到这里
└── packages/
    └── myapp/           # node_modules/react -> store 里的同一份
```

---

### Q2：pnpm 的非扁平 node_modules 解决什么问题？

**幽灵依赖**：在扁平结构中，A 和 B 都依赖 lodash，A 可以 `require('lodash')` 即使它没有声明。pnpm 强制每个包只能访问自己声明的依赖，杜绝幽灵依赖。

结构示例：
```
node_modules/
├── .pnpm/              # 真实包存储
│   ├── lodash@4.0.0/
│   └── react@18.0.0/
├── utils/              # 包 A 的真实 node_modules
│   └── package.json 指向 .pnpm/lodash
└── ui/                 # 包 B 的真实 node_modules
    └── package.json 指向 .pnpm/react
```

---

### Q3：workspace 协议 `workspace:*` 和 `workspace:^` 的区别？

| 协议 | 含义 |
|---|---|
| `workspace:*` | 使用本地最新版本 |
| `workspace:^1.0.0` | 满足 semver 范围的本地最新版本 |
| `workspace:1.0.0` | 精确匹配本地版本 |

发布到 npm 时，`workspace:*` 会被替换为实际版本号（如 `1.0.0`）。

---

### Q4：pnpm workspaces + Lerna 是最佳实践吗？

**是的**，两者各司其职：

| 职责 | 工具 |
|---|---|
| 依赖安装 & 链接 | pnpm workspaces |
| 版本管理 & 发布 | Lerna |
| 增量构建 & 缓存 | Turborepo / Nx |

**推荐组合**：
- 轻量：`pnpm workspaces` + `Lerna`
- 进阶：`pnpm workspaces` + `Lerna` + `Turborepo`
- 企业：`pnpm workspaces` + `Nx`（Nx 内置两者的核心功能）
