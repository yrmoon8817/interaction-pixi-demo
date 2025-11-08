import Particle from './Particle3.js';
const canvas=document.querySelector('canvas');
const context = canvas.getContext('2d');
const dpr = 1;

let canvasWidth = innerWidth;
let canvasHeight = innerHeight;
const interval = 1000/60;
let particles=[];

function init (){
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;
  canvas.style.width=canvasWidth + 'px';
  canvas.style.height=canvasHeight + 'px';
  canvas.width= canvasWidth * dpr;
  canvas.height= canvasHeight * dpr;
  context.scale(dpr,dpr);
}

function confetti({x,y,count,degree, colors, shapes, spread}){
  for(let i = 0; i< count; i+=1){
    particles.push(new Particle(x,y, degree, colors, shapes, spread));
  }
}

function render(){
  let now, delta;
  let then = Date.now();

  const frame = ()=>{
    requestAnimationFrame(frame);
    now = Date.now();
    delta = now - then;
    if(delta< interval) return;
    context.clearRect(0,0, canvas.width, canvas.height);
		confetti({
    	x : 0,
    	y : 0,
    	count:5,
    	degree:45
  	});
		confetti({
    	x : 1,
    	y : 0,
    	count:5,
    	degree:135
  	})
    for(let i = particles.length-1; i>=0; i-=1){
      context.scale(dpr,dpr);
      particles[i].update();
      particles[i].draw(context);
			if(particles[i].opacity < 0){ 
				particles.splice(i,1);
			}
    }
    then = now - (delta % interval);
  }
  requestAnimationFrame(frame);
}

window.addEventListener('load',()=>{
  init();
  render();
});
window.addEventListener('resize', init());
