
import {
  Application,
  Text,
  TextStyle,
  Graphics,
  Container,
  BlurFilter
} from "pixi.js";

const rand = (min, max) => Math.random() * (max - min) + min;

class Particle {
  constructor(x, y) {
    this.g = new Graphics().rect(-1, -1, 2, 2).fill(0xff0000);
    this.g.x = x;
    this.g.y = y;
    this.g.alpha = rand(0.5, 1);

    const speed = rand(1, 3);
    this.vx = rand(-0.1, 1) * speed;
    this.vy = rand(-0.1,-1) * speed;

    this.life = 0;
    this.maxLife = rand(1000, 2000);
    this.last = performance.now();
  }

  update() {
    const now = performance.now();
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;

    this.g.x += this.vx * 60 * dt;
    this.g.y += this.vy * 60 * dt;

    this.g.alpha -= 0.01 * 60 * dt;
    if (this.g.alpha < 0) this.g.alpha = 0;

    this.life = dt
  }
}

async function run() {
  const app = new Application();
  await app.init({
    background: "#000000",
    resizeTo: window,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    preference: "webgl",
  });

  document.querySelector(".wrap").appendChild(app.canvas);

  const center = { x: app.screen.width / 2, y: app.screen.height / 2 };

  const style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 120,
    fill: 0xff0000,
    stroke: { color: 0xff0000, width: 4 },
  });

  const text = new Text({ text: "PIXIJS", style });
  text.anchor.set(0.5);
  text.position.set(center.x, center.y);
  app.stage.addChild(text);

  const blurFilter = new BlurFilter();
  blurFilter.strength = 0;
  text.filters = [blurFilter];

  // 🔥 한 프레임 기다린 후 픽셀 추출
  await new Promise(requestAnimationFrame);
  const pixels = app.renderer.extract.pixels(text);

  const gw = text.width;
  const gh = text.height;

  const particlesLayer = new Container();
  app.stage.addChild(particlesLayer);

  const particles = [];
  const DURATION = 2500;
  const DURATION2 = 1600;
  const start = performance.now();
  let spawnEnabled = true;

  app.ticker.add(() => {
    const now = performance.now();
    const elapsed = now - start;
    const progress = Math.min(elapsed / DURATION, 1);
    const progress2 = Math.min(elapsed / DURATION2, 1);

    text.alpha = 1 - progress;
    blurFilter.strength = progress * 12;

    if (progress2 >= 1) spawnEnabled = false;

    // 🔥 텍스트 내부에서 생성
    if (spawnEnabled) {
      for (let i = 0; i < 170; i++) {
        const x = Math.floor(Math.random() * gw);
        const y = Math.floor(Math.random() * gh / 1.5);

        const idx = (y * gw + x) * 4;
        const alpha = pixels[idx + 3];
        // 🔥 알파 기준으로 글자 영역 감지
        if (alpha < 600) continue;
        const px = center.x + (x - gw/2);
        const py = center.y + (y - gh/3);

        const p = new Particle(px, py);
        particlesLayer.addChild(p.g);
        particles.push(p);
      }
    }

    // 파티클 업데이트
    for (const p of particles) p.update();

    // 제거
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      if (p.g.alpha <= 0 || p.life > p.maxLife) {
        particlesLayer.removeChild(p.g);
        particles.splice(i, 1);
      }
    }
  });
}

run();


