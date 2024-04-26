"use strict";(globalThis.webpackChunk_ember_auto_import_=globalThis.webpackChunk_ember_auto_import_||[]).push([[388],{1875:(e,t,r)=>{function n(e,t){let r=e.length-t,n=0
do{for(let r=t;r>0;r--)e[n+t]+=e[n],n++
r-=t}while(r>0)}function a(e,t,r){let n=0,a=e.length
const o=a/r
for(;a>t;){for(let r=t;r>0;--r)e[n+t]+=e[n],++n
a-=t}const i=e.slice()
for(let s=0;s<o;++s)for(let t=0;t<r;++t)e[r*s+t]=i[(r-t-1)*o+s]}r.d(t,{A:()=>o})
class o{async decode(e,t){const r=await this.decodeBlock(t),o=e.Predictor||1
if(1!==o){const t=!e.StripOffsets
return function(e,t,r,o,i,s){if(!t||1===t)return e
for(let n=0;n<i.length;++n){if(i[n]%8!=0)throw new Error("When decoding with predictor, only multiple of 8 bits are supported.")
if(i[n]!==i[0])throw new Error("When decoding with predictor, all samples must have the same size.")}const c=i[0]/8,d=2===s?1:i.length
for(let l=0;l<o&&!(l*d*r*c>=e.byteLength);++l){let o
if(2===t){switch(i[0]){case 8:o=new Uint8Array(e,l*d*r*c,d*r*c)
break
case 16:o=new Uint16Array(e,l*d*r*c,d*r*c/2)
break
case 32:o=new Uint32Array(e,l*d*r*c,d*r*c/4)
break
default:throw new Error(`Predictor 2 not allowed with ${i[0]} bits per sample.`)}n(o,d)}else 3===t&&(o=new Uint8Array(e,l*d*r*c,d*r*c),a(o,d,c))}return e}(r,o,t?e.TileWidth:e.ImageWidth,t?e.TileLength:e.RowsPerStrip||e.ImageLength,e.BitsPerSample,e.PlanarConfiguration)}return r}}},388:(e,t,r)=>{r.r(t),r.d(t,{default:()=>a})
var n=r(1875)
class a extends n.A{constructor(){if(super(),"undefined"==typeof createImageBitmap)throw new Error("Cannot decode WebImage as `createImageBitmap` is not available")
if("undefined"==typeof document&&"undefined"==typeof OffscreenCanvas)throw new Error("Cannot decode WebImage as neither `document` nor `OffscreenCanvas` is not available")}async decode(e,t){const r=new Blob([t]),n=await createImageBitmap(r)
let a
"undefined"!=typeof document?(a=document.createElement("canvas"),a.width=n.width,a.height=n.height):a=new OffscreenCanvas(n.width,n.height)
const o=a.getContext("2d")
return o.drawImage(n,0,0),o.getImageData(0,0,n.width,n.height).data.buffer}}}}])
