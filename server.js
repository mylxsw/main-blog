const express = require('express');
const path = require('path');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 8080;

// 在启动时构建一次
console.log('Building site...');
exec('node build.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Build error: ${error}`);
        return;
    }
    console.log('Build completed');
    
    // 提供静态文件服务
    app.use(express.static(path.join(__dirname, 'public')));
    
    // 处理所有路由，返回index.html（用于SPA）
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public/index.html'));
    });
    
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
});