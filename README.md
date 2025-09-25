# Main Blog (Next.js)

使用现代化的 React 技术栈（Next.js + Tailwind CSS）驱动的静态博客。文章内容仍然使用 Markdown 编写，构建阶段会自动解析并生成高性能的静态页面。

## 特性

- ⚛️ 基于 Next.js App Router，支持自动静态化和渐进式增强
- 📝 使用 Markdown + Front Matter 管理文章内容，支持目录递归
- 🏎️ 首页列表、文章详情均经过性能优化，支持懒加载与图片渐进动画
- 🎨 Tailwind CSS + 自定义主题，默认暗色风格且易于维护
- 📦 通过 `output: export` 生成纯静态资源，可直接部署到任意静态托管平台

## 项目结构

```text
main-blog/
├── app/                 # Next.js App Router 页面与布局
├── components/          # 可复用的 React 组件
├── content/             # Markdown 文章（可按目录分类）
├── lib/                 # Markdown 解析与数据层工具方法
├── public/              # 静态资源（图片、favicon 等）
├── tailwind.config.ts   # Tailwind CSS 配置
├── next.config.mjs      # Next.js 配置（开启静态导出）
├── docker-compose.yaml  # 本地容器化运行配置
└── Dockerfile           # 生产镜像构建
```

## 快速开始

1. 安装依赖（需要 Node.js 18+）：
   ```bash
   npm install
   ```
2. 启动本地开发服务器：
   ```bash
   npm run dev
   ```
   浏览器访问 <http://localhost:3000>

3. 生成静态站点：
   ```bash
   npm run build
   ```
   构建完成后静态资源位于 `out/` 目录，可直接部署到静态服务器。

## Docker 部署

```bash
docker build -t main-blog .
docker run -p 8080:80 main-blog
```

构建脚本会自动执行 `next build` 并导出静态资源，最终由 Nginx 提供服务。

## 编写文章

- 在 `content/` 目录中新增 `.md` 文件即可。
- Markdown 文件可以包含如下 Front Matter：

  ```markdown
  ---
  title: 标题
  date: 2024-05-20
  tags: [react, nextjs]
  ---
  ```

- 支持嵌套目录，访问路径与文件相同：`content/system/about.md` → `/system/about/`

## 图片渐进加载

所有文章中的图片都会自动应用渐进式加载动画：初始轻微模糊+放大，加载完成后平滑过渡到清晰状态，带来更自然的阅读体验。

## License

MIT
