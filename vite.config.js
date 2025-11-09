// vite.config.js
import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import glsl from 'vite-plugin-glsl'; // ✅ 추가

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
        page6: resolve(__dirname, 'pages/00_06_wave1.html'),
        page7: resolve(__dirname, 'pages/00_07_wave2.html'),
        page8: resolve(__dirname, 'pages/01_10_count_circle.html'),
        page9: resolve(__dirname, 'pages/01_10_firework.html'),
        page10: resolve(__dirname, 'pages/00_08_wave3.html'),
        page11: resolve(__dirname, 'pages/00_09_text1.html'),
        page12: resolve(__dirname, 'pages/00_10_mesh.html'),
        page13: resolve(__dirname, 'pages/00_11_filter.html'),
      }
    }
  },
    plugins: [
    glsl({
      include: ['**/*.glsl', '**/*.frag', '**/*.vert'], // 불러올 확장자
      exclude: undefined,
      defaultExtension: 'glsl',
      warnDuplicatedImports: false,
      compress: false, // 코드 압축 비활성화 (가독성 위해)
    }),
  ],
});