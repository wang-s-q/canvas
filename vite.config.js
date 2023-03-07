import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from "node:url";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    https: false, //本地环境不用https
    hmr: true,
    port: 9999, //本地端口
    host: "0.0.0.0",
    cors: true,
    proxy: {
      //反向代理配置
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  define: {
    "process.env": {},
  },
})
