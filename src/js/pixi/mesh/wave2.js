import { Application, MeshPlane, Assets } from "pixi.js";
export default async function example(){
  const app = new Application();
  await app.init({
    backgroundAlpha:0,
    width:600,
    height:500,
    resolution: window.devicePixelRatio || 1, 
    autoDensity: true
  });
  app.canvas.id = 'app-canvas';
  document.querySelector('.page').appendChild(app.canvas);
  const texture= await Assets.load('/img/wave2.png');
  const plane = new MeshPlane({
    texture,
    verticesX:10,
    verticesY:10,
  });
  plane.width = 600;
  plane.height = 500;
  plane.x = 0;
  plane.y = 0;
  app.stage.addChild(plane);

  const {buffer} = plane.geometry.getAttribute('aPosition');
  // console.log(buffer.data);

  let timer = 0;
  app.ticker.add(()=>{
    
    for (let i = 0; i < buffer.data.length; i += 2) {
      const x = buffer.data[i];
      const y = buffer.data[i + 1];

      // --- 조건부 파동 영역 설정 ---
      // 예: 오른쪽 1/3, 세로 중앙(상하 1/3 제외)
      const rightStart = plane.width * 0.66;
      const centerTop = plane.height * 0.33;
      const centerBottom = plane.height * 0.66;

      if (x > rightStart && y > centerTop && y < centerBottom) {
        buffer.data[i + 1] += Math.sin(timer * 0.08 + i) * 0.5;
      }
    }
    buffer.update();
    timer++;
  })
}
example();