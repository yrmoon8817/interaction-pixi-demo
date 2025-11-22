import { Application, MeshPlane, Assets } from "pixi.js";
export default async function example(){
  const app = new Application();
  await app.init({
    backgroundAlpha:0,
    width:800,
    height:400,
    resolution: window.devicePixelRatio || 1, 
    autoDensity: true
  });
  app.canvas.id = 'app-canvas';
  document.querySelector('.page').appendChild(app.canvas);
  const texture= await Assets.load('../img/wave1.jpg');
  const plane = new MeshPlane({
    texture,
    verticesX: 10,
    verticesY: 10,
  });
  plane.width = 700;
  plane.height = 320;
  plane.x = 30;
  plane.y = 30;
  app.stage.addChild(plane);

  const {buffer} = plane.geometry.getAttribute('aPosition');
  // console.log(buffer.data);

  let timer = 0;
  app.ticker.add(()=>{
    for(let i = 0; i< buffer.data.length; i++) {
      buffer.data[i] += Math.sin(timer * 0.08 + i) * 0.5;
    }
    buffer.update();
    timer++;
  })

}
example();