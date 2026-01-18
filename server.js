
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的路径 (用于 ES Module 环境)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// 使用服务器环境变量中的 PORT，或者默认为 3000
const PORT = process.env.PORT || 3000;

// ==========================================
// 核心配置：托管静态资源
// ==========================================
// 1. 在运行 npm run build 后，Vite 会将 public 文件夹的内容（图片、音频）
//    复制到 dist 文件夹的根目录下。
// 2. express.static 会让外部可以通过 http://your-site/pics/xxx.jpg 访问这些文件
app.use(express.static(path.join(__dirname, 'dist')));

// ==========================================
// SPA 路由回退
// ==========================================
// 任何不匹配静态文件的请求（例如刷新页面时的路由），都返回 index.html
// 让 React Router 在前端处理页面跳转
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  ✅ Server is running successfully!
  ----------------------------------
  Listening on port: ${PORT}
  Serving files from: ${path.join(__dirname, 'dist')}
  
  如果你看不到图片，请确保你已经运行了 'npm run build'
  `);
});
