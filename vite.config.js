// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',  // 상대 경로로 설정: 빌드 시 /assets → ./assets
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        page1: resolve(__dirname, 'pages/00_01_confetti.html'),
        page2: resolve(__dirname, 'pages/00_02_confetti.html'),
        page3: resolve(__dirname, 'pages/00_03_confetti.html'),
        page4: resolve(__dirname, 'pages/00_04_confetti.html'),
        page5: resolve(__dirname, 'pages/00_05_confetti.html'),
        page6: resolve(__dirname, 'pages/00_06_count_circle.html'),
        page7: resolve(__dirname, 'pages/00_07_firework.html'),
        page8: resolve(__dirname, 'pages/01_01_confetti.html'),
      }
    }
  }
});