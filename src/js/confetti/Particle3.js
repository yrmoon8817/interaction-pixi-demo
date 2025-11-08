import { hexToRgb, randomNumBetween } from './Utils.js';

export default class Particle{
    constructor(x,y, deg=0, colors, shapes, spread=30){
        this.angle = Math.PI / 180 * randomNumBetween(deg-spread, deg+spread);
        this.r=randomNumBetween(10,50);
        this.x = x * innerWidth;
        this.y = y * innerHeight;
        this.vx = this.r * Math.cos(this.angle);
        this.vy = this.r * Math.sin(this.angle);
        this.friction = 0.89;
        this.gravity = 0.5;
        this.width=10;
        this.height=10;
        
        this.opacity = 1;
        this.widthDelta = randomNumBetween(0, 360);
        this.heightDelta = randomNumBetween(0, 360);
        
        this.rotation=randomNumBetween(0,360);
        // 시계방향, 반시계방향 랜덤 설정
        this.rotationDelta = randomNumBetween(-1, 1);
        
        this.colors = colors || ['#FF588F', '#FF884B', '#FFD384', '#fff9B0'];
        this.color = hexToRgb(
            this.colors[Math.floor(randomNumBetween(0, this.colors.length))]
        );
        
        
        this.shapes = shapes || ['circle', 'square'];
        this.shape = this.shapes[Math.floor(randomNumBetween(0, this.shapes.length))];
    }
    update(){
        this.vy += this.gravity;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.x += this.vx;
        this.y += this.vy;
        
        this.opacity -= 0.005;
        // 요소의 제자리 회전
        this.widthDelta +=2;
        this.heightDelta+=2;
        
        this.rotation += this.rotationDelta;
    }
    drawSquare(context){
        context.fillRect(
            this.x, 
            this.y,
            this.width * Math.cos(Math.PI / 180 * this.widthDelta), 
            this.height * Math.sin(Math.PI / 180 * this.heightDelta)
        );
    }
    drawCircle(context){
        context.beginPath();
        context.ellipse(
            this.x, 
            this.y,
            Math.abs(this.width * Math.cos(Math.PI / 180 * this.widthDelta))/2, 
            Math.abs(this.height * Math.sin(Math.PI / 180 * this.heightDelta))/2,
            0,
            0,
            Math.PI * 2
        );
        context.fill();
        context.closePath();
    }
    draw(context){
        // 요소의 위치 회전
        context.translate(this.x + this.width * 1.2, this.y+this.height * 1.2);
        context.rotate(Math.PI / 180 * this.rotation);
        //회전 후 원위치..??
        context.translate(-this.x - this.width, -this.y - this.height);
        
        context.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b} ,${this.opacity})`;
        
        switch (this.shape){
            case 'square' : this.drawSquare(context); break
            case 'circle' : this.drawCircle(context); break
        }
        context.resetTransform();
    }
}