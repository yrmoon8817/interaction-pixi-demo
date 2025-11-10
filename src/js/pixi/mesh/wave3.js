import { Application, MeshPlane, Assets, RenderTexture, AnimatedSprite } from "pixi.js";

export default async function example() {
  const app = new Application();
  await app.init({
    backgroundAlpha: 0,
    width: 600,
    height: 500,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  app.canvas.id = "app-canvas";
  document.querySelector(".page").appendChild(app.canvas);

  const texture = await Assets.load("../img/wave2.png");

  // --- 메쉬 플레인 ---
  const plane = new MeshPlane({
    texture,
    verticesX: 10,
    verticesY: 10,
  });
  plane.width = 600;
  plane.height = 500;

  const positionAttribute = plane.geometry.getAttribute("aPosition");
  const { buffer } = positionAttribute;
  const initialVertices = buffer.data.slice();

  // --- 파동 설정 ---
  const angularSpeed = 0.2;
  const amplitude = 6.0;
  const cycleFrames = Math.round(2 * Math.PI / angularSpeed) * 1.5;
  const textures = [];

  const rightStart = plane.width * 0.66;
  const centerTop = plane.height * 0.33;
  const centerBottom = plane.height * 0.66;

  // --- 정방향 프레임 생성 ---
  for (let frame = 0; frame < cycleFrames; frame++) {
    const timer = (frame / cycleFrames) * (2 * Math.PI / angularSpeed);
    const vertices = initialVertices.slice();

    for (let i = 0; i < vertices.length; i += 2) {
      const x = vertices[i];
      const y = vertices[i + 1];
      if (x > rightStart && y > centerTop && y < centerBottom) {
        vertices[i + 1] += Math.sin(timer * 0.8 + i) * amplitude;
      }
    }

    buffer.data = vertices;
    buffer.update();

    const renderTexture = RenderTexture.create({ width: 600, height: 500 });
    app.renderer.render(plane, { renderTexture });
    textures.push(renderTexture);
  }

  // --- 역방향 프레임 추가 (마지막 프레임 제외하여 seamless 연결) ---
  const reverseFrames = textures.slice(0, -1).reverse();
  const alternateTextures = [...textures, ...reverseFrames];

  // --- AnimatedSprite ---
  const animatedSprite = new AnimatedSprite(alternateTextures);
  animatedSprite.animationSpeed = 0.13;
  animatedSprite.loop = true; // 왕복도 반복되게
  animatedSprite.play();

  app.stage.addChild(animatedSprite);

  // --- 초기화 ---
  buffer.data = initialVertices;
  buffer.update();
}

example();


