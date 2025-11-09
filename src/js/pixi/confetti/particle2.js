import { Sprite } from 'pixi.js';
import { randomNumBetween, hexToRgb } from './utils.js';

export default class Particle {
  constructor(texture, x, y, degree = 0, colors, spread = 30, shape = 'circle') {
    this.shape = shape;
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.x = x;
    this.sprite.y = y;

    // 속도/물리
    this.angle = Math.PI / 180 * randomNumBetween(degree - spread, degree + spread);
    this.r = randomNumBetween(10, 50);
    this.vx = this.r * Math.cos(this.angle);
    this.vy = this.r * Math.sin(this.angle);
    this.friction = 0.89;
    this.gravity = 0.5;

    // 색상
    this.colors = colors || ['#FF588F', '#FF884B', '#FFD384', '#FFF9B0'];
    const c = this.colors[Math.floor(randomNumBetween(0, this.colors.length))];
    const rgb = hexToRgb(c);
    this.sprite.tint = (rgb.r << 16) + (rgb.g << 8) + rgb.b;

    // 회전/스케일 초기화
    this.rotation = randomNumBetween(0, 360);
    this.rotationDelta = randomNumBetween(-1, 1);
    this.widthDelta = randomNumBetween(0, 360);
    this.heightDelta = randomNumBetween(0, 360);
    this.scaleBase = randomNumBetween(0.3, 0.7);

    this.opacity = 1;
  }

  update(delta = 1) {
    // 물리 갱신
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;

    this.sprite.x += this.vx;
    this.sprite.y += this.vy;

    // 회전/스케일 변화
    this.rotation += this.rotationDelta;
    this.sprite.rotation = this.rotation * Math.PI / 180;

    // 진동 효과
    this.widthDelta += 10;
    this.heightDelta += 10;
    const wobbleX = Math.cos(this.widthDelta * Math.PI / 180);
    const wobbleY = Math.sin(this.heightDelta * Math.PI / 180);
    this.sprite.scale.set(this.scaleBase * Math.abs(wobbleX), this.scaleBase * Math.abs(wobbleY));

    // 투명도
    this.opacity -= 0.007;
    this.sprite.alpha = this.opacity;
  }
}