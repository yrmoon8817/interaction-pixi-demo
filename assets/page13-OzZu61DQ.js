import"./modulepreload-polyfill-B5Qt9EMX.js";import{j as p,a as m,v,q as x,M as g,h as d,g as F,P as T,A as h,i as w}from"./index-DDZL8cFr.js";import{A as y}from"./Assets-C6Aos3Kt.js";import{F as P}from"./Filter-DJtoOklF.js";import"./BitmapFontManager-De3LcqO4.js";import"./getCanvasFillStyle-Bhfzdggk.js";import"./CanvasPool-AohZQnYu.js";import"./State-3sV0XrC-.js";var b=`
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
`,C=`in vec2 aPosition;
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
`,f=`
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
}`;class S extends P{constructor(...r){let e=r[0];e instanceof p&&(r[1]&&m(v,"DisplacementFilter now uses options object instead of params. {sprite, scale}"),e={sprite:e,scale:r[1]});const{sprite:a,scale:o,...n}=e;let t=o??20;typeof t=="number"&&(t=new T(t,t));const u=new x({uFilterMatrix:{value:new g,type:"mat3x3<f32>"},uScale:{value:t,type:"vec2<f32>"},uRotation:{value:new Float32Array([0,0,0,0]),type:"mat2x2<f32>"}}),s=d.from({vertex:C,fragment:b,name:"displacement-filter"}),c=F.from({vertex:{source:f,entryPoint:"mainVertex"},fragment:{source:f,entryPoint:"mainFragment"}}),l=a.texture.source;super({...n,gpuProgram:c,glProgram:s,resources:{filterUniforms:u,uMapTexture:l,uMapSampler:l.style}}),this._sprite=e.sprite,this._sprite.renderable=!1}apply(r,e,a,o){const n=this.resources.filterUniforms.uniforms;r.calculateSpriteMatrix(n.uFilterMatrix,this._sprite);const t=this._sprite.worldTransform,u=Math.sqrt(t.a*t.a+t.b*t.b),s=Math.sqrt(t.c*t.c+t.d*t.d);u!==0&&s!==0&&(n.uRotation[0]=t.a/u,n.uRotation[1]=t.b/u,n.uRotation[2]=t.c/s,n.uRotation[3]=t.d/s),this.resources.uMapTexture=this._sprite.texture.source,r.applyFilter(this,e,a,o)}get scale(){return this.resources.filterUniforms.uniforms.uScale}}(async()=>{const i=new h;await i.init({resizeTo:window}),document.querySelector(".wrap").appendChild(i.canvas),await y.load(["https://pixijs.com/assets/pixi-filters/displace.png","https://pixijs.com/assets/pixi-filters/ring.png","../img/filter.jpg"]),i.stage.eventMode="static";const r=new w;i.stage.addChild(r);const e=p.from("https://pixijs.com/assets/pixi-filters/displace.png"),a=new S({sprite:e,scale:150});i.stage.addChild(e),r.filters=[a],e.anchor.set(.5);const o=p.from("https://pixijs.com/assets/pixi-filters/ring.png");o.anchor.set(.5),o.visible=!1,i.stage.addChild(o);const n=p.from("../img/filter.jpg");n.width=i.screen.width,n.height=i.screen.height,r.addChild(n),i.stage.on("mousemove",t).on("touchmove",t);function t(u){o.visible=!0,e.position.set(u.data.global.x-25,u.data.global.y),o.position.copyFrom(e.position)}})();
