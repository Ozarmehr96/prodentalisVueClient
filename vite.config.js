import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import pkg from './package.json';
export default defineConfig({
  base: '/', // ✅ абсолютные пути к ассетам
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version)
  },
  plugins: [
    vue(),
    Pages({
      dirs: 'src/pages', // где лежат страницы
      extensions: ['vue'], // расширение
      importMode: 'async', // ленивая подгрузка
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    fs: {
      strict: false
    },
    allowedHosts: ["3e6d7526a96861.lhr.life"]
  }
})

