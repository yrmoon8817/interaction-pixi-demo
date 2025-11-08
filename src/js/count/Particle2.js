import { randomNumBetween } from './Utils2.js';

export default class Particle{
  constructor(){
    this.rFriction = randomNumBetween(0.95,0.99); 
    this.rAlpha = randomNumBetween(0,5);
    this.r = innerHeight /4 ;
    this.angleFriction = randomNumBetween(0.97,0.99);
    this.angleAlpha = randomNumBetween(1,2);
    this.angle = randomNumBetween(0, 360);
    
    this.opacity = randomNumBetween(0.1, 1)
  }
  update(){
    //friction을 r 과 angle에 따로 적용
    // 바깥으로 뻗어나감 
    this.rAlpha*=this.rFriction;
    this.r += this.rAlpha;
    
    this.angleAlpha *= this.angleFriction;
    this.angle+=this.angleAlpha;
    
    this.x = innerWidth / 2 + this.r * Math.cos(Math.PI / 180 * this.angle);
    this.y = innerHeight /2 + this.r * Math.sin(Math.PI / 180 * this.angle);
    
    this.opacity -=0.003;
  }
  draw(context){
    context.beginPath();
    context.arc(this.x, this.y, 1, 0, Math.PI * 2);
    context.fillStyle = `rgba(255,255,255,${this.opacity})`;
    context.fill();
    context.closePath();
    
  }
}