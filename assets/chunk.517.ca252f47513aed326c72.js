"use strict";(globalThis.webpackChunk_ember_auto_import_=globalThis.webpackChunk_ember_auto_import_||[]).push([[517],{1875:(e,t,n)=>{function r(e,t){let n=e.length-t,r=0
do{for(let n=t;n>0;n--)e[r+t]+=e[r],r++
n-=t}while(n>0)}function s(e,t,n){let r=0,s=e.length
const o=s/n
for(;s>t;){for(let n=t;n>0;--n)e[r+t]+=e[r],++r
s-=t}const a=e.slice()
for(let i=0;i<o;++i)for(let t=0;t<n;++t)e[n*i+t]=a[(n-t-1)*o+i]}n.d(t,{A:()=>o})
class o{async decode(e,t){const n=await this.decodeBlock(t),o=e.Predictor||1
if(1!==o){const t=!e.StripOffsets
return function(e,t,n,o,a,i){if(!t||1===t)return e
for(let r=0;r<a.length;++r){if(a[r]%8!=0)throw new Error("When decoding with predictor, only multiple of 8 bits are supported.")
if(a[r]!==a[0])throw new Error("When decoding with predictor, all samples must have the same size.")}const c=a[0]/8,l=2===i?1:a.length
for(let f=0;f<o&&!(f*l*n*c>=e.byteLength);++f){let o
if(2===t){switch(a[0]){case 8:o=new Uint8Array(e,f*l*n*c,l*n*c)
break
case 16:o=new Uint16Array(e,f*l*n*c,l*n*c/2)
break
case 32:o=new Uint32Array(e,f*l*n*c,l*n*c/4)
break
default:throw new Error(`Predictor 2 not allowed with ${a[0]} bits per sample.`)}r(o,l)}else 3===t&&(o=new Uint8Array(e,f*l*n*c,l*n*c),s(o,l,c))}return e}(n,o,t?e.TileWidth:e.ImageWidth,t?e.TileLength:e.RowsPerStrip||e.ImageLength,e.BitsPerSample,e.PlanarConfiguration)}return n}}},5517:(e,t,n)=>{n.r(t),n.d(t,{default:()=>w})
var r=n(1875)
const s=new Int32Array([0,1,8,16,9,2,3,10,17,24,32,25,18,11,4,5,12,19,26,33,40,48,41,34,27,20,13,6,7,14,21,28,35,42,49,56,57,50,43,36,29,22,15,23,30,37,44,51,58,59,52,45,38,31,39,46,53,60,61,54,47,55,62,63]),o=4017,a=799,i=3406,c=2276,l=1567,f=3784,h=5793,u=2896
function m(e,t){let n=0
const r=[]
let s=16
for(;s>0&&!e[s-1];)--s
r.push({children:[],index:0})
let o,a=r[0]
for(let i=0;i<s;i++){for(let s=0;s<e[i];s++){for(a=r.pop(),a.children[a.index]=t[n];a.index>0;)a=r.pop()
for(a.index++,r.push(a);r.length<=i;)r.push(o={children:[],index:0}),a.children[a.index]=o.children,a=o
n++}i+1<s&&(r.push(o={children:[],index:0}),a.children[a.index]=o.children,a=o)}return r[0].children}function d(e,t,n,r,o,a,i,c,l){const{mcusPerLine:f,progressive:h}=n,u=t
let m=t,d=0,b=0
function p(){if(b>0)return b--,d>>b&1
if(d=e[m++],255===d){const t=e[m++]
if(t)throw new Error(`unexpected marker: ${(d<<8|t).toString(16)}`)}return b=7,d>>>7}function w(e){let t,n=e
for(;null!==(t=p());){if(n=n[t],"number"==typeof n)return n
if("object"!=typeof n)throw new Error("invalid huffman sequence")}return null}function k(e){let t=e,n=0
for(;t>0;){const e=p()
if(null===e)return
n=n<<1|e,--t}return n}function g(e){const t=k(e)
return t>=1<<e-1?t:t+(-1<<e)+1}let y,P=0,T=0
function A(e,t,n,r,s){const o=n%f,a=(n/f|0)*e.v+r,i=o*e.h+s
t(e,e.blocks[a][i])}function C(e,t,n){const r=n/e.blocksPerLine|0,s=n%e.blocksPerLine
t(e,e.blocks[r][s])}const v=r.length
let x,L,E,I,U,D
D=h?0===a?0===c?function(e,t){const n=w(e.huffmanTableDC),r=0===n?0:g(n)<<l
e.pred+=r,t[0]=e.pred}:function(e,t){t[0]|=p()<<l}:0===c?function(e,t){if(P>0)return void P--
let n=a
const r=i
for(;n<=r;){const r=w(e.huffmanTableAC),o=15&r,a=r>>4
if(0===o){if(a<15){P=k(a)+(1<<a)-1
break}n+=16}else n+=a,t[s[n]]=g(o)*(1<<l),n++}}:function(e,t){let n=a
const r=i
let o=0
for(;n<=r;){const r=s[n],a=t[r]<0?-1:1
switch(T){case 0:{const t=w(e.huffmanTableAC),n=15&t
if(o=t>>4,0===n)o<15?(P=k(o)+(1<<o),T=4):(o=16,T=1)
else{if(1!==n)throw new Error("invalid ACn encoding")
y=g(n),T=o?2:3}continue}case 1:case 2:t[r]?t[r]+=(p()<<l)*a:(o--,0===o&&(T=2===T?3:0))
break
case 3:t[r]?t[r]+=(p()<<l)*a:(t[r]=y<<l,T=0)
break
case 4:t[r]&&(t[r]+=(p()<<l)*a)}n++}4===T&&(P--,0===P&&(T=0))}:function(e,t){const n=w(e.huffmanTableDC),r=0===n?0:g(n)
e.pred+=r,t[0]=e.pred
let o=1
for(;o<64;){const n=w(e.huffmanTableAC),r=15&n,a=n>>4
if(0===r){if(a<15)break
o+=16}else o+=a,t[s[o]]=g(r),o++}}
let q,z,O=0
z=1===v?r[0].blocksPerLine*r[0].blocksPerColumn:f*n.mcusPerColumn
const _=o||z
for(;O<z;){for(L=0;L<v;L++)r[L].pred=0
if(P=0,1===v)for(x=r[0],U=0;U<_;U++)C(x,D,O),O++
else for(U=0;U<_;U++){for(L=0;L<v;L++){x=r[L]
const{h:e,v:t}=x
for(E=0;E<t;E++)for(I=0;I<e;I++)A(x,D,O,E,I)}if(O++,O===z)break}if(b=0,q=e[m]<<8|e[m+1],q<65280)throw new Error("marker was not found")
if(!(q>=65488&&q<=65495))break
m+=2}return m-u}function b(e,t){const n=[],{blocksPerLine:r,blocksPerColumn:s}=t,m=r<<3,d=new Int32Array(64),b=new Uint8Array(64)
function p(e,n,r){const s=t.quantizationTable
let m,d,b,p,w,k,g,y,P
const T=r
let A
for(A=0;A<64;A++)T[A]=e[A]*s[A]
for(A=0;A<8;++A){const e=8*A
0!==T[1+e]||0!==T[2+e]||0!==T[3+e]||0!==T[4+e]||0!==T[5+e]||0!==T[6+e]||0!==T[7+e]?(m=h*T[0+e]+128>>8,d=h*T[4+e]+128>>8,b=T[2+e],p=T[6+e],w=u*(T[1+e]-T[7+e])+128>>8,y=u*(T[1+e]+T[7+e])+128>>8,k=T[3+e]<<4,g=T[5+e]<<4,P=m-d+1>>1,m=m+d+1>>1,d=P,P=b*f+p*l+128>>8,b=b*l-p*f+128>>8,p=P,P=w-g+1>>1,w=w+g+1>>1,g=P,P=y+k+1>>1,k=y-k+1>>1,y=P,P=m-p+1>>1,m=m+p+1>>1,p=P,P=d-b+1>>1,d=d+b+1>>1,b=P,P=w*c+y*i+2048>>12,w=w*i-y*c+2048>>12,y=P,P=k*a+g*o+2048>>12,k=k*o-g*a+2048>>12,g=P,T[0+e]=m+y,T[7+e]=m-y,T[1+e]=d+g,T[6+e]=d-g,T[2+e]=b+k,T[5+e]=b-k,T[3+e]=p+w,T[4+e]=p-w):(P=h*T[0+e]+512>>10,T[0+e]=P,T[1+e]=P,T[2+e]=P,T[3+e]=P,T[4+e]=P,T[5+e]=P,T[6+e]=P,T[7+e]=P)}for(A=0;A<8;++A){const e=A
0!==T[8+e]||0!==T[16+e]||0!==T[24+e]||0!==T[32+e]||0!==T[40+e]||0!==T[48+e]||0!==T[56+e]?(m=h*T[0+e]+2048>>12,d=h*T[32+e]+2048>>12,b=T[16+e],p=T[48+e],w=u*(T[8+e]-T[56+e])+2048>>12,y=u*(T[8+e]+T[56+e])+2048>>12,k=T[24+e],g=T[40+e],P=m-d+1>>1,m=m+d+1>>1,d=P,P=b*f+p*l+2048>>12,b=b*l-p*f+2048>>12,p=P,P=w-g+1>>1,w=w+g+1>>1,g=P,P=y+k+1>>1,k=y-k+1>>1,y=P,P=m-p+1>>1,m=m+p+1>>1,p=P,P=d-b+1>>1,d=d+b+1>>1,b=P,P=w*c+y*i+2048>>12,w=w*i-y*c+2048>>12,y=P,P=k*a+g*o+2048>>12,k=k*o-g*a+2048>>12,g=P,T[0+e]=m+y,T[56+e]=m-y,T[8+e]=d+g,T[48+e]=d-g,T[16+e]=b+k,T[40+e]=b-k,T[24+e]=p+w,T[32+e]=p-w):(P=h*r[A+0]+8192>>14,T[0+e]=P,T[8+e]=P,T[16+e]=P,T[24+e]=P,T[32+e]=P,T[40+e]=P,T[48+e]=P,T[56+e]=P)}for(A=0;A<64;++A){const e=128+(T[A]+8>>4)
n[A]=e<0?0:e>255?255:e}}for(let o=0;o<s;o++){const e=o<<3
for(let t=0;t<8;t++)n.push(new Uint8Array(m))
for(let s=0;s<r;s++){p(t.blocks[o][s],b,d)
let r=0
const a=s<<3
for(let t=0;t<8;t++){const s=n[e+t]
for(let e=0;e<8;e++)s[a+e]=b[r++]}}}return n}class p{constructor(){this.jfif=null,this.adobe=null,this.quantizationTables=[],this.huffmanTablesAC=[],this.huffmanTablesDC=[],this.resetFrames()}resetFrames(){this.frames=[]}parse(e){let t=0
function n(){const n=e[t]<<8|e[t+1]
return t+=2,n}function r(){const r=n(),s=e.subarray(t,t+r-2)
return t+=s.length,s}function o(e){let t,n,r=0,s=0
for(n in e.components)e.components.hasOwnProperty(n)&&(t=e.components[n],r<t.h&&(r=t.h),s<t.v&&(s=t.v))
const o=Math.ceil(e.samplesPerLine/8/r),a=Math.ceil(e.scanLines/8/s)
for(n in e.components)if(e.components.hasOwnProperty(n)){t=e.components[n]
const i=Math.ceil(Math.ceil(e.samplesPerLine/8)*t.h/r),c=Math.ceil(Math.ceil(e.scanLines/8)*t.v/s),l=o*t.h,f=a*t.v,h=[]
for(let e=0;e<f;e++){const e=[]
for(let t=0;t<l;t++)e.push(new Int32Array(64))
h.push(e)}t.blocksPerLine=i,t.blocksPerColumn=c,t.blocks=h}e.maxH=r,e.maxV=s,e.mcusPerLine=o,e.mcusPerColumn=a}let a=n()
if(65496!==a)throw new Error("SOI not found")
for(a=n();65497!==a;){switch(a){case 65280:break
case 65504:case 65505:case 65506:case 65507:case 65508:case 65509:case 65510:case 65511:case 65512:case 65513:case 65514:case 65515:case 65516:case 65517:case 65518:case 65519:case 65534:{const e=r()
65504===a&&74===e[0]&&70===e[1]&&73===e[2]&&70===e[3]&&0===e[4]&&(this.jfif={version:{major:e[5],minor:e[6]},densityUnits:e[7],xDensity:e[8]<<8|e[9],yDensity:e[10]<<8|e[11],thumbWidth:e[12],thumbHeight:e[13],thumbData:e.subarray(14,14+3*e[12]*e[13])}),65518===a&&65===e[0]&&100===e[1]&&111===e[2]&&98===e[3]&&101===e[4]&&0===e[5]&&(this.adobe={version:e[6],flags0:e[7]<<8|e[8],flags1:e[9]<<8|e[10],transformCode:e[11]})
break}case 65499:{const r=n()+t-2
for(;t<r;){const r=e[t++],o=new Int32Array(64)
if(r>>4){if(r>>4!=1)throw new Error("DQT: invalid table spec")
for(let e=0;e<64;e++)o[s[e]]=n()}else for(let n=0;n<64;n++)o[s[n]]=e[t++]
this.quantizationTables[15&r]=o}break}case 65472:case 65473:case 65474:{n()
const r={extended:65473===a,progressive:65474===a,precision:e[t++],scanLines:n(),samplesPerLine:n(),components:{},componentsOrder:[]},s=e[t++]
let i
for(let n=0;n<s;n++){i=e[t]
const n=e[t+1]>>4,s=15&e[t+1],o=e[t+2]
r.componentsOrder.push(i),r.components[i]={h:n,v:s,quantizationIdx:o},t+=3}o(r),this.frames.push(r)
break}case 65476:{const r=n()
for(let n=2;n<r;){const r=e[t++],s=new Uint8Array(16)
let o=0
for(let n=0;n<16;n++,t++)s[n]=e[t],o+=s[n]
const a=new Uint8Array(o)
for(let n=0;n<o;n++,t++)a[n]=e[t]
n+=17+o,r>>4?this.huffmanTablesAC[15&r]=m(s,a):this.huffmanTablesDC[15&r]=m(s,a)}break}case 65501:n(),this.resetInterval=n()
break
case 65498:{n()
const r=e[t++],s=[],o=this.frames[0]
for(let n=0;n<r;n++){const n=o.components[e[t++]],r=e[t++]
n.huffmanTableDC=this.huffmanTablesDC[r>>4],n.huffmanTableAC=this.huffmanTablesAC[15&r],s.push(n)}const a=e[t++],i=e[t++],c=e[t++],l=d(e,t,o,s,this.resetInterval,a,i,c>>4,15&c)
t+=l
break}case 65535:255!==e[t]&&t--
break
default:if(255===e[t-3]&&e[t-2]>=192&&e[t-2]<=254){t-=3
break}throw new Error(`unknown JPEG marker ${a.toString(16)}`)}a=n()}}getResult(){const{frames:e}=this
if(0===this.frames.length)throw new Error("no frames were decoded")
this.frames.length>1&&console.warn("more than one frame is not supported")
for(let l=0;l<this.frames.length;l++){const e=this.frames[l].components
for(const t of Object.keys(e))e[t].quantizationTable=this.quantizationTables[e[t].quantizationIdx],delete e[t].quantizationIdx}const t=e[0],{components:n,componentsOrder:r}=t,s=[],o=t.samplesPerLine,a=t.scanLines
for(let l=0;l<r.length;l++){const e=n[r[l]]
s.push({lines:b(0,e),scaleX:e.h/t.maxH,scaleY:e.v/t.maxV})}const i=new Uint8Array(o*a*s.length)
let c=0
for(let l=0;l<a;++l)for(let e=0;e<o;++e)for(let t=0;t<s.length;++t){const n=s[t]
i[c]=n.lines[0|l*n.scaleY][0|e*n.scaleX],++c}return i}}class w extends r.A{constructor(e){super(),this.reader=new p,e.JPEGTables&&this.reader.parse(e.JPEGTables)}decodeBlock(e){return this.reader.resetFrames(),this.reader.parse(new Uint8Array(e)),this.reader.getResult().buffer}}}}])
