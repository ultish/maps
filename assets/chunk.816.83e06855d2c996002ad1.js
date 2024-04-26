"use strict";(globalThis.webpackChunk_ember_auto_import_=globalThis.webpackChunk_ember_auto_import_||[]).push([[816],{1875:(e,t,n)=>{function r(e,t){let n=e.length-t,r=0
do{for(let n=t;n>0;n--)e[r+t]+=e[r],r++
n-=t}while(n>0)}function o(e,t,n){let r=0,o=e.length
const i=o/n
for(;o>t;){for(let n=t;n>0;--n)e[r+t]+=e[r],++r
o-=t}const l=e.slice()
for(let s=0;s<i;++s)for(let t=0;t<n;++t)e[n*s+t]=l[(n-t-1)*i+s]}n.d(t,{A:()=>i})
class i{async decode(e,t){const n=await this.decodeBlock(t),i=e.Predictor||1
if(1!==i){const t=!e.StripOffsets
return function(e,t,n,i,l,s){if(!t||1===t)return e
for(let r=0;r<l.length;++r){if(l[r]%8!=0)throw new Error("When decoding with predictor, only multiple of 8 bits are supported.")
if(l[r]!==l[0])throw new Error("When decoding with predictor, all samples must have the same size.")}const c=l[0]/8,a=2===s?1:l.length
for(let f=0;f<i&&!(f*a*n*c>=e.byteLength);++f){let i
if(2===t){switch(l[0]){case 8:i=new Uint8Array(e,f*a*n*c,a*n*c)
break
case 16:i=new Uint16Array(e,f*a*n*c,a*n*c/2)
break
case 32:i=new Uint32Array(e,f*a*n*c,a*n*c/4)
break
default:throw new Error(`Predictor 2 not allowed with ${l[0]} bits per sample.`)}r(i,a)}else 3===t&&(i=new Uint8Array(e,f*a*n*c,a*n*c),o(i,a,c))}return e}(n,i,t?e.TileWidth:e.ImageWidth,t?e.TileLength:e.RowsPerStrip||e.ImageLength,e.BitsPerSample,e.PlanarConfiguration)}return n}}},1816:(e,t,n)=>{n.r(t),n.d(t,{default:()=>i})
var r=n(1875)
function o(e,t){for(let n=t.length-1;n>=0;n--)e.push(t[n])
return e}class i extends r.A{decodeBlock(e){return function(e){const t=new Uint16Array(4093),n=new Uint8Array(4093)
for(let o=0;o<=257;o++)t[o]=4096,n[o]=o
let r=258,i=9,l=0
function s(){r=258,i=9}function c(e){const t=function(e,t,n){const r=t%8,o=Math.floor(t/8),i=8-r,l=t+n-8*(o+1)
let s=8*(o+2)-(t+n)
const c=8*(o+2)-t
if(s=Math.max(0,s),o>=e.length)return console.warn("ran off the end of the buffer before finding EOI_CODE (end on input code)"),257
let a=e[o]&2**(8-r)-1
a<<=n-i
let f=a
if(o+1<e.length){let t=e[o+1]>>>s
t<<=Math.max(0,n-c),f+=t}if(l>8&&o+2<e.length){const r=8*(o+3)-(t+n)
f+=e[o+2]>>>r}return f}(e,l,i)
return l+=i,t}function a(e,o){return n[r]=o,t[r]=e,r++,r-1}function f(e){const r=[]
for(let o=e;4096!==o;o=t[o])r.push(n[o])
return r}const h=[]
s()
const u=new Uint8Array(e)
let d,w=c(u)
for(;257!==w;){if(256===w){for(s(),w=c(u);256===w;)w=c(u)
if(257===w)break
if(w>256)throw new Error(`corrupted code at scanline ${w}`)
o(h,f(w)),d=w}else if(w<r){const e=f(w)
o(h,e),a(d,e[e.length-1]),d=w}else{const e=f(d)
if(!e)throw new Error(`Bogus entry. Not in dictionary, ${d} / ${r}, position: ${l}`)
o(h,e),h.push(e[e.length-1]),a(d,e[e.length-1]),d=w}r+1>=2**i&&(12===i?d=void 0:i++),w=c(u)}return new Uint8Array(h)}(e).buffer}}}}])
