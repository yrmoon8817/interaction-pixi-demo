import"./modulepreload-polyfill-B5Qt9EMX.js";import{g as M,f as I,q as b,r as _,a as p,v as P,V as G,O as $,A as E,C as A}from"./index-DMlA-7KB.js";import{T,C as L}from"./CanvasTextMetrics-dG2MPPsY.js";import{F as C}from"./Filter-DQKg6h7w.js";import{G as R}from"./Graphics-qsRIA3UI.js";import"./State-3sV0XrC-.js";const z={5:[.153388,.221461,.250301],7:[.071303,.131514,.189879,.214607],9:[.028532,.067234,.124009,.179044,.20236],11:[.0093,.028002,.065984,.121703,.175713,.198596],13:[.002406,.009255,.027867,.065666,.121117,.174868,.197641],15:[489e-6,.002403,.009246,.02784,.065602,.120999,.174697,.197448]},j=["in vec2 vBlurTexCoords[%size%];","uniform sampler2D uTexture;","out vec4 finalColor;","void main(void)","{","    finalColor = vec4(0.0);","    %blur%","}"].join(`
`);function k(i){const t=z[i],e=t.length;let r=j,s="";const o="finalColor += texture(uTexture, vBlurTexCoords[%index%]) * %value%;";let l;for(let n=0;n<i;n++){let a=o.replace("%index%",n.toString());l=n,n>=e&&(l=i-n-1),a=a.replace("%value%",t[l].toString()),s+=a,s+=`
`}return r=r.replace("%blur%",s),r=r.replace("%size%",i.toString()),r}const D=`
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
    }`;function H(i,t){const e=Math.ceil(i/2);let r=D,s="",o;t?o="vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * pixelStrength, 0.0);":o="vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * pixelStrength);";for(let l=0;l<i;l++){let n=o.replace("%index%",l.toString());n=n.replace("%sampleIndex%",`${l-(e-1)}.0`),s+=n,s+=`
`}return r=r.replace("%blur%",s),r=r.replace("%size%",i.toString()),r=r.replace("%dimension%",t?"z":"w"),r}function N(i,t){const e=H(t,i),r=k(t);return M.from({vertex:e,fragment:r,name:`blur-${i?"horizontal":"vertical"}-pass-filter`})}var W=`

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
}`;function K(i,t){const e=z[t],r=e.length,s=[],o=[],l=[];for(let u=0;u<t;u++){s[u]=`@location(${u}) offset${u}: vec2<f32>,`,i?o[u]=`filteredCord + vec2(${u-r+1} * pixelStrength, 0.0),`:o[u]=`filteredCord + vec2(0.0, ${u-r+1} * pixelStrength),`;const m=u<r?u:t-u-1,x=e[m].toString();l[u]=`finalColor += textureSample(uTexture, uSampler, offset${u}) * ${x};`}const n=s.join(`
`),a=o.join(`
`),h=l.join(`
`),d=W.replace("%blur-struct%",n).replace("%blur-vertex-out%",a).replace("%blur-fragment-in%",n).replace("%blur-sampling%",h).replace("%dimension%",i?"z":"w");return I.from({vertex:{source:d,entryPoint:"mainVertex"},fragment:{source:d,entryPoint:"mainFragment"}})}const O=class B extends C{constructor(t){t={...B.defaultOptions,...t};const e=N(t.horizontal,t.kernelSize),r=K(t.horizontal,t.kernelSize);super({glProgram:e,gpuProgram:r,resources:{blurUniforms:{uStrength:{value:0,type:"f32"}}},...t}),this.horizontal=t.horizontal,this._quality=0,this.quality=t.quality,this.blur=t.strength,this._uniforms=this.resources.blurUniforms.uniforms}apply(t,e,r,s){if(this._uniforms.uStrength=this.strength/this.passes,this.passes===1)t.applyFilter(this,e,r,s);else{const o=b.getSameSizeTexture(e);let l=e,n=o;this._state.blend=!1;const a=t.renderer.type===_.WEBGPU;for(let h=0;h<this.passes-1;h++){t.applyFilter(this,l,n,h===0?!0:a);const d=n;n=l,l=d}this._state.blend=!0,t.applyFilter(this,l,r,s),b.returnTexture(o)}}get blur(){return this.strength}set blur(t){this.padding=1+Math.abs(t)*2,this.strength=t}get quality(){return this._quality}set quality(t){this._quality=t,this.passes=t}};O.defaultOptions={strength:8,quality:4,kernelSize:5};let y=O;class X extends C{constructor(...t){let e=t[0]??{};typeof e=="number"&&(p(P,"BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }"),e={strength:e},t[1]!==void 0&&(e.quality=t[1]),t[2]!==void 0&&(e.resolution=t[2]||"inherit"),t[3]!==void 0&&(e.kernelSize=t[3])),e={...y.defaultOptions,...e};const{strength:r,strengthX:s,strengthY:o,quality:l,...n}=e;super({...n,compatibleRenderers:_.BOTH,resources:{}}),this._repeatEdgePixels=!1,this.blurXFilter=new y({horizontal:!0,...e}),this.blurYFilter=new y({horizontal:!1,...e}),this.quality=l,this.strengthX=s??r,this.strengthY=o??r,this.repeatEdgePixels=!1}apply(t,e,r,s){const o=Math.abs(this.blurXFilter.strength),l=Math.abs(this.blurYFilter.strength);if(o&&l){const n=b.getSameSizeTexture(e);this.blurXFilter.blendMode="normal",this.blurXFilter.apply(t,e,n,!0),this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(t,n,r,s),b.returnTexture(n)}else l?(this.blurYFilter.blendMode=this.blendMode,this.blurYFilter.apply(t,e,r,s)):(this.blurXFilter.blendMode=this.blendMode,this.blurXFilter.apply(t,e,r,s))}updatePadding(){this._repeatEdgePixels?this.padding=0:this.padding=Math.max(Math.abs(this.blurXFilter.blur),Math.abs(this.blurYFilter.blur))*2}get strength(){if(this.strengthX!==this.strengthY)throw new Error("BlurFilter's strengthX and strengthY are different");return this.strengthX}set strength(t){this.blurXFilter.blur=this.blurYFilter.blur=t,this.updatePadding()}get quality(){return this.blurXFilter.quality}set quality(t){this.blurXFilter.quality=this.blurYFilter.quality=t}get strengthX(){return this.blurXFilter.blur}set strengthX(t){this.blurXFilter.blur=t,this.updatePadding()}get strengthY(){return this.blurYFilter.blur}set strengthY(t){this.blurYFilter.blur=t,this.updatePadding()}get blur(){return p("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength}set blur(t){p("8.3.0","BlurFilter.blur is deprecated, please use BlurFilter.strength instead."),this.strength=t}get blurX(){return p("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX}set blurX(t){p("8.3.0","BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead."),this.strengthX=t}get blurY(){return p("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY}set blurY(t){p("8.3.0","BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead."),this.strengthY=t}get repeatEdgePixels(){return this._repeatEdgePixels}set repeatEdgePixels(t){this._repeatEdgePixels=t,this.updatePadding()}}X.defaultOptions={strength:8,quality:4,kernelSize:5};class J extends G{constructor(t,e){const{text:r,resolution:s,style:o,anchor:l,width:n,height:a,roundPixels:h,...d}=t;super({...d}),this.batched=!0,this._resolution=null,this._autoResolution=!0,this._didTextUpdate=!0,this._styleClass=e,this.text=r??"",this.style=o,this.resolution=s??null,this.allowChildren=!1,this._anchor=new $({_onUpdate:()=>{this.onViewUpdate()}}),l&&(this.anchor=l),this.roundPixels=h??!1,n!==void 0&&(this.width=n),a!==void 0&&(this.height=a)}get anchor(){return this._anchor}set anchor(t){typeof t=="number"?this._anchor.set(t):this._anchor.copyFrom(t)}set text(t){t=t.toString(),this._text!==t&&(this._text=t,this.onViewUpdate())}get text(){return this._text}set resolution(t){this._autoResolution=t===null,this._resolution=t,this.onViewUpdate()}get resolution(){return this._resolution}get style(){return this._style}set style(t){var e;t||(t={}),(e=this._style)==null||e.off("update",this.onViewUpdate,this),t instanceof this._styleClass?this._style=t:this._style=new this._styleClass(t),this._style.on("update",this.onViewUpdate,this),this.onViewUpdate()}get width(){return Math.abs(this.scale.x)*this.bounds.width}set width(t){this._setWidth(t,this.bounds.width)}get height(){return Math.abs(this.scale.y)*this.bounds.height}set height(t){this._setHeight(t,this.bounds.height)}getSize(t){return t||(t={}),t.width=Math.abs(this.scale.x)*this.bounds.width,t.height=Math.abs(this.scale.y)*this.bounds.height,t}setSize(t,e){typeof t=="object"?(e=t.height??t.width,t=t.width):e??(e=t),t!==void 0&&this._setWidth(t,this.bounds.width),e!==void 0&&this._setHeight(e,this.bounds.height)}containsPoint(t){const e=this.bounds.width,r=this.bounds.height,s=-e*this.anchor.x;let o=0;return t.x>=s&&t.x<=s+e&&(o=-r*this.anchor.y,t.y>=o&&t.y<=o+r)}onViewUpdate(){this.didViewUpdate||(this._didTextUpdate=!0),super.onViewUpdate()}_getKey(){return`${this.text}:${this._style.styleKey}:${this._resolution}`}destroy(t=!1){super.destroy(t),this.owner=null,this._bounds=null,this._anchor=null,(typeof t=="boolean"?t:t!=null&&t.style)&&this._style.destroy(t),this._style=null,this._text=null}}function Q(i,t){let e=i[0]??{};return(typeof e=="string"||i[1])&&(p(P,`use new ${t}({ text: "hi!", style }) instead`),e={text:e,style:i[1]}),e}class Z extends J{constructor(...t){const e=Q(t,"Text");super(e,T),this.renderPipeId="text"}updateBounds(){const t=this._bounds,e=this._anchor,r=L.measureText(this._text,this._style),{width:s,height:o}=r;t.minX=-e._x*s,t.maxX=t.minX+s,t.minY=-e._y*o,t.maxY=t.minY+o}}const g=(i,t)=>Math.random()*(t-i)+i;class tt{constructor(t,e){this.g=new R().rect(-1,-1,2,2).fill(16711680),this.g.x=t,this.g.y=e,this.g.alpha=g(.5,1);const r=g(1,3);this.vx=g(-.1,1)*r,this.vy=g(-.1,-1)*r,this.life=0,this.maxLife=g(1e3,2e3),this.last=performance.now()}update(){const t=performance.now(),e=Math.min((t-this.last)/1e3,.1);this.last=t,this.g.x+=this.vx*60*e,this.g.y+=this.vy*60*e,this.g.alpha-=.01*60*e,this.g.alpha<0&&(this.g.alpha=0),this.life=e}}async function et(){const i=new E;await i.init({background:"#000000",resizeTo:window,resolution:window.devicePixelRatio||1,autoDensity:!0,preference:"webgl"}),document.querySelector(".wrap").appendChild(i.canvas);const t={x:i.screen.width/2,y:i.screen.height/2},e=new T({fontFamily:"Arial",fontSize:120,fill:16711680,stroke:{color:16711680,width:4}}),r=new Z({text:"PIXIJS",style:e});r.anchor.set(.5),r.position.set(t.x,t.y),i.stage.addChild(r);const s=new X;s.strength=0,r.filters=[s],await new Promise(requestAnimationFrame);const o=i.renderer.extract.pixels(r),l=r.width,n=r.height,a=new A;i.stage.addChild(a);const h=[],d=2500,u=1600,m=performance.now();let x=!0;i.ticker.add(()=>{const w=performance.now()-m,v=Math.min(w/d,1),Y=Math.min(w/u,1);if(r.alpha=1-v,s.strength=v*12,Y>=1&&(x=!1),x)for(let c=0;c<170;c++){const f=Math.floor(Math.random()*l),F=Math.floor(Math.random()*n/1.5),U=(F*l+f)*4;if(o[U+3]<600)continue;const V=t.x+(f-l/2),q=t.y+(F-n/3),S=new tt(V,q);a.addChild(S.g),h.push(S)}for(const c of h)c.update();for(let c=h.length-1;c>=0;c--){const f=h[c];(f.g.alpha<=0||f.life>f.maxLife)&&(a.removeChild(f.g),h.splice(c,1))}})}et();
