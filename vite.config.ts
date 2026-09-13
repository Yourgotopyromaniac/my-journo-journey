import { fileURLToPath, URL } from 'node:url'
import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const mdxPlugin = mdx({ remarkPlugins: [remarkGfm] })

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdxPlugin,
      // Leave `?raw` imports alone: search loads lesson files as plain text.
      transform(code, id) {
        if (id.includes('?raw')) return undefined
        return mdxPlugin.transform(code, id)
      },
    },
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'My Journo Journey',
        short_name: 'Journo Journey',
        description: 'A 24-week digital journalism course, made for Princess.',
        theme_color: '#F5F0E6',
        background_color: '#F5F0E6',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Cache the app shell and every lesson chunk up front, so all written content works offline.
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Cyrillic glyphs are never used, so skip downloading them. Latin-ext and Vietnamese
        // subsets stay because they cover Yoruba letters such as ẹ, ọ and ṣ.
        globIgnores: ['**/*cyrillic*'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: { cacheName: 'fonts', expiration: { maxEntries: 30 } },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: { cacheName: 'images', expiration: { maxEntries: 200 } },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
