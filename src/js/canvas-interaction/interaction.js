  const canvas = document.querySelector('canvas');
  const context = canvas.getContext('2d');
  context.font = 'bold 30px sans-serif';
  const boxes = [];
  const countEl = 10;
  let mousePos ={x:0, y:0};
  let tempX, tempY,  selectedBox,speed, panel, oX ,oY, step, rafId;

  function render(){
    context.clearRect(0,0, canvas.width, canvas.height);
    let box;
    for(let i=0; i<boxes.length; i+=1){
        box=boxes[i];
        box.draw();
    }
    switch(step) {
      case 1: 
      for(let i=0; i<boxes.length; i+=1){
        box=boxes[i];
        box.x += box.speed;
        if(box.x>canvas.width){
          box.x = -box.width;
        }
      }      
      break;
      
      case 2:
        panel.scale = panel.scale + (1 - panel.scale) * 0.05;
        //각도 = 스케일(0~1) * 720;
        panel.angle = panel.scale * 720;
        if(panel.scale >= 0.999){
          panel.scale=1;
          panel.angle=720;
          step =3;
        }
        panel.draw();
        break;
        
      case 3:
        panel.draw();
        break;
    }
    
    rafId=requestAnimationFrame(render);
    if(step===3){
      panel.showContent();
      cancelAnimationFrame(rafId);
    }
  }
  function init(){
    step = 1;
    oX = canvas.width /2;
    oY = canvas.height /2;
    for(let i = 0; i<countEl; i+=1){
      tempX =Math.random() * canvas.width  * 0.8;
      tempY =Math.random() * canvas.height * 0.8;
      speed = Math.random()*10+1;
      boxes.push(new Box(i, tempX, tempY, speed));
    }
    panel = new Panel();
    render();
  }

  canvas.addEventListener('click', function(ev){
    mousePos.x = ev.offsetX;
    mousePos.y = ev.offsetY;
    let box;
    for(let i=boxes.length-1; i>=0; i-=1){
      box = boxes[i];
      if(mousePos.x > box.x &&
        mousePos.x < box.x + box.width &&
        mousePos.y > box.y &&
        mousePos.y < box.y + box.height ){
        selectedBox=box;
        break;
      }
    }
    if(step===1 && selectedBox){
      step=2;
    }else if(step===3){
      step=1;
      panel.scale = 0;
      selectedBox=null;
      render();
    }
  });
  init();