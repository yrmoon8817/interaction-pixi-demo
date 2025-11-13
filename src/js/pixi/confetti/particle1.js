// particle.js
import { Graphics } from 'pixi.js';
import { hexToRgb, randomNumBetween } from './utils.js';

export default class Particle {
  constructor(x, y, degree = 0, colors, shapes, spread = 30) {
    this.angle = Math.PI / 180 * randomNumBetween(degree - spread, degree + spread);
    this.r = randomNumBetween(10, 50);
    this.x = x;
    this.y = y;
    this.vx = this.r * Math.cos(this.angle);
    this.vy = this.r * Math.sin(this.angle);
    this.friction = 0.89;
    this.gravity = 0.5;
    this.width = 10;
    this.height = 10;

    this.opacity = 1;
    this.widthDelta = randomNumBetween(0, 360);
    this.heightDelta = randomNumBetween(0, 360);

    this.rotation = randomNumBetween(0, 360);
    this.rotationDelta = randomNumBetween(-1, 1);

    this.colors = colors || ['#FF588F', '#FF884B', '#FFD384', '#fff9B0'];
    const c = this.colors[Math.floor(randomNumBetween(0, this.colors.length))];
    this.color = hexToRgb(c);

    this.shapes = shapes || ['circle', 'square'];
    this.shape = this.shapes[Math.floor(randomNumBetween(0, this.shapes.length))];

    // Pixi Graphics
    this.graphics = new Graphics();
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    this.graphics.rotation = this.rotation * Math.PI / 180;
    this.graphics.alpha = this.opacity; // 전체 그래픽스 알파로 투명도 제어
    this.drawInitial();
  }

  drawInitial() {
    const { graphics } = this;
    graphics.clear();
    if (this.shape === 'square') {
      graphics.rect(-this.width/2, -this.height/2, this.width, this.height)
              .fill({ color: (this.color.r << 16) + (this.color.g << 8) + this.color.b, alpha: 1 });  // fill 알파 1로 고정
    } else {
      graphics.ellipse(0, 0, this.width/2, this.height/2)
              .fill({ color: (this.color.r << 16) + (this.color.g << 8) + this.color.b, alpha: 1 });
    }
  }

  update(delta) {
    // 위치·속도 갱신
    this.vy += this.gravity;
    this.vx *= this.friction;
    this.vy *= this.friction;
    this.x += this.vx;
    this.y += this.vy;

    this.opacity -= 0.007;
    this.widthDelta += 2;
    this.heightDelta += 2;
    this.rotation += this.rotationDelta;

    // 그래픽 업데이트
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    this.graphics.rotation = this.rotation * Math.PI / 180;
    this.graphics.alpha = this.opacity;

    // 모양의 크기 변경 (예: 흔들림 효과)
    const w = this.width * Math.cos(Math.PI / 180 * this.widthDelta);  // abs 제거하여 Canvas와 일치
    const h = this.height * Math.sin(Math.PI / 180 * this.heightDelta);  // abs 제거
    this.graphics.clear();

    if (this.shape === 'square') {
      this.graphics.rect(-w/2, -h/2, w, h).fill({ color: (this.color.r << 16) + (this.color.g << 8) + this.color.b, alpha: 1 });
    } else {
      this.graphics.ellipse(0, 0, Math.abs(w/2), Math.abs(h/2)).fill({ color: (this.color.r << 16) + (this.color.g << 8) + this.color.b, alpha: 1 });
    }
  }
}