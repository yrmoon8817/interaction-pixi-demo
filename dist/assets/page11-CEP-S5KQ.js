import"./modulepreload-polyfill-B5Qt9EMX.js";import{h as j,g as k,r as y,s as Y,a as p,v as M,V as D,O as H,l as O,A as W,i as K}from"./index-DDZL8cFr.js";import{T as U,C as N}from"./getCanvasFillStyle-Bhfzdggk.js";import{C as X}from"./CanvasTextGenerator-F44RDnRx.js";import{F as V}from"./Filter-DJtoOklF.js";import{R as J}from"./RenderTexture-DGld5Ob5.js";import{G as Q}from"./Graphics-DNHFdNsL.js";import"./CanvasPool-AohZQnYu.js";import"./State-3sV0XrC-.js";const q={5:[.153388,.221461,.250301],7:[.071303,.131514,.189879,.214607],9:[.028532,.067234,.124009,.179044,.20236],11:[.0093,.028002,.065984,.121703,.175713,.198596],13:[.002406,.009255,.027867,.065666,.121117,.174868,.197641],15:[489e-6,.002403,.009246,.02784,.065602,.120999,.174697,.197448]},Z=["in vec2 vBlurTexCoords[%size%];","uniform sampler2D uTexture;","out vec4 finalColor;","void main(void)","{","    finalColor = vec4(0.0);","    %blur%","}"].join(`
`);function tt(s){const t=q[s],e=t.length;let r=Z,i="";const n="finalColor += texture(uTexture, vBlurTexCoords[%index%]) * %value%;";let l;for(let o=0;o<s;o++){let h=n.replace("%index%",o.toString());l=o,o>=e&&(l=s-o-1),h=h.replace("%value%",t[l].toString()),i+=h,i+=`
`}return r=r.replace("%blur%",i),r=r.replace("%size%",s.toString()),r}const et=`
    in vec2 aPosition;

    uniform float uStrength;

    out vec2 vBlurTexCoords[%size%];

    uniform vec4 uInputSize;
    uniform vec4 uOutputFrame;
    uniform vec4 uOutputTexture;

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

    void main(void)
    {
        gl_Position = filterVertexPosition();

        float pixelStrength = uInputSize.%dimension% * uStrength;

        vec2 textureCoord = filterTextureCoord();
        %blur%
    }`;function rt(s,t){const e=Math.ceil(s/2);let r=et,i="",n;t?n="vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * pixelStrength, 0.0);":n="vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * pixelStrength);";for(let l=0;l<s;l++){let o=n.replace("%index%",l.toString());o=o.replace("%sampleIndex%",`${l-(e-1)}.0`),i+=o,i+=`
`}return r=r.replace("%blur%",i),r=r.replace("%size%",s.toString()),r=r.replace("%dimension%",t?"z":"w"),r}function it(s,t){const e=rt(t,s),r=tt(t);return j.from({vertex:e,fragment:r,name:`blur-${s?"horizontal":"vertical"}-pass-filter`})}var st=`

struct GlobalFilterUniforms {
  uInputSize:vec4<f32>,
  uInputPixel:vec4<f32>,
  uInputClamp:vec4<f32>,
  uOutputFrame:vec4<f32>,
  uGlobalFrame:vec4<f32>,
  uOutputTexture:vec4<f32>,
};

struct BlurUniforms {
  uStrength:f32,
};

@group(0) @binding(0) var<uniform> gfu: GlobalFilterUniforms;
@group(0) @binding(1) var uTexture: texture_2d<f32>;
@group(0) @binding(2) var uSampler : sampler;

@group(1) @binding(0) var<uniform> blurUniforms : BlurUniforms;


struct VSOutput {
    @builtin(position) position: vec4<f32>,
    %blur-struct%
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

fn getSize() -> vec2<f32>
{
  return gfu.uGlobalFrame.zw;
}


@vertex
fn mainVertex(
  @location(0) aPosition : vec2<f32>, 
) -> VSOutput {

  let filteredCord = filterTextureCoord(aPosition);

  let pixelStrength = gfu.uInputSize.%dimension% * blurUniforms.uStrength;

  return VSOutput(
   filterVertexPosition(aPosition),
    %blur-vertex-out%
  );
}

@fragment
fn mainFragment(
  @builtin(position) position: vec4<f32>,
  %blur-fragment-in%
) -> @location(0) vec4<f32> {

    var   finalColor = vec4(0.0);

    %blur-sampling%

    return finalColor;
}`;function nt(s,t){const e=q[t],r=e.length,i=[],n=[],l=[];for(let u=0;u<t;u++){i[u]=`@location(${u}) offset${u}: vec2<f32>,`,s?n[u]=`filteredCord + vec2(${u-r+1} * pixelStrength, 0.0),`:n[u]=`filteredCord + vec2(0.0, ${u-r+1} * pixelStrength),`;const x=u<r?u:t-u-1,w=e[x].toString();l[u]=`finalColor += textureSample(uTexture, uSampler, offset${u}) * ${w};`}const o=i.join(`
`),h=n.join(`
`),c=l.join(`
`),a=st.replace("%blur-struct%",o).replace("%blur-vertex-out%",h).replace("%blur-fragment-in%",o).replace("%blur-sampling%",c).replace("%dimension%",s?"z":"w");return k.from({vertex:{source:a,entryPoint:"mainVertex"},fragment:{source:a,entryPoint:"mainFragment"}})}const I=class A extends V{constructor(t){t={...A.defaultOptions,...t};const e=it(t.horizontal,t.kernelSize),r=nt(t.horizontal,t.kernelSize);super({glProgram:e,gpuProgram:r,resources:{blurUniforms:{uStrength:{value:0,type:"f32"}}},...t}),this.horizontal=t.horizontal,this._quality=0,this.quality=t.quality,this.blur=t.strength,this._uniforms=this.resources.blurUniforms.uniforms}apply(t,e,r,i){if(this._uniforms.uStrength=this.strength/this.passes,this.passes===1)t.applyFilter(this,e,r,i);else{const n=y.getSameSizeTexture(e);let l=e,o=n;this._state.blend=!1;const h=t.renderer.type===Y.WEBGPU;for(let c=0;c<this.passes-1;c++){t.applyFilter(this,l,o,c===0?!0:h);const a=o;o=l,l=a}this._state.blend=!0,t.applyFilter(this,l,r,i),y.returnTexture(n)}}get blur(){return this.strength}set blur(t){this.padding=1+Math.abs(t)*2,this.strength=t}get quality(){return this._quality}set quality(t){this._quality=t,this.passes=t}};I.defaultOptions={strength:8,quality:4,kernelSize:5};let S=I;class G extends V{constructor(...t){let e=t[0]??{};typeof e=="number"&&(p(M,"BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }"),e={strength:e},t[1]!==void 0&&(e.quality=t[1]),t[2]!==void 0&&(e.resolution=t[2]||"inherit"),t[3]!==void 0&&(e.kernelSize=t[3])),e={...S.defaultOptions,...e};const{strength:r,strengthX:i,strengthY:n,quality:l,...o}=e;super({...o,compatibleRenderers:Y.BOTH,resources:{}}),this._repeatEdgePixels=!1,this.blurXFilter=new S({horizontal:!0,...e}),this.blurYFilter=new S({horizontal:!1,...e}),this.quality=l,this.strengthX=i??r,this.strengthY=n??r,this.repeatEdgePixels=!1}apply(t,e,r,i){const n=Math.abs(this.blurXFilter.strength),l=Math.abs(this.blurYFilter.strength);if(n&&l){const o=y.getSameSizeTexture(e);this.blurXFilter.blendMode="normal",this.blurXFilter.apply(t,e,o,!0),this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(t,o,r,i),y.returnTexture(o)}else l?(this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(t,e,r,i)):(this.blurXFilter.blendMode=this.blendMode,this.blurXFilter.apply(t,e,r,i))}updatePadding(){this._repeatEdgePixels?this.padding=0:this.padding=Math.max(Math.abs(this.blurXFilter.blur),Math.abs(this.blurYFilter.blur))*2}get strength(){if(this.strengthX!==this.strengthY)throw new Error("BlurFilter's strengthX and strengthY are different");return this.strengthX}set strength(t){this.blurXFilter.blur=this.blurYFilter.blur=t,this.updatePadding()}get quality(){return this.blurXFilter.quality}set quality(t){this.blurXFilter.quality=this.blurYFilter.quality=t}get strengthX(){return this.blurXFilter.blur}set strengthX(t){this.blurXFilter.blur=t,this.updatePadding()}get strengthY(){return this.blurYFilter.blur}set strengthY(t){this.blurYFilter.blur=t,this.updatePadding()}get blur(){return p("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength}set blur(t){p("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength=t}get blurX(){return p("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX}set blurX(t){p("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX=t}get blurY(){return p("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY}set blurY(t){p("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY=t}get repeatEdgePixels(){return this._repeatEdgePixels}set repeatEdgePixels(t){this._repeatEdgePixels=t,this.updatePadding()}}G.defaultOptions={strength:8,quality:4,kernelSize:5};class ot extends D{constructor(t,e){const{text:r,resolution:i,style:n,anchor:l,width:o,height:h,roundPixels:c,...a}=t;super({...a}),this.batched=!0,this._resolution=null,this._autoResolution=!0,this._didTextUpdate=!0,this._styleClass=e,this.text=r??"",this.style=n,this.resolution=i??null,this.allowChildren=!1,this._anchor=new H({_onUpdate:()=>{this.onViewUpdate()}}),l&&(this.anchor=l),this.roundPixels=c??!1,o!==void 0&&(this.width=o),h!==void 0&&(this.height=h)}get anchor(){return this._anchor}set anchor(t){typeof t=="number"?this._anchor.set(t):this._anchor.copyFrom(t)}set text(t){t=t.toString(),this._text!==t&&(this._text=t,this.onViewUpdate())}get text(){return this._text}set resolution(t){this._autoResolution=t===null,this._resolution=t,this.onViewUpdate()}get resolution(){return this._resolution}get style(){return this._style}set style(t){t||(t={}),this._style?.off("update",this.onViewUpdate,this),t instanceof this._styleClass?this._style=t:this._style=new this._styleClass(t),this._style.on("update",this.onViewUpdate,this),this.onViewUpdate()}get width(){return Math.abs(this.scale.x)*this.bounds.width}set width(t){this._setWidth(t,this.bounds.width)}get height(){return Math.abs(this.scale.y)*this.bounds.height}set height(t){this._setHeight(t,this.bounds.height)}getSize(t){return t||(t={}),t.width=Math.abs(this.scale.x)*this.bounds.width,t.height=Math.abs(this.scale.y)*this.bounds.height,t}setSize(t,e){typeof t=="object"?(e=t.height??t.width,t=t.width):e??(e=t),t!==void 0&&this._setWidth(t,this.bounds.width),e!==void 0&&this._setHeight(e,this.bounds.height)}containsPoint(t){const e=this.bounds.width,r=this.bounds.height,i=-e*this.anchor.x;let n=0;return t.x>=i&&t.x<=i+e&&(n=-r*this.anchor.y,t.y>=n&&t.y<=n+r)}onViewUpdate(){this.didViewUpdate||(this._didTextUpdate=!0),super.onViewUpdate()}destroy(t=!1){super.destroy(t),this.owner=null,this._bounds=null,this._anchor=null,(typeof t=="boolean"?t:t?.style)&&this._style.destroy(t),this._style=null,this._text=null}get styleKey(){return`${this._text}:${this._style.styleKey}:${this._resolution}`}}function lt(s,t){let e=s[0]??{};return(typeof e=="string"||s[1])&&(p(M,`use new ${t}({ text: "hi!", style }) instead`),e={text:e,style:s[1]}),e}class ut extends ot{constructor(...t){const e=lt(t,"Text");super(e,U),this.renderPipeId="text",e.textureStyle&&(this.textureStyle=e.textureStyle instanceof O?e.textureStyle:new O(e.textureStyle))}updateBounds(){const t=this._bounds,e=this._anchor;let r=0,i=0;if(this._style.trim){const{frame:n,canvasAndContext:l}=X.getCanvasAndContext({text:this.text,style:this._style,resolution:1});X.returnCanvasAndContext(l),r=n.width,i=n.height}else{const n=N.measureText(this._text,this._style);r=n.width,i=n.height}t.minX=-e._x*r,t.maxX=t.minX+r,t.minY=-e._y*i,t.maxY=t.minY+i}}const g=(s,t)=>Math.random()*(t-s)+s;function at(s,t,e,r,i,n=128){const l=(i*t+r)*4;if(s[l+3]<=n)return!1;const o=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1]];for(const[h,c]of o){const a=r+h,u=i+c;if(a<0||u<0||a>=t||u>=e)return!0;const x=(u*t+a)*4;if(s[x+3]<=n)return!0}return!1}class ht{constructor(t,e){this.g=new Q().fill(16711680).rect(-1,-1,2,2).endFill(),this.g.x=t,this.g.y=e,this.g.alpha=g(.6,1);const r=100/Math.hypot(100,-40),i=-40/Math.hypot(100,-40),n=g(1.5,3.5);this.vx=r*n,this.vy=i*n,this.t=g(0,Math.PI*2),this.waveS=g(2,4),this.waveA=g(.5,1.5),this.last=performance.now(),this.life=0,this.maxLife=g(2e3,5e3)}update(){const t=performance.now(),e=Math.min((t-this.last)/1e3,.1);this.last=t,this.t+=e*this.waveS;const r=Math.sin(this.t*2)*this.waveA,i=Math.cos(this.t*1.5)*this.waveA*.5;this.g.x+=(this.vx+r)*60*e,this.g.y+=(this.vy+i)*60*e,this.g.alpha-=.004*60*e,this.g.alpha<0&&(this.g.alpha=0),this.life+=e*1e3}}async function ct(){const s=new W;await s.init({background:"#000000",resizeTo:window,resolution:window.devicePixelRatio||1,autoDensity:!0}),document.querySelector(".wrap").appendChild(s.canvas);const t={x:s.screen.width/2,y:s.screen.height/2},e=new U({fontFamily:"Arial",fontSize:120,fill:16711680,stroke:{color:16711680,width:4},padding:8}),r=new ut({text:"PIXIJS",style:e});r.anchor.set(.5),r.position.set(t.x,t.y),s.stage.addChild(r);const i=new G;i.blur=0,r.filters=[i];const n=J.create({width:r.width,height:r.height});r.position.set(r.width/2,r.height/2),s.renderer.render({container:r,target:n,clear:!0}),r.position.set(t.x,t.y);const l=s.renderer.extract.pixels(n),o=n.width,h=n.height-30,c=new K;s.stage.addChild(c);const a=[],u=5e3,x=500,w=performance.now();let _=!0;s.ticker.add(()=>{const b=performance.now()-w,m=Math.min(b/u,1);if(r.alpha=1-m,i.blur=m*10,_&&b<u){const d=Math.floor((60+180*m)*10);for(let f=0;f<d;f++){const P=Math.floor(Math.random()*o),T=Math.floor(Math.random()*h);if(at(l,o,h,P,T,128)&&Math.random()<.5+.4*m){const v=P-o/2,F=T-h/2,C=Math.hypot(v,F)||1,E=v/C,$=F/C,z=g(15,40),L=t.x+(v-E*z),R=t.y+(F-$*z),B=new ht(L,R);c.addChild(B.g),a.push(B)}}}for(const d of a)d.update();for(let d=a.length-1;d>=0;d--){const f=a[d];(f.g.alpha<=0||f.life>f.maxLife)&&(c.removeChild(f.g),a.splice(d,1))}if(b>=u&&b<u+x){_=!1;for(const d of a)d.g.alpha-=.08,d.g.alpha<0&&(d.g.alpha=0)}b>=u+x&&s.ticker.stop()})}ct();
