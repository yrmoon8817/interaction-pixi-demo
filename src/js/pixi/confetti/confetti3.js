


// initApp.js (메인)
import { Application, ParticleContainer, Graphics, RenderTexture, Rectangle, Texture } from 'pixi.js';
import Particle from './particle3.js';

async function initApp() {
  const app = new Application();
  await app.init({
    resizeTo: window,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x000000,
  });
  document.body.appendChild(app.canvas);

  const particleContainer = new ParticleContainer({
    dynamicProperties: {
      position: true,
      scale: true,
      rotation: true,
      alpha: true,
      tint: true,
    },
  });
  app.stage.addChild(particleContainer);

  const pool = [];
  const textures = await createParticleTextures(app);

  function confetti({ x, y, count, degree = 0, colors, spread = 30 }) {
    for (let i = 0; i < count; i++) {
      const shape = Math.random() < 0.6 ? 'circle' : 'square';
      const tex = textures[shape];

      let p = pool.pop();
      if (!p) {
        p = new Particle(tex, x * app.screen.width, y * app.screen.height, degree, colors || ['#FF588F', '#FF884B', '#FFD384', '#FFF9B0'], spread);
      } else {
        p.reset(x * app.screen.width, y * app.screen.height, degree, colors || ['#FF588F', '#FF884B', '#FFD384', '#FFF9B0'], spread);
      }
      particleContainer.addParticle(p);
    }
  }

  app.ticker.add(() => {
    confetti({ x: 0, y: 0.5, count: 100, degree: -50 });
    confetti({ x: 1, y: 0.5, count: 100, degree: -130 });

    const children = particleContainer.particleChildren;
    for (let i = children.length - 1; i >= 0; i--) {
      const p = children[i];
      p.update();
      if (p.opacity <= 0.05) {
        pool.push(p);
        particleContainer.removeParticleAt(i);
      }
    }
    particleContainer.update();
  });
}

async function createParticleTextures(app) {
  const atlas = RenderTexture.create({ width: 20, height: 16 });
  const g = new Graphics();

  const size1 = 10;
  g.circle(size1+4 / 2, size1 / 2, size1 / 2).fill(0xffffff);
  const size2 = 10;
  g.rect(size1, 0, size2, size2).fill(0xffffff);

  app.renderer.render({ container: g, target: atlas });
  g.destroy();

  return {
    circle: new Texture(atlas.source, new Rectangle(0, 0, 8, 8)),
    square: new Texture(atlas.source, new Rectangle(8, 0, 8, 8)),
  };
}

initApp();