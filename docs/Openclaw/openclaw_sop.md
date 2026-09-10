# OpenClaw 安装 SOP（npm 安装方式 + 镜像配置）

> 适用系统：Windows / macOS / Linux（本文以 Windows 为例，命令在 CMD、PowerShell、Git Bash 中均通用）
> 适用对象：需要通过 npm 全局安装并初始化 OpenClaw 的开发/运维人员

---

## 1. 目的

规范 OpenClaw 的安装流程，包括：

1. 使用 npm 全局安装 OpenClaw；
2. 在国内网络环境下将 npm 源切换为国内镜像，保证下载速度与成功率；
3. 安装完成后的初始化、验证与常见问题处理。

---

## 2. 环境要求

| 项目 | 要求 | 检查命令 |
| --- | --- | --- |
| 操作系统 | Windows 10/11、macOS、Linux 均可 | — |
| Node.js | **v22 及以上（建议 LTS 版本）** | `node -v` |
| npm | 随 Node.js 自带，v10+ 即可 | `npm -v` |
| 网络 | 可访问镜像源 registry.npmmirror.com | 见第 4 步 |

> 若 `node -v` 版本低于 22，请先升级 Node.js（可用 nvm / nvm-windows 管理多版本，或到官方/镜像站下载安装包）。

---

## 3. 步骤一：确认 Node.js / npm 已就绪

```bash
node -v
# 期望输出：v22.x.x 或更高

npm -v
# 期望输出：10.x.x 或更高
```

如未安装 Node.js：

- 官方下载：<https://nodejs.org/>
- 国内镜像下载（推荐）：<https://npmmirror.com/mirrors/node/>（选对应版本的 node-v22.x.x-x64.msi 等）

---

## 4. 步骤二：将 npm 源改为国内镜像

### 4.1 查看当前源

```bash
npm config get registry
```

- 默认输出为官方源：`https://registry.npmjs.org/`

### 4.2 方式 A：永久切换为国内镜像（推荐）

```bash
npm config set registry https://registry.npmmirror.com
```

验证：

```bash
npm config get registry
# 期望输出：https://registry.npmmirror.com
```

> 该配置写入用户目录下的 `.npmrc` 文件（Windows 路径一般为 `C:\Users\<用户名>\.npmrc`），对所有项目生效。

### 4.3 方式 B：仅单次安装时使用镜像（不改全局配置）

```bash
npm install -g openclaw@latest --registry=https://registry.npmmirror.com
```

适合不想改动全局配置、或临时在 CI 环境使用的场景。

### 4.4 方式 C：项目级配置（仅对某个目录生效）

在项目根目录新建 `.npmrc` 文件，写入：

```ini
registry=https://registry.npmmirror.com
```

### 4.5 还原为官方源（如需）

```bash
npm config set registry https://registry.npmjs.org
```

### 4.6 常用镜像源参考

| 名称 | 地址 |
| --- | --- |
| npmmirror（淘宝镜像，推荐） | `https://registry.npmmirror.com` |
| npm 官方源 | `https://registry.npmjs.org` |

---

## 5. 步骤三：安装 OpenClaw

确认镜像已配置好后，全局安装：

```bash
npm install -g openclaw@latest
```

验证安装是否成功：

```bash
openclaw --version
```

> - `-g` 表示全局安装，安装后可在任意目录使用 `openclaw` 命令。
> - Windows 下全局包默认安装在 `%APPDATA%\npm` 目录。
> - 若安装缓慢或失败，确认第 4 步镜像是否已生效（`npm config get registry`）。

---

## 6. 步骤四：初始化与启动

### 6.1 运行引导配置（首次安装必做）

```bash
openclaw onboard
```

引导过程会完成：基础目录初始化、网关（Gateway）配置、模型/渠道接入等。按提示逐步确认即可。

### 6.2 启动与访问

```bash
openclaw dashboard
```

打开控制面板（Dashboard），默认本地地址一般为：

```
http://localhost:18789
```

### 6.3 常用检查命令

```bash
openclaw status    # 查看运行状态
openclaw doctor    # 体检：环境、配置、网关等诊断
openclaw --help    # 查看全部可用命令
```

以 `openclaw --help` 实际输出为准；命令有变动时也可参考官方文档 <https://docs.openclaw.ai>。

---

## 7. 升级与卸载

### 7.1 升级到最新版

```bash
npm update -g openclaw
# 或指定版本
npm install -g openclaw@latest
```

### 7.2 卸载

```bash
npm uninstall -g openclaw
```

---

## 8. 常见问题（FAQ）

| 现象 | 原因 / 解决 |
| --- | --- |
| 安装超时、`network timeout` | 镜像未生效，执行 `npm config get registry` 检查；或临时加 `--registry=https://registry.npmmirror.com` |
| `openclaw` 命令找不到（command not found） | 全局 bin 目录未加入 PATH；Windows 检查 `%APPDATA%\npm` 是否在 PATH 中，重开终端再试 |
| 安装时报 Node 版本不满足 | OpenClaw 需要 Node 22+，升级 Node 后重装 |
| 端口被占用（如 18789） | 其他程序占用端口，用 `netstat -ano \| findstr 18789` 定位进程（Windows）后释放端口，或修改网关端口配置 |
| 公司网络需要代理 | `npm config set proxy http://代理地址:端口` 与 `npm config set https-proxy http://代理地址:端口`；不用时记得 `npm config delete proxy` / `npm config delete https-proxy` 清除 |
| 权限不足（macOS/Linux） | 加 `sudo` 或使用 nvm 管理 Node 避免全局权限问题（Windows 一般无此问题） |
| 配置异常、行为异常 | 先执行 `openclaw doctor` 按提示修复 |

---

## 9. 完整流程速查（一键复制版）

```bash
# 1. 检查环境
node -v && npm -v

# 2. 切换国内镜像
npm config set registry https://registry.npmmirror.com
npm config get registry

# 3. 安装
npm install -g openclaw@latest （版本不对用 npm install -g openclaw）
openclaw --version

# 4. 初始化并启动
openclaw onboard (初始化)

openclaw gateway restart（重启启动）
openclaw dashboard （dashboard 打开）
```
