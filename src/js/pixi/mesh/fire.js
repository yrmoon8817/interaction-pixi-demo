
import {
  Application,
  Assets,
  Geometry,
  Mesh,
  RenderTexture,
  Shader,
  Sprite,
} from 'pixi.js';

import vertexShader from '../../../multipassMesh.vert';
import noiseFragment from '../../../noise2.frag';

(async () => {
  // ───────────────────────────────────────────────
  // 1. PIXI 앱 초기화
  // ───────────────────────────────────────────────
  const app = new Application();
  await app.init({
    resizeTo: window,
    preference: 'webgl',
    resizeTo:window,
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
  mapSprite.visible = false; // 🔥 초기 숨김
  // ───────────────────────────────────────────────
  // 3. Geometry 설정
  // ───────────────────────────────────────────────
  const geometry = new Geometry({
    attributes: {
      aPosition: [
        0, 0,
        1920, 0,
        1920, 1080,
        0, 1080,
      ],
      aUV: [0, 0, 1, 0, 1, 1, 0, 1],
    },
    indexBuffer: [0, 1, 2, 0, 2, 3],
  });

  // ───────────────────────────────────────────────
  // 4. 노이즈 텍스처 로드
  // ───────────────────────────────────────────────
  const perlinTexture = await Assets.load('https://pixijs.com/assets/perlin.jpg');

  // ───────────────────────────────────────────────
  // 5. 노이즈 셰이더
  // ───────────────────────────────────────────────
  const noiseShader = Shader.from({
    gl: {
      vertex: vertexShader,
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
  // 6. Mesh + RenderTexture 구성
  // ───────────────────────────────────────────────
  const noiseTexture = RenderTexture.create({ width: 1920, height: 1080 });
  const noiseQuad = new Mesh({ geometry, shader: noiseShader });
  noiseQuad.position.set(0, 0);

  const noiseMaskSprite = new Sprite(noiseTexture);
  noiseMaskSprite.anchor.set(0.5);
  noiseMaskSprite.position.set(app.screen.width / 2, app.screen.height / 2);
  app.stage.addChild(noiseMaskSprite);

  // 지도에 마스크 적용
  mapSprite.mask = noiseMaskSprite;

  // 처음 한 번 렌더링
  app.renderer.render({
    container: noiseQuad,
    target: noiseTexture,
    clear: true,
  });

  // ───────────────────────────────────────────────
  // 7. 반복 애니메이션
  // ───────────────────────────────────────────────
  let limit = 0;
  let direction = 1; // 1: 지도 드러남, -1: 다시 검은 덩어리

  app.ticker.add((ticker) => {
    limit += 0.004 * direction * ticker.deltaTime; // 속도 조절 가능

    // 값 왕복
    if (limit >= 1) direction = -1;
    if (limit <= 0) direction = 1;

    // 셰이더에 전달
    noiseQuad.shader.resources.noiseUniforms.uniforms.limit = limit;

    // 새로 렌더링
    app.renderer.render({
      container: noiseQuad,
      target: noiseTexture,
      clear: true,
    });
    mapSprite.visible = true; // 🔥 이제 표시
  });
})();
