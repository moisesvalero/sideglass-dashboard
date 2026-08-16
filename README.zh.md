# Sideglass

<p align="center">
  <a href="./README.md">English</a> · <a href="./README.es.md">Español</a> · <a href="./README.zh.md">中文</a>
</p>

<p align="center">
  <img src="public/screenshots/landscape-dark.png" alt="Sideglass —— Windows 副屏仪表盘" width="720" />
</p>

<p align="center">
  <strong>Windows 开放源码桌面应用</strong>（Tauri + Next.js）—— 可自定义的副屏仪表盘：天气、日历、硬件、笔记、内嵌 YouTube 和 AI 面板。
</p>

<p align="center">
  <a href="https://github.com/moisesvalero/sideglass-dashboard/releases/latest/download/Sideglass_x64-setup.exe">下载 .exe</a>
  ·
  <a href="https://sideglass.moisesvalero.es">官网</a>
  ·
  <a href="https://github.com/moisesvalero/sideglass-dashboard">GitHub</a>
  ·
  <a href="./CHANGELOG.md">更新日志</a>
</p>

---

## 截图

| 竖屏（深色）                                             | 竖屏（浅色）                                              |
| -------------------------------------------------------- | --------------------------------------------------------- |
| ![竖屏深色](./public/screenshots/portrait-dark.png)       | ![竖屏浅色](./public/screenshots/portrait-light.png)      |

| 横屏（深色）                                              |
| --------------------------------------------------------- |
| ![横屏深色](./public/screenshots/landscape-dark.png)      |

---

## 功能特性

- 时钟和天气（Open-Meteo，无需 API 密钥）
- 通过 iCal 网址接入 Google 日历
- 实时 CPU、内存、GPU 和主磁盘使用率；通过内置传感器 / NVML 获取温度
- **可调整大小、响应式的小组件**：拖动边角保存任意尺寸，卡片内容自适应缩放
- **面板内嵌 YouTube**，桌面应用内支持真实搜索
- AI 面板（ChatGPT、Gemini、Claude、Perplexity、Microsoft Copilot）
- Satoshi 应用字体、本地笔记、每日精选双语名言、小组件可自由排序
- **Windows 风格标题栏**（右侧最小化 / 最大化 / 关闭）
- 自动更新：**设置 → 检查更新**
- 随 Windows 启动、全局快捷键、系统托盘

## 技术栈

| 层级     | 技术                                              |
| -------- | ------------------------------------------------- |
| UI       | Next.js 16, React 19, TypeScript, Tailwind v4     |
| 桌面端   | Tauri v2（无边框窗口、托盘、签名更新器）          |
| 原生     | Rust — sysinfo、WMI/LibreHardwareMonitor、NVML    |

## 开发

```bash
pnpm install
pnpm run dev          # Web 预览 http://localhost:3000
pnpm run tauri:dev    # 桌面应用
pnpm run tauri:build  # Windows 安装包
```

```bash
pnpm run lint && pnpm run check && pnpm run build
```

重新生成营销截图：

```bash
pnpm run screenshots
```

查看 GitHub Release 私有下载量：

```bash
pnpm run stats:downloads
```

为某个版本生成 WinGet 清单：

```bash
pnpm run winget:manifest -- --installer ./path/to/Sideglass_x64-setup.exe
```

参见 [docs/WINGET.md](docs/WINGET.md)。

## 快速配置

| 功能                | 位置                                                         |
| ------------------- | ------------------------------------------------------------ |
| 日历                | 设置 → Google 日历 iCal 网址                                  |
| 调整小组件大小      | 顶栏 → 自定义按钮 → 自由拖动卡片边角                          |
| YouTube             | YouTube 小组件 → 应用内搜索，或在 Web 预览中粘贴链接           |
| 温度显示            | 安装包已内置；若 °C 未显示，请以管理员身份运行                |
| 更新                | 设置 → **检查更新**                                           |
| 开机自启 / 快捷键   | 设置                                                          |

## 更新日志（官网 + 仓库）

- **英文：** [CHANGELOG.md](./CHANGELOG.md) — 构建时在落地页（`/en`）解析
- **西班牙文：** [CHANGELOG.es.md](./CHANGELOG.es.md) — 在西班牙语落地页（`/`）解析

发布新版本时，请在**两个**文件中添加相同的 `## [x.y.z] - date` 小节。

## 发布版本

```bash
git tag v0.2.4
git push origin v0.2.4
```

GitHub Actions 密钥：参见 [docs/UPDATER.md](docs/UPDATER.md)。

## 开放源码

Sideglass 以 PolyForm Noncommercial License 1.0.0 许可开放源码。商业使用、转售、再分发、白标、付费托管或竞争性商业分支需要获得 Moises Valero 的书面许可。

- [提交 issue](https://github.com/moisesvalero/sideglass-dashboard/issues)
- 欢迎提交 Pull Request

## 许可证

[PolyForm Noncommercial License 1.0.0](LICENSE) — Copyright (c) 2026 Moises Valero
