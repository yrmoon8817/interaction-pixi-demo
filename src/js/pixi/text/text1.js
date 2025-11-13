import { Application, Text, TextStyle, Graphics, Container, RenderTexture, BlurFilter } from "pixi.js";

//pixijs 안에서 필요한 기능들을 가져옵니다.
/*
 Application : Pixijs 전체 앱(캔버스 포함)을 만드는 객체
 Text / TextStyle : 화면에 글씨를 표시하기 위한 객체
 Graphics: 도형(사각형, 원 등)을 그릴 때 사용
 Container : 여러 그래픽 요소를 그룹으로 묶는 객체
 RenderTexture : 화면에 렌더링한 결과를 이미지처럼 다룰 수 있는 객체
 BlurFilter : 블러(흐림)효과를 주는 필터

*/

// 랜덤 숫자 만드느 함수 : min과 max 사이의 랜덤한 실수(소수)를 반환
const rand = (min, max) => Math.random() * (max - min) + min;

// 글자 외곽(테두리) 판별함수 
// pixels는 글자 이미지의 픽셀 데이터입니다. 
// 픽셀마다 4개의 값(R,G,B,A)이 있는데, 그중 A(알파값, 투명도)가 128보다 작으면 투명 -> 글자 외곽이 아님
function isEdge(pixels, w, h, x, y, th = 128) {
  const i = (y * w + x) * 4;
  if (pixels[i + 3] <= th) return false;
  // 주변 8방향(상하좌우 + 대각선)을 검사할 방향 목록입니다.
  const dirs = [
    [1, 0], [-1, 0], [0, 1], [0, -1],
    [1, 1], [-1, -1], [1, -1], [-1, 1]
  ];
  // 이웃한 픽셀 중 하나라도 투명하다면 -> 지금 픽셀은 외곽이다. 
  // 즉, 글자의 테두리 부분만 true로 반환합니다.
  // 이 함수는 파티클을 글자 모양의 윤곽선 위에만 생성할 때 사용됩니다.
  for (const [dx, dy] of dirs) {
    const xx = x + dx, yy = y + dy;
    if (xx < 0 || yy < 0 || xx >= w || yy >= h) return true;
    const j = (yy * w + xx) * 4;
    if (pixels[j + 3] <= th) return true;
  }
  return false;
}

