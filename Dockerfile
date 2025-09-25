# Dockerfile for static blog

# 使用Node.js作为构建环境
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建静态文件
RUN npm run build

# 使用Nginx作为生产环境
FROM nginx:alpine

# 复制构建的静态文件到Nginx目录
COPY --from=builder /app/public /usr/share/nginx/html

# 复制简化版Nginx配置文件
COPY nginx.simple.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]