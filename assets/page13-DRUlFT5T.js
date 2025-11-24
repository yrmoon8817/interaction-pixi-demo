import"./modulepreload-polyfill-B5Qt9EMX.js";import{j as f,a as F,v as w,U as y,M as S,h as T,g as C,P,A as b,i as z}from"./index-C9klQOEH.js";import{A as M}from"./Assets-BoX6RB7d.js";import{F as O}from"./Filter-DOz9ksZ6.js";import{G as v}from"./Graphics-CvUUFoWb.js";import"./BitmapFontManager-BRuJYlAf.js";import"./getCanvasFillStyle-DjPYqI5B.js";import"./CanvasPool-C6-OnmGf.js";import"./State-3sV0XrC-.js";var U=`
in vec2 vTextureCoord;
in vec2 vFilterUv;

out vec4 finalColor;

uniform sampler2D uTexture;
uniform sampler2D uMapTexture;

uniform vec4 uInputClamp;
uniform highp vec4 uInputSize;
uniform mat2 uRotation;
uniform vec2 uScale;

void main()
{
    vec4 map = texture(uMapTexture, vFilterUv);
    
    vec2 offset = uInputSize.zw * (uRotation * (map.xy - 0.5)) * uScale; 

    finalColor = texture(uTexture, clamp(vTextureCoord + offset, uInputClamp.xy, uInputClamp.zw));
}
`,I=`in vec2 aPosition;
out vec2 vTextureCoord;
out vec2 vFilterUv;


uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;

uniform mat3 uFilterMatrix;

vec4 filterVertexPosition( void )
{
    vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
    
    position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aPosition * (uOutputFrame.zw * uInputSize.zw);
}

vec2 getFilterCoord( void )
{
  return ( uFilterMatrix * vec3( filterTextureCoord(), 1.0)  ).xy;
}


void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
    vFilterUv = getFilterCoord();
}
`,d=`
struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct DisplacementUniforms {
  uFilterMatrix:mat3x3<f32>,
  uScale:vec2<f32>,
  uRotation:mat2x2<f32>
};



@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> filterUniforms : DisplacementUniforms;
@group(1) @binding(1) var uMapTexture: texture_2d<f32>;
@group(1) @binding(2) var uMapSampler : sampler;

struct VSOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv : vec2<f32>,
    @location(1) filterUv : vec2<f32>,
  };

fn filterVertexPosition(aPosition:vec2<f32>) -> vec4<f32>
{
    var position = aPosition * gfu.uOutputFrame.zw + gfu.uOutputFrame.xy;

    position.x = position.x * (2.0 / gfu.uOutputTexture.x) - 1.0;
    position.y = position.y * (2.0*gfu.uOutputTexture.z / gfu.uOutputTexture.y) - gfu.uOutputTexture.z;

    return vec4(position, 0.0, 1.0);
}

fn filterTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
    return aPosition * (gfu.uOutputFrame.zw * gfu.uInputSize.zw);
}

fn globalTextureCoord( aPosition:vec2<f32> ) -> vec2<f32>
{
  return  (aPosition.xy / gfu.uGlobalFrame.zw) + (gfu.uGlobalFrame.xy / gfu.uGlobalFrame.zw);  
}

fn getFilterCoord(aPosition:vec2<f32> ) -> vec2<f32>
{
  return ( filterUniforms.uFilterMatrix * vec3( filterTextureCoord(aPosition), 1.0)  ).xy;
}

fn getSize() -> vec2<f32>
{

  
  return gfu.uGlobalFrame.zw;
}
  
@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>, 
) -> VSOutput {
  return VSOutput(
   filterVertexPosition(aPosition),
   filterTextureCoord(aPosition),
   getFilterCoord(aPosition)
  );
}

@fragment
fn mainFragment(
  @location(0) uv: vec2<f32>,
  @location(1) filterUv: vec2<f32>,
  @builtin(position) position: vec4<f32>
) -> @location(0) vec4<f32> {

    var map = textureSample(uMapTexture, uMapSampler, filterUv);

    var offset =  gfu.uInputSize.zw * (filterUniforms.uRotation * (map.xy - 0.5)) * filterUniforms.uScale; 
   
    return textureSample(uTexture, uSampler, clamp(uv + offset, gfu.uInputClamp.xy, gfu.uInputClamp.zw));
}`;class G extends O{constructor(...u){let r=u[0];r instanceof f&&(u[1]&&F(w,"DisplacementFilter now uses options object instead of params. {sprite, scale}"),r={sprite:r,scale:u[1]});const{sprite:p,scale:s,...o}=r;let t=s??20;typeof t=="number"&&(t=new P(t,t));const n=new y({uFilterMatrix:{value:new S,type:"mat3x3<f32>"},uScale:{value:t,type:"vec2<f32>"},uRotation:{value:new Float32Array([0,0,0,0]),type:"mat2x2<f32>"}}),e=T.from({vertex:I,fragment:U,name:"displacement-filter"}),l=C.from({vertex:{source:d,entryPoint:"mainVertex"},fragment:{source:d,entryPoint:"mainFragment"}}),a=p.texture.source;super({...o,gpuProgram:l,glProgram:e,resources:{filterUniforms:n,uMapTexture:a,uMapSampler:a.style}}),this._sprite=r.sprite,this._sprite.renderable=!1}apply(u,r,p,s){const o=this.resources.filterUniforms.uniforms;u.calculateSpriteMatrix(o.uFilterMatrix,this._sprite);const t=this._sprite.worldTransform,n=Math.sqrt(t.a*t.a+t.b*t.b),e=Math.sqrt(t.c*t.c+t.d*t.d);n!==0&&e!==0&&(o.uRotation[0]=t.a/n,o.uRotation[1]=t.b/n,o.uRotation[2]=t.c/e,o.uRotation[3]=t.d/e),this.resources.uMapTexture=this._sprite.texture.source,u.applyFilter(this,r,p,s)}get scale(){return this.resources.filterUniforms.uniforms.uScale}}(async()=>{const i=new b;await i.init({resizeTo:window}),document.querySelector(".wrap").appendChild(i.canvas),await M.load(["https://pixijs.com/assets/pixi-filters/displace.png","https://pixijs.com/assets/pixi-filters/ring.png","../img/filter.jpg"]),i.stage.eventMode="static";const u=new z;i.stage.addChild(u);const r=f.from("https://pixijs.com/assets/pixi-filters/displace.png");r.anchor.set(.5),i.stage.addChild(r);const p=new G({sprite:r,scale:150});u.filters=[p];const s=f.from("https://pixijs.com/assets/pixi-filters/ring.png");s.anchor.set(.5),s.visible=!1,i.stage.addChild(s);const o=f.from("../img/filter.jpg");o.width=i.screen.width,o.height=i.screen.height,u.addChild(o),i.stage.on("pointermove",a=>{s.visible=!0,r.position.set(a.global.x-25,a.global.y),s.position.copyFrom(r.position)});const t=320,n=new v().rect(0,0,t,6).fill(16777215);n.x=(i.screen.width-t)/2,n.y=i.screen.height*.85,n.eventMode="static";const e=new v().circle(0,0,15).fill(16777215);e.y=n.height/2,e.x=t/2,e.eventMode="static",e.cursor="pointer",n.addChild(e),i.stage.addChild(n);let l=!1;e.on("pointerdown",a=>{l=!0,a.stopPropagation()}),e.on("pointerup",()=>l=!1),e.on("pointerupoutside",()=>l=!1),n.on("pointermove",a=>{if(!l)return;a.stopPropagation();const c=e.width/2,g=n.toLocal(a.global).x;e.x=Math.max(c,Math.min(g,t-c));const h=e.x/t,m=20,x=m+(200-m)*h;p.scale.x=x,p.scale.y=x})})();
