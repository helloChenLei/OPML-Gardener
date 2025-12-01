# OPML Gardener 🌾

**在本地整理您的订阅源**

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![Privacy First](https://img.shields.io/badge/Privacy-First-green?style=flat-square&logo=shield)
![MIT License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

[在线演示](#) • [功能特性](#-功能特性) • [快速开始](#-快速开始) • [部署](#-部署)

</div>

---

## 📖 简介

**OPML Gardener** 是一个现代化的 RSS 订阅源管理工具。它完全在您的浏览器中运行，帮助您清洗、去重、分类杂乱的 OPML 文件，为迁移阅读器做好准备。

无需担心隐私问题 —— 您的 OPML 文件永不离开浏览器，所有处理都在本地完成。

### 🎯 适用场景

- 📦 从一个 RSS 阅读器迁移到另一个
- 🧹 清理多年积累的订阅源
- 🔍 查找并删除失效的订阅源
- 🗂️ 重新组织订阅分类
- 🎨 合并多个 OPML 文件

---

## ✨ 功能特性

### 🛡️ 隐私优先 (Privacy First)

> **所有解析逻辑在本地运行，OPML 文件永不上传到服务器**

- ✅ 100% 客户端处理
- ✅ 零服务器存储
- ✅ 零数据收集
- ✅ 零追踪分析

**例外说明**: 如使用"更新时间刷新"功能，会通过公共 CORS 代理（allorigins.win）发送 RSS 链接以获取 feed 状态。详见 [PRIVACY.md](./PRIVACY.md)

### ⚡ 极速体验

基于 **Next.js 14** 构建，操作零延迟：

- 🚀 即时解析大型 OPML 文件（1000+ 订阅源）
- ⚡ 实时搜索和筛选
- 🎯 流畅的编辑和排序体验
- 🌓 丝滑的深色模式切换

### 🧹 批量管理

强大的批量操作能力：

- ✅ **批量选择** - 全选/反选/按条件选择
- 📦 **批量移动** - 一键移动多个订阅源到新分类
- 🗑️ **批量删除** - 快速清理无用订阅
- 📤 **批量导出** - 导出选中的订阅源
- 🏷️ **批量编辑** - 批量修改分类和属性

### 🔍 深度清洗

自动检测和修复常见问题：

- 🎯 **智能去重** - 基于 RSS 链接自动检测重复源
- 🩺 **健康检查** - 验证 RSS 链接有效性
- 📅 **更新检测** - 获取 feed 最后更新时间
- 🔗 **链接修复** - 一键测试所有订阅源

### 🎨 Notion 风格界面

现代化的用户体验：

- 📊 **一体化表格** - 所有操作集成在表格内
- 🔍 **工具栏筛选** - 搜索、分类、状态筛选
- 📋 **全宽视图** - 最大化信息显示
- ⚡ **即时反馈** - 实时显示筛选结果
- ↩️ **撤销/重做** - 支持最多 50 步操作历史

### ⌨️ 键盘快捷键

提升效率的快捷键：

- `Ctrl/Cmd + Z` - 撤销
- `Ctrl/Cmd + Y` - 重做
- `Ctrl/Cmd + S` - 导出全部
- `Ctrl/Cmd + A` - 全选
- `Escape` - 取消选择

### 📊 高级功能

- 🔄 **表头排序** - 按状态、分类、标题、链接、更新时间排序
- 🌐 **多格式支持** - 导入/导出 OPML 和 JSON
- 📥 **拖拽上传** - 拖放 OPML 文件即可导入
- 👁️ **导出预览** - 导出前预览内容
- ✏️ **表内编辑** - 直接点击单元格编辑

---

## 🚀 快速开始

### 方式一：在线使用（推荐）

访问在线版本，无需安装任何东西：

**[https://your-deploy-url.vercel.app](https://your-deploy-url.vercel.app)**

### 方式二：本地运行

#### 前置要求

- Node.js 18.0 或更高版本
- npm / yarn / pnpm

#### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/yourusername/opml-gardener.git
cd opml-gardener

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

#### 构建生产版本

```bash
npm run build
npm run start
```

---

## 📖 使用指南

### 1️⃣ 导入 OPML 文件

<img src="docs/import.png" alt="导入界面" width="600">

- 拖拽 OPML 文件到上传区域
- 或点击选择文件
- 支持 OPML 和 JSON 格式

### 2️⃣ 筛选和搜索

<img src="docs/filter.png" alt="筛选功能" width="600">

- 🔍 搜索框：搜索标题或链接
- 🗂️ 分类筛选：按分类查看
- ✅ 状态筛选：有效/无效/未检测

### 3️⃣ 编辑和管理

<img src="docs/edit.png" alt="编辑功能" width="600">

- 点击标题/链接直接编辑
- 点击分类标签切换分类
- 使用批量操作处理多个订阅源

### 4️⃣ 清洗和优化

- 🧹 点击"去重"按钮删除重复订阅
- 🔄 点击"刷新"更新所有 feed 时间
- ✅ 查看状态图标了解 feed 健康度

### 5️⃣ 导出结果

- 📤 导出全部订阅源
- ✅ 导出选中的订阅源
- 🔍 导出当前筛选结果
- 选择 OPML 或 JSON 格式

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 14.2 | React 框架，App Router |
| **TypeScript** | 5.3 | 类型安全 |
| **Tailwind CSS** | 3.4 | 样式框架 |
| **fast-xml-parser** | 4.3 | OPML/XML 解析 |
| **Lucide React** | 0.344 | 图标库 |
| **shadcn/ui** | - | UI 组件库 |

### 架构特点

- 🏗️ **App Router** - Next.js 14 最新路由系统
- 🎨 **组件化设计** - 可复用的 React 组件
- 🔒 **类型安全** - 完整的 TypeScript 覆盖
- 📦 **模块化架构** - 清晰的代码组织
- ⚡ **性能优化** - 虚拟滚动和懒加载

---

## 📁 项目结构

```
OPMLGardener/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 根布局
│   ├── page.tsx             # 主页面
│   ├── globals.css          # 全局样式
│   └── test-xml/            # XML 测试页面
├── components/              # React 组件
│   ├── ui/                  # shadcn/ui 基础组件
│   ├── OpmlUploader.tsx     # 文件上传
│   ├── FeedTable.tsx        # 订阅源表格
│   ├── FloatingActionBar.tsx # 浮动操作栏
│   ├── AddCategoryDialog.tsx # 添加分类对话框
│   ├── ExportPreviewDialog.tsx # 导出预览
│   └── BulkEditDialog.tsx   # 批量编辑
├── hooks/                   # React Hooks
│   ├── useOpml.ts           # OPML 状态管理
│   ├── useHistory.ts        # 撤销/重做
│   └── useKeyboardShortcuts.ts # 快捷键
├── lib/                     # 核心逻辑
│   ├── opml-parser.ts       # OPML 解析和导出
│   ├── json-handler.ts      # JSON 处理
│   ├── rss-validator.ts     # RSS 验证
│   ├── feed-health-checker.ts # Feed 健康检查
│   ├── xml-escape.ts        # XML 转义工具
│   └── utils.ts             # 工具函数
├── types/                   # TypeScript 类型
│   └── index.ts             # 类型定义
├── docs/                    # 文档和审计报告
│   ├── SECURITY_AUDIT_REPORT.md
│   └── REFACTORING_REPORT.md
├── PRIVACY.md               # 隐私政策
└── LICENSE                  # MIT 许可证
```

---

## 🌐 部署

本项目已配置为**静态导出**，可直接部署到任何静态托管平台。

### Vercel (推荐)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/opml-gardener)

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel
```

### Cloudflare Pages

```bash
# 构建
npm run build

# 部署到 Cloudflare Pages
# 构建命令: npm run build
# 输出目录: out
```

### Netlify

```bash
# 构建
npm run build

# 部署到 Netlify
# 构建命令: npm run build
# 发布目录: out
```

### 其他静态托管

任何支持静态文件的平台：

- GitHub Pages
- GitLab Pages
- AWS S3 + CloudFront
- Azure Static Web Apps

只需运行 `npm run build` 并部署 `out` 目录。

---

## 🔒 隐私和安全

我们非常重视您的隐私。详细信息请查看 [PRIVACY.md](./PRIVACY.md)

### 核心原则

- ✅ **本地优先** - 所有数据处理在浏览器中完成
- ✅ **零追踪** - 不使用任何分析工具
- ✅ **零存储** - 不在服务器存储任何数据
- ✅ **开源透明** - 所有代码公开可审计

### 安全审计

项目经过完整的安全审计：

- ✅ XSS 防护验证
- ✅ XML 注入防护
- ✅ 依赖安全扫描
- ✅ 类型安全检查

详见 [SECURITY_AUDIT_REPORT.md](./docs/SECURITY_AUDIT_REPORT.md)

---

## 🧪 开发

### 代码质量

```bash
# 运行 linter
npm run lint

# 类型检查
npx tsc --noEmit
```

### 项目标准

- ✅ TypeScript 严格模式
- ✅ 零 `any` 类型（除合理用途）
- ✅ ESLint 规则遵循
- ✅ 组件化设计
- ✅ 完整的类型定义

### 代码审计报告

- [安全审计报告](./docs/SECURITY_AUDIT_REPORT.md)
- [重构报告](./docs/REFACTORING_REPORT.md)

---

## 📝 变更日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解详细的版本历史。

### 最新版本 v1.3.0

- 🎨 Notion 风格界面重设计
- 🔒 完整安全审计
- 🧹 代码重构和优化
- ✅ 类型安全增强
- 📚 完整文档

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 开发规范

- 遵循现有代码风格
- 添加必要的类型定义
- 更新相关文档
- 确保通过 linter

---

## 🙏 致谢

感谢以下开源项目：

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [shadcn/ui](https://ui.shadcn.com/) - UI 组件
- [fast-xml-parser](https://github.com/NaturalIntelligence/fast-xml-parser) - XML 解析
- [Lucide](https://lucide.dev/) - 图标库

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](./LICENSE) 文件了解详情。

---

## 📮 联系方式

- 提交 Issue: [GitHub Issues](https://github.com/yourusername/opml-gardener/issues)
- 讨论: [GitHub Discussions](https://github.com/yourusername/opml-gardener/discussions)

---

<div align="center">

**由 ❤️ 制作**

如果这个项目对您有帮助，请给一个 ⭐️ Star！

[回到顶部](#opml-gardener-)

</div>
