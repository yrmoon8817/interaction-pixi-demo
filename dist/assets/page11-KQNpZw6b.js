import"./modulepreload-polyfill-B5Qt9EMX.js";import{g as R,f as j,s as b,u as O,a as p,v as X,V as k,O as D,A as H,C as W}from"./index-z_3bUTQL.js";import{T as Y,C as K}from"./CanvasTextMetrics-Bea0LAic.js";import{F as M}from"./Filter-CFr2x1Xi.js";import{R as N}from"./RenderTexture-DRp0-QYY.js";import{G as J}from"./Graphics-BSDvj37r.js";import"./State-3sV0XrC-.js";const U={5:[.153388,.221461,.250301],7:[.071303,.131514,.189879,.214607],9:[.028532,.067234,.124009,.179044,.20236],11:[.0093,.028002,.065984,.121703,.175713,.198596],13:[.002406,.009255,.027867,.065666,.121117,.174868,.197641],15:[489e-6,.002403,.009246,.02784,.065602,.120999,.174697,.197448]},Q=["in vec2 vBlurTexCoords[%size%];","uniform sampler2D uTexture;","out vec4 finalColor;","void main(void)","{","    finalColor = vec4(0.0);","    %blur%","}"].join(`
`);function Z(i){const t=U[i],e=t.length;let r=Q,s="";const n="finalColor += texture(uTexture, vBlurTexCoords[%index%]) * %value%;";let l;for(let o=0;o<i;o++){let a=n.replace("%index%",o.toString());l=o,o>=e&&(l=i-o-1),a=a.replace("%value%",t[l].toString()),s+=a,s+=`
`}return r=r.replace("%blur%",s),r=r.replace("%size%",i.toString()),r}const tt=`
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
    }`;function et(i,t){const e=Math.ceil(i/2);let r=tt,s="",n;t?n="vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * pixelStrength, 0.0);":n="vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * pixelStrength);";for(let l=0;l<i;l++){let o=n.replace("%index%",l.toString());o=o.replace("%sampleIndex%",`${l-(e-1)}.0`),s+=o,s+=`
`}return r=r.replace("%blur%",s),r=r.replace("%size%",i.toString()),r=r.replace("%dimension%",t?"z":"w"),r}function rt(i,t){const e=et(t,i),r=Z(t);return R.from({vertex:e,fragment:r,name:`blur-${i?"horizontal":"vertical"}-pass-filter`})}var it=`

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
}`;function st(i,t){const e=U[t],r=e.length,s=[],n=[],l=[];for(let u=0;u<t;u++){s[u]=`@location(${u}) offset${u}: vec2<f32>,`,i?n[u]=`filteredCord + vec2(${u-r+1} * pixelStrength, 0.0),`:n[u]=`filteredCord + vec2(0.0, ${u-r+1} * pixelStrength),`;const m=u<r?u:t-u-1,y=e[m].toString();l[u]=`finalColor += textureSample(uTexture, uSampler, offset${u}) * ${y};`}const o=s.join(`
`),a=n.join(`
`),d=l.join(`
`),h=it.replace("%blur-struct%",o).replace("%blur-vertex-out%",a).replace("%blur-fragment-in%",o).replace("%blur-sampling%",d).replace("%dimension%",i?"z":"w");return j.from({vertex:{source:h,entryPoint:"mainVertex"},fragment:{source:h,entryPoint:"mainFragment"}})}const V=class q extends M{constructor(t){t={...q.defaultOptions,...t};const e=rt(t.horizontal,t.kernelSize),r=st(t.horizontal,t.kernelSize);super({glProgram:e,gpuProgram:r,resources:{blurUniforms:{uStrength:{value:0,type:"f32"}}},...t}),this.horizontal=t.horizontal,this._quality=0,this.quality=t.quality,this.blur=t.strength,this._uniforms=this.resources.blurUniforms.uniforms}apply(t,e,r,s){if(this._uniforms.uStrength=this.strength/this.passes,this.passes===1)t.applyFilter(this,e,r,s);else{const n=b.getSameSizeTexture(e);let l=e,o=n;this._state.blend=!1;const a=t.renderer.type===O.WEBGPU;for(let d=0;d<this.passes-1;d++){t.applyFilter(this,l,o,d===0?!0:a);const h=o;o=l,l=h}this._state.blend=!0,t.applyFilter(this,l,r,s),b.returnTexture(n)}}get blur(){return this.strength}set blur(t){this.padding=1+Math.abs(t)*2,this.strength=t}get quality(){return this._quality}set quality(t){this._quality=t,this.passes=t}};V.defaultOptions={strength:8,quality:4,kernelSize:5};let F=V;class I extends M{constructor(...t){let e=t[0]??{};typeof e=="number"&&(p(X,"BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }"),e={strength:e},t[1]!==void 0&&(e.quality=t[1]),t[2]!==void 0&&(e.resolution=t[2]||"inherit"),t[3]!==void 0&&(e.kernelSize=t[3])),e={...F.defaultOptions,...e};const{strength:r,strengthX:s,strengthY:n,quality:l,...o}=e;super({...o,compatibleRenderers:O.BOTH,resources:{}}),this._repeatEdgePixels=!1,this.blurXFilter=new F({horizontal:!0,...e}),this.blurYFilter=new F({horizontal:!1,...e}),this.quality=l,this.strengthX=s??r,this.strengthY=n??r,this.repeatEdgePixels=!1}apply(t,e,r,s){const n=Math.abs(this.blurXFilter.strength),l=Math.abs(this.blurYFilter.strength);if(n&&l){const o=b.getSameSizeTexture(e);this.blurXFilter.blendMode="normal",this.blurXFilter.apply(t,e,o,!0),this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(t,o,r,s),b.returnTexture(o)}else l?(this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(t,e,r,s)):(this.blurXFilter.blendMode=this.blendMode,this.blurXFilter.apply(t,e,r,s))}updatePadding(){this._repeatEdgePixels?this.padding=0:this.padding=Math.max(Math.abs(this.blurXFilter.blur),Math.abs(this.blurYFilter.blur))*2}get strength(){if(this.strengthX!==this.strengthY)throw new Error("BlurFilter's strengthX and strengthY are different");return this.strengthX}set strength(t){this.blurXFilter.blur=this.blurYFilter.blur=t,this.updatePadding()}get quality(){return this.blurXFilter.quality}set quality(t){this.blurXFilter.quality=this.blurYFilter.quality=t}get strengthX(){return this.blurXFilter.blur}set strengthX(t){this.blurXFilter.blur=t,this.updatePadding()}get strengthY(){return this.blurYFilter.blur}set strengthY(t){this.blurYFilter.blur=t,this.updatePadding()}get blur(){return p("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength}set blur(t){p("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength=t}get blurX(){return p("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX}set blurX(t){p("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX=t}get blurY(){return p("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY}set blurY(t){p("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY=t}get repeatEdgePixels(){return this._repeatEdgePixels}set repeatEdgePixels(t){this._repeatEdgePixels=t,this.updatePadding()}}I.defaultOptions={strength:8,quality:4,kernelSize:5};class nt extends k{constructor(t,e){const{text:r,resolution:s,style:n,anchor:l,width:o,height:a,roundPixels:d,...h}=t;super({...h}),this.batched=!0,this._resolution=null,this._autoResolution=!0,this._didTextUpdate=!0,this._styleClass=e,this.text=r??"",this.style=n,this.resolution=s??null,this.allowChildren=!1,this._anchor=new D({_onUpdate:()=>{this.onViewUpdate()}}),l&&(this.anchor=l),this.roundPixels=d??!1,o!==void 0&&(this.width=o),a!==void 0&&(this.height=a)}get anchor(){return this._anchor}set anchor(t){typeof t=="number"?this._anchor.set(t):this._anchor.copyFrom(t)}set text(t){t=t.toString(),this._text!==t&&(this._text=t,this.onViewUpdate())}get text(){return this._text}set resolution(t){this._autoResolution=t===null,this._resolution=t,this.onViewUpdate()}get resolution(){return this._resolution}get style(){return this._style}set style(t){var e;t||(t={}),(e=this._style)==null||e.off("update",this.onViewUpdate,this),t instanceof this._styleClass?this._style=t:this._style=new this._styleClass(t),this._style.on("update",this.onViewUpdate,this),this.onViewUpdate()}get width(){return Math.abs(this.scale.x)*this.bounds.width}set width(t){this._setWidth(t,this.bounds.width)}get height(){return Math.abs(this.scale.y)*this.bounds.height}set height(t){this._setHeight(t,this.bounds.height)}getSize(t){return t||(t={}),t.width=Math.abs(this.scale.x)*this.bounds.width,t.height=Math.abs(this.scale.y)*this.bounds.height,t}setSize(t,e){typeof t=="object"?(e=t.height??t.width,t=t.width):e??(e=t),t!==void 0&&this._setWidth(t,this.bounds.width),e!==void 0&&this._setHeight(e,this.bounds.height)}containsPoint(t){const e=this.bounds.width,r=this.bounds.height,s=-e*this.anchor.x;let n=0;return t.x>=s&&t.x<=s+e&&(n=-r*this.anchor.y,t.y>=n&&t.y<=n+r)}onViewUpdate(){this.didViewUpdate||(this._didTextUpdate=!0),super.onViewUpdate()}_getKey(){return`${this.text}:${this._style.styleKey}:${this._resolution}`}destroy(t=!1){super.destroy(t),this.owner=null,this._bounds=null,this._anchor=null,(typeof t=="boolean"?t:t!=null&&t.style)&&this._style.destroy(t),this._style=null,this._text=null}}function ot(i,t){let e=i[0]??{};return(typeof e=="string"||i[1])&&(p(X,`use new ${t}({ text: "hi!", style }) instead`),e={text:e,style:i[1]}),e}class lt extends nt{constructor(...t){const e=ot(t,"Text");super(e,Y),this.renderPipeId="text"}updateBounds(){const t=this._bounds,e=this._anchor,r=K.measureText(this._text,this._style),{width:s,height:n}=r;t.minX=-e._x*s,t.maxX=t.minX+s,t.minY=-e._y*n,t.maxY=t.minY+n}}const g=(i,t)=>Math.random()*(t-i)+i;class ut{constructor(t,e){this.g=new J().fill(16711680).rect(-1,-1,2,2).endFill(),this.g.x=t,this.g.y=e,this.g.alpha=g(.6,1);const r=100/Math.hypot(100,-40),s=-40/Math.hypot(100,-40),n=g(1.5,3.5);this.vx=r*n,this.vy=s*n,this.t=g(0,Math.PI*2),this.waveS=g(2,4),this.waveA=g(.5,1.5),this.last=performance.now(),this.life=0,this.maxLife=g(2e3,5e3)}update(){const t=performance.now(),e=Math.min((t-this.last)/1e3,.1);this.last=t,this.t+=e*this.waveS;const r=Math.sin(this.t*2)*this.waveA,s=Math.cos(this.t*1.5)*this.waveA*.5;this.g.x+=(this.vx+r)*60*e,this.g.y+=(this.vy+s)*60*e,this.g.alpha-=.004*60*e,this.g.alpha<0&&(this.g.alpha=0),this.life+=e*1e3}}async function at(){const i=new H;await i.init({background:"#000000",resizeTo:window,resolution:window.devicePixelRatio||1,autoDensity:!0}),document.querySelector(".wrap").appendChild(i.canvas);const t={x:i.screen.width/2,y:i.screen.height/2},e=new Y({fontFamily:"Arial",fontSize:120,fill:16711680,stroke:{color:16711680,width:4},padding:8}),r=new lt({text:"PIXIJS",style:e});r.anchor.set(.5),r.position.set(t.x,t.y),i.stage.addChild(r);const s=new I;s.blur=0,r.filters=[s];const n=N.create({width:r.width-10,height:r.height*.7});i.renderer.render({container:r,target:n,clear:!0}),r.position.set(t.x,t.y);const l=i.renderer.extract.pixels(n),o=n.width,a=n.height,d=new W;i.stage.addChild(d);const h=[],u=5e3,m=500,y=performance.now();let S=!0;i.ticker.add(()=>{const x=performance.now()-y,_=Math.min(x/u,1);if(r.alpha=1-_,s.blur=_*10,S&&x<u){let c=0;x<5e3&&(c=70);for(let f=0;f<c;f++){const P=Math.floor(Math.random()*o),T=Math.floor(Math.random()*a),G=(T*o+P)*4;if(l[G+3]<=10)continue;const w=P-o/2,v=T-a/1.6,C=Math.hypot(w,v)||1,A=w/C,E=v/C,z=g(-10,-10),$=t.x+(w-A*z),L=t.y+(v-E*z),B=new ut($,L);d.addChild(B.g),h.push(B)}}for(const c of h)c.update();for(let c=h.length-1;c>=0;c--){const f=h[c];(f.g.alpha<=0||f.life>f.maxLife)&&(d.removeChild(f.g),h.splice(c,1))}if(x>=5e3&&x<5100){S=!1;for(const c of h)c.g.alpha=0,c.g.alpha<0&&(c.g.alpha=0)}x>=u+m&&i.ticker.stop()})}at();
