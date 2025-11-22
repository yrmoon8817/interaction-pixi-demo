import {
  Application,
  Assets,
  Container,
  DisplacementFilter,
  Sprite,
  Graphics,
} from "pixi.js";

(async () => {
  const app = new Application();
  await app.init({ resizeTo: window });
  document.querySelector(".wrap").appendChild(app.canvas);

  await Assets.load([
    "https://pixijs.com/assets/pixi-filters/displace.png",
    "https://pixijs.com/assets/pixi-filters/ring.png",
    "../img/filter.jpg",
  ]);

  app.stage.eventMode = "static";

  const container = new Container();
  app.stage.addChild(container);

  // ===============================
  // 🔍 Displacement Filter 구성
  // ===============================
  const displacementSprite = Sprite.from(
    "https://pixijs.com/assets/pixi-filters/displace.png"
  );
  displacementSprite.anchor.set(0.5);
  app.stage.addChild(displacementSprite);

  const displacementFilter = new DisplacementFilter({
    sprite: displacementSprite,
    scale: 150, // 초기 확대 강도
  });

  container.filters = [displacementFilter];

  // 🔎 돋보기 UI
  const ring = Sprite.from("https://pixijs.com/assets/pixi-filters/ring.png");
  ring.anchor.set(0.5);
  ring.visible = false;
  app.stage.addChild(ring);

  // 🖼 배경 이미지
  const bg = Sprite.from("../img/filter.jpg");
  bg.width = app.screen.width;
  bg.height = app.screen.height;
  container.addChild(bg);

  // ===============================
  // 🎯 돋보기 이동 이벤트
  // ===============================
  app.stage.on("pointermove", (event) => {
    ring.visible = true;
    displacementSprite.position.set(event.global.x - 25, event.global.y);
    ring.position.copyFrom(displacementSprite.position);
  });

  // ===============================
  // 🎚 슬라이더 UI
  // ===============================
  const sliderWidth = 320;
  const slider = new Graphics()
    .rect(0, 0, sliderWidth, 6)
    .fill(0xffffff);

  slider.x = (app.screen.width - sliderWidth) / 2;
  slider.y = app.screen.height * 0.85;

  // 이벤트 활성화
  slider.eventMode = "static";

  const handle = new Graphics().circle(0, 0, 15).fill(0xffffff);
  handle.y = slider.height / 2;
  handle.x = sliderWidth / 2;
  handle.eventMode = "static";
  handle.cursor = "pointer";

  slider.addChild(handle);
  app.stage.addChild(slider);

  let dragging = false;

  // 드래그 시작
  handle.on("pointerdown", (e) => {
    dragging = true;
    e.stopPropagation(); // stage에 이벤트 전달 방지
  });

  // 드래그 종료
  handle.on("pointerup", () => (dragging = false));
  handle.on("pointerupoutside", () => (dragging = false));

  // 슬라이더 이동 로직
  slider.on("pointermove", (e) => {
    if (!dragging) return;

    e.stopPropagation();

    const halfWidth = handle.width / 2;
    const localX = slider.toLocal(e.global).x;

    handle.x = Math.max(
      halfWidth,
      Math.min(localX, sliderWidth - halfWidth)
    );

    // 0~1 비율 계산
    const ratio = handle.x / sliderWidth;

    // 확대 강도 → 유라님 상황에 맞게 조절 가능
    const minScale = 20;
    const maxScale = 200;

    const newScale = minScale + (maxScale - minScale) * ratio;

    // v8 방식 적용
    displacementFilter.scale.x = newScale;
    displacementFilter.scale.y = newScale;
  });
})();

