const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const dpr = window.devicePixelRatio;
let canvasWidth, canvasHeight, particles;

let initFunc = function () {
  canvasWidth = innerWidth;
  canvasHeight = innerHeight;
  canvas.style.width = canvasWidth + 'px';
  canvas.style.height = canvasHeight + 'px';
  canvas.width = canvasWidth * dpr;
  canvas.height = canvasHeight * dpr;
  context.scale(dpr, dpr);
  particles = [];
  for (let i = 0; i < TOTAL; i += 1) {
    const x = randomNumBetween(0, canvasWidth);
    const y = randomNumBetween(0, canvasHeight);
    const vy = randomNumBetween(1, 5);
    const init = vy
    const radius = randomNumBetween(50, 100);
    const particle = new Particle(x, y, radius, vy, init);
    particles.push(particle)
  }
}

//x, y, 가로길이, 세로길이
// context.fillRect(10,10,50,50);
const feGaussianBlur = document.querySelector('feGaussianBlur');
const feColorMatrix = document.querySelector('feColorMatrix');

const controls = new function () {
  this.blurValue = 15
  this.alphaChannel = 100
  this.alphaOffset = -23
  this.acc = 1.03
}

let gui = new dat.GUI()
const f1 = gui.addFolder('Gooey Effect');
f1.add(controls, 'blurValue', 0, 100).onChange(value => {
  feGaussianBlur.setAttribute('stdDeviation', value);
});
f1.add(controls, 'alphaChannel', 1, 200).onChange(value => {
  feColorMatrix.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${value} ${controls.alphaOffset}`);
});
f1.add(controls, 'alphaOffset', -40, 40).onChange(value => {
  feColorMatrix.setAttribute('values', `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${controls.alphaChannel} ${value}`);
});

const f2 = gui.addFolder('Particle Property');
f2.add(controls, 'acc', 1, 100, 0.01).onChange(value => {
  particles.forEach(particle => particle.acc = value);
});

class Particle {
  constructor(x, y, radius, vy, init) {
    this.x = x
    this.y = y
    this.radius = radius
    this.vy = vy
    this.init = init
    this.acc = 1.03
  }
  update() {
    this.vy *= this.acc
    this.y += this.vy
  }
  draw() {
    //패스를 그리기 시작함을 알림
    context.beginPath()
    // 호를 그리기
    //x,y,반지름, 0도, 360도
    context.arc(this.x, this.y, this.radius, 0, Math.PI / 180 * 360)
    context.fillStyle = 'orange';
    context.fill();
    context.closePath();
  }
}

const TOTAL = 20;

const randomNumBetween = (min, max) => {
  return Math.random() * (max - min + 1) + min
}

let interval = 1000 / 60;
let now, delta;
let then = Date.now()

function animate() {
  window.requestAnimationFrame(animate);
  now = Date.now();
  delta = now - then;

  if (delta < interval) return

  // 그려졌던 요소를 지우고
  context.clearRect(0, 0, canvasWidth, canvasHeight);

  //x를 1px 이동시키기 
  particles.forEach(particle => {
    particle.update();
    particle.draw();

    if (particle.y - particle.radius > canvasHeight) {
      particle.y = -particle.radius
      particle.vy = particle.init
    }
  });

  then = now - (delta % interval)
}

initFunc();
animate();
window.addEventListener('resize', function () {
  initFunc();
});

