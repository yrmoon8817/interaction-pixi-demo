import CanvasOption from './CanvasOption.js';
export default class Spark extends CanvasOption {
  constructor(x, y, vx, vy, opacity, colorDeg) {
    super();
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.colorDeg = colorDeg;
    this.opacity = opacity;
  }
  update() {
    this.opacity -= 0.01;
    this.x += this.vx;
    this.y += this.vy;
  }
  draw() {
    this.context.beginPath();
    this.context.arc(this.x, this.y, 1, 0, Math.PI * 2);
    this.context.fillStyle = `hsla(${this.colorDeg} ,100% , 65%, ${this.opacity})`;
    this.context.fill();
    this.context.closePath();
  }

}