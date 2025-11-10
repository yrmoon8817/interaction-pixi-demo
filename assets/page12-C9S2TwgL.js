import"./modulepreload-polyfill-B5Qt9EMX.js";import{A as h,j as a,b as v,S as g}from"./index-DDZL8cFr.js";import{A as s}from"./Assets-C6Aos3Kt.js";import{R as w}from"./RenderTexture-DGld5Ob5.js";import{M as x}from"./Mesh-CyTsQIlS.js";import"./BitmapFontManager-De3LcqO4.js";import"./getCanvasFillStyle-Bhfzdggk.js";import"./CanvasPool-AohZQnYu.js";import"./State-3sV0XrC-.js";import"./MeshGeometry-CnjuezGW.js";var M=`precision mediump float;

attribute vec2 aPosition;\r
attribute vec2 aUV;

uniform mat3 uProjectionMatrix;\r
uniform mat3 uWorldTransformMatrix;\r
uniform mat3 uTransformMatrix;

varying vec2 vUvs;

void main() {\r
    vUvs = aUV;\r
    mat3 mvp = uProjectionMatrix * uWorldTransformMatrix * uTransformMatrix;\r
    gl_Position = vec4((mvp * vec3(aPosition, 1.0)).xy, 0.0, 1.0);\r
}`,T=`precision mediump float;

varying vec2 vUvs;\r
uniform float limit;\r
uniform sampler2D noise;

void main() {\r
    
    float n = texture2D(noise, vUvs).r;

    
    float burn = smoothstep(limit - 0.05, limit + 0.05, n);

    
    vec3 fireColor = mix(\r
        vec3(1.0, 0.45, 0.1),   
        vec3(0.4, 0.0, 0.0),    
        burn\r
    );\r
    
    
    float alpha;\r
    alpha = 1.0 - burn; 
    

    
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(fireColor, alpha);\r
}`;(async()=>{const e=new h;await e.init({resizeTo:window,preference:"webgl",resolution:window.devicePixelRatio||1,autoDensity:!0}),document.querySelector(".wrap").appendChild(e.canvas);const m=await s.load("../img/map.jpg"),n=new a(m);n.anchor.set(.5),n.position.set(e.screen.width/2,e.screen.height/2),n.width=1920,n.height=1080,e.stage.addChild(n);const p=new v({attributes:{aPosition:[0,0,1920,0,1920,1080,0,1080],aUV:[0,0,1,0,1,1,0,1]},indexBuffer:[0,1,2,0,2,3]}),c=await s.load("https://pixijs.com/assets/perlin.jpg"),l=g.from({gl:{vertex:M,fragment:T},resources:{noiseUniforms:{limit:{type:"f32",value:0}},noise:c.source}}),i=w.create({width:1920,height:1080}),t=new x({geometry:p,shader:l});t.position.set(0,0);const r=new a(i);r.anchor.set(.5),r.position.set(e.screen.width/2,e.screen.height/2),e.stage.addChild(r),n.mask=r;const u=performance.now(),d=1e4;e.ticker.add(()=>{const f=performance.now()-u,o=Math.min(f/d,1);t.shader.resources.noiseUniforms.uniforms.limit=o,e.renderer.render({container:t,target:i,clear:!0}),o>=1&&e.ticker.stop()})})();
