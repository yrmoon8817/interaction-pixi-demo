import Particle from './Particle2.js';

const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d');
const dpr = window.devicePixelRatio;

let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
const interval = 1000/60;
const particles=[]

function init (){
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;
  canvas.style.width=canvasWidth + 'px';
  canvas.style.height=canvasHeight + 'px';
  canvas.width= canvasWidth * dpr;
  canvas.height= canvasHeight * dpr;
  context.scale(dpr,dpr);
}
function createRing(){
  const PARTICLE_NUM = 1500;
  for(let i =0;i<PARTICLE_NUM; i+=1){
    particles.push(new Particle());
  }
}
function render(){
  let now, delta;
  let then = Date.now();
  const frame = () =>{
    requestAnimationFrame(frame);
    now = Date.now();
    delta = now - then;
    if(delta < interval) return;
    // 지우고 그리게 하기
    context.clearRect(0,0, canvasWidth, canvasHeight);
    for(let i = particles.length -1 ; i>=0; i--){
      particles[i].update();
      particles[i].draw(context);
      if(particles[i].opacity<0) particles.splice(i,1);
    }
    then = now - (delta % interval);
  }
  requestAnimationFrame(frame);
}

window.addEventListener('load',function(){
  init();
  render();
});

window.addEventListener('resize',init);

window.addEventListener('click', ()=>{
  const textArr = document.querySelectorAll('#countdown >span');
  const countDownOption={
    opacity:1,
    scale:1,
    duration:0.4,
    ease: 'Power4.easeOut'
  }
  gsap.fromTo(textArr[0], {opacity:0, scale:5}, {...countDownOption});
  gsap.fromTo(textArr[1], {opacity:0, scale:5}, {...countDownOption, delay:1,onStart:()=>textArr[0].style.opacity=0});
  gsap.fromTo(textArr[2], {opacity:0, scale:5}, {...countDownOption, delay:2,onStart:()=>textArr[1].style.opacity=0});
  const ringImg = document.querySelector('.img_ring');
  gsap.fromTo(ringImg, {opacity:1}, {opacity:0, duration:1, delay:3, onStart:()=>{createRing(); textArr[2].style.opacity=0;}})
})