// 파티클 클래스
class Particle {
  constructor(x, y) {
    // 파티클 생성(빨간 2x2 사각형)
    this.g = new Graphics().fill(0xff0000).rect(-1, -1, 2, 2).endFill();
    // 파티클의 위치와 투명도를 랜덤하게 지정
    this.g.x = x;
    this.g.y = y;
    this.g.alpha = rand(0.6, 1); // 
    // 파티클이 "오른쪽 약간 위"방향으로 이동하도록 방향과 속도를 정합니다.
    // Math.hypot은 두 숫자로 벡터의 길이를 구하는 함수입니다.
    const ux = 100 / Math.hypot(100, -40);
    const uy = -40 / Math.hypot(100, -40);
    const speed = rand(1.5, 3.5);
    this.vx = ux * speed;
    this.vy = uy * speed;
    // 물결 움직임을 위한 값들입니다.
    // t: 현재 파동위치
    // waveS: 파도속도
    // waveA: 파도 크기
    this.t = rand(0, Math.PI * 2);
    this.waveS = rand(2, 4);
    this.waveA = rand(0.5, 1.5);
    // 파티클이 생성된 시간과 수명(2~5초)을 정합니다.
    this.last = performance.now();
    this.life = 0;
    this.maxLife = rand(2000, 5000);
  }
  // 매 프레임마다 움직임 처리
  update() {
    const now = performance.now();
    // 프레임간 시간차를 계산해 애니메이션 처리
    const dt = Math.min((now - this.last) / 1000, 0.1);
    this.last = now;
    // 파동을 계산해서 x, y 방향으로 약간씩 흔들리게 만듭니다.
    this.t += dt * this.waveS;
    const wx = Math.sin(this.t * 2) * this.waveA;
    const wy = Math.cos(this.t * 1.5) * this.waveA * 0.5;

    // 파티클의 위치를 갱신합니다.
    this.g.x += (this.vx + wx) * 60 * dt;
    this.g.y += (this.vy + wy) * 60 * dt;

    // 시간이 지날수록 점점 투명해져서 사라지게 만듭니다.
    this.g.alpha -= 0.004 * 60 * dt;
    if (this.g.alpha < 0) this.g.alpha = 0;
    // 일정 시간이 지나면 파티클 제거
    this.life += dt * 1000;
  }
}
// 앱 실행부분
async function run() {
  // PIXIJS 초기화
  const app = new Application();
  await app.init({
    background: "#000000", // 검정색 배경
    resizeTo: window, // 브라우저 창 크기에 맞게 자동 조절
    resolution: window.devicePixelRatio || 1, // 해상도 대응
    autoDensity: true,
  });
  document.querySelector(".wrap").appendChild(app.canvas); // 초기화한 canvas를 html 임베딩

  const center = { x: app.screen.width / 2, y: app.screen.height / 2 };

  // 텍스트 스타일
  const style = new TextStyle({
    fontFamily: "Arial",
    fontSize: 120,
    fill: 0xff0000,
    stroke: { color: 0xff0000, width: 4 },
    padding: 8,
  });
  // PIXIJS라는 글자를 화면 중앙에 표시
  const text = new Text({ text: "PIXIJS", style });
  text.anchor.set(0.5);
  text.position.set(center.x, center.y);
  app.stage.addChild(text);

  // Blur 필터 설정 -- 글자를 점점 흐리게 만들기
  const blurFilter = new BlurFilter();
  blurFilter.blur = 0;
  text.filters = [blurFilter];

  // RenderTexture로 픽셀 데이터 추출
  // 그 이미지의 픽셀을 분석해서 파티클 생성위치(윤곽선)로 사용
  const rt = RenderTexture.create({ width: text.width - 10, height: text.height * 0.7});
  app.renderer.render({ container: text, target: rt, clear: true });
  text.position.set(center.x, center.y);
  const pixels = app.renderer.extract.pixels(rt);
  const gw = rt.width;
  const gh = rt.height;

  // 파티클 레이어
  const particlesLayer = new Container();
  app.stage.addChild(particlesLayer);
  const particles = [];
  // 타임라인 설정
  const DURATION = 5000; // 텍스트 표시 5초
  const EXTRA = 500;    // 추가 1초 (파티클 사라짐)
  const start = performance.now();
  let spawnEnabled = true;
  // 메인루프 (매 프레임 실행)
  app.ticker.add(() => {
    const now = performance.now();
    const elapsed = now - start;
    const p = Math.min(elapsed / DURATION, 1);

    // 텍스트 페이드 + 블러 > 5초동안 글자가 점점 투명해지고 흐려짐
    text.alpha = 1 - p;
    blurFilter.blur = p * 10;

    // 파티클 생성 > 시간이 갈수록 증가시키기
if (spawnEnabled && elapsed < DURATION) {

  let spawnTrials = 0;

  if (elapsed < 5000) {
    spawnTrials = 70; 
  }

  for (let i = 0; i < spawnTrials; i++) {
    const x = Math.floor(Math.random() * gw);
    const y = Math.floor(Math.random() * gh);

    // 🔥 윤곽선 대신 "글자 내부 영역" 판정
    const idx = (y * gw + x) * 4;
    const alpha = pixels[idx + 3];
    if (alpha <= 10) continue;   // (투명한 영역은 제외 = 글자 영역만 사용)

    // 텍스트 내부의 좌표 → 화면 좌표로 변환하는 부분은 동일
    const dx = x - gw / 2;
    const dy = y - gh / 1.6;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const inward = rand(-10, -10);

    const px = center.x + (dx - ux * inward);
    const py = center.y + (dy - uy * inward);

    const par = new Particle(px, py);
    particlesLayer.addChild(par.g);
    particles.push(par);
  }
}
    // 파티클 업데이트 및 사라진 파티클 제거
    for (const ptt of particles) ptt.update();
    for (let i = particles.length - 1; i >= 0; i--) {
      const ptt = particles[i];
      if (ptt.g.alpha <= 0 || ptt.life > ptt.maxLife) {
        particlesLayer.removeChild(ptt.g);
        particles.splice(i, 1);
      }
    }

    // 5초 후 새 파티클 생성 중지 및 기존 파티클 1초후 사라짐 처리
    if (elapsed >= 5000 && elapsed < 5100) {
      spawnEnabled = false;
      for (const ptt of particles) {
        ptt.g.alpha =0;
        if (ptt.g.alpha < 0) ptt.g.alpha = 0;
      }
    }

    // 완전 종료 > 루프 중지
    if (elapsed >= DURATION + EXTRA) {
      app.ticker.stop();
    }
  });
}

run();




