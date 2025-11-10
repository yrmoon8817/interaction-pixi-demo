import {
  Application,
  Assets,
  Geometry,
  Mesh,
  RenderTexture,
  Shader,
  Sprite,
} from 'pixi.js';

import vertexShader from '../../../multipassMesh.vert'; // 변경: 이름 변경으로 중복 방지
import noiseFragment from '../../../noise2.frag';  // 유지

(async () => {
  // ───────────────────────────────────────────────
  // 1. PIXI 애플리케이션 초기화
  // ───────────────────────────────────────────────
  const app = new Application();
  await app.init({
    resizeTo: window,
    preference: 'webgl',
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  document.querySelector('.wrap').appendChild(app.canvas);

  // ───────────────────────────────────────────────
  // 2. 지도 이미지 로드
  // ───────────────────────────────────────────────
  const mapTexture = await Assets.load('../img/map.jpg');
  const mapSprite = new Sprite(mapTexture);
  mapSprite.anchor.set(0.5);
  mapSprite.position.set(app.screen.width / 2, app.screen.height / 2);
  mapSprite.width = 1920;
  mapSprite.height = 1080;
  app.stage.addChild(mapSprite);

  // ───────────────────────────────────────────────
  // 3. Geometry 설정 (aUV → aTextureCoord로 변경)
  // ───────────────────────────────────────────────
const geometry = new Geometry({
  attributes: {
    aPosition: [
      0, 0,
      1920, 0,
      1920, 1080,
      0, 1080,
    ],
    aUV: [0, 0, 1, 0, 1, 1, 0, 1], // ✅ 셰이더와 일치하도록 수정
  },
  indexBuffer: [0, 1, 2, 0, 2, 3],
});

  // ───────────────────────────────────────────────
  // 4. 퍼린 노이즈 텍스처 로드
  // ───────────────────────────────────────────────
  const perlinTexture = await Assets.load('https://pixijs.com/assets/perlin.jpg');

  // ───────────────────────────────────────────────
  // 5. 노이즈 셰이더 생성
  // ───────────────────────────────────────────────
  const noiseShader = Shader.from({
    gl: {
      vertex: vertexShader, // 변경: import 된 이름 사용
      fragment: noiseFragment,
    },
    resources: {
      noiseUniforms: {
        limit: { type: 'f32', value: 0.0 },
      },
      noise: perlinTexture.source,
    },
  });

  // ───────────────────────────────────────────────
  // 6. 노이즈 메쉬 + 렌더텍스처 + 마스크 구성
  // ───────────────────────────────────────────────
  const noiseTexture = RenderTexture.create({ width: 1920, height: 1080 });
  const noiseQuad = new Mesh({ geometry, shader: noiseShader });
  noiseQuad.position.set(0, 0);

  const noiseMaskSprite = new Sprite(noiseTexture);
  noiseMaskSprite.anchor.set(0.5);
  noiseMaskSprite.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.addChild(noiseMaskSprite);
  mapSprite.mask = noiseMaskSprite;

  // ───────────────────────────────────────────────
  // 7. 애니메이션 루프
  // ───────────────────────────────────────────────
  const startTime = performance.now();
  const duration = 10000;
  app.ticker.add(() => {
    const elapsed = performance.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);

    noiseQuad.shader.resources.noiseUniforms.uniforms.limit = progress;

    app.renderer.render({
      container: noiseQuad,
      target: noiseTexture,
      clear: true,
    });
    if (progress >= 1.0) {
      app.ticker.stop()
    };
  });
})();

