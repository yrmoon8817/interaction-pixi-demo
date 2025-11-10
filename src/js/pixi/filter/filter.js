import {
  Application,
  Assets,
  Container,
  DisplacementFilter,
  Sprite,
} from 'pixi.js';

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ resizeTo: window});

  // Append the application canvas to the document body
  document.querySelector('.wrap').appendChild(app.canvas);

  // Load the textures
  await Assets.load([
    'https://pixijs.com/assets/pixi-filters/displace.png',
    'https://pixijs.com/assets/pixi-filters/ring.png',
    '../../../public/img/filter.jpg',
  ]);

  app.stage.eventMode = 'static';

  const container = new Container();

  app.stage.addChild(container);


  const displacementSprite = Sprite.from(
    'https://pixijs.com/assets/pixi-filters/displace.png',
  );

  // Create a displacement filter
  const displacementFilter = new DisplacementFilter({
    sprite: displacementSprite,
    scale: 150,
  });

  app.stage.addChild(displacementSprite);

  // Apply the filter
  container.filters = [displacementFilter];

  displacementSprite.anchor.set(0.5);

  const ring = Sprite.from('https://pixijs.com/assets/pixi-filters/ring.png');

  ring.anchor.set(0.5);

  ring.visible = false;

  app.stage.addChild(ring);

  const bg = Sprite.from('../img/filter.jpg');

  bg.width = app.screen.width;
  bg.height = app.screen.height;

  container.addChild(bg);
  app.stage.on('mousemove', onPointerMove).on('touchmove', onPointerMove);
  function onPointerMove(eventData) {
    ring.visible = true;
    displacementSprite.position.set(
      eventData.data.global.x - 25,
      eventData.data.global.y,
    );
    ring.position.copyFrom(displacementSprite.position);
  }
})();