"use strict";(globalThis.webpackChunk_ember_auto_import_=globalThis.webpackChunk_ember_auto_import_||[]).push([[205],{1875:(e,t,r)=>{function n(e,t){let r=e.length-t,n=0
do{for(let r=t;r>0;r--)e[n+t]+=e[n],n++
r-=t}while(r>0)}function o(e,t,r){let n=0,o=e.length
const i=o/r
for(;o>t;){for(let r=t;r>0;--r)e[n+t]+=e[n],++n
o-=t}const l=e.slice()
for(let a=0;a<i;++a)for(let t=0;t<r;++t)e[r*a+t]=l[(r-t-1)*i+a]}r.d(t,{A:()=>i})
class i{async decode(e,t){const r=await this.decodeBlock(t),i=e.Predictor||1
if(1!==i){const t=!e.StripOffsets
return function(e,t,r,i,l,a){if(!t||1===t)return e
for(let n=0;n<l.length;++n){if(l[n]%8!=0)throw new Error("When decoding with predictor, only multiple of 8 bits are supported.")
if(l[n]!==l[0])throw new Error("When decoding with predictor, all samples must have the same size.")}const s=l[0]/8,c=2===a?1:l.length
for(let h=0;h<i&&!(h*c*r*s>=e.byteLength);++h){let i
if(2===t){switch(l[0]){case 8:i=new Uint8Array(e,h*c*r*s,c*r*s)
break
case 16:i=new Uint16Array(e,h*c*r*s,c*r*s/2)
break
case 32:i=new Uint32Array(e,h*c*r*s,c*r*s/4)
break
default:throw new Error(`Predictor 2 not allowed with ${l[0]} bits per sample.`)}n(i,c)}else 3===t&&(i=new Uint8Array(e,h*c*r*s,c*r*s),o(i,c,s))}return e}(r,i,t?e.TileWidth:e.ImageWidth,t?e.TileLength:e.RowsPerStrip||e.ImageLength,e.BitsPerSample,e.PlanarConfiguration)}return r}}},9205:(e,t,r)=>{r.r(t),r.d(t,{default:()=>o})
var n=r(1875)
class o extends n.A{decodeBlock(e){return e}}}}])
