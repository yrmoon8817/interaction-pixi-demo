

import { Particle as PIXIParticle } from 'pixi.js';
import { randomNumBetween, hexToRgb } from './utils.js';

export default class Particle extends PIXIParticle {
  constructor(texture, x, y, degree, colors, spread = 30) {
    super({ texture });
    this.reset(x, y, degree, colors, spread);
  }

  reset(x, y, degree, colors, spread) {
    this.x = x;
    this.y = y;

    // ---- 색상 ----
    this.colors = colors || ['#FF588F', '#FF884B', '#FFD384', '#FFF9B0'];
    const color = this.colors[Math.floor(randomNumBetween(0, this.colors.length))];
    const rgb = hexToRgb(color);
    this.tint = (rgb.r << 16) + (rgb.g << 8) + rgb.b;

    // ---- 물리 ----
    const rad = (Math.PI / 180) * randomNumBetween(degree - spread, degree + spread);
    const speed = randomNumBetween(10, 50);
    this.vx = speed * Math.cos(rad);
    this.vy = speed * Math.sin(rad);
    this.friction = 0.89;
    this.gravity = 0.5;

    // ---- 회전 ----
    this.rotation = randomNumBetween(0, 360);
    this.rotationDelta = randomNumBetween(-1, 1);

    // ---- 스케일 기본값 ----
    this.scaleBase = randomNumBetween(0.3, 0.9);

    // ---- 컨페티 흔들림용 독립 변수 추가 ----
    this.widthDelta = randomNumBetween(0, 360);
    this.heightDelta = randomNumBetween(0, 360);

    this.alpha = 1;
  }

  update() {
    // ---- 물리 ----
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.x += this.vx;
    this.y += this.vy;

    // ---- 회전 ----
    this.rotation += this.rotationDelta;

    // ---- 스케일 흔들림 (컨페티 효과) ----
    this.widthDelta += 10;
    this.heightDelta += 10;

    const wobbleX = Math.cos(this.widthDelta * Math.PI / 180);
    const wobbleY = Math.sin(this.heightDelta * Math.PI / 180);

    const scaleX = this.scaleBase * Math.abs(wobbleX);
    const scaleY = this.scaleBase * Math.abs(wobbleY);

    this.scaleX = scaleX;
    this.scaleY = scaleY;

    // ---- 투명도 ----
    this.alpha -= 0.007;
  }

  get opacity() {
    return this.alpha;
  }
}