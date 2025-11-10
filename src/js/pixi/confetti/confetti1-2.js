// main.js
import { Application, Container } from 'pixi.js';
import Particle from './particle1.js';

async function initApp(){
  const app = new Application();
  await app.init({
    resizeTo: window, 
    antialias: true,
    resolution: window.devicePixelRatio || 1,  // 고해상도 지원
    autoDensity: true  // CSS 크기 자동 조정으로 선명도 유지
  });
  document.body.appendChild(app.canvas);

  const particles = [];
  const particleContainer = new Container();
  app.stage.addChild(particleContainer);

  function confetti({x, y, count, degree=0, colors, shapes, spread=30}) {
    for(let i = 0; i < count; i++){
      const p = new Particle(x * app.screen.width, y * app.screen.height, degree, colors, shapes, spread);
      particles.push(p);
      particleContainer.addChild(p.graphics);
    }
  }
  app.ticker.add(()=>{
    // 프레임 작동: delta는 프레임 간격 보정값
    // 매 프레임마다 confetti 호출(예시)
    confetti({x:0, y:0.5, count:60, degree: -50});
    confetti({x:1, y:0.5, count:60, degree: -130});

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      if(p.opacity <= 0){
        particleContainer.removeChild(p.graphics);
        particles.splice(i,1);
      }
    }
  });
}
initApp();