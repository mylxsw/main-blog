# Markdown Blog

A simple static blog generator using Markdown files.

## Features
- Write posts in Markdown
- Front-matter support for metadata (date, tags, etc.)
- Static site generation
- Docker deployment
- Responsive design

## 项目结构

```
markdown-blog/
├── pages/                  # Markdown源文件目录
├── public/                 # 生成的静态文件目录
├── templates/              # HTML模板目录
├── package.json            # 项目依赖配置
├── build.js                # 构建脚本
├── server.js               # 开发服务器
├── markdown-parser.js      # Markdown解析器
├── page-generator.js       # 页面生成器
├── Dockerfile              # Docker配置文件
├── docker-compose.static.yml  # Docker Compose静态部署配置文件
├── nginx.simple.conf       # Nginx配置文件
└── README.md               # 项目说明文档
```

## 快速开始

1. 安装依赖：
   ```
   npm install
   ```

2. 构建静态网站：
   ```
   npm run build
   ```

3. 启动开发服务器：
   ```
   npm start
   ```

   访问地址：http://localhost:8080

## 使用Docker部署

### 静态部署（推荐）

构建镜像：
```
docker build -t markdown-blog .
```

运行容器：
```
docker run -d -p 3000:80 markdown-blog
```

访问网站：
```
http://127.0.0.1:3000
```

### 使用Docker Compose部署

构建并启动容器：
```
docker-compose -f docker-compose.static.yml up -d
```

访问网站：
```
http://127.0.0.1:8080
```

## 编写文章

在 `pages` 目录下创建Markdown文件，支持以下Front-matter元数据：

```markdown
---
title: 文章标题
date: 2023-04-15
tags: [tag1, tag2, tag3]
---

# 文章内容

这里是文章的Markdown内容...
```

文件路径会自动映射为URL路径：
- `pages/abc.md` → `http://127.0.0.1:3000/abc.html`
- `pages/sub/xyz.md` → `http://127.0.0.1:3000/sub/xyz.html`

## 开发指南

### 添加新功能

1. 修改模板文件在 `templates/` 目录
2. 修改样式文件在 `public/styles/main.css`
3. 重新构建项目：`npm run build`

### 自定义配置

- 修改端口：在 `docker-compose.static.yml` 或 `docker run` 命令中更改端口映射
- 修改Nginx配置：编辑 `nginx.simple.conf` 文件

## 故障排除

1. 如果无法访问网站，请尝试使用 `127.0.0.1` 而不是 `localhost`
2. 检查Docker容器是否正常运行：`docker ps`
3. 查看容器日志：`docker logs <container-id>`