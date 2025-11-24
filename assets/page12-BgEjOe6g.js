import"./modulepreload-polyfill-B5Qt9EMX.js";import{A as f,j as s,G as v,S as h}from"./index-C9klQOEH.js";import{A as m}from"./Assets-BoX6RB7d.js";import{R as g}from"./RenderTexture-A9XCA7l0.js";import{M as w}from"./Mesh-DnbGmUJp.js";import"./BitmapFontManager-BRuJYlAf.js";import"./getCanvasFillStyle-DjPYqI5B.js";import"./CanvasPool-C6-OnmGf.js";import"./State-3sV0XrC-.js";import"./MeshGeometry-BrPBMgrR.js";var x=`precision mediump float;

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
}`;(async()=>{const e=new f;await e.init({resizeTo:window,preference:"webgl",resizeTo:window,resolution:window.devicePixelRatio||1,autoDensity:!0}),document.querySelector(".wrap").appendChild(e.canvas);const l=await m.load("../img/map.jpg"),r=new s(l);r.anchor.set(.5),r.position.set(e.screen.width/2,e.screen.height/2),r.width=1920,r.height=1080,e.stage.addChild(r),r.visible=!1;const p=new v({attributes:{aPosition:[0,0,1920,0,1920,1080,0,1080],aUV:[0,0,1,0,1,1,0,1]},indexBuffer:[0,1,2,0,2,3]}),c=await m.load("https://pixijs.com/assets/perlin.jpg"),d=h.from({gl:{vertex:x,fragment:T},resources:{noiseUniforms:{limit:{type:"f32",value:0}},noise:c.source}}),o=g.create({width:1920,height:1080}),n=new w({geometry:p,shader:d});n.position.set(0,0);const i=new s(o);i.anchor.set(.5),i.position.set(e.screen.width/2,e.screen.height/2),e.stage.addChild(i),r.mask=i,e.renderer.render({container:n,target:o,clear:!0});let t=0,a=1;e.ticker.add(u=>{t+=.004*a*u.deltaTime,t>=1&&(a=-1),t<=0&&(a=1),n.shader.resources.noiseUniforms.uniforms.limit=t,e.renderer.render({container:n,target:o,clear:!0}),r.visible=!0})})();
