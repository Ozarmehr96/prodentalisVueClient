import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import pkg from './package.json';
import { VitePWA } from 'vite-plugin-pwa'
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
    VitePWA({
      registerType: 'autoUpdate',        // Автообновление SW
      includeAssets: [],
      manifest: {
        name: 'ProDentalis',
        short_name: 'ProDentalis',
        description: 'Автоматизация зуботехнической лаборатории',
        theme_color: '#3dd2cc', // цвет браузерной строки
        background_color: '#ffffff', // цвет сплэш-скрина
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/pwa-logo-192.png', sizes: '192x192', type: 'image/png' },
          // { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
          { src: '/pwa-logo.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        // ⚠️ Важно: не кэшируем API-запросы
        runtimeCaching: [],  
        cleanupOutdatedCaches: true // автоматически удаляет старые кеши
      },
      devOptions: {
        enabled: true,   // чтобы PWA работало на localhost
        type: 'module'
      }
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
    
    allowedHosts: ["3e6d7526a96861.lhr.life", "flocculable-livingly-imelda.ngrok-free.dev"]
  }
})

