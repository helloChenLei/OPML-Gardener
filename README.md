# OPML Gardener 🌱

一个现代化的 Web 应用，用于可视化、清理、过滤和重组 OPML RSS 订阅列表。

## ✨ 功能特性

### 核心功能
- 📤 **导入 OPML/JSON** - 支持拖拽上传或点击选择，支持 OPML 和 JSON 格式
- 📊 **表格视图** - 直观展示所有订阅源
- 🔍 **搜索和过滤** - 按标题、链接或分类筛选
- ✏️ **在线编辑** - 修改标题、分类、链接等
- 🗂️ **分类管理** - 轻松移动订阅源到不同分类，支持手动添加新分类
- 📥 **导出功能** - 导出全部或仅导出选中的订阅源，支持 OPML 和 JSON 格式
- 👁️ **导出预览** - 导出前预览订阅源列表
- 🧹 **去重功能** - 自动检测并删除重复的订阅源

### 高级功能
- ↩️ **撤销/重做** - 支持撤销/重做所有编辑操作
- 🏷️ **标签系统** - 为订阅源添加自定义标签
- 🔍 **RSS 验证** - 批量检查 RSS 链接有效性
- 🔄 **排序功能** - 按标题、分类、验证时间排序
- 📝 **批量编辑** - 批量修改多个订阅源的分类
- ⌨️ **快捷键** - 完整的键盘快捷键支持

### UI/UX
- 🌓 **深色模式** - 完整的深色主题支持，自动跟随系统
- 🎨 **现代 UI** - 使用 Tailwind CSS 和 shadcn/ui 构建
- 🔒 **隐私优先** - 所有数据在浏览器本地处理，不上传到服务器

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm run start
```

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **图标**: Lucide React
- **OPML 解析**: fast-xml-parser

## 📖 使用说明

1. **导入 OPML 文件**
   - 将 OPML 文件拖放到上传区域，或点击选择文件

2. **查看和编辑**
   - 在表格中查看所有订阅源
   - 使用侧边栏搜索或按分类筛选
   - 点击字段直接编辑标题、分类或链接

3. **批量操作**
   - 勾选多个订阅源进行批量选择
   - 使用"导出已选"功能导出选中的订阅源

4. **去重**
   - 点击"去除重复"按钮自动删除具有相同 RSS 链接的重复项

5. **导出**
   - 导出全部或仅导出选中的订阅源为新的 OPML 文件

## 📁 项目结构

```
OPMLGardener/
├── app/
│   ├── layout.tsx          # 根布局
│   ├── page.tsx            # 主页面
│   └── globals.css         # 全局样式
├── components/
│   ├── ui/                 # shadcn/ui 基础组件
│   ├── OpmlUploader.tsx    # OPML 文件上传组件
│   ├── FeedTable.tsx       # 订阅源表格组件
│   └── FilterSidebar.tsx   # 筛选侧边栏
├── hooks/
│   └── useOpml.ts          # OPML 状态管理 Hook
├── lib/
│   ├── utils.ts            # 工具函数
│   └── opml-parser.ts      # OPML 解析和导出
└── types/
    └── index.ts            # TypeScript 类型定义
```

## 🔮 未来计划

### v2.0.0 (长期)
- [ ] 订阅源分组功能
- [ ] 自定义主题
- [ ] 导出模板系统
- [ ] 订阅源统计分析
- [ ] 浏览器扩展版本

## 📝 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

由 ❤️ 制作

