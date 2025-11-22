import"./modulepreload-polyfill-B5Qt9EMX.js";import{T as u,m as w,o as _,i as F,V as A,p as D,A as B,R as P}from"./index-DMlA-7KB.js";import{r as h,h as I}from"./utils-DQaJ-aSb.js";import{R as M}from"./RenderTexture-BtxiRFfi.js";import{G as V}from"./Graphics-qsRIA3UI.js";const m=class p{constructor(t){if(t instanceof u)this.texture=t,w(this,p.defaultOptions,{});else{const e={...p.defaultOptions,...t};w(this,e,{})}}get alpha(){return this._alpha}set alpha(t){this._alpha=Math.min(Math.max(t,0),1),this._updateColor()}get tint(){return _(this._tint)}set tint(t){typeof t=="number"?this._tint=t:this._tint=F.shared.setValue(t??16777215).toBgrNumber(),this._updateColor()}_updateColor(){this.color=this._tint+((this._alpha*255|0)<<24)}};m.defaultOptions={anchorX:0,anchorY:0,x:0,y:0,scaleX:1,scaleY:1,rotation:0,tint:16777215,alpha:1};let E=m;const C={vertex:{attributeName:"aVertex",format:"float32x2",code:`
            const texture = p.texture;
            const sx = p.scaleX;
            const sy = p.scaleY;
            const ax = p.anchorX;
            const ay = p.anchorY;
            const trim = texture.trim;
            const orig = texture.orig;

            if (trim)
            {
                w1 = trim.x - (ax * orig.width);
                w0 = w1 + trim.width;

                h1 = trim.y - (ay * orig.height);
                h0 = h1 + trim.height;
            }
            else
            {
                w1 = -ax * (orig.width);
                w0 = w1 + orig.width;

                h1 = -ay * (orig.height);
                h0 = h1 + orig.height;
            }

            f32v[offset] = w1 * sx;
            f32v[offset + 1] = h1 * sy;

            f32v[offset + stride] = w0 * sx;
            f32v[offset + stride + 1] = h1 * sy;

            f32v[offset + (stride * 2)] = w0 * sx;
            f32v[offset + (stride * 2) + 1] = h0 * sy;

            f32v[offset + (stride * 3)] = w1 * sx;
            f32v[offset + (stride * 3) + 1] = h0 * sy;
        `,dynamic:!1},position:{attributeName:"aPosition",format:"float32x2",code:`
            var x = p.x;
            var y = p.y;

            f32v[offset] = x;
            f32v[offset + 1] = y;

            f32v[offset + stride] = x;
            f32v[offset + stride + 1] = y;

            f32v[offset + (stride * 2)] = x;
            f32v[offset + (stride * 2) + 1] = y;

            f32v[offset + (stride * 3)] = x;
            f32v[offset + (stride * 3) + 1] = y;
        `,dynamic:!0},rotation:{attributeName:"aRotation",format:"float32",code:`
            var rotation = p.rotation;

            f32v[offset] = rotation;
            f32v[offset + stride] = rotation;
            f32v[offset + (stride * 2)] = rotation;
            f32v[offset + (stride * 3)] = rotation;
        `,dynamic:!1},uvs:{attributeName:"aUV",format:"float32x2",code:`
            var uvs = p.texture.uvs;

            f32v[offset] = uvs.x0;
            f32v[offset + 1] = uvs.y0;

            f32v[offset + stride] = uvs.x1;
            f32v[offset + stride + 1] = uvs.y1;

            f32v[offset + (stride * 2)] = uvs.x2;
            f32v[offset + (stride * 2) + 1] = uvs.y2;

            f32v[offset + (stride * 3)] = uvs.x3;
            f32v[offset + (stride * 3) + 1] = uvs.y3;
        `,dynamic:!1},color:{attributeName:"aColor",format:"unorm8x4",code:`
            const c = p.color;

            u32v[offset] = c;
            u32v[offset + stride] = c;
            u32v[offset + (stride * 2)] = c;
            u32v[offset + (stride * 3)] = c;
        `,dynamic:!1}},T=new D(0,0,0,0),y=class v extends A{constructor(t={}){t={...v.defaultOptions,...t,dynamicProperties:{...v.defaultOptions.dynamicProperties,...t==null?void 0:t.dynamicProperties}};const{dynamicProperties:e,shader:i,roundPixels:r,texture:s,particles:a,...n}=t;super({label:"ParticleContainer",...n}),this.renderPipeId="particle",this.batched=!1,this._childrenDirty=!1,this.texture=s||null,this.shader=i,this._properties={};for(const l in C){const c=C[l],d=e[l];this._properties[l]={...c,dynamic:d}}this.allowChildren=!0,this.roundPixels=r??!1,this.particleChildren=a??[]}addParticle(...t){for(let e=0;e<t.length;e++)this.particleChildren.push(t[e]);return this.onViewUpdate(),t[0]}removeParticle(...t){let e=!1;for(let i=0;i<t.length;i++){const r=this.particleChildren.indexOf(t[i]);r>-1&&(this.particleChildren.splice(r,1),e=!0)}return e&&this.onViewUpdate(),t[0]}update(){this._childrenDirty=!0}onViewUpdate(){this._childrenDirty=!0,super.onViewUpdate()}get bounds(){return T}updateBounds(){}destroy(t=!1){var i,r;if(super.destroy(t),typeof t=="boolean"?t:t==null?void 0:t.texture){const s=typeof t=="boolean"?t:t==null?void 0:t.textureSource,a=this.texture??((i=this.particleChildren[0])==null?void 0:i.texture);a&&a.destroy(s)}this.texture=null,(r=this.shader)==null||r.destroy()}removeParticles(t,e){const i=this.particleChildren.splice(t,e);return this.onViewUpdate(),i}removeParticleAt(t){const e=this.particleChildren.splice(t,1);return this.onViewUpdate(),e[0]}addParticleAt(t,e){return this.particleChildren.splice(e,0,t),this.onViewUpdate(),t}addChild(...t){throw new Error("ParticleContainer.addChild() is not available. Please use ParticleContainer.addParticle()")}removeChild(...t){throw new Error("ParticleContainer.removeChild() is not available. Please use ParticleContainer.removeParticle()")}removeChildren(t,e){throw new Error("ParticleContainer.removeChildren() is not available. Please use ParticleContainer.removeParticles()")}removeChildAt(t){throw new Error("ParticleContainer.removeChildAt() is not available. Please use ParticleContainer.removeParticleAt()")}getChildAt(t){throw new Error("ParticleContainer.getChildAt() is not available. Please use ParticleContainer.getParticleAt()")}setChildIndex(t,e){throw new Error("ParticleContainer.setChildIndex() is not available. Please use ParticleContainer.setParticleIndex()")}getChildIndex(t){throw new Error("ParticleContainer.getChildIndex() is not available. Please use ParticleContainer.getParticleIndex()")}addChildAt(t,e){throw new Error("ParticleContainer.addChildAt() is not available. Please use ParticleContainer.addParticleAt()")}swapChildren(t,e){throw new Error("ParticleContainer.swapChildren() is not available. Please use ParticleContainer.swapParticles()")}reparentChild(...t){throw new Error("ParticleContainer.reparentChild() is not available with the particle container")}reparentChildAt(t,e){throw new Error("ParticleContainer.reparentChildAt() is not available with the particle container")}};y.defaultOptions={dynamicProperties:{vertex:!1,position:!0,rotation:!1,uvs:!1,color:!1},roundPixels:!1};let R=y;class U extends E{constructor(t,e,i,r,s,a=30){super({texture:t}),this.reset(e,i,r,s,a)}reset(t,e,i,r,s){this.x=t,this.y=e,this.colors=r||["#FF588F","#FF884B","#FFD384","#FFF9B0"];const a=this.colors[Math.floor(h(0,this.colors.length))],n=I(a);this.tint=(n.r<<16)+(n.g<<8)+n.b;const l=Math.PI/180*h(i-s,i+s),c=h(10,50);this.vx=c*Math.cos(l),this.vy=c*Math.sin(l),this.friction=.89,this.gravity=.5,this.rotation=h(0,360),this.rotationDelta=h(-1,1),this.scaleBase=h(.3,.9),this.widthDelta=h(0,360),this.heightDelta=h(0,360),this.alpha=1}update(){this.vy+=this.gravity,this.vx*=this.friction,this.vy*=this.friction,this.x+=this.vx,this.y+=this.vy,this.rotation+=this.rotationDelta,this.widthDelta+=10,this.heightDelta+=10;const t=Math.cos(this.widthDelta*Math.PI/180),e=Math.sin(this.heightDelta*Math.PI/180),i=this.scaleBase*Math.abs(t),r=this.scaleBase*Math.abs(e);this.scaleX=i,this.scaleY=r,this.alpha-=.007}get opacity(){return this.alpha}}async function N(){const o=new B;await o.init({resizeTo:window,antialias:!0,resolution:window.devicePixelRatio||1,autoDensity:!0,backgroundColor:0}),document.body.appendChild(o.canvas);const t=new R({dynamicProperties:{position:!0,scale:!0,rotation:!0,alpha:!0,tint:!0}});o.stage.addChild(t);const e=[],i=await O(o);function r({x:s,y:a,count:n,degree:l=0,colors:c,spread:d=30}){for(let x=0;x<n;x++){const g=Math.random()<.6?"circle":"square",b=i[g];let f=e.pop();f?f.reset(s*o.screen.width,a*o.screen.height,l,c||["#FF588F","#FF884B","#FFD384","#FFF9B0"],d):f=new U(b,s*o.screen.width,a*o.screen.height,l,c||["#FF588F","#FF884B","#FFD384","#FFF9B0"],d),t.addParticle(f)}}o.ticker.add(()=>{r({x:0,y:.5,count:100,degree:-50}),r({x:1,y:.5,count:100,degree:-130});const s=t.particleChildren;for(let a=s.length-1;a>=0;a--){const n=s[a];n.update(),n.opacity<=.05&&(e.push(n),t.removeParticleAt(a))}t.update()})}async function O(o){const t=M.create({width:20,height:16}),e=new V,i=10;e.circle(i+4/2,i/2,i/2).fill(16777215);const r=10;return e.rect(i,0,r,r).fill(16777215),o.renderer.render({container:e,target:t}),e.destroy(),{circle:new u(t.source,new P(0,0,8,8)),square:new u(t.source,new P(8,0,8,8))}}N();
