import { Application, Container, Graphics } from 'pixi.js';
import Particle from './particle2.js';

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

  const particleContainer = new Container();
  app.stage.addChild(particleContainer);
  const particles = [];

  // ✅ 도형별 기본 텍스처 생성
  const textures = createParticleTextures(app);

  function confetti({ x, y, count, degree = 0, colors, shapes, spread = 30 }) {
    for (let i = 0; i < count; i++) {
      const shape = shapes ? shapes[Math.floor(Math.random() * shapes.length)] : 'circle';
      const tex = textures[shape];
      const p = new Particle(tex, x * app.screen.width, y * app.screen.height, degree, colors, spread, shape);
      particles.push(p);
      particleContainer.addChild(p.sprite);
    }
  }

  app.ticker.add(() => {
    // 테스트용 계속 뿌리기
    confetti({ x: 0, y: 0.5, count: 70, degree: -50 });
    confetti({ x: 1, y: 0.5, count: 70, degree: -130 });

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if (p.opacity <= 0) {
        particleContainer.removeChild(p.sprite);
        particles.splice(i, 1);
      }
    }
  });
}

function createParticleTextures(app) {
  const shapes = ['circle', 'square'];
  const textures = {};

  for (const shape of shapes) {
    const g = new Graphics();

    if (shape === 'circle') {
      g.circle(10, 10, 10).fill({ color: 0xffffff });
    } else {
      g.rect(0, 0, 10, 10).fill({ color: 0xffffff });
    }

    const tex = app.renderer.generateTexture(g);
    textures[shape] = tex;
  }

  return textures;
}

initApp();