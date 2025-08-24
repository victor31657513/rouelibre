(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const qo="168",oh=0,jl=1,lh=2,Ou=1,ch=2,dn=3,On=0,Ee=1,fn=2,Pn=0,Ui=1,Kl=2,$l=3,Zl=4,uh=5,Jn=100,dh=101,hh=102,fh=103,ph=104,mh=200,gh=201,_h=202,vh=203,to=204,eo=205,xh=206,yh=207,Mh=208,Sh=209,Eh=210,bh=211,wh=212,Ah=213,Th=214,Ch=0,Rh=1,Dh=2,Rs=3,Lh=4,Ph=5,Ih=6,Uh=7,Fu=0,Nh=1,Oh=2,In=0,Fh=1,kh=2,Bh=3,zh=4,Hh=5,Vh=6,Gh=7,ku=300,zi=301,Hi=302,no=303,io=304,aa=306,ro=1e3,ni=1001,so=1002,Se=1003,Wh=1004,Br=1005,qe=1006,ga=1007,ii=1008,mn=1009,Bu=1010,zu=1011,Er=1012,Yo=1013,si=1014,tn=1015,Dr=1016,jo=1017,Ko=1018,Vi=1020,Hu=35902,Vu=1021,Gu=1022,Ye=1023,Wu=1024,Xu=1025,Ni=1026,Gi=1027,$o=1028,Zo=1029,qu=1030,Jo=1031,Qo=1033,xs=33776,ys=33777,Ms=33778,Ss=33779,ao=35840,oo=35841,lo=35842,co=35843,uo=36196,ho=37492,fo=37496,po=37808,mo=37809,go=37810,_o=37811,vo=37812,xo=37813,yo=37814,Mo=37815,So=37816,Eo=37817,bo=37818,wo=37819,Ao=37820,To=37821,Es=36492,Co=36494,Ro=36495,Yu=36283,Do=36284,Lo=36285,Po=36286,Xh=3200,qh=3201,ju=0,Yh=1,Ln="",Ze="srgb",Bn="srgb-linear",tl="display-p3",oa="display-p3-linear",Ds="linear",$t="srgb",Ls="rec709",Ps="p3",pi=7680,Jl=519,jh=512,Kh=513,$h=514,Ku=515,Zh=516,Jh=517,Qh=518,tf=519,Ql=35044,ef=35048,tc="300 es",pn=2e3,Is=2001;class Zi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const i=this._listeners;return i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const r=this._listeners[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const i=this._listeners[t.type];if(i!==void 0){t.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const he=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ec=1234567;const mr=Math.PI/180,br=180/Math.PI;function Ji(){const n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(he[n&255]+he[n>>8&255]+he[n>>16&255]+he[n>>24&255]+"-"+he[t&255]+he[t>>8&255]+"-"+he[t>>16&15|64]+he[t>>24&255]+"-"+he[e&63|128]+he[e>>8&255]+"-"+he[e>>16&255]+he[e>>24&255]+he[i&255]+he[i>>8&255]+he[i>>16&255]+he[i>>24&255]).toLowerCase()}function _e(n,t,e){return Math.max(t,Math.min(e,n))}function el(n,t){return(n%t+t)%t}function nf(n,t,e,i,r){return i+(n-t)*(r-i)/(e-t)}function rf(n,t,e){return n!==t?(e-n)/(t-n):0}function gr(n,t,e){return(1-e)*n+e*t}function sf(n,t,e,i){return gr(n,t,1-Math.exp(-e*i))}function af(n,t=1){return t-Math.abs(el(n,t*2)-t)}function of(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*(3-2*n))}function lf(n,t,e){return n<=t?0:n>=e?1:(n=(n-t)/(e-t),n*n*n*(n*(n*6-15)+10))}function cf(n,t){return n+Math.floor(Math.random()*(t-n+1))}function uf(n,t){return n+Math.random()*(t-n)}function df(n){return n*(.5-Math.random())}function hf(n){n!==void 0&&(ec=n);let t=ec+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function ff(n){return n*mr}function pf(n){return n*br}function mf(n){return(n&n-1)===0&&n!==0}function gf(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function _f(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function vf(n,t,e,i,r){const s=Math.cos,a=Math.sin,o=s(e/2),l=a(e/2),c=s((t+i)/2),u=a((t+i)/2),h=s((t-i)/2),d=a((t-i)/2),m=s((i-t)/2),_=a((i-t)/2);switch(r){case"XYX":n.set(o*u,l*h,l*d,o*c);break;case"YZY":n.set(l*d,o*u,l*h,o*c);break;case"ZXZ":n.set(l*h,l*d,o*u,o*c);break;case"XZX":n.set(o*u,l*_,l*m,o*c);break;case"YXY":n.set(l*m,o*u,l*_,o*c);break;case"ZYZ":n.set(l*_,l*m,o*u,o*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Pi(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function me(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}const hn={DEG2RAD:mr,RAD2DEG:br,generateUUID:Ji,clamp:_e,euclideanModulo:el,mapLinear:nf,inverseLerp:rf,lerp:gr,damp:sf,pingpong:af,smoothstep:of,smootherstep:lf,randInt:cf,randFloat:uf,randFloatSpread:df,seededRandom:hf,degToRad:ff,radToDeg:pf,isPowerOfTwo:mf,ceilPowerOfTwo:gf,floorPowerOfTwo:_f,setQuaternionFromProperEuler:vf,normalize:me,denormalize:Pi};class Ot{constructor(t=0,e=0){Ot.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,i=this.y,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6],this.y=r[1]*e+r[4]*i+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(_e(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const i=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*i-a*r+t.x,this.y=s*r+a*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Pt{constructor(t,e,i,r,s,a,o,l,c){Pt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,r,s,a,o,l,c)}set(t,e,i,r,s,a,o,l,c){const u=this.elements;return u[0]=t,u[1]=r,u[2]=o,u[3]=e,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,r=e.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],m=i[5],_=i[8],g=r[0],p=r[3],f=r[6],b=r[1],S=r[4],E=r[7],D=r[2],w=r[5],T=r[8];return s[0]=a*g+o*b+l*D,s[3]=a*p+o*S+l*w,s[6]=a*f+o*E+l*T,s[1]=c*g+u*b+h*D,s[4]=c*p+u*S+h*w,s[7]=c*f+u*E+h*T,s[2]=d*g+m*b+_*D,s[5]=d*p+m*S+_*w,s[8]=d*f+m*E+_*T,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return e*a*u-e*o*c-i*s*u+i*o*l+r*s*c-r*a*l}invert(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=u*a-o*c,d=o*l-u*s,m=c*s-a*l,_=e*h+i*d+r*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);const g=1/_;return t[0]=h*g,t[1]=(r*c-u*i)*g,t[2]=(o*i-r*a)*g,t[3]=d*g,t[4]=(u*e-r*l)*g,t[5]=(r*s-o*e)*g,t[6]=m*g,t[7]=(i*l-c*e)*g,t[8]=(a*e-i*s)*g,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+t,-r*c,r*l,-r*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(_a.makeScale(t,e)),this}rotate(t){return this.premultiply(_a.makeRotation(-t)),this}translate(t,e){return this.premultiply(_a.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,i=t.elements;for(let r=0;r<9;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const _a=new Pt;function $u(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function Us(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function xf(){const n=Us("canvas");return n.style.display="block",n}const nc={};function _r(n){n in nc||(nc[n]=!0,console.warn(n))}function yf(n,t,e){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:i()}}setTimeout(s,e)})}const ic=new Pt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),rc=new Pt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ir={[Bn]:{transfer:Ds,primaries:Ls,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n,fromReference:n=>n},[Ze]:{transfer:$t,primaries:Ls,luminanceCoefficients:[.2126,.7152,.0722],toReference:n=>n.convertSRGBToLinear(),fromReference:n=>n.convertLinearToSRGB()},[oa]:{transfer:Ds,primaries:Ps,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.applyMatrix3(rc),fromReference:n=>n.applyMatrix3(ic)},[tl]:{transfer:$t,primaries:Ps,luminanceCoefficients:[.2289,.6917,.0793],toReference:n=>n.convertSRGBToLinear().applyMatrix3(rc),fromReference:n=>n.applyMatrix3(ic).convertLinearToSRGB()}},Mf=new Set([Bn,oa]),Yt={enabled:!0,_workingColorSpace:Bn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(n){if(!Mf.has(n))throw new Error(`Unsupported working color space, "${n}".`);this._workingColorSpace=n},convert:function(n,t,e){if(this.enabled===!1||t===e||!t||!e)return n;const i=ir[t].toReference,r=ir[e].fromReference;return r(i(n))},fromWorkingColorSpace:function(n,t){return this.convert(n,this._workingColorSpace,t)},toWorkingColorSpace:function(n,t){return this.convert(n,t,this._workingColorSpace)},getPrimaries:function(n){return ir[n].primaries},getTransfer:function(n){return n===Ln?Ds:ir[n].transfer},getLuminanceCoefficients:function(n,t=this._workingColorSpace){return n.fromArray(ir[t].luminanceCoefficients)}};function Oi(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function va(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}let mi;class Sf{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{mi===void 0&&(mi=Us("canvas")),mi.width=t.width,mi.height=t.height;const i=mi.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),e=mi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Us("canvas");e.width=t.width,e.height=t.height;const i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);const r=i.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Oi(s[a]/255)*255;return i.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Oi(e[i]/255)*255):e[i]=Oi(e[i]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ef=0;class Zu{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ef++}),this.uuid=Ji(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(xa(r[a].image)):s.push(xa(r[a]))}else s=xa(r);i.url=s}return e||(t.images[this.uuid]=i),i}}function xa(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?Sf.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let bf=0;class xe extends Zi{constructor(t=xe.DEFAULT_IMAGE,e=xe.DEFAULT_MAPPING,i=ni,r=ni,s=qe,a=ii,o=Ye,l=mn,c=xe.DEFAULT_ANISOTROPY,u=Ln){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:bf++}),this.uuid=Ji(),this.name="",this.source=new Zu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ot(0,0),this.repeat=new Ot(1,1),this.center=new Ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ku)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ro:t.x=t.x-Math.floor(t.x);break;case ni:t.x=t.x<0?0:1;break;case so:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ro:t.y=t.y-Math.floor(t.y);break;case ni:t.y=t.y<0?0:1;break;case so:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}xe.DEFAULT_IMAGE=null;xe.DEFAULT_MAPPING=ku;xe.DEFAULT_ANISOTROPY=1;class ae{constructor(t=0,e=0,i=0,r=1){ae.prototype.isVector4=!0,this.x=t,this.y=e,this.z=i,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,r){return this.x=t,this.y=e,this.z=i,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,i=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,r,s;const l=t.elements,c=l[0],u=l[4],h=l[8],d=l[1],m=l[5],_=l[9],g=l[2],p=l[6],f=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-g)<.01&&Math.abs(_-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+g)<.1&&Math.abs(_+p)<.1&&Math.abs(c+m+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(c+1)/2,E=(m+1)/2,D=(f+1)/2,w=(u+d)/4,T=(h+g)/4,L=(_+p)/4;return S>E&&S>D?S<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(S),r=w/i,s=T/i):E>D?E<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(E),i=w/r,s=L/r):D<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(D),i=T/s,r=L/s),this.set(i,r,s,e),this}let b=Math.sqrt((p-_)*(p-_)+(h-g)*(h-g)+(d-u)*(d-u));return Math.abs(b)<.001&&(b=1),this.x=(p-_)/b,this.y=(h-g)/b,this.z=(d-u)/b,this.w=Math.acos((c+m+f-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class wf extends Zi{constructor(t=1,e=1,i={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ae(0,0,t,e),this.scissorTest=!1,this.viewport=new ae(0,0,t,e);const r={width:t,height:e,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:qe,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new xe(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let i=0,r=t.textures.length;i<r;i++)this.textures[i]=t.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Zu(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ai extends wf{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}}class Ju extends xe{constructor(t=null,e=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:r},this.magFilter=Se,this.minFilter=Se,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Af extends xe{constructor(t=null,e=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:r},this.magFilter=Se,this.minFilter=Se,this.wrapR=ni,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Un{constructor(t=0,e=0,i=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=r}static slerpFlat(t,e,i,r,s,a,o){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3];const d=s[a+0],m=s[a+1],_=s[a+2],g=s[a+3];if(o===0){t[e+0]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h;return}if(o===1){t[e+0]=d,t[e+1]=m,t[e+2]=_,t[e+3]=g;return}if(h!==g||l!==d||c!==m||u!==_){let p=1-o;const f=l*d+c*m+u*_+h*g,b=f>=0?1:-1,S=1-f*f;if(S>Number.EPSILON){const D=Math.sqrt(S),w=Math.atan2(D,f*b);p=Math.sin(p*w)/D,o=Math.sin(o*w)/D}const E=o*b;if(l=l*p+d*E,c=c*p+m*E,u=u*p+_*E,h=h*p+g*E,p===1-o){const D=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=D,c*=D,u*=D,h*=D}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=h}static multiplyQuaternionsFlat(t,e,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[a],d=s[a+1],m=s[a+2],_=s[a+3];return t[e]=o*_+u*h+l*m-c*d,t[e+1]=l*_+u*d+c*h-o*m,t[e+2]=c*_+u*m+o*d-l*h,t[e+3]=u*_-o*h-l*d-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,r){return this._x=t,this._y=e,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const i=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(r/2),h=o(s/2),d=l(i/2),m=l(r/2),_=l(s/2);switch(a){case"XYZ":this._x=d*u*h+c*m*_,this._y=c*m*h-d*u*_,this._z=c*u*_+d*m*h,this._w=c*u*h-d*m*_;break;case"YXZ":this._x=d*u*h+c*m*_,this._y=c*m*h-d*u*_,this._z=c*u*_-d*m*h,this._w=c*u*h+d*m*_;break;case"ZXY":this._x=d*u*h-c*m*_,this._y=c*m*h+d*u*_,this._z=c*u*_+d*m*h,this._w=c*u*h-d*m*_;break;case"ZYX":this._x=d*u*h-c*m*_,this._y=c*m*h+d*u*_,this._z=c*u*_-d*m*h,this._w=c*u*h+d*m*_;break;case"YZX":this._x=d*u*h+c*m*_,this._y=c*m*h+d*u*_,this._z=c*u*_-d*m*h,this._w=c*u*h-d*m*_;break;case"XZY":this._x=d*u*h-c*m*_,this._y=c*m*h-d*u*_,this._z=c*u*_+d*m*h,this._w=c*u*h+d*m*_;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const i=e/2,r=Math.sin(i);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,i=e[0],r=e[4],s=e[8],a=e[1],o=e[5],l=e[9],c=e[2],u=e[6],h=e[10],d=i+o+h;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(u-l)*m,this._y=(s-c)*m,this._z=(a-r)*m}else if(i>o&&i>h){const m=2*Math.sqrt(1+i-o-h);this._w=(u-l)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+c)/m}else if(o>h){const m=2*Math.sqrt(1+o-i-h);this._w=(s-c)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+h-i-o);this._w=(a-r)/m,this._x=(s+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<Number.EPSILON?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(_e(this.dot(t),-1,1)))}rotateTowards(t,e){const i=this.angleTo(t);if(i===0)return this;const r=Math.min(1,e/i);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const i=t._x,r=t._y,s=t._z,a=t._w,o=e._x,l=e._y,c=e._z,u=e._w;return this._x=i*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-i*c,this._z=s*u+a*c+i*l-r*o,this._w=a*u-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+i*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const m=1-e;return this._w=m*a+e*this._w,this._x=m*i+e*this._x,this._y=m*r+e*this._y,this._z=m*s+e*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,o),h=Math.sin((1-e)*u)/c,d=Math.sin(e*u)/c;return this._w=a*h+this._w*d,this._x=i*h+this._x*d,this._y=r*h+this._y*d,this._z=s*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(t=0,e=0,i=0){O.prototype.isVector3=!0,this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(sc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(sc.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6]*r,this.y=s[1]*e+s[4]*i+s[7]*r,this.z=s[2]*e+s[5]*i+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,i=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,i=this.y,r=this.z,s=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*r-o*i),u=2*(o*e-s*r),h=2*(s*i-a*e);return this.x=e+l*c+a*h-o*u,this.y=i+l*u+o*c-s*h,this.z=r+l*h+s*u-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,i=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*i+s[8]*r,this.y=s[1]*e+s[5]*i+s[9]*r,this.z=s[2]*e+s[6]*i+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(t,Math.min(e,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const i=t.x,r=t.y,s=t.z,a=e.x,o=e.y,l=e.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return ya.copy(this).projectOnVector(t),this.sub(ya)}reflect(t){return this.sub(ya.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const i=this.dot(t)/e;return Math.acos(_e(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,i=this.y-t.y,r=this.z-t.z;return e*e+i*i+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){const r=Math.sin(e)*t;return this.x=r*Math.sin(i),this.y=Math.cos(e)*t,this.z=r*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ya=new O,sc=new Un;class zn{constructor(t=new O(1/0,1/0,1/0),e=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(Ge.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(Ge.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const i=Ge.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const i=t.geometry;if(i!==void 0){const s=i.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ge):Ge.fromBufferAttribute(s,a),Ge.applyMatrix4(t.matrixWorld),this.expandByPoint(Ge);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),zr.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),zr.copy(i.boundingBox)),zr.applyMatrix4(t.matrixWorld),this.union(zr)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Ge),Ge.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(rr),Hr.subVectors(this.max,rr),gi.subVectors(t.a,rr),_i.subVectors(t.b,rr),vi.subVectors(t.c,rr),Mn.subVectors(_i,gi),Sn.subVectors(vi,_i),Gn.subVectors(gi,vi);let e=[0,-Mn.z,Mn.y,0,-Sn.z,Sn.y,0,-Gn.z,Gn.y,Mn.z,0,-Mn.x,Sn.z,0,-Sn.x,Gn.z,0,-Gn.x,-Mn.y,Mn.x,0,-Sn.y,Sn.x,0,-Gn.y,Gn.x,0];return!Ma(e,gi,_i,vi,Hr)||(e=[1,0,0,0,1,0,0,0,1],!Ma(e,gi,_i,vi,Hr))?!1:(Vr.crossVectors(Mn,Sn),e=[Vr.x,Vr.y,Vr.z],Ma(e,gi,_i,vi,Hr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ge).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ge).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(an[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),an[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),an[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),an[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),an[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),an[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),an[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),an[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(an),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const an=[new O,new O,new O,new O,new O,new O,new O,new O],Ge=new O,zr=new zn,gi=new O,_i=new O,vi=new O,Mn=new O,Sn=new O,Gn=new O,rr=new O,Hr=new O,Vr=new O,Wn=new O;function Ma(n,t,e,i,r){for(let s=0,a=n.length-3;s<=a;s+=3){Wn.fromArray(n,s);const o=r.x*Math.abs(Wn.x)+r.y*Math.abs(Wn.y)+r.z*Math.abs(Wn.z),l=t.dot(Wn),c=e.dot(Wn),u=i.dot(Wn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Tf=new zn,sr=new O,Sa=new O;class Qi{constructor(t=new O,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const i=this.center;e!==void 0?i.copy(e):Tf.setFromPoints(t).getCenter(i);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,i.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;sr.subVectors(t,this.center);const e=sr.lengthSq();if(e>this.radius*this.radius){const i=Math.sqrt(e),r=(i-this.radius)*.5;this.center.addScaledVector(sr,r/i),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Sa.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(sr.copy(t.center).add(Sa)),this.expandByPoint(sr.copy(t.center).sub(Sa))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const on=new O,Ea=new O,Gr=new O,En=new O,ba=new O,Wr=new O,wa=new O;class nl{constructor(t=new O,e=new O(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,on)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=on.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(on.copy(this.origin).addScaledVector(this.direction,e),on.distanceToSquared(t))}distanceSqToSegment(t,e,i,r){Ea.copy(t).add(e).multiplyScalar(.5),Gr.copy(e).sub(t).normalize(),En.copy(this.origin).sub(Ea);const s=t.distanceTo(e)*.5,a=-this.direction.dot(Gr),o=En.dot(this.direction),l=-En.dot(Gr),c=En.lengthSq(),u=Math.abs(1-a*a);let h,d,m,_;if(u>0)if(h=a*l-o,d=a*o-l,_=s*u,h>=0)if(d>=-_)if(d<=_){const g=1/u;h*=g,d*=g,m=h*(h+a*d+2*o)+d*(a*h+d+2*l)+c}else d=s,h=Math.max(0,-(a*d+o)),m=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(a*d+o)),m=-h*h+d*(d+2*l)+c;else d<=-_?(h=Math.max(0,-(-a*s+o)),d=h>0?-s:Math.min(Math.max(-s,-l),s),m=-h*h+d*(d+2*l)+c):d<=_?(h=0,d=Math.min(Math.max(-s,-l),s),m=d*(d+2*l)+c):(h=Math.max(0,-(a*s+o)),d=h>0?s:Math.min(Math.max(-s,-l),s),m=-h*h+d*(d+2*l)+c);else d=a>0?-s:s,h=Math.max(0,-(a*d+o)),m=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Ea).addScaledVector(Gr,d),m}intersectSphere(t,e){on.subVectors(t.center,this.origin);const i=on.dot(this.direction),r=on.dot(on)-i*i,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){const i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(t.min.x-d.x)*c,r=(t.max.x-d.x)*c):(i=(t.max.x-d.x)*c,r=(t.min.x-d.x)*c),u>=0?(s=(t.min.y-d.y)*u,a=(t.max.y-d.y)*u):(s=(t.max.y-d.y)*u,a=(t.min.y-d.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),h>=0?(o=(t.min.z-d.z)*h,l=(t.max.z-d.z)*h):(o=(t.max.z-d.z)*h,l=(t.min.z-d.z)*h),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,e)}intersectsBox(t){return this.intersectBox(t,on)!==null}intersectTriangle(t,e,i,r,s){ba.subVectors(e,t),Wr.subVectors(i,t),wa.crossVectors(ba,Wr);let a=this.direction.dot(wa),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;En.subVectors(this.origin,t);const l=o*this.direction.dot(Wr.crossVectors(En,Wr));if(l<0)return null;const c=o*this.direction.dot(ba.cross(En));if(c<0||l+c>a)return null;const u=-o*En.dot(wa);return u<0?null:this.at(u/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class jt{constructor(t,e,i,r,s,a,o,l,c,u,h,d,m,_,g,p){jt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,r,s,a,o,l,c,u,h,d,m,_,g,p)}set(t,e,i,r,s,a,o,l,c,u,h,d,m,_,g,p){const f=this.elements;return f[0]=t,f[4]=e,f[8]=i,f[12]=r,f[1]=s,f[5]=a,f[9]=o,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=m,f[7]=_,f[11]=g,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new jt().fromArray(this.elements)}copy(t){const e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){const e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,i=t.elements,r=1/xi.setFromMatrixColumn(t,0).length(),s=1/xi.setFromMatrixColumn(t,1).length(),a=1/xi.setFromMatrixColumn(t,2).length();return e[0]=i[0]*r,e[1]=i[1]*r,e[2]=i[2]*r,e[3]=0,e[4]=i[4]*s,e[5]=i[5]*s,e[6]=i[6]*s,e[7]=0,e[8]=i[8]*a,e[9]=i[9]*a,e[10]=i[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,i=t.x,r=t.y,s=t.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(t.order==="XYZ"){const d=a*u,m=a*h,_=o*u,g=o*h;e[0]=l*u,e[4]=-l*h,e[8]=c,e[1]=m+_*c,e[5]=d-g*c,e[9]=-o*l,e[2]=g-d*c,e[6]=_+m*c,e[10]=a*l}else if(t.order==="YXZ"){const d=l*u,m=l*h,_=c*u,g=c*h;e[0]=d+g*o,e[4]=_*o-m,e[8]=a*c,e[1]=a*h,e[5]=a*u,e[9]=-o,e[2]=m*o-_,e[6]=g+d*o,e[10]=a*l}else if(t.order==="ZXY"){const d=l*u,m=l*h,_=c*u,g=c*h;e[0]=d-g*o,e[4]=-a*h,e[8]=_+m*o,e[1]=m+_*o,e[5]=a*u,e[9]=g-d*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const d=a*u,m=a*h,_=o*u,g=o*h;e[0]=l*u,e[4]=_*c-m,e[8]=d*c+g,e[1]=l*h,e[5]=g*c+d,e[9]=m*c-_,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const d=a*l,m=a*c,_=o*l,g=o*c;e[0]=l*u,e[4]=g-d*h,e[8]=_*h+m,e[1]=h,e[5]=a*u,e[9]=-o*u,e[2]=-c*u,e[6]=m*h+_,e[10]=d-g*h}else if(t.order==="XZY"){const d=a*l,m=a*c,_=o*l,g=o*c;e[0]=l*u,e[4]=-h,e[8]=c*u,e[1]=d*h+g,e[5]=a*u,e[9]=m*h-_,e[2]=_*h-m,e[6]=o*u,e[10]=g*h+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Cf,t,Rf)}lookAt(t,e,i){const r=this.elements;return Ce.subVectors(t,e),Ce.lengthSq()===0&&(Ce.z=1),Ce.normalize(),bn.crossVectors(i,Ce),bn.lengthSq()===0&&(Math.abs(i.z)===1?Ce.x+=1e-4:Ce.z+=1e-4,Ce.normalize(),bn.crossVectors(i,Ce)),bn.normalize(),Xr.crossVectors(Ce,bn),r[0]=bn.x,r[4]=Xr.x,r[8]=Ce.x,r[1]=bn.y,r[5]=Xr.y,r[9]=Ce.y,r[2]=bn.z,r[6]=Xr.z,r[10]=Ce.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const i=t.elements,r=e.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],m=i[13],_=i[2],g=i[6],p=i[10],f=i[14],b=i[3],S=i[7],E=i[11],D=i[15],w=r[0],T=r[4],L=r[8],M=r[12],v=r[1],C=r[5],k=r[9],U=r[13],z=r[2],G=r[6],V=r[10],$=r[14],W=r[3],st=r[7],lt=r[11],ft=r[15];return s[0]=a*w+o*v+l*z+c*W,s[4]=a*T+o*C+l*G+c*st,s[8]=a*L+o*k+l*V+c*lt,s[12]=a*M+o*U+l*$+c*ft,s[1]=u*w+h*v+d*z+m*W,s[5]=u*T+h*C+d*G+m*st,s[9]=u*L+h*k+d*V+m*lt,s[13]=u*M+h*U+d*$+m*ft,s[2]=_*w+g*v+p*z+f*W,s[6]=_*T+g*C+p*G+f*st,s[10]=_*L+g*k+p*V+f*lt,s[14]=_*M+g*U+p*$+f*ft,s[3]=b*w+S*v+E*z+D*W,s[7]=b*T+S*C+E*G+D*st,s[11]=b*L+S*k+E*V+D*lt,s[15]=b*M+S*U+E*$+D*ft,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],i=t[4],r=t[8],s=t[12],a=t[1],o=t[5],l=t[9],c=t[13],u=t[2],h=t[6],d=t[10],m=t[14],_=t[3],g=t[7],p=t[11],f=t[15];return _*(+s*l*h-r*c*h-s*o*d+i*c*d+r*o*m-i*l*m)+g*(+e*l*m-e*c*d+s*a*d-r*a*m+r*c*u-s*l*u)+p*(+e*c*h-e*o*m-s*a*h+i*a*m+s*o*u-i*c*u)+f*(-r*o*u-e*l*h+e*o*d+r*a*h-i*a*d+i*l*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=i),this}invert(){const t=this.elements,e=t[0],i=t[1],r=t[2],s=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],h=t[9],d=t[10],m=t[11],_=t[12],g=t[13],p=t[14],f=t[15],b=h*p*c-g*d*c+g*l*m-o*p*m-h*l*f+o*d*f,S=_*d*c-u*p*c-_*l*m+a*p*m+u*l*f-a*d*f,E=u*g*c-_*h*c+_*o*m-a*g*m-u*o*f+a*h*f,D=_*h*l-u*g*l-_*o*d+a*g*d+u*o*p-a*h*p,w=e*b+i*S+r*E+s*D;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/w;return t[0]=b*T,t[1]=(g*d*s-h*p*s-g*r*m+i*p*m+h*r*f-i*d*f)*T,t[2]=(o*p*s-g*l*s+g*r*c-i*p*c-o*r*f+i*l*f)*T,t[3]=(h*l*s-o*d*s-h*r*c+i*d*c+o*r*m-i*l*m)*T,t[4]=S*T,t[5]=(u*p*s-_*d*s+_*r*m-e*p*m-u*r*f+e*d*f)*T,t[6]=(_*l*s-a*p*s-_*r*c+e*p*c+a*r*f-e*l*f)*T,t[7]=(a*d*s-u*l*s+u*r*c-e*d*c-a*r*m+e*l*m)*T,t[8]=E*T,t[9]=(_*h*s-u*g*s-_*i*m+e*g*m+u*i*f-e*h*f)*T,t[10]=(a*g*s-_*o*s+_*i*c-e*g*c-a*i*f+e*o*f)*T,t[11]=(u*o*s-a*h*s-u*i*c+e*h*c+a*i*m-e*o*m)*T,t[12]=D*T,t[13]=(u*g*r-_*h*r+_*i*d-e*g*d-u*i*p+e*h*p)*T,t[14]=(_*o*r-a*g*r-_*i*l+e*g*l+a*i*p-e*o*p)*T,t[15]=(a*h*r-u*o*r+u*i*l-e*h*l-a*i*d+e*o*d)*T,this}scale(t){const e=this.elements,i=t.x,r=t.y,s=t.z;return e[0]*=i,e[4]*=r,e[8]*=s,e[1]*=i,e[5]*=r,e[9]*=s,e[2]*=i,e[6]*=r,e[10]*=s,e[3]*=i,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,r))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const i=Math.cos(e),r=Math.sin(e),s=1-i,a=t.x,o=t.y,l=t.z,c=s*a,u=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+i,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,r,s,a){return this.set(1,i,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,i){const r=this.elements,s=e._x,a=e._y,o=e._z,l=e._w,c=s+s,u=a+a,h=o+o,d=s*c,m=s*u,_=s*h,g=a*u,p=a*h,f=o*h,b=l*c,S=l*u,E=l*h,D=i.x,w=i.y,T=i.z;return r[0]=(1-(g+f))*D,r[1]=(m+E)*D,r[2]=(_-S)*D,r[3]=0,r[4]=(m-E)*w,r[5]=(1-(d+f))*w,r[6]=(p+b)*w,r[7]=0,r[8]=(_+S)*T,r[9]=(p-b)*T,r[10]=(1-(d+g))*T,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,i){const r=this.elements;let s=xi.set(r[0],r[1],r[2]).length();const a=xi.set(r[4],r[5],r[6]).length(),o=xi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],We.copy(this);const c=1/s,u=1/a,h=1/o;return We.elements[0]*=c,We.elements[1]*=c,We.elements[2]*=c,We.elements[4]*=u,We.elements[5]*=u,We.elements[6]*=u,We.elements[8]*=h,We.elements[9]*=h,We.elements[10]*=h,e.setFromRotationMatrix(We),i.x=s,i.y=a,i.z=o,this}makePerspective(t,e,i,r,s,a,o=pn){const l=this.elements,c=2*s/(e-t),u=2*s/(i-r),h=(e+t)/(e-t),d=(i+r)/(i-r);let m,_;if(o===pn)m=-(a+s)/(a-s),_=-2*a*s/(a-s);else if(o===Is)m=-a/(a-s),_=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,i,r,s,a,o=pn){const l=this.elements,c=1/(e-t),u=1/(i-r),h=1/(a-s),d=(e+t)*c,m=(i+r)*u;let _,g;if(o===pn)_=(a+s)*h,g=-2*h;else if(o===Is)_=s*h,g=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=g,l[14]=-_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){const e=this.elements,i=t.elements;for(let r=0;r<16;r++)if(e[r]!==i[r])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){const i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}}const xi=new O,We=new jt,Cf=new O(0,0,0),Rf=new O(1,1,1),bn=new O,Xr=new O,Ce=new O,ac=new jt,oc=new Un;class Be{constructor(t=0,e=0,i=0,r=Be.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,r=this._order){return this._x=t,this._y=e,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],m=r[10];switch(e){case"XYZ":this._y=Math.asin(_e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-_e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(_e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,m),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-_e(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(_e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-_e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return ac.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ac,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return oc.setFromEuler(this),this.setFromQuaternion(oc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Be.DEFAULT_ORDER="XYZ";class il{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Df=0;const lc=new O,yi=new Un,ln=new jt,qr=new O,ar=new O,Lf=new O,Pf=new Un,cc=new O(1,0,0),uc=new O(0,1,0),dc=new O(0,0,1),hc={type:"added"},If={type:"removed"},Mi={type:"childadded",child:null},Aa={type:"childremoved",child:null};class ne extends Zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Df++}),this.uuid=Ji(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ne.DEFAULT_UP.clone();const t=new O,e=new Be,i=new Un,r=new O(1,1,1);function s(){i.setFromEuler(e,!1)}function a(){e.setFromQuaternion(i,void 0,!1)}e._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new jt},normalMatrix:{value:new Pt}}),this.matrix=new jt,this.matrixWorld=new jt,this.matrixAutoUpdate=ne.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ne.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new il,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return yi.setFromAxisAngle(t,e),this.quaternion.multiply(yi),this}rotateOnWorldAxis(t,e){return yi.setFromAxisAngle(t,e),this.quaternion.premultiply(yi),this}rotateX(t){return this.rotateOnAxis(cc,t)}rotateY(t){return this.rotateOnAxis(uc,t)}rotateZ(t){return this.rotateOnAxis(dc,t)}translateOnAxis(t,e){return lc.copy(t).applyQuaternion(this.quaternion),this.position.add(lc.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(cc,t)}translateY(t){return this.translateOnAxis(uc,t)}translateZ(t){return this.translateOnAxis(dc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ln.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?qr.copy(t):qr.set(t,e,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ar.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ln.lookAt(ar,qr,this.up):ln.lookAt(qr,ar,this.up),this.quaternion.setFromRotationMatrix(ln),r&&(ln.extractRotation(r.matrixWorld),yi.setFromRotationMatrix(ln),this.quaternion.premultiply(yi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(hc),Mi.child=t,this.dispatchEvent(Mi),Mi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(If),Aa.child=t,this.dispatchEvent(Aa),Aa.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ln.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ln.multiply(t.parent.matrixWorld)),t.applyMatrix4(ln),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(hc),Mi.child=t,this.dispatchEvent(Mi),Mi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,t,Lf),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ar,Pf,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let i=0,r=e.length;i<r;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];s(t.shapes,h)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(t.materials,this.material[l]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),u=a(t.images),h=a(t.shapes),d=a(t.skeletons),m=a(t.animations),_=a(t.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=r,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){const r=t.children[i];this.add(r.clone())}return this}}ne.DEFAULT_UP=new O(0,1,0);ne.DEFAULT_MATRIX_AUTO_UPDATE=!0;ne.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Xe=new O,cn=new O,Ta=new O,un=new O,Si=new O,Ei=new O,fc=new O,Ca=new O,Ra=new O,Da=new O;class Qe{constructor(t=new O,e=new O,i=new O){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,r){r.subVectors(i,e),Xe.subVectors(t,e),r.cross(Xe);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,i,r,s){Xe.subVectors(r,e),cn.subVectors(i,e),Ta.subVectors(t,e);const a=Xe.dot(Xe),o=Xe.dot(cn),l=Xe.dot(Ta),c=cn.dot(cn),u=cn.dot(Ta),h=a*c-o*o;if(h===0)return s.set(0,0,0),null;const d=1/h,m=(c*l-o*u)*d,_=(a*u-o*l)*d;return s.set(1-m-_,_,m)}static containsPoint(t,e,i,r){return this.getBarycoord(t,e,i,r,un)===null?!1:un.x>=0&&un.y>=0&&un.x+un.y<=1}static getInterpolation(t,e,i,r,s,a,o,l){return this.getBarycoord(t,e,i,r,un)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,un.x),l.addScaledVector(a,un.y),l.addScaledVector(o,un.z),l)}static isFrontFacing(t,e,i,r){return Xe.subVectors(i,e),cn.subVectors(t,e),Xe.cross(cn).dot(r)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,r){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,i,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Xe.subVectors(this.c,this.b),cn.subVectors(this.a,this.b),Xe.cross(cn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Qe.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Qe.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,r,s){return Qe.getInterpolation(t,this.a,this.b,this.c,e,i,r,s)}containsPoint(t){return Qe.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Qe.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const i=this.a,r=this.b,s=this.c;let a,o;Si.subVectors(r,i),Ei.subVectors(s,i),Ca.subVectors(t,i);const l=Si.dot(Ca),c=Ei.dot(Ca);if(l<=0&&c<=0)return e.copy(i);Ra.subVectors(t,r);const u=Si.dot(Ra),h=Ei.dot(Ra);if(u>=0&&h<=u)return e.copy(r);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),e.copy(i).addScaledVector(Si,a);Da.subVectors(t,s);const m=Si.dot(Da),_=Ei.dot(Da);if(_>=0&&m<=_)return e.copy(s);const g=m*c-l*_;if(g<=0&&c>=0&&_<=0)return o=c/(c-_),e.copy(i).addScaledVector(Ei,o);const p=u*_-m*h;if(p<=0&&h-u>=0&&m-_>=0)return fc.subVectors(s,r),o=(h-u)/(h-u+(m-_)),e.copy(r).addScaledVector(fc,o);const f=1/(p+g+d);return a=g*f,o=d*f,e.copy(i).addScaledVector(Si,a).addScaledVector(Ei,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Qu={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},wn={h:0,s:0,l:0},Yr={h:0,s:0,l:0};function La(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}class kt{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ze){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Yt.toWorkingColorSpace(this,e),this}setRGB(t,e,i,r=Yt.workingColorSpace){return this.r=t,this.g=e,this.b=i,Yt.toWorkingColorSpace(this,r),this}setHSL(t,e,i,r=Yt.workingColorSpace){if(t=el(t,1),e=_e(e,0,1),i=_e(i,0,1),e===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+e):i+e-i*e,a=2*i-s;this.r=La(a,s,t+1/3),this.g=La(a,s,t),this.b=La(a,s,t-1/3)}return Yt.toWorkingColorSpace(this,r),this}setStyle(t,e=Ze){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ze){const i=Qu[t.toLowerCase()];return i!==void 0?this.setHex(i,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Oi(t.r),this.g=Oi(t.g),this.b=Oi(t.b),this}copyLinearToSRGB(t){return this.r=va(t.r),this.g=va(t.g),this.b=va(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ze){return Yt.fromWorkingColorSpace(fe.copy(this),t),Math.round(_e(fe.r*255,0,255))*65536+Math.round(_e(fe.g*255,0,255))*256+Math.round(_e(fe.b*255,0,255))}getHexString(t=Ze){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Yt.workingColorSpace){Yt.fromWorkingColorSpace(fe.copy(this),e);const i=fe.r,r=fe.g,s=fe.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const h=a-o;switch(c=u<=.5?h/(a+o):h/(2-a-o),a){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=Yt.workingColorSpace){return Yt.fromWorkingColorSpace(fe.copy(this),e),t.r=fe.r,t.g=fe.g,t.b=fe.b,t}getStyle(t=Ze){Yt.fromWorkingColorSpace(fe.copy(this),t);const e=fe.r,i=fe.g,r=fe.b;return t!==Ze?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(t,e,i){return this.getHSL(wn),this.setHSL(wn.h+t,wn.s+e,wn.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(wn),t.getHSL(Yr);const i=gr(wn.h,Yr.h,e),r=gr(wn.s,Yr.s,e),s=gr(wn.l,Yr.l,e);return this.setHSL(i,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,i=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*i+s[6]*r,this.g=s[1]*e+s[4]*i+s[7]*r,this.b=s[2]*e+s[5]*i+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const fe=new kt;kt.NAMES=Qu;let Uf=0;class tr extends Zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Uf++}),this.uuid=Ji(),this.name="",this.type="Material",this.blending=Ui,this.side=On,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=to,this.blendDst=eo,this.blendEquation=Jn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new kt(0,0,0),this.blendAlpha=0,this.depthFunc=Rs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Jl,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const i=t[e];if(i===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[e]=i}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Ui&&(i.blending=this.blending),this.side!==On&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==to&&(i.blendSrc=this.blendSrc),this.blendDst!==eo&&(i.blendDst=this.blendDst),this.blendEquation!==Jn&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Rs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Jl&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(i.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let i=null;if(e!==null){const r=e.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=e[s].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class rl extends tr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new kt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Be,this.combine=Fu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const se=new O,jr=new Ot;class je{constructor(t,e,i=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Ql,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=tn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return _r("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[i+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)jr.fromBufferAttribute(this,e),jr.applyMatrix3(t),this.setXY(e,jr.x,jr.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)se.fromBufferAttribute(this,e),se.applyMatrix3(t),this.setXYZ(e,se.x,se.y,se.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)se.fromBufferAttribute(this,e),se.applyMatrix4(t),this.setXYZ(e,se.x,se.y,se.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)se.fromBufferAttribute(this,e),se.applyNormalMatrix(t),this.setXYZ(e,se.x,se.y,se.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)se.fromBufferAttribute(this,e),se.transformDirection(t),this.setXYZ(e,se.x,se.y,se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=Pi(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=me(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Pi(e,this.array)),e}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Pi(e,this.array)),e}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Pi(e,this.array)),e}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Pi(e,this.array)),e}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,r){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array),r=me(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this}setXYZW(t,e,i,r,s){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),i=me(i,this.array),r=me(r,this.array),s=me(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ql&&(t.usage=this.usage),t}}class td extends je{constructor(t,e,i){super(new Uint16Array(t),e,i)}}class ed extends je{constructor(t,e,i){super(new Uint32Array(t),e,i)}}class pe extends je{constructor(t,e,i){super(new Float32Array(t),e,i)}}let Nf=0;const Ne=new jt,Pa=new ne,bi=new O,Re=new zn,or=new zn,ce=new O;class Ie extends Zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Nf++}),this.uuid=Ji(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new($u(t)?ed:td)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Pt().getNormalMatrix(t);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ne.makeRotationFromQuaternion(t),this.applyMatrix4(Ne),this}rotateX(t){return Ne.makeRotationX(t),this.applyMatrix4(Ne),this}rotateY(t){return Ne.makeRotationY(t),this.applyMatrix4(Ne),this}rotateZ(t){return Ne.makeRotationZ(t),this.applyMatrix4(Ne),this}translate(t,e,i){return Ne.makeTranslation(t,e,i),this.applyMatrix4(Ne),this}scale(t,e,i){return Ne.makeScale(t,e,i),this.applyMatrix4(Ne),this}lookAt(t){return Pa.lookAt(t),Pa.updateMatrix(),this.applyMatrix4(Pa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(t){const e=[];for(let i=0,r=t.length;i<r;i++){const s=t[i];e.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new pe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new zn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,r=e.length;i<r;i++){const s=e[i];Re.setFromBufferAttribute(s),this.morphTargetsRelative?(ce.addVectors(this.boundingBox.min,Re.min),this.boundingBox.expandByPoint(ce),ce.addVectors(this.boundingBox.max,Re.max),this.boundingBox.expandByPoint(ce)):(this.boundingBox.expandByPoint(Re.min),this.boundingBox.expandByPoint(Re.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Qi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(t){const i=this.boundingSphere.center;if(Re.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];or.setFromBufferAttribute(o),this.morphTargetsRelative?(ce.addVectors(Re.min,or.min),Re.expandByPoint(ce),ce.addVectors(Re.max,or.max),Re.expandByPoint(ce)):(Re.expandByPoint(or.min),Re.expandByPoint(or.max))}Re.getCenter(i);let r=0;for(let s=0,a=t.count;s<a;s++)ce.fromBufferAttribute(t,s),r=Math.max(r,i.distanceToSquared(ce));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)ce.fromBufferAttribute(o,c),l&&(bi.fromBufferAttribute(t,c),ce.add(bi)),r=Math.max(r,i.distanceToSquared(ce))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new je(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let L=0;L<i.count;L++)o[L]=new O,l[L]=new O;const c=new O,u=new O,h=new O,d=new Ot,m=new Ot,_=new Ot,g=new O,p=new O;function f(L,M,v){c.fromBufferAttribute(i,L),u.fromBufferAttribute(i,M),h.fromBufferAttribute(i,v),d.fromBufferAttribute(s,L),m.fromBufferAttribute(s,M),_.fromBufferAttribute(s,v),u.sub(c),h.sub(c),m.sub(d),_.sub(d);const C=1/(m.x*_.y-_.x*m.y);isFinite(C)&&(g.copy(u).multiplyScalar(_.y).addScaledVector(h,-m.y).multiplyScalar(C),p.copy(h).multiplyScalar(m.x).addScaledVector(u,-_.x).multiplyScalar(C),o[L].add(g),o[M].add(g),o[v].add(g),l[L].add(p),l[M].add(p),l[v].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:t.count}]);for(let L=0,M=b.length;L<M;++L){const v=b[L],C=v.start,k=v.count;for(let U=C,z=C+k;U<z;U+=3)f(t.getX(U+0),t.getX(U+1),t.getX(U+2))}const S=new O,E=new O,D=new O,w=new O;function T(L){D.fromBufferAttribute(r,L),w.copy(D);const M=o[L];S.copy(M),S.sub(D.multiplyScalar(D.dot(M))).normalize(),E.crossVectors(w,M);const C=E.dot(l[L])<0?-1:1;a.setXYZW(L,S.x,S.y,S.z,C)}for(let L=0,M=b.length;L<M;++L){const v=b[L],C=v.start,k=v.count;for(let U=C,z=C+k;U<z;U+=3)T(t.getX(U+0)),T(t.getX(U+1)),T(t.getX(U+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new je(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let d=0,m=i.count;d<m;d++)i.setXYZ(d,0,0,0);const r=new O,s=new O,a=new O,o=new O,l=new O,c=new O,u=new O,h=new O;if(t)for(let d=0,m=t.count;d<m;d+=3){const _=t.getX(d+0),g=t.getX(d+1),p=t.getX(d+2);r.fromBufferAttribute(e,_),s.fromBufferAttribute(e,g),a.fromBufferAttribute(e,p),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),o.fromBufferAttribute(i,_),l.fromBufferAttribute(i,g),c.fromBufferAttribute(i,p),o.add(u),l.add(u),c.add(u),i.setXYZ(_,o.x,o.y,o.z),i.setXYZ(g,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,m=e.count;d<m;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),a.fromBufferAttribute(e,d+2),u.subVectors(a,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)ce.fromBufferAttribute(t,e),ce.normalize(),t.setXYZ(e,ce.x,ce.y,ce.z)}toNonIndexed(){function t(o,l){const c=o.array,u=o.itemSize,h=o.normalized,d=new c.constructor(l.length*u);let m=0,_=0;for(let g=0,p=l.length;g<p;g++){o.isInterleavedBufferAttribute?m=l[g]*o.data.stride+o.offset:m=l[g]*u;for(let f=0;f<u;f++)d[_++]=c[m++]}return new je(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ie,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=t(l,i);e.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,h=c.length;u<h;u++){const d=c[u],m=t(d,i);l.push(m)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const i=this.attributes;for(const l in i){const c=i[l];t.data.attributes[l]=c.toJSON(t.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const m=c[h];u.push(m.toJSON(t.data))}u.length>0&&(r[l]=u,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const i=t.index;i!==null&&this.setIndex(i.clone(e));const r=t.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(e))}const s=t.morphAttributes;for(const c in s){const u=[],h=s[c];for(let d=0,m=h.length;d<m;d++)u.push(h[d].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,u=a.length;c<u;c++){const h=a[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pc=new jt,Xn=new nl,Kr=new Qi,mc=new O,wi=new O,Ai=new O,Ti=new O,Ia=new O,$r=new O,Zr=new Ot,Jr=new Ot,Qr=new Ot,gc=new O,_c=new O,vc=new O,ts=new O,es=new O;class ve extends ne{constructor(t=new Ie,e=new rl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const r=e[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){$r.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],h=s[l];u!==0&&(Ia.fromBufferAttribute(h,t),a?$r.addScaledVector(Ia,u):$r.addScaledVector(Ia.sub(e),u))}e.add($r)}return e}raycast(t,e){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Kr.copy(i.boundingSphere),Kr.applyMatrix4(s),Xn.copy(t.ray).recast(t.near),!(Kr.containsPoint(Xn.origin)===!1&&(Xn.intersectSphere(Kr,mc)===null||Xn.origin.distanceToSquared(mc)>(t.far-t.near)**2))&&(pc.copy(s).invert(),Xn.copy(t.ray).applyMatrix4(pc),!(i.boundingBox!==null&&Xn.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Xn)))}_computeIntersections(t,e,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let _=0,g=d.length;_<g;_++){const p=d[_],f=a[p.materialIndex],b=Math.max(p.start,m.start),S=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let E=b,D=S;E<D;E+=3){const w=o.getX(E),T=o.getX(E+1),L=o.getX(E+2);r=ns(this,f,t,i,c,u,h,w,T,L),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const _=Math.max(0,m.start),g=Math.min(o.count,m.start+m.count);for(let p=_,f=g;p<f;p+=3){const b=o.getX(p),S=o.getX(p+1),E=o.getX(p+2);r=ns(this,a,t,i,c,u,h,b,S,E),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let _=0,g=d.length;_<g;_++){const p=d[_],f=a[p.materialIndex],b=Math.max(p.start,m.start),S=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let E=b,D=S;E<D;E+=3){const w=E,T=E+1,L=E+2;r=ns(this,f,t,i,c,u,h,w,T,L),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const _=Math.max(0,m.start),g=Math.min(l.count,m.start+m.count);for(let p=_,f=g;p<f;p+=3){const b=p,S=p+1,E=p+2;r=ns(this,a,t,i,c,u,h,b,S,E),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}}}function Of(n,t,e,i,r,s,a,o){let l;if(t.side===Ee?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,t.side===On,o),l===null)return null;es.copy(o),es.applyMatrix4(n.matrixWorld);const c=e.ray.origin.distanceTo(es);return c<e.near||c>e.far?null:{distance:c,point:es.clone(),object:n}}function ns(n,t,e,i,r,s,a,o,l,c){n.getVertexPosition(o,wi),n.getVertexPosition(l,Ai),n.getVertexPosition(c,Ti);const u=Of(n,t,e,i,wi,Ai,Ti,ts);if(u){r&&(Zr.fromBufferAttribute(r,o),Jr.fromBufferAttribute(r,l),Qr.fromBufferAttribute(r,c),u.uv=Qe.getInterpolation(ts,wi,Ai,Ti,Zr,Jr,Qr,new Ot)),s&&(Zr.fromBufferAttribute(s,o),Jr.fromBufferAttribute(s,l),Qr.fromBufferAttribute(s,c),u.uv1=Qe.getInterpolation(ts,wi,Ai,Ti,Zr,Jr,Qr,new Ot)),a&&(gc.fromBufferAttribute(a,o),_c.fromBufferAttribute(a,l),vc.fromBufferAttribute(a,c),u.normal=Qe.getInterpolation(ts,wi,Ai,Ti,gc,_c,vc,new O),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new O,materialIndex:0};Qe.getNormal(wi,Ai,Ti,h.normal),u.face=h}return u}class er extends Ie{constructor(t=1,e=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],h=[];let d=0,m=0;_("z","y","x",-1,-1,i,e,t,a,s,0),_("z","y","x",1,-1,i,e,-t,a,s,1),_("x","z","y",1,1,t,i,e,r,a,2),_("x","z","y",1,-1,t,i,-e,r,a,3),_("x","y","z",1,-1,t,e,i,r,s,4),_("x","y","z",-1,-1,t,e,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new pe(c,3)),this.setAttribute("normal",new pe(u,3)),this.setAttribute("uv",new pe(h,2));function _(g,p,f,b,S,E,D,w,T,L,M){const v=E/T,C=D/L,k=E/2,U=D/2,z=w/2,G=T+1,V=L+1;let $=0,W=0;const st=new O;for(let lt=0;lt<V;lt++){const ft=lt*C-U;for(let Rt=0;Rt<G;Rt++){const Bt=Rt*v-k;st[g]=Bt*b,st[p]=ft*S,st[f]=z,c.push(st.x,st.y,st.z),st[g]=0,st[p]=0,st[f]=w>0?1:-1,u.push(st.x,st.y,st.z),h.push(Rt/T),h.push(1-lt/L),$+=1}}for(let lt=0;lt<L;lt++)for(let ft=0;ft<T;ft++){const Rt=d+ft+G*lt,Bt=d+ft+G*(lt+1),X=d+(ft+1)+G*(lt+1),J=d+(ft+1)+G*lt;l.push(Rt,Bt,J),l.push(Bt,X,J),W+=6}o.addGroup(m,W,M),m+=W,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new er(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Wi(n){const t={};for(const e in n){t[e]={};for(const i in n[e]){const r=n[e][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=r.clone():Array.isArray(r)?t[e][i]=r.slice():t[e][i]=r}}return t}function ge(n){const t={};for(let e=0;e<n.length;e++){const i=Wi(n[e]);for(const r in i)t[r]=i[r]}return t}function Ff(n){const t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function nd(n){const t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Yt.workingColorSpace}const kf={clone:Wi,merge:ge};var Bf=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zf=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Fn extends tr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bf,this.fragmentShader=zf,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Wi(t.uniforms),this.uniformsGroups=Ff(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}}class id extends ne{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new jt,this.projectionMatrix=new jt,this.projectionMatrixInverse=new jt,this.coordinateSystem=pn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const An=new O,xc=new Ot,yc=new Ot;class Fe extends id{constructor(t=50,e=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=br*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(mr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return br*2*Math.atan(Math.tan(mr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){An.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(An.x,An.y).multiplyScalar(-t/An.z),An.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(An.x,An.y).multiplyScalar(-t/An.z)}getViewSize(t,e){return this.getViewBounds(t,xc,yc),e.subVectors(yc,xc)}setViewOffset(t,e,i,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(mr*.5*this.fov)/this.zoom,i=2*e,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,e-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-i,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ci=-90,Ri=1;class Hf extends ne{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Fe(Ci,Ri,t,e);r.layers=this.layers,this.add(r);const s=new Fe(Ci,Ri,t,e);s.layers=this.layers,this.add(s);const a=new Fe(Ci,Ri,t,e);a.layers=this.layers,this.add(a);const o=new Fe(Ci,Ri,t,e);o.layers=this.layers,this.add(o);const l=new Fe(Ci,Ri,t,e);l.layers=this.layers,this.add(l);const c=new Fe(Ci,Ri,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[i,r,s,a,o,l]=e;for(const c of e)this.remove(c);if(t===pn)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Is)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,h=t.getRenderTarget(),d=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;const g=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,t.setRenderTarget(i,0,r),t.render(e,s),t.setRenderTarget(i,1,r),t.render(e,a),t.setRenderTarget(i,2,r),t.render(e,o),t.setRenderTarget(i,3,r),t.render(e,l),t.setRenderTarget(i,4,r),t.render(e,c),i.texture.generateMipmaps=g,t.setRenderTarget(i,5,r),t.render(e,u),t.setRenderTarget(h,d,m),t.xr.enabled=_,i.texture.needsPMREMUpdate=!0}}class rd extends xe{constructor(t,e,i,r,s,a,o,l,c,u){t=t!==void 0?t:[],e=e!==void 0?e:zi,super(t,e,i,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Vf extends ai{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const i={width:t,height:t,depth:1},r=[i,i,i,i,i,i];this.texture=new rd(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:qe}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new er(5,5,5),s=new Fn({name:"CubemapFromEquirect",uniforms:Wi(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ee,blending:Pn});s.uniforms.tEquirect.value=e;const a=new ve(r,s),o=e.minFilter;return e.minFilter===ii&&(e.minFilter=qe),new Hf(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,i,r){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,i,r);t.setRenderTarget(s)}}const Ua=new O,Gf=new O,Wf=new Pt;class Kn{constructor(t=new O(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,r){return this.normal.set(t,e,i),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){const r=Ua.subVectors(i,e).cross(Gf.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const i=t.delta(Ua),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(i,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const i=e||Wf.getNormalMatrix(t),r=this.coplanarPoint(Ua).applyMatrix4(t),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const qn=new Qi,is=new O;class sl{constructor(t=new Kn,e=new Kn,i=new Kn,r=new Kn,s=new Kn,a=new Kn){this.planes=[t,e,i,r,s,a]}set(t,e,i,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=pn){const i=this.planes,r=t.elements,s=r[0],a=r[1],o=r[2],l=r[3],c=r[4],u=r[5],h=r[6],d=r[7],m=r[8],_=r[9],g=r[10],p=r[11],f=r[12],b=r[13],S=r[14],E=r[15];if(i[0].setComponents(l-s,d-c,p-m,E-f).normalize(),i[1].setComponents(l+s,d+c,p+m,E+f).normalize(),i[2].setComponents(l+a,d+u,p+_,E+b).normalize(),i[3].setComponents(l-a,d-u,p-_,E-b).normalize(),i[4].setComponents(l-o,d-h,p-g,E-S).normalize(),e===pn)i[5].setComponents(l+o,d+h,p+g,E+S).normalize();else if(e===Is)i[5].setComponents(o,h,g,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),qn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),qn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(qn)}intersectsSprite(t){return qn.center.set(0,0,0),qn.radius=.7071067811865476,qn.applyMatrix4(t.matrixWorld),this.intersectsSphere(qn)}intersectsSphere(t){const e=this.planes,i=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let i=0;i<6;i++){const r=e[i];if(is.x=r.normal.x>0?t.max.x:t.min.x,is.y=r.normal.y>0?t.max.y:t.min.y,is.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(is)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function sd(){let n=null,t=!1,e=null,i=null;function r(s,a){e(s,a),i=n.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(i=n.requestAnimationFrame(r),t=!0)},stop:function(){n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){n=s}}}function Xf(n){const t=new WeakMap;function e(o,l){const c=o.array,u=o.usage,h=c.byteLength,d=n.createBuffer();n.bindBuffer(l,d),n.bufferData(l,c,u),o.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function i(o,l,c){const u=l.array,h=l._updateRange,d=l.updateRanges;if(n.bindBuffer(c,o),h.count===-1&&d.length===0&&n.bufferSubData(c,0,u),d.length!==0){for(let m=0,_=d.length;m<_;m++){const g=d[m];n.bufferSubData(c,g.start*u.BYTES_PER_ELEMENT,u,g.start,g.count)}l.clearUpdateRanges()}h.count!==-1&&(n.bufferSubData(c,h.offset*u.BYTES_PER_ELEMENT,u,h.offset,h.count),h.count=-1),l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(n.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}class Lr extends Ie{constructor(t=1,e=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(i),l=Math.floor(r),c=o+1,u=l+1,h=t/o,d=e/l,m=[],_=[],g=[],p=[];for(let f=0;f<u;f++){const b=f*d-a;for(let S=0;S<c;S++){const E=S*h-s;_.push(E,-b,0),g.push(0,0,1),p.push(S/o),p.push(1-f/l)}}for(let f=0;f<l;f++)for(let b=0;b<o;b++){const S=b+c*f,E=b+c*(f+1),D=b+1+c*(f+1),w=b+1+c*f;m.push(S,E,w),m.push(E,D,w)}this.setIndex(m),this.setAttribute("position",new pe(_,3)),this.setAttribute("normal",new pe(g,3)),this.setAttribute("uv",new pe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Lr(t.width,t.height,t.widthSegments,t.heightSegments)}}var qf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Yf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,jf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Kf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,$f=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zf=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Qf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,tp=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ep=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,np=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ip=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,rp=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,sp=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ap=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,op=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,lp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,up=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,hp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,fp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,pp=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,mp=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,gp=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,_p=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,vp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,xp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,yp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ep=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,bp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,wp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ap=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Tp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Cp=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Dp=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Lp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Pp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ip=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Up=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Np=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Op=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Fp=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,kp=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Bp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zp=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hp=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vp=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Gp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Wp=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Xp=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,qp=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Yp=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,jp=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Kp=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,$p=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zp=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Qp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,tm=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,em=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,nm=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,im=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,rm=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,sm=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,am=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,om=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,lm=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cm=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,um=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,dm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hm=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,fm=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,pm=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,mm=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,gm=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,_m=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,vm=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,xm=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ym=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Mm=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sm=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Em=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,bm=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,wm=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Am=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tm=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Cm=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Rm=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Dm=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Lm=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Pm=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Im=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Um=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Nm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Om=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Fm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,km=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bm=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,zm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Vm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Gm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Wm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Xm=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,qm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jm=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Km=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,$m=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Jm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Qm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,tg=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,eg=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ng=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ig=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rg=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,sg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ag=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,og=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lg=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ug=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,hg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,fg=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,mg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,gg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_g=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,vg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,xg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,yg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Eg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,bg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Lt={alphahash_fragment:qf,alphahash_pars_fragment:Yf,alphamap_fragment:jf,alphamap_pars_fragment:Kf,alphatest_fragment:$f,alphatest_pars_fragment:Zf,aomap_fragment:Jf,aomap_pars_fragment:Qf,batching_pars_vertex:tp,batching_vertex:ep,begin_vertex:np,beginnormal_vertex:ip,bsdfs:rp,iridescence_fragment:sp,bumpmap_pars_fragment:ap,clipping_planes_fragment:op,clipping_planes_pars_fragment:lp,clipping_planes_pars_vertex:cp,clipping_planes_vertex:up,color_fragment:dp,color_pars_fragment:hp,color_pars_vertex:fp,color_vertex:pp,common:mp,cube_uv_reflection_fragment:gp,defaultnormal_vertex:_p,displacementmap_pars_vertex:vp,displacementmap_vertex:xp,emissivemap_fragment:yp,emissivemap_pars_fragment:Mp,colorspace_fragment:Sp,colorspace_pars_fragment:Ep,envmap_fragment:bp,envmap_common_pars_fragment:wp,envmap_pars_fragment:Ap,envmap_pars_vertex:Tp,envmap_physical_pars_fragment:kp,envmap_vertex:Cp,fog_vertex:Rp,fog_pars_vertex:Dp,fog_fragment:Lp,fog_pars_fragment:Pp,gradientmap_pars_fragment:Ip,lightmap_pars_fragment:Up,lights_lambert_fragment:Np,lights_lambert_pars_fragment:Op,lights_pars_begin:Fp,lights_toon_fragment:Bp,lights_toon_pars_fragment:zp,lights_phong_fragment:Hp,lights_phong_pars_fragment:Vp,lights_physical_fragment:Gp,lights_physical_pars_fragment:Wp,lights_fragment_begin:Xp,lights_fragment_maps:qp,lights_fragment_end:Yp,logdepthbuf_fragment:jp,logdepthbuf_pars_fragment:Kp,logdepthbuf_pars_vertex:$p,logdepthbuf_vertex:Zp,map_fragment:Jp,map_pars_fragment:Qp,map_particle_fragment:tm,map_particle_pars_fragment:em,metalnessmap_fragment:nm,metalnessmap_pars_fragment:im,morphinstance_vertex:rm,morphcolor_vertex:sm,morphnormal_vertex:am,morphtarget_pars_vertex:om,morphtarget_vertex:lm,normal_fragment_begin:cm,normal_fragment_maps:um,normal_pars_fragment:dm,normal_pars_vertex:hm,normal_vertex:fm,normalmap_pars_fragment:pm,clearcoat_normal_fragment_begin:mm,clearcoat_normal_fragment_maps:gm,clearcoat_pars_fragment:_m,iridescence_pars_fragment:vm,opaque_fragment:xm,packing:ym,premultiplied_alpha_fragment:Mm,project_vertex:Sm,dithering_fragment:Em,dithering_pars_fragment:bm,roughnessmap_fragment:wm,roughnessmap_pars_fragment:Am,shadowmap_pars_fragment:Tm,shadowmap_pars_vertex:Cm,shadowmap_vertex:Rm,shadowmask_pars_fragment:Dm,skinbase_vertex:Lm,skinning_pars_vertex:Pm,skinning_vertex:Im,skinnormal_vertex:Um,specularmap_fragment:Nm,specularmap_pars_fragment:Om,tonemapping_fragment:Fm,tonemapping_pars_fragment:km,transmission_fragment:Bm,transmission_pars_fragment:zm,uv_pars_fragment:Hm,uv_pars_vertex:Vm,uv_vertex:Gm,worldpos_vertex:Wm,background_vert:Xm,background_frag:qm,backgroundCube_vert:Ym,backgroundCube_frag:jm,cube_vert:Km,cube_frag:$m,depth_vert:Zm,depth_frag:Jm,distanceRGBA_vert:Qm,distanceRGBA_frag:tg,equirect_vert:eg,equirect_frag:ng,linedashed_vert:ig,linedashed_frag:rg,meshbasic_vert:sg,meshbasic_frag:ag,meshlambert_vert:og,meshlambert_frag:lg,meshmatcap_vert:cg,meshmatcap_frag:ug,meshnormal_vert:dg,meshnormal_frag:hg,meshphong_vert:fg,meshphong_frag:pg,meshphysical_vert:mg,meshphysical_frag:gg,meshtoon_vert:_g,meshtoon_frag:vg,points_vert:xg,points_frag:yg,shadow_vert:Mg,shadow_frag:Sg,sprite_vert:Eg,sprite_frag:bg},rt={common:{diffuse:{value:new kt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Pt},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Pt}},envmap:{envMap:{value:null},envMapRotation:{value:new Pt},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Pt},normalScale:{value:new Ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new kt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new kt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0},uvTransform:{value:new Pt}},sprite:{diffuse:{value:new kt(16777215)},opacity:{value:1},center:{value:new Ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Pt},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0}}},Je={basic:{uniforms:ge([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.fog]),vertexShader:Lt.meshbasic_vert,fragmentShader:Lt.meshbasic_frag},lambert:{uniforms:ge([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new kt(0)}}]),vertexShader:Lt.meshlambert_vert,fragmentShader:Lt.meshlambert_frag},phong:{uniforms:ge([rt.common,rt.specularmap,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,rt.lights,{emissive:{value:new kt(0)},specular:{value:new kt(1118481)},shininess:{value:30}}]),vertexShader:Lt.meshphong_vert,fragmentShader:Lt.meshphong_frag},standard:{uniforms:ge([rt.common,rt.envmap,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.roughnessmap,rt.metalnessmap,rt.fog,rt.lights,{emissive:{value:new kt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Lt.meshphysical_vert,fragmentShader:Lt.meshphysical_frag},toon:{uniforms:ge([rt.common,rt.aomap,rt.lightmap,rt.emissivemap,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.gradientmap,rt.fog,rt.lights,{emissive:{value:new kt(0)}}]),vertexShader:Lt.meshtoon_vert,fragmentShader:Lt.meshtoon_frag},matcap:{uniforms:ge([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,rt.fog,{matcap:{value:null}}]),vertexShader:Lt.meshmatcap_vert,fragmentShader:Lt.meshmatcap_frag},points:{uniforms:ge([rt.points,rt.fog]),vertexShader:Lt.points_vert,fragmentShader:Lt.points_frag},dashed:{uniforms:ge([rt.common,rt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Lt.linedashed_vert,fragmentShader:Lt.linedashed_frag},depth:{uniforms:ge([rt.common,rt.displacementmap]),vertexShader:Lt.depth_vert,fragmentShader:Lt.depth_frag},normal:{uniforms:ge([rt.common,rt.bumpmap,rt.normalmap,rt.displacementmap,{opacity:{value:1}}]),vertexShader:Lt.meshnormal_vert,fragmentShader:Lt.meshnormal_frag},sprite:{uniforms:ge([rt.sprite,rt.fog]),vertexShader:Lt.sprite_vert,fragmentShader:Lt.sprite_frag},background:{uniforms:{uvTransform:{value:new Pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Lt.background_vert,fragmentShader:Lt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Pt}},vertexShader:Lt.backgroundCube_vert,fragmentShader:Lt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Lt.cube_vert,fragmentShader:Lt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Lt.equirect_vert,fragmentShader:Lt.equirect_frag},distanceRGBA:{uniforms:ge([rt.common,rt.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Lt.distanceRGBA_vert,fragmentShader:Lt.distanceRGBA_frag},shadow:{uniforms:ge([rt.lights,rt.fog,{color:{value:new kt(0)},opacity:{value:1}}]),vertexShader:Lt.shadow_vert,fragmentShader:Lt.shadow_frag}};Je.physical={uniforms:ge([Je.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Pt},clearcoatNormalScale:{value:new Ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Pt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Pt},sheen:{value:0},sheenColor:{value:new kt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Pt},transmissionSamplerSize:{value:new Ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Pt},attenuationDistance:{value:0},attenuationColor:{value:new kt(0)},specularColor:{value:new kt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Pt},anisotropyVector:{value:new Ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Pt}}]),vertexShader:Lt.meshphysical_vert,fragmentShader:Lt.meshphysical_frag};const rs={r:0,b:0,g:0},Yn=new Be,wg=new jt;function Ag(n,t,e,i,r,s,a){const o=new kt(0);let l=s===!0?0:1,c,u,h=null,d=0,m=null;function _(b){let S=b.isScene===!0?b.background:null;return S&&S.isTexture&&(S=(b.backgroundBlurriness>0?e:t).get(S)),S}function g(b){let S=!1;const E=_(b);E===null?f(o,l):E&&E.isColor&&(f(E,1),S=!0);const D=n.xr.getEnvironmentBlendMode();D==="additive"?i.buffers.color.setClear(0,0,0,1,a):D==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(n.autoClear||S)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function p(b,S){const E=_(S);E&&(E.isCubeTexture||E.mapping===aa)?(u===void 0&&(u=new ve(new er(1,1,1),new Fn({name:"BackgroundCubeMaterial",uniforms:Wi(Je.backgroundCube.uniforms),vertexShader:Je.backgroundCube.vertexShader,fragmentShader:Je.backgroundCube.fragmentShader,side:Ee,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(D,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),Yn.copy(S.backgroundRotation),Yn.x*=-1,Yn.y*=-1,Yn.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(Yn.y*=-1,Yn.z*=-1),u.material.uniforms.envMap.value=E,u.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(wg.makeRotationFromEuler(Yn)),u.material.toneMapped=Yt.getTransfer(E.colorSpace)!==$t,(h!==E||d!==E.version||m!==n.toneMapping)&&(u.material.needsUpdate=!0,h=E,d=E.version,m=n.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(c===void 0&&(c=new ve(new Lr(2,2),new Fn({name:"BackgroundMaterial",uniforms:Wi(Je.background.uniforms),vertexShader:Je.background.vertexShader,fragmentShader:Je.background.fragmentShader,side:On,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(c)),c.material.uniforms.t2D.value=E,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.toneMapped=Yt.getTransfer(E.colorSpace)!==$t,E.matrixAutoUpdate===!0&&E.updateMatrix(),c.material.uniforms.uvTransform.value.copy(E.matrix),(h!==E||d!==E.version||m!==n.toneMapping)&&(c.material.needsUpdate=!0,h=E,d=E.version,m=n.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function f(b,S){b.getRGB(rs,nd(n)),i.buffers.color.setClear(rs.r,rs.g,rs.b,S,a)}return{getClearColor:function(){return o},setClearColor:function(b,S=1){o.set(b),l=S,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,f(o,l)},render:g,addToRenderList:p}}function Tg(n,t){const e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,a=!1;function o(v,C,k,U,z){let G=!1;const V=h(U,k,C);s!==V&&(s=V,c(s.object)),G=m(v,U,k,z),G&&_(v,U,k,z),z!==null&&t.update(z,n.ELEMENT_ARRAY_BUFFER),(G||a)&&(a=!1,E(v,C,k,U),z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(z).buffer))}function l(){return n.createVertexArray()}function c(v){return n.bindVertexArray(v)}function u(v){return n.deleteVertexArray(v)}function h(v,C,k){const U=k.wireframe===!0;let z=i[v.id];z===void 0&&(z={},i[v.id]=z);let G=z[C.id];G===void 0&&(G={},z[C.id]=G);let V=G[U];return V===void 0&&(V=d(l()),G[U]=V),V}function d(v){const C=[],k=[],U=[];for(let z=0;z<e;z++)C[z]=0,k[z]=0,U[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:C,enabledAttributes:k,attributeDivisors:U,object:v,attributes:{},index:null}}function m(v,C,k,U){const z=s.attributes,G=C.attributes;let V=0;const $=k.getAttributes();for(const W in $)if($[W].location>=0){const lt=z[W];let ft=G[W];if(ft===void 0&&(W==="instanceMatrix"&&v.instanceMatrix&&(ft=v.instanceMatrix),W==="instanceColor"&&v.instanceColor&&(ft=v.instanceColor)),lt===void 0||lt.attribute!==ft||ft&&lt.data!==ft.data)return!0;V++}return s.attributesNum!==V||s.index!==U}function _(v,C,k,U){const z={},G=C.attributes;let V=0;const $=k.getAttributes();for(const W in $)if($[W].location>=0){let lt=G[W];lt===void 0&&(W==="instanceMatrix"&&v.instanceMatrix&&(lt=v.instanceMatrix),W==="instanceColor"&&v.instanceColor&&(lt=v.instanceColor));const ft={};ft.attribute=lt,lt&&lt.data&&(ft.data=lt.data),z[W]=ft,V++}s.attributes=z,s.attributesNum=V,s.index=U}function g(){const v=s.newAttributes;for(let C=0,k=v.length;C<k;C++)v[C]=0}function p(v){f(v,0)}function f(v,C){const k=s.newAttributes,U=s.enabledAttributes,z=s.attributeDivisors;k[v]=1,U[v]===0&&(n.enableVertexAttribArray(v),U[v]=1),z[v]!==C&&(n.vertexAttribDivisor(v,C),z[v]=C)}function b(){const v=s.newAttributes,C=s.enabledAttributes;for(let k=0,U=C.length;k<U;k++)C[k]!==v[k]&&(n.disableVertexAttribArray(k),C[k]=0)}function S(v,C,k,U,z,G,V){V===!0?n.vertexAttribIPointer(v,C,k,z,G):n.vertexAttribPointer(v,C,k,U,z,G)}function E(v,C,k,U){g();const z=U.attributes,G=k.getAttributes(),V=C.defaultAttributeValues;for(const $ in G){const W=G[$];if(W.location>=0){let st=z[$];if(st===void 0&&($==="instanceMatrix"&&v.instanceMatrix&&(st=v.instanceMatrix),$==="instanceColor"&&v.instanceColor&&(st=v.instanceColor)),st!==void 0){const lt=st.normalized,ft=st.itemSize,Rt=t.get(st);if(Rt===void 0)continue;const Bt=Rt.buffer,X=Rt.type,J=Rt.bytesPerElement,ut=X===n.INT||X===n.UNSIGNED_INT||st.gpuType===Yo;if(st.isInterleavedBufferAttribute){const at=st.data,xt=at.stride,Et=st.offset;if(at.isInstancedInterleavedBuffer){for(let Ut=0;Ut<W.locationSize;Ut++)f(W.location+Ut,at.meshPerAttribute);v.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Ut=0;Ut<W.locationSize;Ut++)p(W.location+Ut);n.bindBuffer(n.ARRAY_BUFFER,Bt);for(let Ut=0;Ut<W.locationSize;Ut++)S(W.location+Ut,ft/W.locationSize,X,lt,xt*J,(Et+ft/W.locationSize*Ut)*J,ut)}else{if(st.isInstancedBufferAttribute){for(let at=0;at<W.locationSize;at++)f(W.location+at,st.meshPerAttribute);v.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let at=0;at<W.locationSize;at++)p(W.location+at);n.bindBuffer(n.ARRAY_BUFFER,Bt);for(let at=0;at<W.locationSize;at++)S(W.location+at,ft/W.locationSize,X,lt,ft*J,ft/W.locationSize*at*J,ut)}}else if(V!==void 0){const lt=V[$];if(lt!==void 0)switch(lt.length){case 2:n.vertexAttrib2fv(W.location,lt);break;case 3:n.vertexAttrib3fv(W.location,lt);break;case 4:n.vertexAttrib4fv(W.location,lt);break;default:n.vertexAttrib1fv(W.location,lt)}}}}b()}function D(){L();for(const v in i){const C=i[v];for(const k in C){const U=C[k];for(const z in U)u(U[z].object),delete U[z];delete C[k]}delete i[v]}}function w(v){if(i[v.id]===void 0)return;const C=i[v.id];for(const k in C){const U=C[k];for(const z in U)u(U[z].object),delete U[z];delete C[k]}delete i[v.id]}function T(v){for(const C in i){const k=i[C];if(k[v.id]===void 0)continue;const U=k[v.id];for(const z in U)u(U[z].object),delete U[z];delete k[v.id]}}function L(){M(),a=!0,s!==r&&(s=r,c(s.object))}function M(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:L,resetDefaultState:M,dispose:D,releaseStatesOfGeometry:w,releaseStatesOfProgram:T,initAttributes:g,enableAttribute:p,disableUnusedAttributes:b}}function Cg(n,t,e){let i;function r(c){i=c}function s(c,u){n.drawArrays(i,c,u),e.update(u,i,1)}function a(c,u,h){h!==0&&(n.drawArraysInstanced(i,c,u,h),e.update(u,i,h))}function o(c,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,c,0,u,0,h);let m=0;for(let _=0;_<h;_++)m+=u[_];e.update(m,i,1)}function l(c,u,h,d){if(h===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let _=0;_<c.length;_++)a(c[_],u[_],d[_]);else{m.multiDrawArraysInstancedWEBGL(i,c,0,u,0,d,0,h);let _=0;for(let g=0;g<h;g++)_+=u[g];for(let g=0;g<d.length;g++)e.update(_,i,d[g])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Rg(n,t,e,i){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");r=n.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(w){return!(w!==Ye&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(w){const T=w===Dr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==mn&&i.convert(w)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==tn&&!T)}function l(w){if(w==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=e.logarithmicDepthBuffer===!0,d=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),m=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),g=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),f=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),S=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),E=m>0,D=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:m,maxTextureSize:_,maxCubemapSize:g,maxAttributes:p,maxVertexUniforms:f,maxVaryings:b,maxFragmentUniforms:S,vertexTextures:E,maxSamples:D}}function Dg(n){const t=this;let e=null,i=0,r=!1,s=!1;const a=new Kn,o=new Pt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const m=h.length!==0||d||i!==0||r;return r=d,i=h.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){e=u(h,d,0)},this.setState=function(h,d,m){const _=h.clippingPlanes,g=h.clipIntersection,p=h.clipShadows,f=n.get(h);if(!r||_===null||_.length===0||s&&!p)s?u(null):c();else{const b=s?0:i,S=b*4;let E=f.clippingState||null;l.value=E,E=u(_,d,S,m);for(let D=0;D!==S;++D)E[D]=e[D];f.clippingState=E,this.numIntersection=g?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function u(h,d,m,_){const g=h!==null?h.length:0;let p=null;if(g!==0){if(p=l.value,_!==!0||p===null){const f=m+g*4,b=d.matrixWorldInverse;o.getNormalMatrix(b),(p===null||p.length<f)&&(p=new Float32Array(f));for(let S=0,E=m;S!==g;++S,E+=4)a.copy(h[S]).applyMatrix4(b,o),a.normal.toArray(p,E),p[E+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=g,t.numIntersection=0,p}}function Lg(n){let t=new WeakMap;function e(a,o){return o===no?a.mapping=zi:o===io&&(a.mapping=Hi),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===no||o===io)if(t.has(a)){const l=t.get(a).texture;return e(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const c=new Vf(l.height);return c.fromEquirectangularTexture(n,a),t.set(a,c),a.addEventListener("dispose",r),e(c.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function s(){t=new WeakMap}return{get:i,dispose:s}}class ad extends id{constructor(t=-1,e=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-t,a=i+t,o=r+e,l=r-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ii=4,Mc=[.125,.215,.35,.446,.526,.582],Qn=20,Na=new ad,Sc=new kt;let Oa=null,Fa=0,ka=0,Ba=!1;const $n=(1+Math.sqrt(5))/2,Di=1/$n,Ec=[new O(-$n,Di,0),new O($n,Di,0),new O(-Di,0,$n),new O(Di,0,$n),new O(0,$n,-Di),new O(0,$n,Di),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)];class bc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,i=.1,r=100){Oa=this._renderer.getRenderTarget(),Fa=this._renderer.getActiveCubeFace(),ka=this._renderer.getActiveMipmapLevel(),Ba=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,i,r,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ac(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Oa,Fa,ka),this._renderer.xr.enabled=Ba,t.scissorTest=!1,ss(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===zi||t.mapping===Hi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Oa=this._renderer.getRenderTarget(),Fa=this._renderer.getActiveCubeFace(),ka=this._renderer.getActiveMipmapLevel(),Ba=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:qe,minFilter:qe,generateMipmaps:!1,type:Dr,format:Ye,colorSpace:Bn,depthBuffer:!1},r=wc(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=wc(t,e,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Pg(s)),this._blurMaterial=Ig(s,t,e)}return r}_compileMaterial(t){const e=new ve(this._lodPlanes[0],t);this._renderer.compile(e,Na)}_sceneToCubeUV(t,e,i,r){const o=new Fe(90,1,e,i),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(Sc),u.toneMapping=In,u.autoClear=!1;const m=new rl({name:"PMREM.Background",side:Ee,depthWrite:!1,depthTest:!1}),_=new ve(new er,m);let g=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,g=!0):(m.color.copy(Sc),g=!0);for(let f=0;f<6;f++){const b=f%3;b===0?(o.up.set(0,l[f],0),o.lookAt(c[f],0,0)):b===1?(o.up.set(0,0,l[f]),o.lookAt(0,c[f],0)):(o.up.set(0,l[f],0),o.lookAt(0,0,c[f]));const S=this._cubeSize;ss(r,b*S,f>2?S:0,S,S),u.setRenderTarget(r),g&&u.render(_,o),u.render(t,o)}_.geometry.dispose(),_.material.dispose(),u.toneMapping=d,u.autoClear=h,t.background=p}_textureToCubeUV(t,e){const i=this._renderer,r=t.mapping===zi||t.mapping===Hi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ac());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new ve(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const l=this._cubeSize;ss(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(a,Na)}_applyPMREM(t){const e=this._renderer,i=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=Ec[(r-s-1)%Ec.length];this._blur(t,s-1,s,a,o)}e.autoClear=i}_blur(t,e,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,i,r,"latitudinal",s),this._halfBlur(a,t,i,i,r,"longitudinal",s)}_halfBlur(t,e,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new ve(this._lodPlanes[r],c),d=c.uniforms,m=this._sizeLods[i]-1,_=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Qn-1),g=s/_,p=isFinite(s)?1+Math.floor(u*g):Qn;p>Qn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Qn}`);const f=[];let b=0;for(let T=0;T<Qn;++T){const L=T/g,M=Math.exp(-L*L/2);f.push(M),T===0?b+=M:T<p&&(b+=2*M)}for(let T=0;T<f.length;T++)f[T]=f[T]/b;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:S}=this;d.dTheta.value=_,d.mipInt.value=S-i;const E=this._sizeLods[r],D=3*E*(r>S-Ii?r-S+Ii:0),w=4*(this._cubeSize-E);ss(e,D,w,3*E,2*E),l.setRenderTarget(e),l.render(h,Na)}}function Pg(n){const t=[],e=[],i=[];let r=n;const s=n-Ii+1+Mc.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let l=1/o;a>n-Ii?l=Mc[a-n+Ii-1]:a===0&&(l=0),i.push(l);const c=1/(o-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],m=6,_=6,g=3,p=2,f=1,b=new Float32Array(g*_*m),S=new Float32Array(p*_*m),E=new Float32Array(f*_*m);for(let w=0;w<m;w++){const T=w%3*2/3-1,L=w>2?0:-1,M=[T,L,0,T+2/3,L,0,T+2/3,L+1,0,T,L,0,T+2/3,L+1,0,T,L+1,0];b.set(M,g*_*w),S.set(d,p*_*w);const v=[w,w,w,w,w,w];E.set(v,f*_*w)}const D=new Ie;D.setAttribute("position",new je(b,g)),D.setAttribute("uv",new je(S,p)),D.setAttribute("faceIndex",new je(E,f)),t.push(D),r>Ii&&r--}return{lodPlanes:t,sizeLods:e,sigmas:i}}function wc(n,t,e){const i=new ai(n,t,e);return i.texture.mapping=aa,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function ss(n,t,e,i,r){n.viewport.set(t,e,i,r),n.scissor.set(t,e,i,r)}function Ig(n,t,e){const i=new Float32Array(Qn),r=new O(0,1,0);return new Fn({name:"SphericalGaussianBlur",defines:{n:Qn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:al(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Ac(){return new Fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:al(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Tc(){return new Fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:al(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function al(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Ug(n){let t=new WeakMap,e=null;function i(o){if(o&&o.isTexture){const l=o.mapping,c=l===no||l===io,u=l===zi||l===Hi;if(c||u){let h=t.get(o);const d=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==d)return e===null&&(e=new bc(n)),h=c?e.fromEquirectangular(o,h):e.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),h.texture;if(h!==void 0)return h.texture;{const m=o.image;return c&&m&&m.height>0||u&&m&&r(m)?(e===null&&(e=new bc(n)),h=c?e.fromEquirectangular(o):e.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,t.set(o,h),o.addEventListener("dispose",s),h.texture):null}}}return o}function r(o){let l=0;const c=6;for(let u=0;u<c;u++)o[u]!==void 0&&l++;return l===c}function s(o){const l=o.target;l.removeEventListener("dispose",s);const c=t.get(l);c!==void 0&&(t.delete(l),c.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:i,dispose:a}}function Ng(n){const t={};function e(i){if(t[i]!==void 0)return t[i];let r;switch(i){case"WEBGL_depth_texture":r=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=n.getExtension(i)}return t[i]=r,r}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){const r=e(i);return r===null&&_r("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Og(n,t,e,i){const r={},s=new WeakMap;function a(h){const d=h.target;d.index!==null&&t.remove(d.index);for(const _ in d.attributes)t.remove(d.attributes[_]);for(const _ in d.morphAttributes){const g=d.morphAttributes[_];for(let p=0,f=g.length;p<f;p++)t.remove(g[p])}d.removeEventListener("dispose",a),delete r[d.id];const m=s.get(d);m&&(t.remove(m),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function o(h,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,e.memory.geometries++),d}function l(h){const d=h.attributes;for(const _ in d)t.update(d[_],n.ARRAY_BUFFER);const m=h.morphAttributes;for(const _ in m){const g=m[_];for(let p=0,f=g.length;p<f;p++)t.update(g[p],n.ARRAY_BUFFER)}}function c(h){const d=[],m=h.index,_=h.attributes.position;let g=0;if(m!==null){const b=m.array;g=m.version;for(let S=0,E=b.length;S<E;S+=3){const D=b[S+0],w=b[S+1],T=b[S+2];d.push(D,w,w,T,T,D)}}else if(_!==void 0){const b=_.array;g=_.version;for(let S=0,E=b.length/3-1;S<E;S+=3){const D=S+0,w=S+1,T=S+2;d.push(D,w,w,T,T,D)}}else return;const p=new($u(d)?ed:td)(d,1);p.version=g;const f=s.get(h);f&&t.remove(f),s.set(h,p)}function u(h){const d=s.get(h);if(d){const m=h.index;m!==null&&d.version<m.version&&c(h)}else c(h);return s.get(h)}return{get:o,update:l,getWireframeAttribute:u}}function Fg(n,t,e){let i;function r(d){i=d}let s,a;function o(d){s=d.type,a=d.bytesPerElement}function l(d,m){n.drawElements(i,m,s,d*a),e.update(m,i,1)}function c(d,m,_){_!==0&&(n.drawElementsInstanced(i,m,s,d*a,_),e.update(m,i,_))}function u(d,m,_){if(_===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,s,d,0,_);let p=0;for(let f=0;f<_;f++)p+=m[f];e.update(p,i,1)}function h(d,m,_,g){if(_===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<d.length;f++)c(d[f]/a,m[f],g[f]);else{p.multiDrawElementsInstancedWEBGL(i,m,0,s,d,0,g,0,_);let f=0;for(let b=0;b<_;b++)f+=m[b];for(let b=0;b<g.length;b++)e.update(f,i,g[b])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function kg(n){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(e.calls++,a){case n.TRIANGLES:e.triangles+=o*(s/3);break;case n.LINES:e.lines+=o*(s/2);break;case n.LINE_STRIP:e.lines+=o*(s-1);break;case n.LINE_LOOP:e.lines+=o*s;break;case n.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:i}}function Bg(n,t,e){const i=new WeakMap,r=new ae;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==h){let M=function(){T.dispose(),i.delete(o),o.removeEventListener("dispose",M)};d!==void 0&&d.texture.dispose();const m=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],f=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let S=0;m===!0&&(S=1),_===!0&&(S=2),g===!0&&(S=3);let E=o.attributes.position.count*S,D=1;E>t.maxTextureSize&&(D=Math.ceil(E/t.maxTextureSize),E=t.maxTextureSize);const w=new Float32Array(E*D*4*h),T=new Ju(w,E,D,h);T.type=tn,T.needsUpdate=!0;const L=S*4;for(let v=0;v<h;v++){const C=p[v],k=f[v],U=b[v],z=E*D*4*v;for(let G=0;G<C.count;G++){const V=G*L;m===!0&&(r.fromBufferAttribute(C,G),w[z+V+0]=r.x,w[z+V+1]=r.y,w[z+V+2]=r.z,w[z+V+3]=0),_===!0&&(r.fromBufferAttribute(k,G),w[z+V+4]=r.x,w[z+V+5]=r.y,w[z+V+6]=r.z,w[z+V+7]=0),g===!0&&(r.fromBufferAttribute(U,G),w[z+V+8]=r.x,w[z+V+9]=r.y,w[z+V+10]=r.z,w[z+V+11]=U.itemSize===4?r.w:1)}}d={count:h,texture:T,size:new Ot(E,D)},i.set(o,d),o.addEventListener("dispose",M)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",a.morphTexture,e);else{let m=0;for(let g=0;g<c.length;g++)m+=c[g];const _=o.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",d.size)}return{update:s}}function zg(n,t,e,i){let r=new WeakMap;function s(l){const c=i.render.frame,u=l.geometry,h=t.get(l,u);if(r.get(h)!==c&&(t.update(h),r.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==c&&(e.update(l.instanceMatrix,n.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,n.ARRAY_BUFFER),r.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;r.get(d)!==c&&(d.update(),r.set(d,c))}return h}function a(){r=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),e.remove(c.instanceMatrix),c.instanceColor!==null&&e.remove(c.instanceColor)}return{update:s,dispose:a}}class od extends xe{constructor(t,e,i,r,s,a,o,l,c,u=Ni){if(u!==Ni&&u!==Gi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===Ni&&(i=si),i===void 0&&u===Gi&&(i=Vi),super(null,r,s,a,o,l,u,i,c),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Se,this.minFilter=l!==void 0?l:Se,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const ld=new xe,Cc=new od(1,1),cd=new Ju,ud=new Af,dd=new rd,Rc=[],Dc=[],Lc=new Float32Array(16),Pc=new Float32Array(9),Ic=new Float32Array(4);function nr(n,t,e){const i=n[0];if(i<=0||i>0)return n;const r=t*e;let s=Rc[r];if(s===void 0&&(s=new Float32Array(r),Rc[r]=s),t!==0){i.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,n[a].toArray(s,o)}return s}function oe(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function le(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function la(n,t){let e=Dc[t];e===void 0&&(e=new Int32Array(t),Dc[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function Hg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Vg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(oe(e,t))return;n.uniform2fv(this.addr,t),le(e,t)}}function Gg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(oe(e,t))return;n.uniform3fv(this.addr,t),le(e,t)}}function Wg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(oe(e,t))return;n.uniform4fv(this.addr,t),le(e,t)}}function Xg(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(oe(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),le(e,t)}else{if(oe(e,i))return;Ic.set(i),n.uniformMatrix2fv(this.addr,!1,Ic),le(e,i)}}function qg(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(oe(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),le(e,t)}else{if(oe(e,i))return;Pc.set(i),n.uniformMatrix3fv(this.addr,!1,Pc),le(e,i)}}function Yg(n,t){const e=this.cache,i=t.elements;if(i===void 0){if(oe(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),le(e,t)}else{if(oe(e,i))return;Lc.set(i),n.uniformMatrix4fv(this.addr,!1,Lc),le(e,i)}}function jg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Kg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(oe(e,t))return;n.uniform2iv(this.addr,t),le(e,t)}}function $g(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(oe(e,t))return;n.uniform3iv(this.addr,t),le(e,t)}}function Zg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(oe(e,t))return;n.uniform4iv(this.addr,t),le(e,t)}}function Jg(n,t){const e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Qg(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(oe(e,t))return;n.uniform2uiv(this.addr,t),le(e,t)}}function t_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(oe(e,t))return;n.uniform3uiv(this.addr,t),le(e,t)}}function e_(n,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(oe(e,t))return;n.uniform4uiv(this.addr,t),le(e,t)}}function n_(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(Cc.compareFunction=Ku,s=Cc):s=ld,e.setTexture2D(t||s,r)}function i_(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTexture3D(t||ud,r)}function r_(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTextureCube(t||dd,r)}function s_(n,t,e){const i=this.cache,r=e.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),e.setTexture2DArray(t||cd,r)}function a_(n){switch(n){case 5126:return Hg;case 35664:return Vg;case 35665:return Gg;case 35666:return Wg;case 35674:return Xg;case 35675:return qg;case 35676:return Yg;case 5124:case 35670:return jg;case 35667:case 35671:return Kg;case 35668:case 35672:return $g;case 35669:case 35673:return Zg;case 5125:return Jg;case 36294:return Qg;case 36295:return t_;case 36296:return e_;case 35678:case 36198:case 36298:case 36306:case 35682:return n_;case 35679:case 36299:case 36307:return i_;case 35680:case 36300:case 36308:case 36293:return r_;case 36289:case 36303:case 36311:case 36292:return s_}}function o_(n,t){n.uniform1fv(this.addr,t)}function l_(n,t){const e=nr(t,this.size,2);n.uniform2fv(this.addr,e)}function c_(n,t){const e=nr(t,this.size,3);n.uniform3fv(this.addr,e)}function u_(n,t){const e=nr(t,this.size,4);n.uniform4fv(this.addr,e)}function d_(n,t){const e=nr(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function h_(n,t){const e=nr(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function f_(n,t){const e=nr(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function p_(n,t){n.uniform1iv(this.addr,t)}function m_(n,t){n.uniform2iv(this.addr,t)}function g_(n,t){n.uniform3iv(this.addr,t)}function __(n,t){n.uniform4iv(this.addr,t)}function v_(n,t){n.uniform1uiv(this.addr,t)}function x_(n,t){n.uniform2uiv(this.addr,t)}function y_(n,t){n.uniform3uiv(this.addr,t)}function M_(n,t){n.uniform4uiv(this.addr,t)}function S_(n,t,e){const i=this.cache,r=t.length,s=la(e,r);oe(i,s)||(n.uniform1iv(this.addr,s),le(i,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||ld,s[a])}function E_(n,t,e){const i=this.cache,r=t.length,s=la(e,r);oe(i,s)||(n.uniform1iv(this.addr,s),le(i,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||ud,s[a])}function b_(n,t,e){const i=this.cache,r=t.length,s=la(e,r);oe(i,s)||(n.uniform1iv(this.addr,s),le(i,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||dd,s[a])}function w_(n,t,e){const i=this.cache,r=t.length,s=la(e,r);oe(i,s)||(n.uniform1iv(this.addr,s),le(i,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||cd,s[a])}function A_(n){switch(n){case 5126:return o_;case 35664:return l_;case 35665:return c_;case 35666:return u_;case 35674:return d_;case 35675:return h_;case 35676:return f_;case 5124:case 35670:return p_;case 35667:case 35671:return m_;case 35668:case 35672:return g_;case 35669:case 35673:return __;case 5125:return v_;case 36294:return x_;case 36295:return y_;case 36296:return M_;case 35678:case 36198:case 36298:case 36306:case 35682:return S_;case 35679:case 36299:case 36307:return E_;case 35680:case 36300:case 36308:case 36293:return b_;case 36289:case 36303:case 36311:case 36292:return w_}}class T_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=a_(e.type)}}class C_{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=A_(e.type)}}class R_{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],i)}}}const za=/(\w+)(\])?(\[|\.)?/g;function Uc(n,t){n.seq.push(t),n.map[t.id]=t}function D_(n,t,e){const i=n.name,r=i.length;for(za.lastIndex=0;;){const s=za.exec(i),a=za.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){Uc(e,c===void 0?new T_(o,n,t):new C_(o,n,t));break}else{let h=e.map[o];h===void 0&&(h=new R_(o),Uc(e,h)),e=h}}}class bs{constructor(t,e){this.seq=[],this.map={};const i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);D_(s,a,this)}}setValue(t,e,i,r){const s=this.map[e];s!==void 0&&s.setValue(t,i,r)}setOptional(t,e,i){const r=e[i];r!==void 0&&this.setValue(t,i,r)}static upload(t,e,i,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,r)}}static seqWithValue(t,e){const i=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&i.push(a)}return i}}function Nc(n,t,e){const i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}const L_=37297;let P_=0;function I_(n,t){const e=n.split(`
`),i=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return i.join(`
`)}function U_(n){const t=Yt.getPrimaries(Yt.workingColorSpace),e=Yt.getPrimaries(n);let i;switch(t===e?i="":t===Ps&&e===Ls?i="LinearDisplayP3ToLinearSRGB":t===Ls&&e===Ps&&(i="LinearSRGBToLinearDisplayP3"),n){case Bn:case oa:return[i,"LinearTransferOETF"];case Ze:case tl:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",n),[i,"LinearTransferOETF"]}}function Oc(n,t,e){const i=n.getShaderParameter(t,n.COMPILE_STATUS),r=n.getShaderInfoLog(t).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+I_(n.getShaderSource(t),a)}else return r}function N_(n,t){const e=U_(t);return`vec4 ${n}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function O_(n,t){let e;switch(t){case Fh:e="Linear";break;case kh:e="Reinhard";break;case Bh:e="Cineon";break;case zh:e="ACESFilmic";break;case Vh:e="AgX";break;case Gh:e="Neutral";break;case Hh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const as=new O;function F_(){Yt.getLuminanceCoefficients(as);const n=as.x.toFixed(4),t=as.y.toFixed(4),e=as.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function k_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(pr).join(`
`)}function B_(n){const t=[];for(const e in n){const i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function z_(n,t){const e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=n.getActiveAttrib(t,r),a=s.name;let o=1;s.type===n.FLOAT_MAT2&&(o=2),s.type===n.FLOAT_MAT3&&(o=3),s.type===n.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:n.getAttribLocation(t,a),locationSize:o}}return e}function pr(n){return n!==""}function Fc(n,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function kc(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const H_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Io(n){return n.replace(H_,G_)}const V_=new Map;function G_(n,t){let e=Lt[t];if(e===void 0){const i=V_.get(t);if(i!==void 0)e=Lt[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("Can not resolve #include <"+t+">")}return Io(e)}const W_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bc(n){return n.replace(W_,X_)}function X_(n,t,e,i){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function zc(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function q_(n){let t="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Ou?t="SHADOWMAP_TYPE_PCF":n.shadowMapType===ch?t="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===dn&&(t="SHADOWMAP_TYPE_VSM"),t}function Y_(n){let t="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case zi:case Hi:t="ENVMAP_TYPE_CUBE";break;case aa:t="ENVMAP_TYPE_CUBE_UV";break}return t}function j_(n){let t="ENVMAP_MODE_REFLECTION";if(n.envMap)switch(n.envMapMode){case Hi:t="ENVMAP_MODE_REFRACTION";break}return t}function K_(n){let t="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case Fu:t="ENVMAP_BLENDING_MULTIPLY";break;case Nh:t="ENVMAP_BLENDING_MIX";break;case Oh:t="ENVMAP_BLENDING_ADD";break}return t}function $_(n){const t=n.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:i,maxMip:e}}function Z_(n,t,e,i){const r=n.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=q_(e),c=Y_(e),u=j_(e),h=K_(e),d=$_(e),m=k_(e),_=B_(s),g=r.createProgram();let p,f,b=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(pr).join(`
`),p.length>0&&(p+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(pr).join(`
`),f.length>0&&(f+=`
`)):(p=[zc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(pr).join(`
`),f=[zc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==In?"#define TONE_MAPPING":"",e.toneMapping!==In?Lt.tonemapping_pars_fragment:"",e.toneMapping!==In?O_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Lt.colorspace_pars_fragment,N_("linearToOutputTexel",e.outputColorSpace),F_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(pr).join(`
`)),a=Io(a),a=Fc(a,e),a=kc(a,e),o=Io(o),o=Fc(o,e),o=kc(o,e),a=Bc(a),o=Bc(o),e.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,f=["#define varying in",e.glslVersion===tc?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===tc?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const S=b+p+a,E=b+f+o,D=Nc(r,r.VERTEX_SHADER,S),w=Nc(r,r.FRAGMENT_SHADER,E);r.attachShader(g,D),r.attachShader(g,w),e.index0AttributeName!==void 0?r.bindAttribLocation(g,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(g,0,"position"),r.linkProgram(g);function T(C){if(n.debug.checkShaderErrors){const k=r.getProgramInfoLog(g).trim(),U=r.getShaderInfoLog(D).trim(),z=r.getShaderInfoLog(w).trim();let G=!0,V=!0;if(r.getProgramParameter(g,r.LINK_STATUS)===!1)if(G=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,g,D,w);else{const $=Oc(r,D,"vertex"),W=Oc(r,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(g,r.VALIDATE_STATUS)+`

Material Name: `+C.name+`
Material Type: `+C.type+`

Program Info Log: `+k+`
`+$+`
`+W)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(U===""||z==="")&&(V=!1);V&&(C.diagnostics={runnable:G,programLog:k,vertexShader:{log:U,prefix:p},fragmentShader:{log:z,prefix:f}})}r.deleteShader(D),r.deleteShader(w),L=new bs(r,g),M=z_(r,g)}let L;this.getUniforms=function(){return L===void 0&&T(this),L};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let v=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=r.getProgramParameter(g,L_)),v},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=P_++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=D,this.fragmentShader=w,this}let J_=0;class Q_{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,i=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){const e=this.shaderCache;let i=e.get(t);return i===void 0&&(i=new tv(t),e.set(t,i)),i}}class tv{constructor(t){this.id=J_++,this.code=t,this.usedTimes=0}}function ev(n,t,e,i,r,s,a){const o=new il,l=new Q_,c=new Set,u=[],h=r.logarithmicDepthBuffer,d=r.vertexTextures;let m=r.precision;const _={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(M){return c.add(M),M===0?"uv":`uv${M}`}function p(M,v,C,k,U){const z=k.fog,G=U.geometry,V=M.isMeshStandardMaterial?k.environment:null,$=(M.isMeshStandardMaterial?e:t).get(M.envMap||V),W=$&&$.mapping===aa?$.image.height:null,st=_[M.type];M.precision!==null&&(m=r.getMaxPrecision(M.precision),m!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",m,"instead."));const lt=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,ft=lt!==void 0?lt.length:0;let Rt=0;G.morphAttributes.position!==void 0&&(Rt=1),G.morphAttributes.normal!==void 0&&(Rt=2),G.morphAttributes.color!==void 0&&(Rt=3);let Bt,X,J,ut;if(st){const Gt=Je[st];Bt=Gt.vertexShader,X=Gt.fragmentShader}else Bt=M.vertexShader,X=M.fragmentShader,l.update(M),J=l.getVertexShaderID(M),ut=l.getFragmentShaderID(M);const at=n.getRenderTarget(),xt=U.isInstancedMesh===!0,Et=U.isBatchedMesh===!0,Ut=!!M.map,Kt=!!M.matcap,R=!!$,Zt=!!M.aoMap,Ht=!!M.lightMap,Vt=!!M.bumpMap,gt=!!M.normalMap,Jt=!!M.displacementMap,bt=!!M.emissiveMap,Tt=!!M.metalnessMap,A=!!M.roughnessMap,x=M.anisotropy>0,H=M.clearcoat>0,Y=M.dispersion>0,Z=M.iridescence>0,K=M.sheen>0,yt=M.transmission>0,it=x&&!!M.anisotropyMap,ct=H&&!!M.clearcoatMap,Dt=H&&!!M.clearcoatNormalMap,Q=H&&!!M.clearcoatRoughnessMap,dt=Z&&!!M.iridescenceMap,Ft=Z&&!!M.iridescenceThicknessMap,At=K&&!!M.sheenColorMap,ht=K&&!!M.sheenRoughnessMap,Ct=!!M.specularMap,Nt=!!M.specularColorMap,Qt=!!M.specularIntensityMap,P=yt&&!!M.transmissionMap,tt=yt&&!!M.thicknessMap,q=!!M.gradientMap,j=!!M.alphaMap,nt=M.alphaTest>0,Mt=!!M.alphaHash,zt=!!M.extensions;let ie=In;M.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(ie=n.toneMapping);const ue={shaderID:st,shaderType:M.type,shaderName:M.name,vertexShader:Bt,fragmentShader:X,defines:M.defines,customVertexShaderID:J,customFragmentShaderID:ut,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:m,batching:Et,batchingColor:Et&&U._colorsTexture!==null,instancing:xt,instancingColor:xt&&U.instanceColor!==null,instancingMorph:xt&&U.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:at===null?n.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:Bn,alphaToCoverage:!!M.alphaToCoverage,map:Ut,matcap:Kt,envMap:R,envMapMode:R&&$.mapping,envMapCubeUVHeight:W,aoMap:Zt,lightMap:Ht,bumpMap:Vt,normalMap:gt,displacementMap:d&&Jt,emissiveMap:bt,normalMapObjectSpace:gt&&M.normalMapType===Yh,normalMapTangentSpace:gt&&M.normalMapType===ju,metalnessMap:Tt,roughnessMap:A,anisotropy:x,anisotropyMap:it,clearcoat:H,clearcoatMap:ct,clearcoatNormalMap:Dt,clearcoatRoughnessMap:Q,dispersion:Y,iridescence:Z,iridescenceMap:dt,iridescenceThicknessMap:Ft,sheen:K,sheenColorMap:At,sheenRoughnessMap:ht,specularMap:Ct,specularColorMap:Nt,specularIntensityMap:Qt,transmission:yt,transmissionMap:P,thicknessMap:tt,gradientMap:q,opaque:M.transparent===!1&&M.blending===Ui&&M.alphaToCoverage===!1,alphaMap:j,alphaTest:nt,alphaHash:Mt,combine:M.combine,mapUv:Ut&&g(M.map.channel),aoMapUv:Zt&&g(M.aoMap.channel),lightMapUv:Ht&&g(M.lightMap.channel),bumpMapUv:Vt&&g(M.bumpMap.channel),normalMapUv:gt&&g(M.normalMap.channel),displacementMapUv:Jt&&g(M.displacementMap.channel),emissiveMapUv:bt&&g(M.emissiveMap.channel),metalnessMapUv:Tt&&g(M.metalnessMap.channel),roughnessMapUv:A&&g(M.roughnessMap.channel),anisotropyMapUv:it&&g(M.anisotropyMap.channel),clearcoatMapUv:ct&&g(M.clearcoatMap.channel),clearcoatNormalMapUv:Dt&&g(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Q&&g(M.clearcoatRoughnessMap.channel),iridescenceMapUv:dt&&g(M.iridescenceMap.channel),iridescenceThicknessMapUv:Ft&&g(M.iridescenceThicknessMap.channel),sheenColorMapUv:At&&g(M.sheenColorMap.channel),sheenRoughnessMapUv:ht&&g(M.sheenRoughnessMap.channel),specularMapUv:Ct&&g(M.specularMap.channel),specularColorMapUv:Nt&&g(M.specularColorMap.channel),specularIntensityMapUv:Qt&&g(M.specularIntensityMap.channel),transmissionMapUv:P&&g(M.transmissionMap.channel),thicknessMapUv:tt&&g(M.thicknessMap.channel),alphaMapUv:j&&g(M.alphaMap.channel),vertexTangents:!!G.attributes.tangent&&(gt||x),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!G.attributes.uv&&(Ut||j),fog:!!z,useFog:M.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:U.isSkinnedMesh===!0,morphTargets:G.morphAttributes.position!==void 0,morphNormals:G.morphAttributes.normal!==void 0,morphColors:G.morphAttributes.color!==void 0,morphTargetsCount:ft,morphTextureStride:Rt,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:M.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:ie,decodeVideoTexture:Ut&&M.map.isVideoTexture===!0&&Yt.getTransfer(M.map.colorSpace)===$t,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===fn,flipSided:M.side===Ee,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:zt&&M.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(zt&&M.extensions.multiDraw===!0||Et)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ue.vertexUv1s=c.has(1),ue.vertexUv2s=c.has(2),ue.vertexUv3s=c.has(3),c.clear(),ue}function f(M){const v=[];if(M.shaderID?v.push(M.shaderID):(v.push(M.customVertexShaderID),v.push(M.customFragmentShaderID)),M.defines!==void 0)for(const C in M.defines)v.push(C),v.push(M.defines[C]);return M.isRawShaderMaterial===!1&&(b(v,M),S(v,M),v.push(n.outputColorSpace)),v.push(M.customProgramCacheKey),v.join()}function b(M,v){M.push(v.precision),M.push(v.outputColorSpace),M.push(v.envMapMode),M.push(v.envMapCubeUVHeight),M.push(v.mapUv),M.push(v.alphaMapUv),M.push(v.lightMapUv),M.push(v.aoMapUv),M.push(v.bumpMapUv),M.push(v.normalMapUv),M.push(v.displacementMapUv),M.push(v.emissiveMapUv),M.push(v.metalnessMapUv),M.push(v.roughnessMapUv),M.push(v.anisotropyMapUv),M.push(v.clearcoatMapUv),M.push(v.clearcoatNormalMapUv),M.push(v.clearcoatRoughnessMapUv),M.push(v.iridescenceMapUv),M.push(v.iridescenceThicknessMapUv),M.push(v.sheenColorMapUv),M.push(v.sheenRoughnessMapUv),M.push(v.specularMapUv),M.push(v.specularColorMapUv),M.push(v.specularIntensityMapUv),M.push(v.transmissionMapUv),M.push(v.thicknessMapUv),M.push(v.combine),M.push(v.fogExp2),M.push(v.sizeAttenuation),M.push(v.morphTargetsCount),M.push(v.morphAttributeCount),M.push(v.numDirLights),M.push(v.numPointLights),M.push(v.numSpotLights),M.push(v.numSpotLightMaps),M.push(v.numHemiLights),M.push(v.numRectAreaLights),M.push(v.numDirLightShadows),M.push(v.numPointLightShadows),M.push(v.numSpotLightShadows),M.push(v.numSpotLightShadowsWithMaps),M.push(v.numLightProbes),M.push(v.shadowMapType),M.push(v.toneMapping),M.push(v.numClippingPlanes),M.push(v.numClipIntersection),M.push(v.depthPacking)}function S(M,v){o.disableAll(),v.supportsVertexTextures&&o.enable(0),v.instancing&&o.enable(1),v.instancingColor&&o.enable(2),v.instancingMorph&&o.enable(3),v.matcap&&o.enable(4),v.envMap&&o.enable(5),v.normalMapObjectSpace&&o.enable(6),v.normalMapTangentSpace&&o.enable(7),v.clearcoat&&o.enable(8),v.iridescence&&o.enable(9),v.alphaTest&&o.enable(10),v.vertexColors&&o.enable(11),v.vertexAlphas&&o.enable(12),v.vertexUv1s&&o.enable(13),v.vertexUv2s&&o.enable(14),v.vertexUv3s&&o.enable(15),v.vertexTangents&&o.enable(16),v.anisotropy&&o.enable(17),v.alphaHash&&o.enable(18),v.batching&&o.enable(19),v.dispersion&&o.enable(20),v.batchingColor&&o.enable(21),M.push(o.mask),o.disableAll(),v.fog&&o.enable(0),v.useFog&&o.enable(1),v.flatShading&&o.enable(2),v.logarithmicDepthBuffer&&o.enable(3),v.skinning&&o.enable(4),v.morphTargets&&o.enable(5),v.morphNormals&&o.enable(6),v.morphColors&&o.enable(7),v.premultipliedAlpha&&o.enable(8),v.shadowMapEnabled&&o.enable(9),v.doubleSided&&o.enable(10),v.flipSided&&o.enable(11),v.useDepthPacking&&o.enable(12),v.dithering&&o.enable(13),v.transmission&&o.enable(14),v.sheen&&o.enable(15),v.opaque&&o.enable(16),v.pointsUvs&&o.enable(17),v.decodeVideoTexture&&o.enable(18),v.alphaToCoverage&&o.enable(19),M.push(o.mask)}function E(M){const v=_[M.type];let C;if(v){const k=Je[v];C=kf.clone(k.uniforms)}else C=M.uniforms;return C}function D(M,v){let C;for(let k=0,U=u.length;k<U;k++){const z=u[k];if(z.cacheKey===v){C=z,++C.usedTimes;break}}return C===void 0&&(C=new Z_(n,v,M,s),u.push(C)),C}function w(M){if(--M.usedTimes===0){const v=u.indexOf(M);u[v]=u[u.length-1],u.pop(),M.destroy()}}function T(M){l.remove(M)}function L(){l.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:E,acquireProgram:D,releaseProgram:w,releaseShaderCache:T,programs:u,dispose:L}}function nv(){let n=new WeakMap;function t(a){return n.has(a)}function e(a){let o=n.get(a);return o===void 0&&(o={},n.set(a,o)),o}function i(a){n.delete(a)}function r(a,o,l){n.get(a)[o]=l}function s(){n=new WeakMap}return{has:t,get:e,remove:i,update:r,dispose:s}}function iv(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.z!==t.z?n.z-t.z:n.id-t.id}function Hc(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function Vc(){const n=[];let t=0;const e=[],i=[],r=[];function s(){t=0,e.length=0,i.length=0,r.length=0}function a(h,d,m,_,g,p){let f=n[t];return f===void 0?(f={id:h.id,object:h,geometry:d,material:m,groupOrder:_,renderOrder:h.renderOrder,z:g,group:p},n[t]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=m,f.groupOrder=_,f.renderOrder=h.renderOrder,f.z=g,f.group=p),t++,f}function o(h,d,m,_,g,p){const f=a(h,d,m,_,g,p);m.transmission>0?i.push(f):m.transparent===!0?r.push(f):e.push(f)}function l(h,d,m,_,g,p){const f=a(h,d,m,_,g,p);m.transmission>0?i.unshift(f):m.transparent===!0?r.unshift(f):e.unshift(f)}function c(h,d){e.length>1&&e.sort(h||iv),i.length>1&&i.sort(d||Hc),r.length>1&&r.sort(d||Hc)}function u(){for(let h=t,d=n.length;h<d;h++){const m=n[h];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:u,sort:c}}function rv(){let n=new WeakMap;function t(i,r){const s=n.get(i);let a;return s===void 0?(a=new Vc,n.set(i,[a])):r>=s.length?(a=new Vc,s.push(a)):a=s[r],a}function e(){n=new WeakMap}return{get:t,dispose:e}}function sv(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new O,color:new kt};break;case"SpotLight":e={position:new O,direction:new O,color:new kt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new O,color:new kt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new O,skyColor:new kt,groundColor:new kt};break;case"RectAreaLight":e={color:new kt,position:new O,halfWidth:new O,halfHeight:new O};break}return n[t.id]=e,e}}}function av(){const n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}let ov=0;function lv(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function cv(n){const t=new sv,e=av(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new O);const r=new O,s=new jt,a=new jt;function o(c){let u=0,h=0,d=0;for(let M=0;M<9;M++)i.probe[M].set(0,0,0);let m=0,_=0,g=0,p=0,f=0,b=0,S=0,E=0,D=0,w=0,T=0;c.sort(lv);for(let M=0,v=c.length;M<v;M++){const C=c[M],k=C.color,U=C.intensity,z=C.distance,G=C.shadow&&C.shadow.map?C.shadow.map.texture:null;if(C.isAmbientLight)u+=k.r*U,h+=k.g*U,d+=k.b*U;else if(C.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(C.sh.coefficients[V],U);T++}else if(C.isDirectionalLight){const V=t.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){const $=C.shadow,W=e.get(C);W.shadowIntensity=$.intensity,W.shadowBias=$.bias,W.shadowNormalBias=$.normalBias,W.shadowRadius=$.radius,W.shadowMapSize=$.mapSize,i.directionalShadow[m]=W,i.directionalShadowMap[m]=G,i.directionalShadowMatrix[m]=C.shadow.matrix,b++}i.directional[m]=V,m++}else if(C.isSpotLight){const V=t.get(C);V.position.setFromMatrixPosition(C.matrixWorld),V.color.copy(k).multiplyScalar(U),V.distance=z,V.coneCos=Math.cos(C.angle),V.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),V.decay=C.decay,i.spot[g]=V;const $=C.shadow;if(C.map&&(i.spotLightMap[D]=C.map,D++,$.updateMatrices(C),C.castShadow&&w++),i.spotLightMatrix[g]=$.matrix,C.castShadow){const W=e.get(C);W.shadowIntensity=$.intensity,W.shadowBias=$.bias,W.shadowNormalBias=$.normalBias,W.shadowRadius=$.radius,W.shadowMapSize=$.mapSize,i.spotShadow[g]=W,i.spotShadowMap[g]=G,E++}g++}else if(C.isRectAreaLight){const V=t.get(C);V.color.copy(k).multiplyScalar(U),V.halfWidth.set(C.width*.5,0,0),V.halfHeight.set(0,C.height*.5,0),i.rectArea[p]=V,p++}else if(C.isPointLight){const V=t.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),V.distance=C.distance,V.decay=C.decay,C.castShadow){const $=C.shadow,W=e.get(C);W.shadowIntensity=$.intensity,W.shadowBias=$.bias,W.shadowNormalBias=$.normalBias,W.shadowRadius=$.radius,W.shadowMapSize=$.mapSize,W.shadowCameraNear=$.camera.near,W.shadowCameraFar=$.camera.far,i.pointShadow[_]=W,i.pointShadowMap[_]=G,i.pointShadowMatrix[_]=C.shadow.matrix,S++}i.point[_]=V,_++}else if(C.isHemisphereLight){const V=t.get(C);V.skyColor.copy(C.color).multiplyScalar(U),V.groundColor.copy(C.groundColor).multiplyScalar(U),i.hemi[f]=V,f++}}p>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=rt.LTC_FLOAT_1,i.rectAreaLTC2=rt.LTC_FLOAT_2):(i.rectAreaLTC1=rt.LTC_HALF_1,i.rectAreaLTC2=rt.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;const L=i.hash;(L.directionalLength!==m||L.pointLength!==_||L.spotLength!==g||L.rectAreaLength!==p||L.hemiLength!==f||L.numDirectionalShadows!==b||L.numPointShadows!==S||L.numSpotShadows!==E||L.numSpotMaps!==D||L.numLightProbes!==T)&&(i.directional.length=m,i.spot.length=g,i.rectArea.length=p,i.point.length=_,i.hemi.length=f,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.pointShadow.length=S,i.pointShadowMap.length=S,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=b,i.pointShadowMatrix.length=S,i.spotLightMatrix.length=E+D-w,i.spotLightMap.length=D,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=T,L.directionalLength=m,L.pointLength=_,L.spotLength=g,L.rectAreaLength=p,L.hemiLength=f,L.numDirectionalShadows=b,L.numPointShadows=S,L.numSpotShadows=E,L.numSpotMaps=D,L.numLightProbes=T,i.version=ov++)}function l(c,u){let h=0,d=0,m=0,_=0,g=0;const p=u.matrixWorldInverse;for(let f=0,b=c.length;f<b;f++){const S=c[f];if(S.isDirectionalLight){const E=i.directional[h];E.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(p),h++}else if(S.isSpotLight){const E=i.spot[m];E.position.setFromMatrixPosition(S.matrixWorld),E.position.applyMatrix4(p),E.direction.setFromMatrixPosition(S.matrixWorld),r.setFromMatrixPosition(S.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(p),m++}else if(S.isRectAreaLight){const E=i.rectArea[_];E.position.setFromMatrixPosition(S.matrixWorld),E.position.applyMatrix4(p),a.identity(),s.copy(S.matrixWorld),s.premultiply(p),a.extractRotation(s),E.halfWidth.set(S.width*.5,0,0),E.halfHeight.set(0,S.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),_++}else if(S.isPointLight){const E=i.point[d];E.position.setFromMatrixPosition(S.matrixWorld),E.position.applyMatrix4(p),d++}else if(S.isHemisphereLight){const E=i.hemi[g];E.direction.setFromMatrixPosition(S.matrixWorld),E.direction.transformDirection(p),g++}}}return{setup:o,setupView:l,state:i}}function Gc(n){const t=new cv(n),e=[],i=[];function r(u){c.camera=u,e.length=0,i.length=0}function s(u){e.push(u)}function a(u){i.push(u)}function o(){t.setup(e)}function l(u){t.setupView(e,u)}const c={lightsArray:e,shadowsArray:i,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:c,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function uv(n){let t=new WeakMap;function e(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new Gc(n),t.set(r,[o])):s>=a.length?(o=new Gc(n),a.push(o)):o=a[s],o}function i(){t=new WeakMap}return{get:e,dispose:i}}class dv extends tr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Xh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class hv extends tr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const fv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,pv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function mv(n,t,e){let i=new sl;const r=new Ot,s=new Ot,a=new ae,o=new dv({depthPacking:qh}),l=new hv,c={},u=e.maxTextureSize,h={[On]:Ee,[Ee]:On,[fn]:fn},d=new Fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ot},radius:{value:4}},vertexShader:fv,fragmentShader:pv}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const _=new Ie;_.setAttribute("position",new je(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const g=new ve(_,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Ou;let f=this.type;this.render=function(w,T,L){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const M=n.getRenderTarget(),v=n.getActiveCubeFace(),C=n.getActiveMipmapLevel(),k=n.state;k.setBlending(Pn),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const U=f!==dn&&this.type===dn,z=f===dn&&this.type!==dn;for(let G=0,V=w.length;G<V;G++){const $=w[G],W=$.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;r.copy(W.mapSize);const st=W.getFrameExtents();if(r.multiply(st),s.copy(W.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/st.x),r.x=s.x*st.x,W.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/st.y),r.y=s.y*st.y,W.mapSize.y=s.y)),W.map===null||U===!0||z===!0){const ft=this.type!==dn?{minFilter:Se,magFilter:Se}:{};W.map!==null&&W.map.dispose(),W.map=new ai(r.x,r.y,ft),W.map.texture.name=$.name+".shadowMap",W.camera.updateProjectionMatrix()}n.setRenderTarget(W.map),n.clear();const lt=W.getViewportCount();for(let ft=0;ft<lt;ft++){const Rt=W.getViewport(ft);a.set(s.x*Rt.x,s.y*Rt.y,s.x*Rt.z,s.y*Rt.w),k.viewport(a),W.updateMatrices($,ft),i=W.getFrustum(),E(T,L,W.camera,$,this.type)}W.isPointLightShadow!==!0&&this.type===dn&&b(W,L),W.needsUpdate=!1}f=this.type,p.needsUpdate=!1,n.setRenderTarget(M,v,C)};function b(w,T){const L=t.update(g);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new ai(r.x,r.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,n.setRenderTarget(w.mapPass),n.clear(),n.renderBufferDirect(T,null,L,d,g,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,n.setRenderTarget(w.map),n.clear(),n.renderBufferDirect(T,null,L,m,g,null)}function S(w,T,L,M){let v=null;const C=L.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(C!==void 0)v=C;else if(v=L.isPointLight===!0?l:o,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const k=v.uuid,U=T.uuid;let z=c[k];z===void 0&&(z={},c[k]=z);let G=z[U];G===void 0&&(G=v.clone(),z[U]=G,T.addEventListener("dispose",D)),v=G}if(v.visible=T.visible,v.wireframe=T.wireframe,M===dn?v.side=T.shadowSide!==null?T.shadowSide:T.side:v.side=T.shadowSide!==null?T.shadowSide:h[T.side],v.alphaMap=T.alphaMap,v.alphaTest=T.alphaTest,v.map=T.map,v.clipShadows=T.clipShadows,v.clippingPlanes=T.clippingPlanes,v.clipIntersection=T.clipIntersection,v.displacementMap=T.displacementMap,v.displacementScale=T.displacementScale,v.displacementBias=T.displacementBias,v.wireframeLinewidth=T.wireframeLinewidth,v.linewidth=T.linewidth,L.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const k=n.properties.get(v);k.light=L}return v}function E(w,T,L,M,v){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&v===dn)&&(!w.frustumCulled||i.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,w.matrixWorld);const U=t.update(w),z=w.material;if(Array.isArray(z)){const G=U.groups;for(let V=0,$=G.length;V<$;V++){const W=G[V],st=z[W.materialIndex];if(st&&st.visible){const lt=S(w,st,M,v);w.onBeforeShadow(n,w,T,L,U,lt,W),n.renderBufferDirect(L,null,U,lt,w,W),w.onAfterShadow(n,w,T,L,U,lt,W)}}}else if(z.visible){const G=S(w,z,M,v);w.onBeforeShadow(n,w,T,L,U,G,null),n.renderBufferDirect(L,null,U,G,w,null),w.onAfterShadow(n,w,T,L,U,G,null)}}const k=w.children;for(let U=0,z=k.length;U<z;U++)E(k[U],T,L,M,v)}function D(w){w.target.removeEventListener("dispose",D);for(const L in c){const M=c[L],v=w.target.uuid;v in M&&(M[v].dispose(),delete M[v])}}}function gv(n){function t(){let P=!1;const tt=new ae;let q=null;const j=new ae(0,0,0,0);return{setMask:function(nt){q!==nt&&!P&&(n.colorMask(nt,nt,nt,nt),q=nt)},setLocked:function(nt){P=nt},setClear:function(nt,Mt,zt,ie,ue){ue===!0&&(nt*=ie,Mt*=ie,zt*=ie),tt.set(nt,Mt,zt,ie),j.equals(tt)===!1&&(n.clearColor(nt,Mt,zt,ie),j.copy(tt))},reset:function(){P=!1,q=null,j.set(-1,0,0,0)}}}function e(){let P=!1,tt=null,q=null,j=null;return{setTest:function(nt){nt?ut(n.DEPTH_TEST):at(n.DEPTH_TEST)},setMask:function(nt){tt!==nt&&!P&&(n.depthMask(nt),tt=nt)},setFunc:function(nt){if(q!==nt){switch(nt){case Ch:n.depthFunc(n.NEVER);break;case Rh:n.depthFunc(n.ALWAYS);break;case Dh:n.depthFunc(n.LESS);break;case Rs:n.depthFunc(n.LEQUAL);break;case Lh:n.depthFunc(n.EQUAL);break;case Ph:n.depthFunc(n.GEQUAL);break;case Ih:n.depthFunc(n.GREATER);break;case Uh:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}q=nt}},setLocked:function(nt){P=nt},setClear:function(nt){j!==nt&&(n.clearDepth(nt),j=nt)},reset:function(){P=!1,tt=null,q=null,j=null}}}function i(){let P=!1,tt=null,q=null,j=null,nt=null,Mt=null,zt=null,ie=null,ue=null;return{setTest:function(Gt){P||(Gt?ut(n.STENCIL_TEST):at(n.STENCIL_TEST))},setMask:function(Gt){tt!==Gt&&!P&&(n.stencilMask(Gt),tt=Gt)},setFunc:function(Gt,sn,$e){(q!==Gt||j!==sn||nt!==$e)&&(n.stencilFunc(Gt,sn,$e),q=Gt,j=sn,nt=$e)},setOp:function(Gt,sn,$e){(Mt!==Gt||zt!==sn||ie!==$e)&&(n.stencilOp(Gt,sn,$e),Mt=Gt,zt=sn,ie=$e)},setLocked:function(Gt){P=Gt},setClear:function(Gt){ue!==Gt&&(n.clearStencil(Gt),ue=Gt)},reset:function(){P=!1,tt=null,q=null,j=null,nt=null,Mt=null,zt=null,ie=null,ue=null}}}const r=new t,s=new e,a=new i,o=new WeakMap,l=new WeakMap;let c={},u={},h=new WeakMap,d=[],m=null,_=!1,g=null,p=null,f=null,b=null,S=null,E=null,D=null,w=new kt(0,0,0),T=0,L=!1,M=null,v=null,C=null,k=null,U=null;const z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let G=!1,V=0;const $=n.getParameter(n.VERSION);$.indexOf("WebGL")!==-1?(V=parseFloat(/^WebGL (\d)/.exec($)[1]),G=V>=1):$.indexOf("OpenGL ES")!==-1&&(V=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),G=V>=2);let W=null,st={};const lt=n.getParameter(n.SCISSOR_BOX),ft=n.getParameter(n.VIEWPORT),Rt=new ae().fromArray(lt),Bt=new ae().fromArray(ft);function X(P,tt,q,j){const nt=new Uint8Array(4),Mt=n.createTexture();n.bindTexture(P,Mt),n.texParameteri(P,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(P,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let zt=0;zt<q;zt++)P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY?n.texImage3D(tt,0,n.RGBA,1,1,j,0,n.RGBA,n.UNSIGNED_BYTE,nt):n.texImage2D(tt+zt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,nt);return Mt}const J={};J[n.TEXTURE_2D]=X(n.TEXTURE_2D,n.TEXTURE_2D,1),J[n.TEXTURE_CUBE_MAP]=X(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),J[n.TEXTURE_2D_ARRAY]=X(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),J[n.TEXTURE_3D]=X(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),ut(n.DEPTH_TEST),s.setFunc(Rs),Vt(!1),gt(jl),ut(n.CULL_FACE),Zt(Pn);function ut(P){c[P]!==!0&&(n.enable(P),c[P]=!0)}function at(P){c[P]!==!1&&(n.disable(P),c[P]=!1)}function xt(P,tt){return u[P]!==tt?(n.bindFramebuffer(P,tt),u[P]=tt,P===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=tt),P===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=tt),!0):!1}function Et(P,tt){let q=d,j=!1;if(P){q=h.get(tt),q===void 0&&(q=[],h.set(tt,q));const nt=P.textures;if(q.length!==nt.length||q[0]!==n.COLOR_ATTACHMENT0){for(let Mt=0,zt=nt.length;Mt<zt;Mt++)q[Mt]=n.COLOR_ATTACHMENT0+Mt;q.length=nt.length,j=!0}}else q[0]!==n.BACK&&(q[0]=n.BACK,j=!0);j&&n.drawBuffers(q)}function Ut(P){return m!==P?(n.useProgram(P),m=P,!0):!1}const Kt={[Jn]:n.FUNC_ADD,[dh]:n.FUNC_SUBTRACT,[hh]:n.FUNC_REVERSE_SUBTRACT};Kt[fh]=n.MIN,Kt[ph]=n.MAX;const R={[mh]:n.ZERO,[gh]:n.ONE,[_h]:n.SRC_COLOR,[to]:n.SRC_ALPHA,[Eh]:n.SRC_ALPHA_SATURATE,[Mh]:n.DST_COLOR,[xh]:n.DST_ALPHA,[vh]:n.ONE_MINUS_SRC_COLOR,[eo]:n.ONE_MINUS_SRC_ALPHA,[Sh]:n.ONE_MINUS_DST_COLOR,[yh]:n.ONE_MINUS_DST_ALPHA,[bh]:n.CONSTANT_COLOR,[wh]:n.ONE_MINUS_CONSTANT_COLOR,[Ah]:n.CONSTANT_ALPHA,[Th]:n.ONE_MINUS_CONSTANT_ALPHA};function Zt(P,tt,q,j,nt,Mt,zt,ie,ue,Gt){if(P===Pn){_===!0&&(at(n.BLEND),_=!1);return}if(_===!1&&(ut(n.BLEND),_=!0),P!==uh){if(P!==g||Gt!==L){if((p!==Jn||S!==Jn)&&(n.blendEquation(n.FUNC_ADD),p=Jn,S=Jn),Gt)switch(P){case Ui:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Kl:n.blendFunc(n.ONE,n.ONE);break;case $l:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Zl:n.blendFuncSeparate(n.ZERO,n.SRC_COLOR,n.ZERO,n.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}else switch(P){case Ui:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Kl:n.blendFunc(n.SRC_ALPHA,n.ONE);break;case $l:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Zl:n.blendFunc(n.ZERO,n.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",P);break}f=null,b=null,E=null,D=null,w.set(0,0,0),T=0,g=P,L=Gt}return}nt=nt||tt,Mt=Mt||q,zt=zt||j,(tt!==p||nt!==S)&&(n.blendEquationSeparate(Kt[tt],Kt[nt]),p=tt,S=nt),(q!==f||j!==b||Mt!==E||zt!==D)&&(n.blendFuncSeparate(R[q],R[j],R[Mt],R[zt]),f=q,b=j,E=Mt,D=zt),(ie.equals(w)===!1||ue!==T)&&(n.blendColor(ie.r,ie.g,ie.b,ue),w.copy(ie),T=ue),g=P,L=!1}function Ht(P,tt){P.side===fn?at(n.CULL_FACE):ut(n.CULL_FACE);let q=P.side===Ee;tt&&(q=!q),Vt(q),P.blending===Ui&&P.transparent===!1?Zt(Pn):Zt(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),s.setFunc(P.depthFunc),s.setTest(P.depthTest),s.setMask(P.depthWrite),r.setMask(P.colorWrite);const j=P.stencilWrite;a.setTest(j),j&&(a.setMask(P.stencilWriteMask),a.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),a.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),bt(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?ut(n.SAMPLE_ALPHA_TO_COVERAGE):at(n.SAMPLE_ALPHA_TO_COVERAGE)}function Vt(P){M!==P&&(P?n.frontFace(n.CW):n.frontFace(n.CCW),M=P)}function gt(P){P!==oh?(ut(n.CULL_FACE),P!==v&&(P===jl?n.cullFace(n.BACK):P===lh?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):at(n.CULL_FACE),v=P}function Jt(P){P!==C&&(G&&n.lineWidth(P),C=P)}function bt(P,tt,q){P?(ut(n.POLYGON_OFFSET_FILL),(k!==tt||U!==q)&&(n.polygonOffset(tt,q),k=tt,U=q)):at(n.POLYGON_OFFSET_FILL)}function Tt(P){P?ut(n.SCISSOR_TEST):at(n.SCISSOR_TEST)}function A(P){P===void 0&&(P=n.TEXTURE0+z-1),W!==P&&(n.activeTexture(P),W=P)}function x(P,tt,q){q===void 0&&(W===null?q=n.TEXTURE0+z-1:q=W);let j=st[q];j===void 0&&(j={type:void 0,texture:void 0},st[q]=j),(j.type!==P||j.texture!==tt)&&(W!==q&&(n.activeTexture(q),W=q),n.bindTexture(P,tt||J[P]),j.type=P,j.texture=tt)}function H(){const P=st[W];P!==void 0&&P.type!==void 0&&(n.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function Y(){try{n.compressedTexImage2D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Z(){try{n.compressedTexImage3D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function K(){try{n.texSubImage2D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function yt(){try{n.texSubImage3D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function it(){try{n.compressedTexSubImage2D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function ct(){try{n.compressedTexSubImage3D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Dt(){try{n.texStorage2D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Q(){try{n.texStorage3D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function dt(){try{n.texImage2D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function Ft(){try{n.texImage3D.apply(n,arguments)}catch(P){console.error("THREE.WebGLState:",P)}}function At(P){Rt.equals(P)===!1&&(n.scissor(P.x,P.y,P.z,P.w),Rt.copy(P))}function ht(P){Bt.equals(P)===!1&&(n.viewport(P.x,P.y,P.z,P.w),Bt.copy(P))}function Ct(P,tt){let q=l.get(tt);q===void 0&&(q=new WeakMap,l.set(tt,q));let j=q.get(P);j===void 0&&(j=n.getUniformBlockIndex(tt,P.name),q.set(P,j))}function Nt(P,tt){const j=l.get(tt).get(P);o.get(tt)!==j&&(n.uniformBlockBinding(tt,j,P.__bindingPointIndex),o.set(tt,j))}function Qt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),c={},W=null,st={},u={},h=new WeakMap,d=[],m=null,_=!1,g=null,p=null,f=null,b=null,S=null,E=null,D=null,w=new kt(0,0,0),T=0,L=!1,M=null,v=null,C=null,k=null,U=null,Rt.set(0,0,n.canvas.width,n.canvas.height),Bt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:ut,disable:at,bindFramebuffer:xt,drawBuffers:Et,useProgram:Ut,setBlending:Zt,setMaterial:Ht,setFlipSided:Vt,setCullFace:gt,setLineWidth:Jt,setPolygonOffset:bt,setScissorTest:Tt,activeTexture:A,bindTexture:x,unbindTexture:H,compressedTexImage2D:Y,compressedTexImage3D:Z,texImage2D:dt,texImage3D:Ft,updateUBOMapping:Ct,uniformBlockBinding:Nt,texStorage2D:Dt,texStorage3D:Q,texSubImage2D:K,texSubImage3D:yt,compressedTexSubImage2D:it,compressedTexSubImage3D:ct,scissor:At,viewport:ht,reset:Qt}}function Wc(n,t,e,i){const r=_v(i);switch(e){case Vu:return n*t;case Wu:return n*t;case Xu:return n*t*2;case $o:return n*t/r.components*r.byteLength;case Zo:return n*t/r.components*r.byteLength;case qu:return n*t*2/r.components*r.byteLength;case Jo:return n*t*2/r.components*r.byteLength;case Gu:return n*t*3/r.components*r.byteLength;case Ye:return n*t*4/r.components*r.byteLength;case Qo:return n*t*4/r.components*r.byteLength;case xs:case ys:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ms:case Ss:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case oo:case co:return Math.max(n,16)*Math.max(t,8)/4;case ao:case lo:return Math.max(n,8)*Math.max(t,8)/2;case uo:case ho:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case fo:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case po:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case mo:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case go:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case _o:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case vo:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case xo:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case yo:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case Mo:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case So:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case Eo:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case bo:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case wo:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case Ao:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case To:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case Es:case Co:case Ro:return Math.ceil(n/4)*Math.ceil(t/4)*16;case Yu:case Do:return Math.ceil(n/4)*Math.ceil(t/4)*8;case Lo:case Po:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function _v(n){switch(n){case mn:case Bu:return{byteLength:1,components:1};case Er:case zu:case Dr:return{byteLength:2,components:1};case jo:case Ko:return{byteLength:2,components:4};case si:case Yo:case tn:return{byteLength:4,components:1};case Hu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}function vv(n,t,e,i,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ot,u=new WeakMap;let h;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(A,x){return m?new OffscreenCanvas(A,x):Us("canvas")}function g(A,x,H){let Y=1;const Z=Tt(A);if((Z.width>H||Z.height>H)&&(Y=H/Math.max(Z.width,Z.height)),Y<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const K=Math.floor(Y*Z.width),yt=Math.floor(Y*Z.height);h===void 0&&(h=_(K,yt));const it=x?_(K,yt):h;return it.width=K,it.height=yt,it.getContext("2d").drawImage(A,0,0,K,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Z.width+"x"+Z.height+") to ("+K+"x"+yt+")."),it}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Z.width+"x"+Z.height+")."),A;return A}function p(A){return A.generateMipmaps&&A.minFilter!==Se&&A.minFilter!==qe}function f(A){n.generateMipmap(A)}function b(A,x,H,Y,Z=!1){if(A!==null){if(n[A]!==void 0)return n[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let K=x;if(x===n.RED&&(H===n.FLOAT&&(K=n.R32F),H===n.HALF_FLOAT&&(K=n.R16F),H===n.UNSIGNED_BYTE&&(K=n.R8)),x===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(K=n.R8UI),H===n.UNSIGNED_SHORT&&(K=n.R16UI),H===n.UNSIGNED_INT&&(K=n.R32UI),H===n.BYTE&&(K=n.R8I),H===n.SHORT&&(K=n.R16I),H===n.INT&&(K=n.R32I)),x===n.RG&&(H===n.FLOAT&&(K=n.RG32F),H===n.HALF_FLOAT&&(K=n.RG16F),H===n.UNSIGNED_BYTE&&(K=n.RG8)),x===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(K=n.RG8UI),H===n.UNSIGNED_SHORT&&(K=n.RG16UI),H===n.UNSIGNED_INT&&(K=n.RG32UI),H===n.BYTE&&(K=n.RG8I),H===n.SHORT&&(K=n.RG16I),H===n.INT&&(K=n.RG32I)),x===n.RGB&&H===n.UNSIGNED_INT_5_9_9_9_REV&&(K=n.RGB9_E5),x===n.RGBA){const yt=Z?Ds:Yt.getTransfer(Y);H===n.FLOAT&&(K=n.RGBA32F),H===n.HALF_FLOAT&&(K=n.RGBA16F),H===n.UNSIGNED_BYTE&&(K=yt===$t?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT_4_4_4_4&&(K=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(K=n.RGB5_A1)}return(K===n.R16F||K===n.R32F||K===n.RG16F||K===n.RG32F||K===n.RGBA16F||K===n.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function S(A,x){let H;return A?x===null||x===si||x===Vi?H=n.DEPTH24_STENCIL8:x===tn?H=n.DEPTH32F_STENCIL8:x===Er&&(H=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===si||x===Vi?H=n.DEPTH_COMPONENT24:x===tn?H=n.DEPTH_COMPONENT32F:x===Er&&(H=n.DEPTH_COMPONENT16),H}function E(A,x){return p(A)===!0||A.isFramebufferTexture&&A.minFilter!==Se&&A.minFilter!==qe?Math.log2(Math.max(x.width,x.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?x.mipmaps.length:1}function D(A){const x=A.target;x.removeEventListener("dispose",D),T(x),x.isVideoTexture&&u.delete(x)}function w(A){const x=A.target;x.removeEventListener("dispose",w),M(x)}function T(A){const x=i.get(A);if(x.__webglInit===void 0)return;const H=A.source,Y=d.get(H);if(Y){const Z=Y[x.__cacheKey];Z.usedTimes--,Z.usedTimes===0&&L(A),Object.keys(Y).length===0&&d.delete(H)}i.remove(A)}function L(A){const x=i.get(A);n.deleteTexture(x.__webglTexture);const H=A.source,Y=d.get(H);delete Y[x.__cacheKey],a.memory.textures--}function M(A){const x=i.get(A);if(A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let Y=0;Y<6;Y++){if(Array.isArray(x.__webglFramebuffer[Y]))for(let Z=0;Z<x.__webglFramebuffer[Y].length;Z++)n.deleteFramebuffer(x.__webglFramebuffer[Y][Z]);else n.deleteFramebuffer(x.__webglFramebuffer[Y]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[Y])}else{if(Array.isArray(x.__webglFramebuffer))for(let Y=0;Y<x.__webglFramebuffer.length;Y++)n.deleteFramebuffer(x.__webglFramebuffer[Y]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let Y=0;Y<x.__webglColorRenderbuffer.length;Y++)x.__webglColorRenderbuffer[Y]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[Y]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const H=A.textures;for(let Y=0,Z=H.length;Y<Z;Y++){const K=i.get(H[Y]);K.__webglTexture&&(n.deleteTexture(K.__webglTexture),a.memory.textures--),i.remove(H[Y])}i.remove(A)}let v=0;function C(){v=0}function k(){const A=v;return A>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),v+=1,A}function U(A){const x=[];return x.push(A.wrapS),x.push(A.wrapT),x.push(A.wrapR||0),x.push(A.magFilter),x.push(A.minFilter),x.push(A.anisotropy),x.push(A.internalFormat),x.push(A.format),x.push(A.type),x.push(A.generateMipmaps),x.push(A.premultiplyAlpha),x.push(A.flipY),x.push(A.unpackAlignment),x.push(A.colorSpace),x.join()}function z(A,x){const H=i.get(A);if(A.isVideoTexture&&Jt(A),A.isRenderTargetTexture===!1&&A.version>0&&H.__version!==A.version){const Y=A.image;if(Y===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Y.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Bt(H,A,x);return}}e.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+x)}function G(A,x){const H=i.get(A);if(A.version>0&&H.__version!==A.version){Bt(H,A,x);return}e.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+x)}function V(A,x){const H=i.get(A);if(A.version>0&&H.__version!==A.version){Bt(H,A,x);return}e.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+x)}function $(A,x){const H=i.get(A);if(A.version>0&&H.__version!==A.version){X(H,A,x);return}e.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+x)}const W={[ro]:n.REPEAT,[ni]:n.CLAMP_TO_EDGE,[so]:n.MIRRORED_REPEAT},st={[Se]:n.NEAREST,[Wh]:n.NEAREST_MIPMAP_NEAREST,[Br]:n.NEAREST_MIPMAP_LINEAR,[qe]:n.LINEAR,[ga]:n.LINEAR_MIPMAP_NEAREST,[ii]:n.LINEAR_MIPMAP_LINEAR},lt={[jh]:n.NEVER,[tf]:n.ALWAYS,[Kh]:n.LESS,[Ku]:n.LEQUAL,[$h]:n.EQUAL,[Qh]:n.GEQUAL,[Zh]:n.GREATER,[Jh]:n.NOTEQUAL};function ft(A,x){if(x.type===tn&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===qe||x.magFilter===ga||x.magFilter===Br||x.magFilter===ii||x.minFilter===qe||x.minFilter===ga||x.minFilter===Br||x.minFilter===ii)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(A,n.TEXTURE_WRAP_S,W[x.wrapS]),n.texParameteri(A,n.TEXTURE_WRAP_T,W[x.wrapT]),(A===n.TEXTURE_3D||A===n.TEXTURE_2D_ARRAY)&&n.texParameteri(A,n.TEXTURE_WRAP_R,W[x.wrapR]),n.texParameteri(A,n.TEXTURE_MAG_FILTER,st[x.magFilter]),n.texParameteri(A,n.TEXTURE_MIN_FILTER,st[x.minFilter]),x.compareFunction&&(n.texParameteri(A,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(A,n.TEXTURE_COMPARE_FUNC,lt[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Se||x.minFilter!==Br&&x.minFilter!==ii||x.type===tn&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");n.texParameterf(A,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,r.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Rt(A,x){let H=!1;A.__webglInit===void 0&&(A.__webglInit=!0,x.addEventListener("dispose",D));const Y=x.source;let Z=d.get(Y);Z===void 0&&(Z={},d.set(Y,Z));const K=U(x);if(K!==A.__cacheKey){Z[K]===void 0&&(Z[K]={texture:n.createTexture(),usedTimes:0},a.memory.textures++,H=!0),Z[K].usedTimes++;const yt=Z[A.__cacheKey];yt!==void 0&&(Z[A.__cacheKey].usedTimes--,yt.usedTimes===0&&L(x)),A.__cacheKey=K,A.__webglTexture=Z[K].texture}return H}function Bt(A,x,H){let Y=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(Y=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(Y=n.TEXTURE_3D);const Z=Rt(A,x),K=x.source;e.bindTexture(Y,A.__webglTexture,n.TEXTURE0+H);const yt=i.get(K);if(K.version!==yt.__version||Z===!0){e.activeTexture(n.TEXTURE0+H);const it=Yt.getPrimaries(Yt.workingColorSpace),ct=x.colorSpace===Ln?null:Yt.getPrimaries(x.colorSpace),Dt=x.colorSpace===Ln||it===ct?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Dt);let Q=g(x.image,!1,r.maxTextureSize);Q=bt(x,Q);const dt=s.convert(x.format,x.colorSpace),Ft=s.convert(x.type);let At=b(x.internalFormat,dt,Ft,x.colorSpace,x.isVideoTexture);ft(Y,x);let ht;const Ct=x.mipmaps,Nt=x.isVideoTexture!==!0,Qt=yt.__version===void 0||Z===!0,P=K.dataReady,tt=E(x,Q);if(x.isDepthTexture)At=S(x.format===Gi,x.type),Qt&&(Nt?e.texStorage2D(n.TEXTURE_2D,1,At,Q.width,Q.height):e.texImage2D(n.TEXTURE_2D,0,At,Q.width,Q.height,0,dt,Ft,null));else if(x.isDataTexture)if(Ct.length>0){Nt&&Qt&&e.texStorage2D(n.TEXTURE_2D,tt,At,Ct[0].width,Ct[0].height);for(let q=0,j=Ct.length;q<j;q++)ht=Ct[q],Nt?P&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,ht.width,ht.height,dt,Ft,ht.data):e.texImage2D(n.TEXTURE_2D,q,At,ht.width,ht.height,0,dt,Ft,ht.data);x.generateMipmaps=!1}else Nt?(Qt&&e.texStorage2D(n.TEXTURE_2D,tt,At,Q.width,Q.height),P&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,Q.width,Q.height,dt,Ft,Q.data)):e.texImage2D(n.TEXTURE_2D,0,At,Q.width,Q.height,0,dt,Ft,Q.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Nt&&Qt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,tt,At,Ct[0].width,Ct[0].height,Q.depth);for(let q=0,j=Ct.length;q<j;q++)if(ht=Ct[q],x.format!==Ye)if(dt!==null)if(Nt){if(P)if(x.layerUpdates.size>0){const nt=Wc(ht.width,ht.height,x.format,x.type);for(const Mt of x.layerUpdates){const zt=ht.data.subarray(Mt*nt/ht.data.BYTES_PER_ELEMENT,(Mt+1)*nt/ht.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,Mt,ht.width,ht.height,1,dt,zt,0,0)}x.clearLayerUpdates()}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,ht.width,ht.height,Q.depth,dt,ht.data,0,0)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,q,At,ht.width,ht.height,Q.depth,0,ht.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Nt?P&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,q,0,0,0,ht.width,ht.height,Q.depth,dt,Ft,ht.data):e.texImage3D(n.TEXTURE_2D_ARRAY,q,At,ht.width,ht.height,Q.depth,0,dt,Ft,ht.data)}else{Nt&&Qt&&e.texStorage2D(n.TEXTURE_2D,tt,At,Ct[0].width,Ct[0].height);for(let q=0,j=Ct.length;q<j;q++)ht=Ct[q],x.format!==Ye?dt!==null?Nt?P&&e.compressedTexSubImage2D(n.TEXTURE_2D,q,0,0,ht.width,ht.height,dt,ht.data):e.compressedTexImage2D(n.TEXTURE_2D,q,At,ht.width,ht.height,0,ht.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Nt?P&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,ht.width,ht.height,dt,Ft,ht.data):e.texImage2D(n.TEXTURE_2D,q,At,ht.width,ht.height,0,dt,Ft,ht.data)}else if(x.isDataArrayTexture)if(Nt){if(Qt&&e.texStorage3D(n.TEXTURE_2D_ARRAY,tt,At,Q.width,Q.height,Q.depth),P)if(x.layerUpdates.size>0){const q=Wc(Q.width,Q.height,x.format,x.type);for(const j of x.layerUpdates){const nt=Q.data.subarray(j*q/Q.data.BYTES_PER_ELEMENT,(j+1)*q/Q.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,j,Q.width,Q.height,1,dt,Ft,nt)}x.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,dt,Ft,Q.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,At,Q.width,Q.height,Q.depth,0,dt,Ft,Q.data);else if(x.isData3DTexture)Nt?(Qt&&e.texStorage3D(n.TEXTURE_3D,tt,At,Q.width,Q.height,Q.depth),P&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,dt,Ft,Q.data)):e.texImage3D(n.TEXTURE_3D,0,At,Q.width,Q.height,Q.depth,0,dt,Ft,Q.data);else if(x.isFramebufferTexture){if(Qt)if(Nt)e.texStorage2D(n.TEXTURE_2D,tt,At,Q.width,Q.height);else{let q=Q.width,j=Q.height;for(let nt=0;nt<tt;nt++)e.texImage2D(n.TEXTURE_2D,nt,At,q,j,0,dt,Ft,null),q>>=1,j>>=1}}else if(Ct.length>0){if(Nt&&Qt){const q=Tt(Ct[0]);e.texStorage2D(n.TEXTURE_2D,tt,At,q.width,q.height)}for(let q=0,j=Ct.length;q<j;q++)ht=Ct[q],Nt?P&&e.texSubImage2D(n.TEXTURE_2D,q,0,0,dt,Ft,ht):e.texImage2D(n.TEXTURE_2D,q,At,dt,Ft,ht);x.generateMipmaps=!1}else if(Nt){if(Qt){const q=Tt(Q);e.texStorage2D(n.TEXTURE_2D,tt,At,q.width,q.height)}P&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,dt,Ft,Q)}else e.texImage2D(n.TEXTURE_2D,0,At,dt,Ft,Q);p(x)&&f(Y),yt.__version=K.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function X(A,x,H){if(x.image.length!==6)return;const Y=Rt(A,x),Z=x.source;e.bindTexture(n.TEXTURE_CUBE_MAP,A.__webglTexture,n.TEXTURE0+H);const K=i.get(Z);if(Z.version!==K.__version||Y===!0){e.activeTexture(n.TEXTURE0+H);const yt=Yt.getPrimaries(Yt.workingColorSpace),it=x.colorSpace===Ln?null:Yt.getPrimaries(x.colorSpace),ct=x.colorSpace===Ln||yt===it?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,ct);const Dt=x.isCompressedTexture||x.image[0].isCompressedTexture,Q=x.image[0]&&x.image[0].isDataTexture,dt=[];for(let j=0;j<6;j++)!Dt&&!Q?dt[j]=g(x.image[j],!0,r.maxCubemapSize):dt[j]=Q?x.image[j].image:x.image[j],dt[j]=bt(x,dt[j]);const Ft=dt[0],At=s.convert(x.format,x.colorSpace),ht=s.convert(x.type),Ct=b(x.internalFormat,At,ht,x.colorSpace),Nt=x.isVideoTexture!==!0,Qt=K.__version===void 0||Y===!0,P=Z.dataReady;let tt=E(x,Ft);ft(n.TEXTURE_CUBE_MAP,x);let q;if(Dt){Nt&&Qt&&e.texStorage2D(n.TEXTURE_CUBE_MAP,tt,Ct,Ft.width,Ft.height);for(let j=0;j<6;j++){q=dt[j].mipmaps;for(let nt=0;nt<q.length;nt++){const Mt=q[nt];x.format!==Ye?At!==null?Nt?P&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,nt,0,0,Mt.width,Mt.height,At,Mt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,nt,Ct,Mt.width,Mt.height,0,Mt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?P&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,nt,0,0,Mt.width,Mt.height,At,ht,Mt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,nt,Ct,Mt.width,Mt.height,0,At,ht,Mt.data)}}}else{if(q=x.mipmaps,Nt&&Qt){q.length>0&&tt++;const j=Tt(dt[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,tt,Ct,j.width,j.height)}for(let j=0;j<6;j++)if(Q){Nt?P&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,dt[j].width,dt[j].height,At,ht,dt[j].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ct,dt[j].width,dt[j].height,0,At,ht,dt[j].data);for(let nt=0;nt<q.length;nt++){const zt=q[nt].image[j].image;Nt?P&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,nt+1,0,0,zt.width,zt.height,At,ht,zt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,nt+1,Ct,zt.width,zt.height,0,At,ht,zt.data)}}else{Nt?P&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,0,0,At,ht,dt[j]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0,Ct,At,ht,dt[j]);for(let nt=0;nt<q.length;nt++){const Mt=q[nt];Nt?P&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,nt+1,0,0,At,ht,Mt.image[j]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+j,nt+1,Ct,At,ht,Mt.image[j])}}}p(x)&&f(n.TEXTURE_CUBE_MAP),K.__version=Z.version,x.onUpdate&&x.onUpdate(x)}A.__version=x.version}function J(A,x,H,Y,Z,K){const yt=s.convert(H.format,H.colorSpace),it=s.convert(H.type),ct=b(H.internalFormat,yt,it,H.colorSpace);if(!i.get(x).__hasExternalTextures){const Q=Math.max(1,x.width>>K),dt=Math.max(1,x.height>>K);Z===n.TEXTURE_3D||Z===n.TEXTURE_2D_ARRAY?e.texImage3D(Z,K,ct,Q,dt,x.depth,0,yt,it,null):e.texImage2D(Z,K,ct,Q,dt,0,yt,it,null)}e.bindFramebuffer(n.FRAMEBUFFER,A),gt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,Y,Z,i.get(H).__webglTexture,0,Vt(x)):(Z===n.TEXTURE_2D||Z>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&Z<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,Y,Z,i.get(H).__webglTexture,K),e.bindFramebuffer(n.FRAMEBUFFER,null)}function ut(A,x,H){if(n.bindRenderbuffer(n.RENDERBUFFER,A),x.depthBuffer){const Y=x.depthTexture,Z=Y&&Y.isDepthTexture?Y.type:null,K=S(x.stencilBuffer,Z),yt=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,it=Vt(x);gt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,it,K,x.width,x.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,it,K,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,K,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,yt,n.RENDERBUFFER,A)}else{const Y=x.textures;for(let Z=0;Z<Y.length;Z++){const K=Y[Z],yt=s.convert(K.format,K.colorSpace),it=s.convert(K.type),ct=b(K.internalFormat,yt,it,K.colorSpace),Dt=Vt(x);H&&gt(x)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,Dt,ct,x.width,x.height):gt(x)?o.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Dt,ct,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,ct,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function at(A,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(n.FRAMEBUFFER,A),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(x.depthTexture).__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),z(x.depthTexture,0);const Y=i.get(x.depthTexture).__webglTexture,Z=Vt(x);if(x.depthTexture.format===Ni)gt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Y,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,Y,0);else if(x.depthTexture.format===Gi)gt(x)?o.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Y,0,Z):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,Y,0);else throw new Error("Unknown depthTexture format")}function xt(A){const x=i.get(A),H=A.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==A.depthTexture){const Y=A.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),Y){const Z=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,Y.removeEventListener("dispose",Z)};Y.addEventListener("dispose",Z),x.__depthDisposeCallback=Z}x.__boundDepthTexture=Y}if(A.depthTexture&&!x.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");at(x.__webglFramebuffer,A)}else if(H){x.__webglDepthbuffer=[];for(let Y=0;Y<6;Y++)if(e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[Y]),x.__webglDepthbuffer[Y]===void 0)x.__webglDepthbuffer[Y]=n.createRenderbuffer(),ut(x.__webglDepthbuffer[Y],A,!1);else{const Z=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,K=x.__webglDepthbuffer[Y];n.bindRenderbuffer(n.RENDERBUFFER,K),n.framebufferRenderbuffer(n.FRAMEBUFFER,Z,n.RENDERBUFFER,K)}}else if(e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),ut(x.__webglDepthbuffer,A,!1);else{const Y=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,Z=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,Z),n.framebufferRenderbuffer(n.FRAMEBUFFER,Y,n.RENDERBUFFER,Z)}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Et(A,x,H){const Y=i.get(A);x!==void 0&&J(Y.__webglFramebuffer,A,A.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&xt(A)}function Ut(A){const x=A.texture,H=i.get(A),Y=i.get(x);A.addEventListener("dispose",w);const Z=A.textures,K=A.isWebGLCubeRenderTarget===!0,yt=Z.length>1;if(yt||(Y.__webglTexture===void 0&&(Y.__webglTexture=n.createTexture()),Y.__version=x.version,a.memory.textures++),K){H.__webglFramebuffer=[];for(let it=0;it<6;it++)if(x.mipmaps&&x.mipmaps.length>0){H.__webglFramebuffer[it]=[];for(let ct=0;ct<x.mipmaps.length;ct++)H.__webglFramebuffer[it][ct]=n.createFramebuffer()}else H.__webglFramebuffer[it]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){H.__webglFramebuffer=[];for(let it=0;it<x.mipmaps.length;it++)H.__webglFramebuffer[it]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(yt)for(let it=0,ct=Z.length;it<ct;it++){const Dt=i.get(Z[it]);Dt.__webglTexture===void 0&&(Dt.__webglTexture=n.createTexture(),a.memory.textures++)}if(A.samples>0&&gt(A)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let it=0;it<Z.length;it++){const ct=Z[it];H.__webglColorRenderbuffer[it]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[it]);const Dt=s.convert(ct.format,ct.colorSpace),Q=s.convert(ct.type),dt=b(ct.internalFormat,Dt,Q,ct.colorSpace,A.isXRRenderTarget===!0),Ft=Vt(A);n.renderbufferStorageMultisample(n.RENDERBUFFER,Ft,dt,A.width,A.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+it,n.RENDERBUFFER,H.__webglColorRenderbuffer[it])}n.bindRenderbuffer(n.RENDERBUFFER,null),A.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),ut(H.__webglDepthRenderbuffer,A,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(K){e.bindTexture(n.TEXTURE_CUBE_MAP,Y.__webglTexture),ft(n.TEXTURE_CUBE_MAP,x);for(let it=0;it<6;it++)if(x.mipmaps&&x.mipmaps.length>0)for(let ct=0;ct<x.mipmaps.length;ct++)J(H.__webglFramebuffer[it][ct],A,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+it,ct);else J(H.__webglFramebuffer[it],A,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+it,0);p(x)&&f(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(yt){for(let it=0,ct=Z.length;it<ct;it++){const Dt=Z[it],Q=i.get(Dt);e.bindTexture(n.TEXTURE_2D,Q.__webglTexture),ft(n.TEXTURE_2D,Dt),J(H.__webglFramebuffer,A,Dt,n.COLOR_ATTACHMENT0+it,n.TEXTURE_2D,0),p(Dt)&&f(n.TEXTURE_2D)}e.unbindTexture()}else{let it=n.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(it=A.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(it,Y.__webglTexture),ft(it,x),x.mipmaps&&x.mipmaps.length>0)for(let ct=0;ct<x.mipmaps.length;ct++)J(H.__webglFramebuffer[ct],A,x,n.COLOR_ATTACHMENT0,it,ct);else J(H.__webglFramebuffer,A,x,n.COLOR_ATTACHMENT0,it,0);p(x)&&f(it),e.unbindTexture()}A.depthBuffer&&xt(A)}function Kt(A){const x=A.textures;for(let H=0,Y=x.length;H<Y;H++){const Z=x[H];if(p(Z)){const K=A.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:n.TEXTURE_2D,yt=i.get(Z).__webglTexture;e.bindTexture(K,yt),f(K),e.unbindTexture()}}}const R=[],Zt=[];function Ht(A){if(A.samples>0){if(gt(A)===!1){const x=A.textures,H=A.width,Y=A.height;let Z=n.COLOR_BUFFER_BIT;const K=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,yt=i.get(A),it=x.length>1;if(it)for(let ct=0;ct<x.length;ct++)e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ct,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ct,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let ct=0;ct<x.length;ct++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(Z|=n.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(Z|=n.STENCIL_BUFFER_BIT)),it){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,yt.__webglColorRenderbuffer[ct]);const Dt=i.get(x[ct]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Dt,0)}n.blitFramebuffer(0,0,H,Y,0,0,H,Y,Z,n.NEAREST),l===!0&&(R.length=0,Zt.length=0,R.push(n.COLOR_ATTACHMENT0+ct),A.depthBuffer&&A.resolveDepthBuffer===!1&&(R.push(K),Zt.push(K),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Zt)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,R))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),it)for(let ct=0;ct<x.length;ct++){e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+ct,n.RENDERBUFFER,yt.__webglColorRenderbuffer[ct]);const Dt=i.get(x[ct]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,yt.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+ct,n.TEXTURE_2D,Dt,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const x=A.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function Vt(A){return Math.min(r.maxSamples,A.samples)}function gt(A){const x=i.get(A);return A.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function Jt(A){const x=a.render.frame;u.get(A)!==x&&(u.set(A,x),A.update())}function bt(A,x){const H=A.colorSpace,Y=A.format,Z=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||H!==Bn&&H!==Ln&&(Yt.getTransfer(H)===$t?(Y!==Ye||Z!==mn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),x}function Tt(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=k,this.resetTextureUnits=C,this.setTexture2D=z,this.setTexture2DArray=G,this.setTexture3D=V,this.setTextureCube=$,this.rebindTextures=Et,this.setupRenderTarget=Ut,this.updateRenderTargetMipmap=Kt,this.updateMultisampleRenderTarget=Ht,this.setupDepthRenderbuffer=xt,this.setupFrameBufferTexture=J,this.useMultisampledRTT=gt}function xv(n,t){function e(i,r=Ln){let s;const a=Yt.getTransfer(r);if(i===mn)return n.UNSIGNED_BYTE;if(i===jo)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Ko)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Hu)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Bu)return n.BYTE;if(i===zu)return n.SHORT;if(i===Er)return n.UNSIGNED_SHORT;if(i===Yo)return n.INT;if(i===si)return n.UNSIGNED_INT;if(i===tn)return n.FLOAT;if(i===Dr)return n.HALF_FLOAT;if(i===Vu)return n.ALPHA;if(i===Gu)return n.RGB;if(i===Ye)return n.RGBA;if(i===Wu)return n.LUMINANCE;if(i===Xu)return n.LUMINANCE_ALPHA;if(i===Ni)return n.DEPTH_COMPONENT;if(i===Gi)return n.DEPTH_STENCIL;if(i===$o)return n.RED;if(i===Zo)return n.RED_INTEGER;if(i===qu)return n.RG;if(i===Jo)return n.RG_INTEGER;if(i===Qo)return n.RGBA_INTEGER;if(i===xs||i===ys||i===Ms||i===Ss)if(a===$t)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===xs)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ys)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Ms)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Ss)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===xs)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ys)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Ms)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Ss)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ao||i===oo||i===lo||i===co)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===ao)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===oo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===lo)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===co)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===uo||i===ho||i===fo)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(i===uo||i===ho)return a===$t?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===fo)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===po||i===mo||i===go||i===_o||i===vo||i===xo||i===yo||i===Mo||i===So||i===Eo||i===bo||i===wo||i===Ao||i===To)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(i===po)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===mo)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===go)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===_o)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===vo)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===xo)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===yo)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Mo)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===So)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Eo)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===bo)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===wo)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ao)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===To)return a===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Es||i===Co||i===Ro)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(i===Es)return a===$t?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Co)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Ro)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Yu||i===Do||i===Lo||i===Po)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(i===Es)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Do)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Lo)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Po)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Vi?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}class yv extends Fe{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class os extends ne{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Mv={type:"move"};class Ha{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new os,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new os,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new os,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const g of t.hand.values()){const p=e.getJointPose(g,i),f=this._getHandJoint(c,g);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),m=.02,_=.005;c.inputState.pinching&&d>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Mv)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const i=new os;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}}const Sv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ev=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class bv{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,i){if(this.texture===null){const r=new xe,s=t.properties.get(r);s.__webglTexture=e.texture,(e.depthNear!=i.depthNear||e.depthFar!=i.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,i=new Fn({vertexShader:Sv,fragmentShader:Ev,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ve(new Lr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class wv extends Zi{constructor(t,e){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,h=null,d=null,m=null,_=null;const g=new bv,p=e.getContextAttributes();let f=null,b=null;const S=[],E=[],D=new Ot;let w=null;const T=new Fe;T.layers.enable(1),T.viewport=new ae;const L=new Fe;L.layers.enable(2),L.viewport=new ae;const M=[T,L],v=new yv;v.layers.enable(1),v.layers.enable(2);let C=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let J=S[X];return J===void 0&&(J=new Ha,S[X]=J),J.getTargetRaySpace()},this.getControllerGrip=function(X){let J=S[X];return J===void 0&&(J=new Ha,S[X]=J),J.getGripSpace()},this.getHand=function(X){let J=S[X];return J===void 0&&(J=new Ha,S[X]=J),J.getHandSpace()};function U(X){const J=E.indexOf(X.inputSource);if(J===-1)return;const ut=S[J];ut!==void 0&&(ut.update(X.inputSource,X.frame,c||a),ut.dispatchEvent({type:X.type,data:X.inputSource}))}function z(){r.removeEventListener("select",U),r.removeEventListener("selectstart",U),r.removeEventListener("selectend",U),r.removeEventListener("squeeze",U),r.removeEventListener("squeezestart",U),r.removeEventListener("squeezeend",U),r.removeEventListener("end",z),r.removeEventListener("inputsourceschange",G);for(let X=0;X<S.length;X++){const J=E[X];J!==null&&(E[X]=null,S[X].disconnect(J))}C=null,k=null,g.reset(),t.setRenderTarget(f),m=null,d=null,h=null,r=null,b=null,Bt.stop(),i.isPresenting=!1,t.setPixelRatio(w),t.setSize(D.width,D.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(X){c=X},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return h},this.getFrame=function(){return _},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(f=t.getRenderTarget(),r.addEventListener("select",U),r.addEventListener("selectstart",U),r.addEventListener("selectend",U),r.addEventListener("squeeze",U),r.addEventListener("squeezestart",U),r.addEventListener("squeezeend",U),r.addEventListener("end",z),r.addEventListener("inputsourceschange",G),p.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(D),r.renderState.layers===void 0){const J={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,e,J),r.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),b=new ai(m.framebufferWidth,m.framebufferHeight,{format:Ye,type:mn,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil})}else{let J=null,ut=null,at=null;p.depth&&(at=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=p.stencil?Gi:Ni,ut=p.stencil?Vi:si);const xt={colorFormat:e.RGBA8,depthFormat:at,scaleFactor:s};h=new XRWebGLBinding(r,e),d=h.createProjectionLayer(xt),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),b=new ai(d.textureWidth,d.textureHeight,{format:Ye,type:mn,depthTexture:new od(d.textureWidth,d.textureHeight,ut,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),Bt.setContext(r),Bt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function G(X){for(let J=0;J<X.removed.length;J++){const ut=X.removed[J],at=E.indexOf(ut);at>=0&&(E[at]=null,S[at].disconnect(ut))}for(let J=0;J<X.added.length;J++){const ut=X.added[J];let at=E.indexOf(ut);if(at===-1){for(let Et=0;Et<S.length;Et++)if(Et>=E.length){E.push(ut),at=Et;break}else if(E[Et]===null){E[Et]=ut,at=Et;break}if(at===-1)break}const xt=S[at];xt&&xt.connect(ut)}}const V=new O,$=new O;function W(X,J,ut){V.setFromMatrixPosition(J.matrixWorld),$.setFromMatrixPosition(ut.matrixWorld);const at=V.distanceTo($),xt=J.projectionMatrix.elements,Et=ut.projectionMatrix.elements,Ut=xt[14]/(xt[10]-1),Kt=xt[14]/(xt[10]+1),R=(xt[9]+1)/xt[5],Zt=(xt[9]-1)/xt[5],Ht=(xt[8]-1)/xt[0],Vt=(Et[8]+1)/Et[0],gt=Ut*Ht,Jt=Ut*Vt,bt=at/(-Ht+Vt),Tt=bt*-Ht;if(J.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Tt),X.translateZ(bt),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),xt[10]===-1)X.projectionMatrix.copy(J.projectionMatrix),X.projectionMatrixInverse.copy(J.projectionMatrixInverse);else{const A=Ut+bt,x=Kt+bt,H=gt-Tt,Y=Jt+(at-Tt),Z=R*Kt/x*A,K=Zt*Kt/x*A;X.projectionMatrix.makePerspective(H,Y,Z,K,A,x),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function st(X,J){J===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(J.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let J=X.near,ut=X.far;g.texture!==null&&(g.depthNear>0&&(J=g.depthNear),g.depthFar>0&&(ut=g.depthFar)),v.near=L.near=T.near=J,v.far=L.far=T.far=ut,(C!==v.near||k!==v.far)&&(r.updateRenderState({depthNear:v.near,depthFar:v.far}),C=v.near,k=v.far);const at=X.parent,xt=v.cameras;st(v,at);for(let Et=0;Et<xt.length;Et++)st(xt[Et],at);xt.length===2?W(v,T,L):v.projectionMatrix.copy(T.projectionMatrix),lt(X,v,at)};function lt(X,J,ut){ut===null?X.matrix.copy(J.matrixWorld):(X.matrix.copy(ut.matrixWorld),X.matrix.invert(),X.matrix.multiply(J.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(J.projectionMatrix),X.projectionMatrixInverse.copy(J.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=br*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(d===null&&m===null))return l},this.setFoveation=function(X){l=X,d!==null&&(d.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(v)};let ft=null;function Rt(X,J){if(u=J.getViewerPose(c||a),_=J,u!==null){const ut=u.views;m!==null&&(t.setRenderTargetFramebuffer(b,m.framebuffer),t.setRenderTarget(b));let at=!1;ut.length!==v.cameras.length&&(v.cameras.length=0,at=!0);for(let Et=0;Et<ut.length;Et++){const Ut=ut[Et];let Kt=null;if(m!==null)Kt=m.getViewport(Ut);else{const Zt=h.getViewSubImage(d,Ut);Kt=Zt.viewport,Et===0&&(t.setRenderTargetTextures(b,Zt.colorTexture,d.ignoreDepthValues?void 0:Zt.depthStencilTexture),t.setRenderTarget(b))}let R=M[Et];R===void 0&&(R=new Fe,R.layers.enable(Et),R.viewport=new ae,M[Et]=R),R.matrix.fromArray(Ut.transform.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale),R.projectionMatrix.fromArray(Ut.projectionMatrix),R.projectionMatrixInverse.copy(R.projectionMatrix).invert(),R.viewport.set(Kt.x,Kt.y,Kt.width,Kt.height),Et===0&&(v.matrix.copy(R.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),at===!0&&v.cameras.push(R)}const xt=r.enabledFeatures;if(xt&&xt.includes("depth-sensing")){const Et=h.getDepthInformation(ut[0]);Et&&Et.isValid&&Et.texture&&g.init(t,Et,r.renderState)}}for(let ut=0;ut<S.length;ut++){const at=E[ut],xt=S[ut];at!==null&&xt!==void 0&&xt.update(at,J,c||a)}ft&&ft(X,J),J.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:J}),_=null}const Bt=new sd;Bt.setAnimationLoop(Rt),this.setAnimationLoop=function(X){ft=X},this.dispose=function(){}}}const jn=new Be,Av=new jt;function Tv(n,t){function e(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function i(p,f){f.color.getRGB(p.fogColor.value,nd(n)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function r(p,f,b,S,E){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(p,f):f.isMeshToonMaterial?(s(p,f),h(p,f)):f.isMeshPhongMaterial?(s(p,f),u(p,f)):f.isMeshStandardMaterial?(s(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,E)):f.isMeshMatcapMaterial?(s(p,f),_(p,f)):f.isMeshDepthMaterial?s(p,f):f.isMeshDistanceMaterial?(s(p,f),g(p,f)):f.isMeshNormalMaterial?s(p,f):f.isLineBasicMaterial?(a(p,f),f.isLineDashedMaterial&&o(p,f)):f.isPointsMaterial?l(p,f,b,S):f.isSpriteMaterial?c(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,e(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Ee&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,e(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Ee&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,e(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,e(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const b=t.get(f),S=b.envMap,E=b.envMapRotation;S&&(p.envMap.value=S,jn.copy(E),jn.x*=-1,jn.y*=-1,jn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(jn.y*=-1,jn.z*=-1),p.envMapRotation.value.setFromMatrix4(Av.makeRotationFromEuler(jn)),p.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap&&(p.lightMap.value=f.lightMap,p.lightMapIntensity.value=f.lightMapIntensity,e(f.lightMap,p.lightMapTransform)),f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,p.aoMapTransform))}function a(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform))}function o(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function l(p,f,b,S){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*b,p.scale.value=S*.5,f.map&&(p.map.value=f.map,e(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function c(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function u(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function h(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,p.roughnessMapTransform)),f.envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,b){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ee&&p.clearcoatNormalScale.value.negate())),f.dispersion>0&&(p.dispersion.value=f.dispersion),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,f){f.matcap&&(p.matcap.value=f.matcap)}function g(p,f){const b=t.get(f).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function Cv(n,t,e,i){let r={},s={},a=[];const o=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,S){const E=S.program;i.uniformBlockBinding(b,E)}function c(b,S){let E=r[b.id];E===void 0&&(_(b),E=u(b),r[b.id]=E,b.addEventListener("dispose",p));const D=S.program;i.updateUBOMapping(b,D);const w=t.render.frame;s[b.id]!==w&&(d(b),s[b.id]=w)}function u(b){const S=h();b.__bindingPointIndex=S;const E=n.createBuffer(),D=b.__size,w=b.usage;return n.bindBuffer(n.UNIFORM_BUFFER,E),n.bufferData(n.UNIFORM_BUFFER,D,w),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,S,E),E}function h(){for(let b=0;b<o;b++)if(a.indexOf(b)===-1)return a.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(b){const S=r[b.id],E=b.uniforms,D=b.__cache;n.bindBuffer(n.UNIFORM_BUFFER,S);for(let w=0,T=E.length;w<T;w++){const L=Array.isArray(E[w])?E[w]:[E[w]];for(let M=0,v=L.length;M<v;M++){const C=L[M];if(m(C,w,M,D)===!0){const k=C.__offset,U=Array.isArray(C.value)?C.value:[C.value];let z=0;for(let G=0;G<U.length;G++){const V=U[G],$=g(V);typeof V=="number"||typeof V=="boolean"?(C.__data[0]=V,n.bufferSubData(n.UNIFORM_BUFFER,k+z,C.__data)):V.isMatrix3?(C.__data[0]=V.elements[0],C.__data[1]=V.elements[1],C.__data[2]=V.elements[2],C.__data[3]=0,C.__data[4]=V.elements[3],C.__data[5]=V.elements[4],C.__data[6]=V.elements[5],C.__data[7]=0,C.__data[8]=V.elements[6],C.__data[9]=V.elements[7],C.__data[10]=V.elements[8],C.__data[11]=0):(V.toArray(C.__data,z),z+=$.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,C.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(b,S,E,D){const w=b.value,T=S+"_"+E;if(D[T]===void 0)return typeof w=="number"||typeof w=="boolean"?D[T]=w:D[T]=w.clone(),!0;{const L=D[T];if(typeof w=="number"||typeof w=="boolean"){if(L!==w)return D[T]=w,!0}else if(L.equals(w)===!1)return L.copy(w),!0}return!1}function _(b){const S=b.uniforms;let E=0;const D=16;for(let T=0,L=S.length;T<L;T++){const M=Array.isArray(S[T])?S[T]:[S[T]];for(let v=0,C=M.length;v<C;v++){const k=M[v],U=Array.isArray(k.value)?k.value:[k.value];for(let z=0,G=U.length;z<G;z++){const V=U[z],$=g(V),W=E%D,st=W%$.boundary,lt=W+st;E+=st,lt!==0&&D-lt<$.storage&&(E+=D-lt),k.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=E,E+=$.storage}}}const w=E%D;return w>0&&(E+=D-w),b.__size=E,b.__cache={},this}function g(b){const S={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(S.boundary=4,S.storage=4):b.isVector2?(S.boundary=8,S.storage=8):b.isVector3||b.isColor?(S.boundary=16,S.storage=12):b.isVector4?(S.boundary=16,S.storage=16):b.isMatrix3?(S.boundary=48,S.storage=48):b.isMatrix4?(S.boundary=64,S.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),S}function p(b){const S=b.target;S.removeEventListener("dispose",p);const E=a.indexOf(S.__bindingPointIndex);a.splice(E,1),n.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function f(){for(const b in r)n.deleteBuffer(r[b]);a=[],r={},s={}}return{bind:l,update:c,dispose:f}}class Rv{constructor(t={}){const{canvas:e=xf(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=t;this.isWebGLRenderer=!0;let d;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=i.getContextAttributes().alpha}else d=a;const m=new Uint32Array(4),_=new Int32Array(4);let g=null,p=null;const f=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ze,this.toneMapping=In,this.toneMappingExposure=1;const S=this;let E=!1,D=0,w=0,T=null,L=-1,M=null;const v=new ae,C=new ae;let k=null;const U=new kt(0);let z=0,G=e.width,V=e.height,$=1,W=null,st=null;const lt=new ae(0,0,G,V),ft=new ae(0,0,G,V);let Rt=!1;const Bt=new sl;let X=!1,J=!1;const ut=new jt,at=new O,xt=new ae,Et={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ut=!1;function Kt(){return T===null?$:1}let R=i;function Zt(y,I){return e.getContext(y,I)}try{const y={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${qo}`),e.addEventListener("webglcontextlost",q,!1),e.addEventListener("webglcontextrestored",j,!1),e.addEventListener("webglcontextcreationerror",nt,!1),R===null){const I="webgl2";if(R=Zt(I,y),R===null)throw Zt(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(y){throw console.error("THREE.WebGLRenderer: "+y.message),y}let Ht,Vt,gt,Jt,bt,Tt,A,x,H,Y,Z,K,yt,it,ct,Dt,Q,dt,Ft,At,ht,Ct,Nt,Qt;function P(){Ht=new Ng(R),Ht.init(),Ct=new xv(R,Ht),Vt=new Rg(R,Ht,t,Ct),gt=new gv(R),Jt=new kg(R),bt=new nv,Tt=new vv(R,Ht,gt,bt,Vt,Ct,Jt),A=new Lg(S),x=new Ug(S),H=new Xf(R),Nt=new Tg(R,H),Y=new Og(R,H,Jt,Nt),Z=new zg(R,Y,H,Jt),Ft=new Bg(R,Vt,Tt),Dt=new Dg(bt),K=new ev(S,A,x,Ht,Vt,Nt,Dt),yt=new Tv(S,bt),it=new rv,ct=new uv(Ht),dt=new Ag(S,A,x,gt,Z,d,l),Q=new mv(S,Z,Vt),Qt=new Cv(R,Jt,Vt,gt),At=new Cg(R,Ht,Jt),ht=new Fg(R,Ht,Jt),Jt.programs=K.programs,S.capabilities=Vt,S.extensions=Ht,S.properties=bt,S.renderLists=it,S.shadowMap=Q,S.state=gt,S.info=Jt}P();const tt=new wv(S,R);this.xr=tt,this.getContext=function(){return R},this.getContextAttributes=function(){return R.getContextAttributes()},this.forceContextLoss=function(){const y=Ht.get("WEBGL_lose_context");y&&y.loseContext()},this.forceContextRestore=function(){const y=Ht.get("WEBGL_lose_context");y&&y.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(y){y!==void 0&&($=y,this.setSize(G,V,!1))},this.getSize=function(y){return y.set(G,V)},this.setSize=function(y,I,F=!0){if(tt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}G=y,V=I,e.width=Math.floor(y*$),e.height=Math.floor(I*$),F===!0&&(e.style.width=y+"px",e.style.height=I+"px"),this.setViewport(0,0,y,I)},this.getDrawingBufferSize=function(y){return y.set(G*$,V*$).floor()},this.setDrawingBufferSize=function(y,I,F){G=y,V=I,$=F,e.width=Math.floor(y*F),e.height=Math.floor(I*F),this.setViewport(0,0,y,I)},this.getCurrentViewport=function(y){return y.copy(v)},this.getViewport=function(y){return y.copy(lt)},this.setViewport=function(y,I,F,B){y.isVector4?lt.set(y.x,y.y,y.z,y.w):lt.set(y,I,F,B),gt.viewport(v.copy(lt).multiplyScalar($).round())},this.getScissor=function(y){return y.copy(ft)},this.setScissor=function(y,I,F,B){y.isVector4?ft.set(y.x,y.y,y.z,y.w):ft.set(y,I,F,B),gt.scissor(C.copy(ft).multiplyScalar($).round())},this.getScissorTest=function(){return Rt},this.setScissorTest=function(y){gt.setScissorTest(Rt=y)},this.setOpaqueSort=function(y){W=y},this.setTransparentSort=function(y){st=y},this.getClearColor=function(y){return y.copy(dt.getClearColor())},this.setClearColor=function(){dt.setClearColor.apply(dt,arguments)},this.getClearAlpha=function(){return dt.getClearAlpha()},this.setClearAlpha=function(){dt.setClearAlpha.apply(dt,arguments)},this.clear=function(y=!0,I=!0,F=!0){let B=0;if(y){let N=!1;if(T!==null){const et=T.texture.format;N=et===Qo||et===Jo||et===Zo}if(N){const et=T.texture.type,ot=et===mn||et===si||et===Er||et===Vi||et===jo||et===Ko,pt=dt.getClearColor(),mt=dt.getClearAlpha(),St=pt.r,wt=pt.g,_t=pt.b;ot?(m[0]=St,m[1]=wt,m[2]=_t,m[3]=mt,R.clearBufferuiv(R.COLOR,0,m)):(_[0]=St,_[1]=wt,_[2]=_t,_[3]=mt,R.clearBufferiv(R.COLOR,0,_))}else B|=R.COLOR_BUFFER_BIT}I&&(B|=R.DEPTH_BUFFER_BIT),F&&(B|=R.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),R.clear(B)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",q,!1),e.removeEventListener("webglcontextrestored",j,!1),e.removeEventListener("webglcontextcreationerror",nt,!1),it.dispose(),ct.dispose(),bt.dispose(),A.dispose(),x.dispose(),Z.dispose(),Nt.dispose(),Qt.dispose(),K.dispose(),tt.dispose(),tt.removeEventListener("sessionstart",$e),tt.removeEventListener("sessionend",Hl),Vn.stop()};function q(y){y.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function j(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const y=Jt.autoReset,I=Q.enabled,F=Q.autoUpdate,B=Q.needsUpdate,N=Q.type;P(),Jt.autoReset=y,Q.enabled=I,Q.autoUpdate=F,Q.needsUpdate=B,Q.type=N}function nt(y){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",y.statusMessage)}function Mt(y){const I=y.target;I.removeEventListener("dispose",Mt),zt(I)}function zt(y){ie(y),bt.remove(y)}function ie(y){const I=bt.get(y).programs;I!==void 0&&(I.forEach(function(F){K.releaseProgram(F)}),y.isShaderMaterial&&K.releaseShaderCache(y))}this.renderBufferDirect=function(y,I,F,B,N,et){I===null&&(I=Et);const ot=N.isMesh&&N.matrixWorld.determinant()<0,pt=ih(y,I,F,B,N);gt.setMaterial(B,ot);let mt=F.index,St=1;if(B.wireframe===!0){if(mt=Y.getWireframeAttribute(F),mt===void 0)return;St=2}const wt=F.drawRange,_t=F.attributes.position;let Wt=wt.start*St,te=(wt.start+wt.count)*St;et!==null&&(Wt=Math.max(Wt,et.start*St),te=Math.min(te,(et.start+et.count)*St)),mt!==null?(Wt=Math.max(Wt,0),te=Math.min(te,mt.count)):_t!=null&&(Wt=Math.max(Wt,0),te=Math.min(te,_t.count));const ee=te-Wt;if(ee<0||ee===1/0)return;Nt.setup(N,B,pt,F,mt);let Ae,Xt=At;if(mt!==null&&(Ae=H.get(mt),Xt=ht,Xt.setIndex(Ae)),N.isMesh)B.wireframe===!0?(gt.setLineWidth(B.wireframeLinewidth*Kt()),Xt.setMode(R.LINES)):Xt.setMode(R.TRIANGLES);else if(N.isLine){let vt=B.linewidth;vt===void 0&&(vt=1),gt.setLineWidth(vt*Kt()),N.isLineSegments?Xt.setMode(R.LINES):N.isLineLoop?Xt.setMode(R.LINE_LOOP):Xt.setMode(R.LINE_STRIP)}else N.isPoints?Xt.setMode(R.POINTS):N.isSprite&&Xt.setMode(R.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)Xt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ht.get("WEBGL_multi_draw"))Xt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{const vt=N._multiDrawStarts,de=N._multiDrawCounts,qt=N._multiDrawCount,Ve=mt?H.get(mt).bytesPerElement:1,fi=bt.get(B).currentProgram.getUniforms();for(let Te=0;Te<qt;Te++)fi.setValue(R,"_gl_DrawID",Te),Xt.render(vt[Te]/Ve,de[Te])}else if(N.isInstancedMesh)Xt.renderInstances(Wt,ee,N.count);else if(F.isInstancedBufferGeometry){const vt=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,de=Math.min(F.instanceCount,vt);Xt.renderInstances(Wt,ee,de)}else Xt.render(Wt,ee)};function ue(y,I,F){y.transparent===!0&&y.side===fn&&y.forceSinglePass===!1?(y.side=Ee,y.needsUpdate=!0,kr(y,I,F),y.side=On,y.needsUpdate=!0,kr(y,I,F),y.side=fn):kr(y,I,F)}this.compile=function(y,I,F=null){F===null&&(F=y),p=ct.get(F),p.init(I),b.push(p),F.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),y!==F&&y.traverseVisible(function(N){N.isLight&&N.layers.test(I.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();const B=new Set;return y.traverse(function(N){const et=N.material;if(et)if(Array.isArray(et))for(let ot=0;ot<et.length;ot++){const pt=et[ot];ue(pt,F,N),B.add(pt)}else ue(et,F,N),B.add(et)}),b.pop(),p=null,B},this.compileAsync=function(y,I,F=null){const B=this.compile(y,I,F);return new Promise(N=>{function et(){if(B.forEach(function(ot){bt.get(ot).currentProgram.isReady()&&B.delete(ot)}),B.size===0){N(y);return}setTimeout(et,10)}Ht.get("KHR_parallel_shader_compile")!==null?et():setTimeout(et,10)})};let Gt=null;function sn(y){Gt&&Gt(y)}function $e(){Vn.stop()}function Hl(){Vn.start()}const Vn=new sd;Vn.setAnimationLoop(sn),typeof self<"u"&&Vn.setContext(self),this.setAnimationLoop=function(y){Gt=y,tt.setAnimationLoop(y),y===null?Vn.stop():Vn.start()},tt.addEventListener("sessionstart",$e),tt.addEventListener("sessionend",Hl),this.render=function(y,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),tt.enabled===!0&&tt.isPresenting===!0&&(tt.cameraAutoUpdate===!0&&tt.updateCamera(I),I=tt.getCamera()),y.isScene===!0&&y.onBeforeRender(S,y,I,T),p=ct.get(y,b.length),p.init(I),b.push(p),ut.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),Bt.setFromProjectionMatrix(ut),J=this.localClippingEnabled,X=Dt.init(this.clippingPlanes,J),g=it.get(y,f.length),g.init(),f.push(g),tt.enabled===!0&&tt.isPresenting===!0){const et=S.xr.getDepthSensingMesh();et!==null&&ha(et,I,-1/0,S.sortObjects)}ha(y,I,0,S.sortObjects),g.finish(),S.sortObjects===!0&&g.sort(W,st),Ut=tt.enabled===!1||tt.isPresenting===!1||tt.hasDepthSensing()===!1,Ut&&dt.addToRenderList(g,y),this.info.render.frame++,X===!0&&Dt.beginShadows();const F=p.state.shadowsArray;Q.render(F,y,I),X===!0&&Dt.endShadows(),this.info.autoReset===!0&&this.info.reset();const B=g.opaque,N=g.transmissive;if(p.setupLights(),I.isArrayCamera){const et=I.cameras;if(N.length>0)for(let ot=0,pt=et.length;ot<pt;ot++){const mt=et[ot];Gl(B,N,y,mt)}Ut&&dt.render(y);for(let ot=0,pt=et.length;ot<pt;ot++){const mt=et[ot];Vl(g,y,mt,mt.viewport)}}else N.length>0&&Gl(B,N,y,I),Ut&&dt.render(y),Vl(g,y,I);T!==null&&(Tt.updateMultisampleRenderTarget(T),Tt.updateRenderTargetMipmap(T)),y.isScene===!0&&y.onAfterRender(S,y,I),Nt.resetDefaultState(),L=-1,M=null,b.pop(),b.length>0?(p=b[b.length-1],X===!0&&Dt.setGlobalState(S.clippingPlanes,p.state.camera)):p=null,f.pop(),f.length>0?g=f[f.length-1]:g=null};function ha(y,I,F,B){if(y.visible===!1)return;if(y.layers.test(I.layers)){if(y.isGroup)F=y.renderOrder;else if(y.isLOD)y.autoUpdate===!0&&y.update(I);else if(y.isLight)p.pushLight(y),y.castShadow&&p.pushShadow(y);else if(y.isSprite){if(!y.frustumCulled||Bt.intersectsSprite(y)){B&&xt.setFromMatrixPosition(y.matrixWorld).applyMatrix4(ut);const ot=Z.update(y),pt=y.material;pt.visible&&g.push(y,ot,pt,F,xt.z,null)}}else if((y.isMesh||y.isLine||y.isPoints)&&(!y.frustumCulled||Bt.intersectsObject(y))){const ot=Z.update(y),pt=y.material;if(B&&(y.boundingSphere!==void 0?(y.boundingSphere===null&&y.computeBoundingSphere(),xt.copy(y.boundingSphere.center)):(ot.boundingSphere===null&&ot.computeBoundingSphere(),xt.copy(ot.boundingSphere.center)),xt.applyMatrix4(y.matrixWorld).applyMatrix4(ut)),Array.isArray(pt)){const mt=ot.groups;for(let St=0,wt=mt.length;St<wt;St++){const _t=mt[St],Wt=pt[_t.materialIndex];Wt&&Wt.visible&&g.push(y,ot,Wt,F,xt.z,_t)}}else pt.visible&&g.push(y,ot,pt,F,xt.z,null)}}const et=y.children;for(let ot=0,pt=et.length;ot<pt;ot++)ha(et[ot],I,F,B)}function Vl(y,I,F,B){const N=y.opaque,et=y.transmissive,ot=y.transparent;p.setupLightsView(F),X===!0&&Dt.setGlobalState(S.clippingPlanes,F),B&&gt.viewport(v.copy(B)),N.length>0&&Fr(N,I,F),et.length>0&&Fr(et,I,F),ot.length>0&&Fr(ot,I,F),gt.buffers.depth.setTest(!0),gt.buffers.depth.setMask(!0),gt.buffers.color.setMask(!0),gt.setPolygonOffset(!1)}function Gl(y,I,F,B){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[B.id]===void 0&&(p.state.transmissionRenderTarget[B.id]=new ai(1,1,{generateMipmaps:!0,type:Ht.has("EXT_color_buffer_half_float")||Ht.has("EXT_color_buffer_float")?Dr:mn,minFilter:ii,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Yt.workingColorSpace}));const et=p.state.transmissionRenderTarget[B.id],ot=B.viewport||v;et.setSize(ot.z,ot.w);const pt=S.getRenderTarget();S.setRenderTarget(et),S.getClearColor(U),z=S.getClearAlpha(),z<1&&S.setClearColor(16777215,.5),S.clear(),Ut&&dt.render(F);const mt=S.toneMapping;S.toneMapping=In;const St=B.viewport;if(B.viewport!==void 0&&(B.viewport=void 0),p.setupLightsView(B),X===!0&&Dt.setGlobalState(S.clippingPlanes,B),Fr(y,F,B),Tt.updateMultisampleRenderTarget(et),Tt.updateRenderTargetMipmap(et),Ht.has("WEBGL_multisampled_render_to_texture")===!1){let wt=!1;for(let _t=0,Wt=I.length;_t<Wt;_t++){const te=I[_t],ee=te.object,Ae=te.geometry,Xt=te.material,vt=te.group;if(Xt.side===fn&&ee.layers.test(B.layers)){const de=Xt.side;Xt.side=Ee,Xt.needsUpdate=!0,Wl(ee,F,B,Ae,Xt,vt),Xt.side=de,Xt.needsUpdate=!0,wt=!0}}wt===!0&&(Tt.updateMultisampleRenderTarget(et),Tt.updateRenderTargetMipmap(et))}S.setRenderTarget(pt),S.setClearColor(U,z),St!==void 0&&(B.viewport=St),S.toneMapping=mt}function Fr(y,I,F){const B=I.isScene===!0?I.overrideMaterial:null;for(let N=0,et=y.length;N<et;N++){const ot=y[N],pt=ot.object,mt=ot.geometry,St=B===null?ot.material:B,wt=ot.group;pt.layers.test(F.layers)&&Wl(pt,I,F,mt,St,wt)}}function Wl(y,I,F,B,N,et){y.onBeforeRender(S,I,F,B,N,et),y.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,y.matrixWorld),y.normalMatrix.getNormalMatrix(y.modelViewMatrix),N.onBeforeRender(S,I,F,B,y,et),N.transparent===!0&&N.side===fn&&N.forceSinglePass===!1?(N.side=Ee,N.needsUpdate=!0,S.renderBufferDirect(F,I,B,N,y,et),N.side=On,N.needsUpdate=!0,S.renderBufferDirect(F,I,B,N,y,et),N.side=fn):S.renderBufferDirect(F,I,B,N,y,et),y.onAfterRender(S,I,F,B,N,et)}function kr(y,I,F){I.isScene!==!0&&(I=Et);const B=bt.get(y),N=p.state.lights,et=p.state.shadowsArray,ot=N.state.version,pt=K.getParameters(y,N.state,et,I,F),mt=K.getProgramCacheKey(pt);let St=B.programs;B.environment=y.isMeshStandardMaterial?I.environment:null,B.fog=I.fog,B.envMap=(y.isMeshStandardMaterial?x:A).get(y.envMap||B.environment),B.envMapRotation=B.environment!==null&&y.envMap===null?I.environmentRotation:y.envMapRotation,St===void 0&&(y.addEventListener("dispose",Mt),St=new Map,B.programs=St);let wt=St.get(mt);if(wt!==void 0){if(B.currentProgram===wt&&B.lightsStateVersion===ot)return ql(y,pt),wt}else pt.uniforms=K.getUniforms(y),y.onBeforeCompile(pt,S),wt=K.acquireProgram(pt,mt),St.set(mt,wt),B.uniforms=pt.uniforms;const _t=B.uniforms;return(!y.isShaderMaterial&&!y.isRawShaderMaterial||y.clipping===!0)&&(_t.clippingPlanes=Dt.uniform),ql(y,pt),B.needsLights=sh(y),B.lightsStateVersion=ot,B.needsLights&&(_t.ambientLightColor.value=N.state.ambient,_t.lightProbe.value=N.state.probe,_t.directionalLights.value=N.state.directional,_t.directionalLightShadows.value=N.state.directionalShadow,_t.spotLights.value=N.state.spot,_t.spotLightShadows.value=N.state.spotShadow,_t.rectAreaLights.value=N.state.rectArea,_t.ltc_1.value=N.state.rectAreaLTC1,_t.ltc_2.value=N.state.rectAreaLTC2,_t.pointLights.value=N.state.point,_t.pointLightShadows.value=N.state.pointShadow,_t.hemisphereLights.value=N.state.hemi,_t.directionalShadowMap.value=N.state.directionalShadowMap,_t.directionalShadowMatrix.value=N.state.directionalShadowMatrix,_t.spotShadowMap.value=N.state.spotShadowMap,_t.spotLightMatrix.value=N.state.spotLightMatrix,_t.spotLightMap.value=N.state.spotLightMap,_t.pointShadowMap.value=N.state.pointShadowMap,_t.pointShadowMatrix.value=N.state.pointShadowMatrix),B.currentProgram=wt,B.uniformsList=null,wt}function Xl(y){if(y.uniformsList===null){const I=y.currentProgram.getUniforms();y.uniformsList=bs.seqWithValue(I.seq,y.uniforms)}return y.uniformsList}function ql(y,I){const F=bt.get(y);F.outputColorSpace=I.outputColorSpace,F.batching=I.batching,F.batchingColor=I.batchingColor,F.instancing=I.instancing,F.instancingColor=I.instancingColor,F.instancingMorph=I.instancingMorph,F.skinning=I.skinning,F.morphTargets=I.morphTargets,F.morphNormals=I.morphNormals,F.morphColors=I.morphColors,F.morphTargetsCount=I.morphTargetsCount,F.numClippingPlanes=I.numClippingPlanes,F.numIntersection=I.numClipIntersection,F.vertexAlphas=I.vertexAlphas,F.vertexTangents=I.vertexTangents,F.toneMapping=I.toneMapping}function ih(y,I,F,B,N){I.isScene!==!0&&(I=Et),Tt.resetTextureUnits();const et=I.fog,ot=B.isMeshStandardMaterial?I.environment:null,pt=T===null?S.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Bn,mt=(B.isMeshStandardMaterial?x:A).get(B.envMap||ot),St=B.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,wt=!!F.attributes.tangent&&(!!B.normalMap||B.anisotropy>0),_t=!!F.morphAttributes.position,Wt=!!F.morphAttributes.normal,te=!!F.morphAttributes.color;let ee=In;B.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(ee=S.toneMapping);const Ae=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,Xt=Ae!==void 0?Ae.length:0,vt=bt.get(B),de=p.state.lights;if(X===!0&&(J===!0||y!==M)){const Ue=y===M&&B.id===L;Dt.setState(B,y,Ue)}let qt=!1;B.version===vt.__version?(vt.needsLights&&vt.lightsStateVersion!==de.state.version||vt.outputColorSpace!==pt||N.isBatchedMesh&&vt.batching===!1||!N.isBatchedMesh&&vt.batching===!0||N.isBatchedMesh&&vt.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&vt.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&vt.instancing===!1||!N.isInstancedMesh&&vt.instancing===!0||N.isSkinnedMesh&&vt.skinning===!1||!N.isSkinnedMesh&&vt.skinning===!0||N.isInstancedMesh&&vt.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&vt.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&vt.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&vt.instancingMorph===!1&&N.morphTexture!==null||vt.envMap!==mt||B.fog===!0&&vt.fog!==et||vt.numClippingPlanes!==void 0&&(vt.numClippingPlanes!==Dt.numPlanes||vt.numIntersection!==Dt.numIntersection)||vt.vertexAlphas!==St||vt.vertexTangents!==wt||vt.morphTargets!==_t||vt.morphNormals!==Wt||vt.morphColors!==te||vt.toneMapping!==ee||vt.morphTargetsCount!==Xt)&&(qt=!0):(qt=!0,vt.__version=B.version);let Ve=vt.currentProgram;qt===!0&&(Ve=kr(B,I,N));let fi=!1,Te=!1,fa=!1;const re=Ve.getUniforms(),yn=vt.uniforms;if(gt.useProgram(Ve.program)&&(fi=!0,Te=!0,fa=!0),B.id!==L&&(L=B.id,Te=!0),fi||M!==y){re.setValue(R,"projectionMatrix",y.projectionMatrix),re.setValue(R,"viewMatrix",y.matrixWorldInverse);const Ue=re.map.cameraPosition;Ue!==void 0&&Ue.setValue(R,at.setFromMatrixPosition(y.matrixWorld)),Vt.logarithmicDepthBuffer&&re.setValue(R,"logDepthBufFC",2/(Math.log(y.far+1)/Math.LN2)),(B.isMeshPhongMaterial||B.isMeshToonMaterial||B.isMeshLambertMaterial||B.isMeshBasicMaterial||B.isMeshStandardMaterial||B.isShaderMaterial)&&re.setValue(R,"isOrthographic",y.isOrthographicCamera===!0),M!==y&&(M=y,Te=!0,fa=!0)}if(N.isSkinnedMesh){re.setOptional(R,N,"bindMatrix"),re.setOptional(R,N,"bindMatrixInverse");const Ue=N.skeleton;Ue&&(Ue.boneTexture===null&&Ue.computeBoneTexture(),re.setValue(R,"boneTexture",Ue.boneTexture,Tt))}N.isBatchedMesh&&(re.setOptional(R,N,"batchingTexture"),re.setValue(R,"batchingTexture",N._matricesTexture,Tt),re.setOptional(R,N,"batchingIdTexture"),re.setValue(R,"batchingIdTexture",N._indirectTexture,Tt),re.setOptional(R,N,"batchingColorTexture"),N._colorsTexture!==null&&re.setValue(R,"batchingColorTexture",N._colorsTexture,Tt));const pa=F.morphAttributes;if((pa.position!==void 0||pa.normal!==void 0||pa.color!==void 0)&&Ft.update(N,F,Ve),(Te||vt.receiveShadow!==N.receiveShadow)&&(vt.receiveShadow=N.receiveShadow,re.setValue(R,"receiveShadow",N.receiveShadow)),B.isMeshGouraudMaterial&&B.envMap!==null&&(yn.envMap.value=mt,yn.flipEnvMap.value=mt.isCubeTexture&&mt.isRenderTargetTexture===!1?-1:1),B.isMeshStandardMaterial&&B.envMap===null&&I.environment!==null&&(yn.envMapIntensity.value=I.environmentIntensity),Te&&(re.setValue(R,"toneMappingExposure",S.toneMappingExposure),vt.needsLights&&rh(yn,fa),et&&B.fog===!0&&yt.refreshFogUniforms(yn,et),yt.refreshMaterialUniforms(yn,B,$,V,p.state.transmissionRenderTarget[y.id]),bs.upload(R,Xl(vt),yn,Tt)),B.isShaderMaterial&&B.uniformsNeedUpdate===!0&&(bs.upload(R,Xl(vt),yn,Tt),B.uniformsNeedUpdate=!1),B.isSpriteMaterial&&re.setValue(R,"center",N.center),re.setValue(R,"modelViewMatrix",N.modelViewMatrix),re.setValue(R,"normalMatrix",N.normalMatrix),re.setValue(R,"modelMatrix",N.matrixWorld),B.isShaderMaterial||B.isRawShaderMaterial){const Ue=B.uniformsGroups;for(let ma=0,ah=Ue.length;ma<ah;ma++){const Yl=Ue[ma];Qt.update(Yl,Ve),Qt.bind(Yl,Ve)}}return Ve}function rh(y,I){y.ambientLightColor.needsUpdate=I,y.lightProbe.needsUpdate=I,y.directionalLights.needsUpdate=I,y.directionalLightShadows.needsUpdate=I,y.pointLights.needsUpdate=I,y.pointLightShadows.needsUpdate=I,y.spotLights.needsUpdate=I,y.spotLightShadows.needsUpdate=I,y.rectAreaLights.needsUpdate=I,y.hemisphereLights.needsUpdate=I}function sh(y){return y.isMeshLambertMaterial||y.isMeshToonMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isShadowMaterial||y.isShaderMaterial&&y.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(y,I,F){bt.get(y.texture).__webglTexture=I,bt.get(y.depthTexture).__webglTexture=F;const B=bt.get(y);B.__hasExternalTextures=!0,B.__autoAllocateDepthBuffer=F===void 0,B.__autoAllocateDepthBuffer||Ht.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),B.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(y,I){const F=bt.get(y);F.__webglFramebuffer=I,F.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(y,I=0,F=0){T=y,D=I,w=F;let B=!0,N=null,et=!1,ot=!1;if(y){const mt=bt.get(y);if(mt.__useDefaultFramebuffer!==void 0)gt.bindFramebuffer(R.FRAMEBUFFER,null),B=!1;else if(mt.__webglFramebuffer===void 0)Tt.setupRenderTarget(y);else if(mt.__hasExternalTextures)Tt.rebindTextures(y,bt.get(y.texture).__webglTexture,bt.get(y.depthTexture).__webglTexture);else if(y.depthBuffer){const _t=y.depthTexture;if(mt.__boundDepthTexture!==_t){if(_t!==null&&bt.has(_t)&&(y.width!==_t.image.width||y.height!==_t.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Tt.setupDepthRenderbuffer(y)}}const St=y.texture;(St.isData3DTexture||St.isDataArrayTexture||St.isCompressedArrayTexture)&&(ot=!0);const wt=bt.get(y).__webglFramebuffer;y.isWebGLCubeRenderTarget?(Array.isArray(wt[I])?N=wt[I][F]:N=wt[I],et=!0):y.samples>0&&Tt.useMultisampledRTT(y)===!1?N=bt.get(y).__webglMultisampledFramebuffer:Array.isArray(wt)?N=wt[F]:N=wt,v.copy(y.viewport),C.copy(y.scissor),k=y.scissorTest}else v.copy(lt).multiplyScalar($).floor(),C.copy(ft).multiplyScalar($).floor(),k=Rt;if(gt.bindFramebuffer(R.FRAMEBUFFER,N)&&B&&gt.drawBuffers(y,N),gt.viewport(v),gt.scissor(C),gt.setScissorTest(k),et){const mt=bt.get(y.texture);R.framebufferTexture2D(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,R.TEXTURE_CUBE_MAP_POSITIVE_X+I,mt.__webglTexture,F)}else if(ot){const mt=bt.get(y.texture),St=I||0;R.framebufferTextureLayer(R.FRAMEBUFFER,R.COLOR_ATTACHMENT0,mt.__webglTexture,F||0,St)}L=-1},this.readRenderTargetPixels=function(y,I,F,B,N,et,ot){if(!(y&&y.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let pt=bt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ot!==void 0&&(pt=pt[ot]),pt){gt.bindFramebuffer(R.FRAMEBUFFER,pt);try{const mt=y.texture,St=mt.format,wt=mt.type;if(!Vt.textureFormatReadable(St)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Vt.textureTypeReadable(wt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=y.width-B&&F>=0&&F<=y.height-N&&R.readPixels(I,F,B,N,Ct.convert(St),Ct.convert(wt),et)}finally{const mt=T!==null?bt.get(T).__webglFramebuffer:null;gt.bindFramebuffer(R.FRAMEBUFFER,mt)}}},this.readRenderTargetPixelsAsync=async function(y,I,F,B,N,et,ot){if(!(y&&y.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pt=bt.get(y).__webglFramebuffer;if(y.isWebGLCubeRenderTarget&&ot!==void 0&&(pt=pt[ot]),pt){gt.bindFramebuffer(R.FRAMEBUFFER,pt);try{const mt=y.texture,St=mt.format,wt=mt.type;if(!Vt.textureFormatReadable(St))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Vt.textureTypeReadable(wt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=y.width-B&&F>=0&&F<=y.height-N){const _t=R.createBuffer();R.bindBuffer(R.PIXEL_PACK_BUFFER,_t),R.bufferData(R.PIXEL_PACK_BUFFER,et.byteLength,R.STREAM_READ),R.readPixels(I,F,B,N,Ct.convert(St),Ct.convert(wt),0),R.flush();const Wt=R.fenceSync(R.SYNC_GPU_COMMANDS_COMPLETE,0);await yf(R,Wt,4);try{R.bindBuffer(R.PIXEL_PACK_BUFFER,_t),R.getBufferSubData(R.PIXEL_PACK_BUFFER,0,et)}finally{R.deleteBuffer(_t),R.deleteSync(Wt)}return et}}finally{const mt=T!==null?bt.get(T).__webglFramebuffer:null;gt.bindFramebuffer(R.FRAMEBUFFER,mt)}}},this.copyFramebufferToTexture=function(y,I=null,F=0){y.isTexture!==!0&&(_r("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,y=arguments[1]);const B=Math.pow(2,-F),N=Math.floor(y.image.width*B),et=Math.floor(y.image.height*B),ot=I!==null?I.x:0,pt=I!==null?I.y:0;Tt.setTexture2D(y,0),R.copyTexSubImage2D(R.TEXTURE_2D,F,0,0,ot,pt,N,et),gt.unbindTexture()},this.copyTextureToTexture=function(y,I,F=null,B=null,N=0){y.isTexture!==!0&&(_r("WebGLRenderer: copyTextureToTexture function signature has changed."),B=arguments[0]||null,y=arguments[1],I=arguments[2],N=arguments[3]||0,F=null);let et,ot,pt,mt,St,wt;F!==null?(et=F.max.x-F.min.x,ot=F.max.y-F.min.y,pt=F.min.x,mt=F.min.y):(et=y.image.width,ot=y.image.height,pt=0,mt=0),B!==null?(St=B.x,wt=B.y):(St=0,wt=0);const _t=Ct.convert(I.format),Wt=Ct.convert(I.type);Tt.setTexture2D(I,0),R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,I.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,I.unpackAlignment);const te=R.getParameter(R.UNPACK_ROW_LENGTH),ee=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Ae=R.getParameter(R.UNPACK_SKIP_PIXELS),Xt=R.getParameter(R.UNPACK_SKIP_ROWS),vt=R.getParameter(R.UNPACK_SKIP_IMAGES),de=y.isCompressedTexture?y.mipmaps[N]:y.image;R.pixelStorei(R.UNPACK_ROW_LENGTH,de.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,de.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,pt),R.pixelStorei(R.UNPACK_SKIP_ROWS,mt),y.isDataTexture?R.texSubImage2D(R.TEXTURE_2D,N,St,wt,et,ot,_t,Wt,de.data):y.isCompressedTexture?R.compressedTexSubImage2D(R.TEXTURE_2D,N,St,wt,de.width,de.height,_t,de.data):R.texSubImage2D(R.TEXTURE_2D,N,St,wt,et,ot,_t,Wt,de),R.pixelStorei(R.UNPACK_ROW_LENGTH,te),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ee),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ae),R.pixelStorei(R.UNPACK_SKIP_ROWS,Xt),R.pixelStorei(R.UNPACK_SKIP_IMAGES,vt),N===0&&I.generateMipmaps&&R.generateMipmap(R.TEXTURE_2D),gt.unbindTexture()},this.copyTextureToTexture3D=function(y,I,F=null,B=null,N=0){y.isTexture!==!0&&(_r("WebGLRenderer: copyTextureToTexture3D function signature has changed."),F=arguments[0]||null,B=arguments[1]||null,y=arguments[2],I=arguments[3],N=arguments[4]||0);let et,ot,pt,mt,St,wt,_t,Wt,te;const ee=y.isCompressedTexture?y.mipmaps[N]:y.image;F!==null?(et=F.max.x-F.min.x,ot=F.max.y-F.min.y,pt=F.max.z-F.min.z,mt=F.min.x,St=F.min.y,wt=F.min.z):(et=ee.width,ot=ee.height,pt=ee.depth,mt=0,St=0,wt=0),B!==null?(_t=B.x,Wt=B.y,te=B.z):(_t=0,Wt=0,te=0);const Ae=Ct.convert(I.format),Xt=Ct.convert(I.type);let vt;if(I.isData3DTexture)Tt.setTexture3D(I,0),vt=R.TEXTURE_3D;else if(I.isDataArrayTexture||I.isCompressedArrayTexture)Tt.setTexture2DArray(I,0),vt=R.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}R.pixelStorei(R.UNPACK_FLIP_Y_WEBGL,I.flipY),R.pixelStorei(R.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),R.pixelStorei(R.UNPACK_ALIGNMENT,I.unpackAlignment);const de=R.getParameter(R.UNPACK_ROW_LENGTH),qt=R.getParameter(R.UNPACK_IMAGE_HEIGHT),Ve=R.getParameter(R.UNPACK_SKIP_PIXELS),fi=R.getParameter(R.UNPACK_SKIP_ROWS),Te=R.getParameter(R.UNPACK_SKIP_IMAGES);R.pixelStorei(R.UNPACK_ROW_LENGTH,ee.width),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,ee.height),R.pixelStorei(R.UNPACK_SKIP_PIXELS,mt),R.pixelStorei(R.UNPACK_SKIP_ROWS,St),R.pixelStorei(R.UNPACK_SKIP_IMAGES,wt),y.isDataTexture||y.isData3DTexture?R.texSubImage3D(vt,N,_t,Wt,te,et,ot,pt,Ae,Xt,ee.data):I.isCompressedArrayTexture?R.compressedTexSubImage3D(vt,N,_t,Wt,te,et,ot,pt,Ae,ee.data):R.texSubImage3D(vt,N,_t,Wt,te,et,ot,pt,Ae,Xt,ee),R.pixelStorei(R.UNPACK_ROW_LENGTH,de),R.pixelStorei(R.UNPACK_IMAGE_HEIGHT,qt),R.pixelStorei(R.UNPACK_SKIP_PIXELS,Ve),R.pixelStorei(R.UNPACK_SKIP_ROWS,fi),R.pixelStorei(R.UNPACK_SKIP_IMAGES,Te),N===0&&I.generateMipmaps&&R.generateMipmap(vt),gt.unbindTexture()},this.initRenderTarget=function(y){bt.get(y).__webglFramebuffer===void 0&&Tt.setupRenderTarget(y)},this.initTexture=function(y){y.isCubeTexture?Tt.setTextureCube(y,0):y.isData3DTexture?Tt.setTexture3D(y,0):y.isDataArrayTexture||y.isCompressedArrayTexture?Tt.setTexture2DArray(y,0):Tt.setTexture2D(y,0),gt.unbindTexture()},this.resetState=function(){D=0,w=0,T=null,gt.reset(),Nt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return pn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===tl?"display-p3":"srgb",e.unpackColorSpace=Yt.workingColorSpace===oa?"display-p3":"srgb"}}class Dv extends ne{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Be,this.environmentIntensity=1,this.environmentRotation=new Be,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Lv extends xe{constructor(t=null,e=1,i=1,r,s,a,o,l,c=Se,u=Se,h,d){super(null,a,o,l,c,u,r,s,h,d),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xc extends je{constructor(t,e,i,r=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Li=new jt,qc=new jt,ls=[],Yc=new zn,Pv=new jt,lr=new ve,cr=new Qi;class Iv extends ve{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Xc(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,Pv)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new zn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Li),Yc.copy(t.boundingBox).applyMatrix4(Li),this.boundingBox.union(Yc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Qi),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,Li),cr.copy(t.boundingSphere).applyMatrix4(Li),this.boundingSphere.union(cr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const i=e.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,a=t*s+1;for(let o=0;o<i.length;o++)i[o]=r[a+o]}raycast(t,e){const i=this.matrixWorld,r=this.count;if(lr.geometry=this.geometry,lr.material=this.material,lr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),cr.copy(this.boundingSphere),cr.applyMatrix4(i),t.ray.intersectsSphere(cr)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Li),qc.multiplyMatrices(i,Li),lr.matrixWorld=qc,lr.raycast(t,ls);for(let a=0,o=ls.length;a<o;a++){const l=ls[a];l.instanceId=s,l.object=this,e.push(l)}ls.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Xc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const i=e.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Lv(new Float32Array(r*this.count),r,this.count,$o,tn));const s=this.morphTexture.source.data.data;let a=0;for(let c=0;c<i.length;c++)a+=i[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=r*t;s[l]=o,s.set(i,l+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class ol extends tr{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new kt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Ns=new O,Os=new O,jc=new jt,ur=new nl,cs=new Qi,Va=new O,Kc=new O;class hd extends ne{constructor(t=new Ie,e=new ol){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[0];for(let r=1,s=e.count;r<s;r++)Ns.fromBufferAttribute(e,r-1),Os.fromBufferAttribute(e,r),i[r]=i[r-1],i[r]+=Ns.distanceTo(Os);t.setAttribute("lineDistance",new pe(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const i=this.geometry,r=this.matrixWorld,s=t.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),cs.copy(i.boundingSphere),cs.applyMatrix4(r),cs.radius+=s,t.ray.intersectsSphere(cs)===!1)return;jc.copy(r).invert(),ur.copy(t.ray).applyMatrix4(jc);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){const m=Math.max(0,a.start),_=Math.min(u.count,a.start+a.count);for(let g=m,p=_-1;g<p;g+=c){const f=u.getX(g),b=u.getX(g+1),S=us(this,t,ur,l,f,b);S&&e.push(S)}if(this.isLineLoop){const g=u.getX(_-1),p=u.getX(m),f=us(this,t,ur,l,g,p);f&&e.push(f)}}else{const m=Math.max(0,a.start),_=Math.min(d.count,a.start+a.count);for(let g=m,p=_-1;g<p;g+=c){const f=us(this,t,ur,l,g,g+1);f&&e.push(f)}if(this.isLineLoop){const g=us(this,t,ur,l,_-1,m);g&&e.push(g)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){const r=e[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function us(n,t,e,i,r,s){const a=n.geometry.attributes.position;if(Ns.fromBufferAttribute(a,r),Os.fromBufferAttribute(a,s),e.distanceSqToSegment(Ns,Os,Va,Kc)>i)return;Va.applyMatrix4(n.matrixWorld);const l=t.ray.origin.distanceTo(Va);if(!(l<t.near||l>t.far))return{distance:l,point:Kc.clone().applyMatrix4(n.matrixWorld),index:r,face:null,faceIndex:null,object:n}}const $c=new O,Zc=new O;class Uv extends hd{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,i=[];for(let r=0,s=e.count;r<s;r+=2)$c.fromBufferAttribute(e,r),Zc.fromBufferAttribute(e,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+$c.distanceTo(Zc);t.setAttribute("lineDistance",new pe(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ll extends Ie{constructor(t=1,e=1,i=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],h=[],d=[],m=[];let _=0;const g=[],p=i/2;let f=0;b(),a===!1&&(t>0&&S(!0),e>0&&S(!1)),this.setIndex(u),this.setAttribute("position",new pe(h,3)),this.setAttribute("normal",new pe(d,3)),this.setAttribute("uv",new pe(m,2));function b(){const E=new O,D=new O;let w=0;const T=(e-t)/i;for(let L=0;L<=s;L++){const M=[],v=L/s,C=v*(e-t)+t;for(let k=0;k<=r;k++){const U=k/r,z=U*l+o,G=Math.sin(z),V=Math.cos(z);D.x=C*G,D.y=-v*i+p,D.z=C*V,h.push(D.x,D.y,D.z),E.set(G,T,V).normalize(),d.push(E.x,E.y,E.z),m.push(U,1-v),M.push(_++)}g.push(M)}for(let L=0;L<r;L++)for(let M=0;M<s;M++){const v=g[M][L],C=g[M+1][L],k=g[M+1][L+1],U=g[M][L+1];u.push(v,C,U),u.push(C,k,U),w+=6}c.addGroup(f,w,0),f+=w}function S(E){const D=_,w=new Ot,T=new O;let L=0;const M=E===!0?t:e,v=E===!0?1:-1;for(let k=1;k<=r;k++)h.push(0,p*v,0),d.push(0,v,0),m.push(.5,.5),_++;const C=_;for(let k=0;k<=r;k++){const z=k/r*l+o,G=Math.cos(z),V=Math.sin(z);T.x=M*V,T.y=p*v,T.z=M*G,h.push(T.x,T.y,T.z),d.push(0,v,0),w.x=G*.5+.5,w.y=V*.5*v+.5,m.push(w.x,w.y),_++}for(let k=0;k<r;k++){const U=D+k,z=C+k;E===!0?u.push(z,z+1,U):u.push(z+1,z,U),L+=3}c.addGroup(f,L,E===!0?1:2),f+=L}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ll(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class ca extends tr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new kt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new kt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ju,this.normalScale=new Ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Be,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class fd extends ne{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new kt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Nv extends fd{constructor(t,e,i){super(t,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ne.DEFAULT_UP),this.updateMatrix(),this.groundColor=new kt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Ga=new jt,Jc=new O,Qc=new O;class Ov{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ot(512,512),this.map=null,this.mapPass=null,this.matrix=new jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new sl,this._frameExtents=new Ot(1,1),this._viewportCount=1,this._viewports=[new ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,i=this.matrix;Jc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Jc),Qc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Qc),e.updateMatrixWorld(),Ga.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Ga),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Ga)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Fv extends Ov{constructor(){super(new ad(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class kv extends fd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ne.DEFAULT_UP),this.updateMatrix(),this.target=new ne,this.shadow=new Fv}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}const tu=new jt;class Bv{constructor(t,e,i=0,r=1/0){this.ray=new nl(t,e),this.near=i,this.far=r,this.camera=null,this.layers=new il,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return tu.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(tu),this}intersectObject(t,e=!0,i=[]){return Uo(t,this,i,e),i.sort(eu),i}intersectObjects(t,e=!0,i=[]){for(let r=0,s=t.length;r<s;r++)Uo(t[r],this,i,e);return i.sort(eu),i}}function eu(n,t){return n.distance-t.distance}function Uo(n,t,e,i){let r=!0;if(n.layers.test(t.layers)&&n.raycast(t,e)===!1&&(r=!1),r===!0&&i===!0){const s=n.children;for(let a=0,o=s.length;a<o;a++)Uo(s[a],t,e,!0)}}const nu=new O;let ds,Wa;class iu extends ne{constructor(t=new O(0,0,1),e=new O(0,0,0),i=1,r=16776960,s=i*.2,a=s*.2){super(),this.type="ArrowHelper",ds===void 0&&(ds=new Ie,ds.setAttribute("position",new pe([0,0,0,0,1,0],3)),Wa=new ll(0,.5,1,5,1),Wa.translate(0,-.5,0)),this.position.copy(e),this.line=new hd(ds,new ol({color:r,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new ve(Wa,new rl({color:r,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(i,s,a)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{nu.set(t.z,0,-t.x).normalize();const e=Math.acos(t.y);this.quaternion.setFromAxisAngle(nu,e)}}setLength(t,e=t*.2,i=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(i,e,i),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qo);const zv="0.1.42",Hv={version:zv};var Vv=function(){function n(t,e){e===void 0&&(e=[]),this._eventType=t,this._eventFunctions=e}return n.prototype.init=function(){var t=this;this._eventFunctions.forEach(function(e){typeof window<"u"&&window.addEventListener(t._eventType,e)})},n}(),Gv=function(){function n(){this._instances={Accordion:{},Carousel:{},Collapse:{},Dial:{},Dismiss:{},Drawer:{},Dropdown:{},Modal:{},Popover:{},Tabs:{},Tooltip:{},InputCounter:{},CopyClipboard:{},Datepicker:{}}}return n.prototype.addInstance=function(t,e,i,r){if(r===void 0&&(r=!1),!this._instances[t])return console.warn("Flowbite: Component ".concat(t," does not exist.")),!1;if(this._instances[t][i]&&!r){console.warn("Flowbite: Instance with ID ".concat(i," already exists."));return}r&&this._instances[t][i]&&this._instances[t][i].destroyAndRemoveInstance(),this._instances[t][i||this._generateRandomId()]=e},n.prototype.getAllInstances=function(){return this._instances},n.prototype.getInstances=function(t){return this._instances[t]?this._instances[t]:(console.warn("Flowbite: Component ".concat(t," does not exist.")),!1)},n.prototype.getInstance=function(t,e){if(this._componentAndInstanceCheck(t,e)){if(!this._instances[t][e]){console.warn("Flowbite: Instance with ID ".concat(e," does not exist."));return}return this._instances[t][e]}},n.prototype.destroyAndRemoveInstance=function(t,e){this._componentAndInstanceCheck(t,e)&&(this.destroyInstanceObject(t,e),this.removeInstance(t,e))},n.prototype.removeInstance=function(t,e){this._componentAndInstanceCheck(t,e)&&delete this._instances[t][e]},n.prototype.destroyInstanceObject=function(t,e){this._componentAndInstanceCheck(t,e)&&this._instances[t][e].destroy()},n.prototype.instanceExists=function(t,e){return!(!this._instances[t]||!this._instances[t][e])},n.prototype._generateRandomId=function(){return Math.random().toString(36).substr(2,9)},n.prototype._componentAndInstanceCheck=function(t,e){return this._instances[t]?this._instances[t][e]?!0:(console.warn("Flowbite: Instance with ID ".concat(e," does not exist.")),!1):(console.warn("Flowbite: Component ".concat(t," does not exist.")),!1)},n}(),It=new Gv;typeof window<"u"&&(window.FlowbiteInstances=It);var Fs=function(){return Fs=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},Fs.apply(this,arguments)},ks={alwaysOpen:!1,activeClasses:"bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white",inactiveClasses:"text-gray-500 dark:text-gray-400",onOpen:function(){},onClose:function(){},onToggle:function(){}},Wv={id:null,override:!0},pd=function(){function n(t,e,i,r){t===void 0&&(t=null),e===void 0&&(e=[]),i===void 0&&(i=ks),r===void 0&&(r=Wv),this._instanceId=r.id?r.id:t.id,this._accordionEl=t,this._items=e,this._options=Fs(Fs({},ks),i),this._initialized=!1,this.init(),It.addInstance("Accordion",this,this._instanceId,r.override)}return n.prototype.init=function(){var t=this;this._items.length&&!this._initialized&&(this._items.forEach(function(e){e.active&&t.open(e.id);var i=function(){t.toggle(e.id)};e.triggerEl.addEventListener("click",i),e.clickHandler=i}),this._initialized=!0)},n.prototype.destroy=function(){this._items.length&&this._initialized&&(this._items.forEach(function(t){t.triggerEl.removeEventListener("click",t.clickHandler),delete t.clickHandler}),this._initialized=!1)},n.prototype.removeInstance=function(){It.removeInstance("Accordion",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype.getItem=function(t){return this._items.filter(function(e){return e.id===t})[0]},n.prototype.open=function(t){var e,i,r=this,s=this.getItem(t);this._options.alwaysOpen||this._items.map(function(a){var o,l;a!==s&&((o=a.triggerEl.classList).remove.apply(o,r._options.activeClasses.split(" ")),(l=a.triggerEl.classList).add.apply(l,r._options.inactiveClasses.split(" ")),a.targetEl.classList.add("hidden"),a.triggerEl.setAttribute("aria-expanded","false"),a.active=!1,a.iconEl&&a.iconEl.classList.add("rotate-180"))}),(e=s.triggerEl.classList).add.apply(e,this._options.activeClasses.split(" ")),(i=s.triggerEl.classList).remove.apply(i,this._options.inactiveClasses.split(" ")),s.triggerEl.setAttribute("aria-expanded","true"),s.targetEl.classList.remove("hidden"),s.active=!0,s.iconEl&&s.iconEl.classList.remove("rotate-180"),this._options.onOpen(this,s)},n.prototype.toggle=function(t){var e=this.getItem(t);e.active?this.close(t):this.open(t),this._options.onToggle(this,e)},n.prototype.close=function(t){var e,i,r=this.getItem(t);(e=r.triggerEl.classList).remove.apply(e,this._options.activeClasses.split(" ")),(i=r.triggerEl.classList).add.apply(i,this._options.inactiveClasses.split(" ")),r.targetEl.classList.add("hidden"),r.triggerEl.setAttribute("aria-expanded","false"),r.active=!1,r.iconEl&&r.iconEl.classList.add("rotate-180"),this._options.onClose(this,r)},n.prototype.updateOnOpen=function(t){this._options.onOpen=t},n.prototype.updateOnClose=function(t){this._options.onClose=t},n.prototype.updateOnToggle=function(t){this._options.onToggle=t},n}();function cl(){document.querySelectorAll("[data-accordion]").forEach(function(n){var t=n.getAttribute("data-accordion"),e=n.getAttribute("data-active-classes"),i=n.getAttribute("data-inactive-classes"),r=[];n.querySelectorAll("[data-accordion-target]").forEach(function(s){if(s.closest("[data-accordion]")===n){var a={id:s.getAttribute("data-accordion-target"),triggerEl:s,targetEl:document.querySelector(s.getAttribute("data-accordion-target")),iconEl:s.querySelector("[data-accordion-icon]"),active:s.getAttribute("aria-expanded")==="true"};r.push(a)}}),new pd(n,r,{alwaysOpen:t==="open",activeClasses:e||ks.activeClasses,inactiveClasses:i||ks.inactiveClasses})})}typeof window<"u"&&(window.Accordion=pd,window.initAccordions=cl);var Bs=function(){return Bs=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},Bs.apply(this,arguments)},ru={onCollapse:function(){},onExpand:function(){},onToggle:function(){}},Xv={id:null,override:!0},No=function(){function n(t,e,i,r){t===void 0&&(t=null),e===void 0&&(e=null),i===void 0&&(i=ru),r===void 0&&(r=Xv),this._instanceId=r.id?r.id:t.id,this._targetEl=t,this._triggerEl=e,this._options=Bs(Bs({},ru),i),this._visible=!1,this._initialized=!1,this.init(),It.addInstance("Collapse",this,this._instanceId,r.override)}return n.prototype.init=function(){var t=this;this._triggerEl&&this._targetEl&&!this._initialized&&(this._triggerEl.hasAttribute("aria-expanded")?this._visible=this._triggerEl.getAttribute("aria-expanded")==="true":this._visible=!this._targetEl.classList.contains("hidden"),this._clickHandler=function(){t.toggle()},this._triggerEl.addEventListener("click",this._clickHandler),this._initialized=!0)},n.prototype.destroy=function(){this._triggerEl&&this._initialized&&(this._triggerEl.removeEventListener("click",this._clickHandler),this._initialized=!1)},n.prototype.removeInstance=function(){It.removeInstance("Collapse",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype.collapse=function(){this._targetEl.classList.add("hidden"),this._triggerEl&&this._triggerEl.setAttribute("aria-expanded","false"),this._visible=!1,this._options.onCollapse(this)},n.prototype.expand=function(){this._targetEl.classList.remove("hidden"),this._triggerEl&&this._triggerEl.setAttribute("aria-expanded","true"),this._visible=!0,this._options.onExpand(this)},n.prototype.toggle=function(){this._visible?this.collapse():this.expand(),this._options.onToggle(this)},n.prototype.updateOnCollapse=function(t){this._options.onCollapse=t},n.prototype.updateOnExpand=function(t){this._options.onExpand=t},n.prototype.updateOnToggle=function(t){this._options.onToggle=t},n}();function ul(){document.querySelectorAll("[data-collapse-toggle]").forEach(function(n){var t=n.getAttribute("data-collapse-toggle"),e=document.getElementById(t);e?It.instanceExists("Collapse",e.getAttribute("id"))?new No(e,n,{},{id:e.getAttribute("id")+"_"+It._generateRandomId()}):new No(e,n):console.error('The target element with id "'.concat(t,'" does not exist. Please check the data-collapse-toggle attribute.'))})}typeof window<"u"&&(window.Collapse=No,window.initCollapses=ul);var ti=function(){return ti=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},ti.apply(this,arguments)},ws={defaultPosition:0,indicators:{items:[],activeClasses:"bg-white dark:bg-gray-800",inactiveClasses:"bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800"},interval:3e3,onNext:function(){},onPrev:function(){},onChange:function(){}},qv={id:null,override:!0},md=function(){function n(t,e,i,r){t===void 0&&(t=null),e===void 0&&(e=[]),i===void 0&&(i=ws),r===void 0&&(r=qv),this._instanceId=r.id?r.id:t.id,this._carouselEl=t,this._items=e,this._options=ti(ti(ti({},ws),i),{indicators:ti(ti({},ws.indicators),i.indicators)}),this._activeItem=this.getItem(this._options.defaultPosition),this._indicators=this._options.indicators.items,this._intervalDuration=this._options.interval,this._intervalInstance=null,this._initialized=!1,this.init(),It.addInstance("Carousel",this,this._instanceId,r.override)}return n.prototype.init=function(){var t=this;this._items.length&&!this._initialized&&(this._items.map(function(e){e.el.classList.add("absolute","inset-0","transition-transform","transform")}),this.getActiveItem()?this.slideTo(this.getActiveItem().position):this.slideTo(0),this._indicators.map(function(e,i){e.el.addEventListener("click",function(){t.slideTo(i)})}),this._initialized=!0)},n.prototype.destroy=function(){this._initialized&&(this._initialized=!1)},n.prototype.removeInstance=function(){It.removeInstance("Carousel",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype.getItem=function(t){return this._items[t]},n.prototype.slideTo=function(t){var e=this._items[t],i={left:e.position===0?this._items[this._items.length-1]:this._items[e.position-1],middle:e,right:e.position===this._items.length-1?this._items[0]:this._items[e.position+1]};this._rotate(i),this._setActiveItem(e),this._intervalInstance&&(this.pause(),this.cycle()),this._options.onChange(this)},n.prototype.next=function(){var t=this.getActiveItem(),e=null;t.position===this._items.length-1?e=this._items[0]:e=this._items[t.position+1],this.slideTo(e.position),this._options.onNext(this)},n.prototype.prev=function(){var t=this.getActiveItem(),e=null;t.position===0?e=this._items[this._items.length-1]:e=this._items[t.position-1],this.slideTo(e.position),this._options.onPrev(this)},n.prototype._rotate=function(t){if(this._items.map(function(e){e.el.classList.add("hidden")}),this._items.length===1){t.middle.el.classList.remove("-translate-x-full","translate-x-full","translate-x-0","hidden","z-10"),t.middle.el.classList.add("translate-x-0","z-20");return}t.left.el.classList.remove("-translate-x-full","translate-x-full","translate-x-0","hidden","z-20"),t.left.el.classList.add("-translate-x-full","z-10"),t.middle.el.classList.remove("-translate-x-full","translate-x-full","translate-x-0","hidden","z-10"),t.middle.el.classList.add("translate-x-0","z-30"),t.right.el.classList.remove("-translate-x-full","translate-x-full","translate-x-0","hidden","z-30"),t.right.el.classList.add("translate-x-full","z-20")},n.prototype.cycle=function(){var t=this;typeof window<"u"&&(this._intervalInstance=window.setInterval(function(){t.next()},this._intervalDuration))},n.prototype.pause=function(){clearInterval(this._intervalInstance)},n.prototype.getActiveItem=function(){return this._activeItem},n.prototype._setActiveItem=function(t){var e,i,r=this;this._activeItem=t;var s=t.position;this._indicators.length&&(this._indicators.map(function(a){var o,l;a.el.setAttribute("aria-current","false"),(o=a.el.classList).remove.apply(o,r._options.indicators.activeClasses.split(" ")),(l=a.el.classList).add.apply(l,r._options.indicators.inactiveClasses.split(" "))}),(e=this._indicators[s].el.classList).add.apply(e,this._options.indicators.activeClasses.split(" ")),(i=this._indicators[s].el.classList).remove.apply(i,this._options.indicators.inactiveClasses.split(" ")),this._indicators[s].el.setAttribute("aria-current","true"))},n.prototype.updateOnNext=function(t){this._options.onNext=t},n.prototype.updateOnPrev=function(t){this._options.onPrev=t},n.prototype.updateOnChange=function(t){this._options.onChange=t},n}();function dl(){document.querySelectorAll("[data-carousel]").forEach(function(n){var t=n.getAttribute("data-carousel-interval"),e=n.getAttribute("data-carousel")==="slide",i=[],r=0;n.querySelectorAll("[data-carousel-item]").length&&Array.from(n.querySelectorAll("[data-carousel-item]")).map(function(c,u){i.push({position:u,el:c}),c.getAttribute("data-carousel-item")==="active"&&(r=u)});var s=[];n.querySelectorAll("[data-carousel-slide-to]").length&&Array.from(n.querySelectorAll("[data-carousel-slide-to]")).map(function(c){s.push({position:parseInt(c.getAttribute("data-carousel-slide-to")),el:c})});var a=new md(n,i,{defaultPosition:r,indicators:{items:s},interval:t||ws.interval});e&&a.cycle();var o=n.querySelector("[data-carousel-next]"),l=n.querySelector("[data-carousel-prev]");o&&o.addEventListener("click",function(){a.next()}),l&&l.addEventListener("click",function(){a.prev()})})}typeof window<"u"&&(window.Carousel=md,window.initCarousels=dl);var zs=function(){return zs=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},zs.apply(this,arguments)},su={transition:"transition-opacity",duration:300,timing:"ease-out",onHide:function(){}},Yv={id:null,override:!0},gd=function(){function n(t,e,i,r){t===void 0&&(t=null),e===void 0&&(e=null),i===void 0&&(i=su),r===void 0&&(r=Yv),this._instanceId=r.id?r.id:t.id,this._targetEl=t,this._triggerEl=e,this._options=zs(zs({},su),i),this._initialized=!1,this.init(),It.addInstance("Dismiss",this,this._instanceId,r.override)}return n.prototype.init=function(){var t=this;this._triggerEl&&this._targetEl&&!this._initialized&&(this._clickHandler=function(){t.hide()},this._triggerEl.addEventListener("click",this._clickHandler),this._initialized=!0)},n.prototype.destroy=function(){this._triggerEl&&this._initialized&&(this._triggerEl.removeEventListener("click",this._clickHandler),this._initialized=!1)},n.prototype.removeInstance=function(){It.removeInstance("Dismiss",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype.hide=function(){var t=this;this._targetEl.classList.add(this._options.transition,"duration-".concat(this._options.duration),this._options.timing,"opacity-0"),setTimeout(function(){t._targetEl.classList.add("hidden")},this._options.duration),this._options.onHide(this,this._targetEl)},n.prototype.updateOnHide=function(t){this._options.onHide=t},n}();function hl(){document.querySelectorAll("[data-dismiss-target]").forEach(function(n){var t=n.getAttribute("data-dismiss-target"),e=document.querySelector(t);e?new gd(e,n):console.error('The dismiss element with id "'.concat(t,'" does not exist. Please check the data-dismiss-target attribute.'))})}typeof window<"u"&&(window.Dismiss=gd,window.initDismisses=hl);var be="top",ze="bottom",He="right",we="left",fl="auto",Pr=[be,ze,He,we],Xi="start",wr="end",jv="clippingParents",_d="viewport",dr="popper",Kv="reference",au=Pr.reduce(function(n,t){return n.concat([t+"-"+Xi,t+"-"+wr])},[]),vd=[].concat(Pr,[fl]).reduce(function(n,t){return n.concat([t,t+"-"+Xi,t+"-"+wr])},[]),$v="beforeRead",Zv="read",Jv="afterRead",Qv="beforeMain",t0="main",e0="afterMain",n0="beforeWrite",i0="write",r0="afterWrite",s0=[$v,Zv,Jv,Qv,t0,e0,n0,i0,r0];function rn(n){return n?(n.nodeName||"").toLowerCase():null}function Pe(n){if(n==null)return window;if(n.toString()!=="[object Window]"){var t=n.ownerDocument;return t&&t.defaultView||window}return n}function oi(n){var t=Pe(n).Element;return n instanceof t||n instanceof Element}function ke(n){var t=Pe(n).HTMLElement;return n instanceof t||n instanceof HTMLElement}function pl(n){if(typeof ShadowRoot>"u")return!1;var t=Pe(n).ShadowRoot;return n instanceof t||n instanceof ShadowRoot}function a0(n){var t=n.state;Object.keys(t.elements).forEach(function(e){var i=t.styles[e]||{},r=t.attributes[e]||{},s=t.elements[e];!ke(s)||!rn(s)||(Object.assign(s.style,i),Object.keys(r).forEach(function(a){var o=r[a];o===!1?s.removeAttribute(a):s.setAttribute(a,o===!0?"":o)}))})}function o0(n){var t=n.state,e={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,e.popper),t.styles=e,t.elements.arrow&&Object.assign(t.elements.arrow.style,e.arrow),function(){Object.keys(t.elements).forEach(function(i){var r=t.elements[i],s=t.attributes[i]||{},a=Object.keys(t.styles.hasOwnProperty(i)?t.styles[i]:e[i]),o=a.reduce(function(l,c){return l[c]="",l},{});!ke(r)||!rn(r)||(Object.assign(r.style,o),Object.keys(s).forEach(function(l){r.removeAttribute(l)}))})}}const l0={name:"applyStyles",enabled:!0,phase:"write",fn:a0,effect:o0,requires:["computeStyles"]};function en(n){return n.split("-")[0]}var ri=Math.max,Hs=Math.min,qi=Math.round;function Oo(){var n=navigator.userAgentData;return n!=null&&n.brands&&Array.isArray(n.brands)?n.brands.map(function(t){return t.brand+"/"+t.version}).join(" "):navigator.userAgent}function xd(){return!/^((?!chrome|android).)*safari/i.test(Oo())}function Yi(n,t,e){t===void 0&&(t=!1),e===void 0&&(e=!1);var i=n.getBoundingClientRect(),r=1,s=1;t&&ke(n)&&(r=n.offsetWidth>0&&qi(i.width)/n.offsetWidth||1,s=n.offsetHeight>0&&qi(i.height)/n.offsetHeight||1);var a=oi(n)?Pe(n):window,o=a.visualViewport,l=!xd()&&e,c=(i.left+(l&&o?o.offsetLeft:0))/r,u=(i.top+(l&&o?o.offsetTop:0))/s,h=i.width/r,d=i.height/s;return{width:h,height:d,top:u,right:c+h,bottom:u+d,left:c,x:c,y:u}}function ml(n){var t=Yi(n),e=n.offsetWidth,i=n.offsetHeight;return Math.abs(t.width-e)<=1&&(e=t.width),Math.abs(t.height-i)<=1&&(i=t.height),{x:n.offsetLeft,y:n.offsetTop,width:e,height:i}}function yd(n,t){var e=t.getRootNode&&t.getRootNode();if(n.contains(t))return!0;if(e&&pl(e)){var i=t;do{if(i&&n.isSameNode(i))return!0;i=i.parentNode||i.host}while(i)}return!1}function gn(n){return Pe(n).getComputedStyle(n)}function c0(n){return["table","td","th"].indexOf(rn(n))>=0}function Hn(n){return((oi(n)?n.ownerDocument:n.document)||window.document).documentElement}function ua(n){return rn(n)==="html"?n:n.assignedSlot||n.parentNode||(pl(n)?n.host:null)||Hn(n)}function ou(n){return!ke(n)||gn(n).position==="fixed"?null:n.offsetParent}function u0(n){var t=/firefox/i.test(Oo()),e=/Trident/i.test(Oo());if(e&&ke(n)){var i=gn(n);if(i.position==="fixed")return null}var r=ua(n);for(pl(r)&&(r=r.host);ke(r)&&["html","body"].indexOf(rn(r))<0;){var s=gn(r);if(s.transform!=="none"||s.perspective!=="none"||s.contain==="paint"||["transform","perspective"].indexOf(s.willChange)!==-1||t&&s.willChange==="filter"||t&&s.filter&&s.filter!=="none")return r;r=r.parentNode}return null}function Ir(n){for(var t=Pe(n),e=ou(n);e&&c0(e)&&gn(e).position==="static";)e=ou(e);return e&&(rn(e)==="html"||rn(e)==="body"&&gn(e).position==="static")?t:e||u0(n)||t}function gl(n){return["top","bottom"].indexOf(n)>=0?"x":"y"}function vr(n,t,e){return ri(n,Hs(t,e))}function d0(n,t,e){var i=vr(n,t,e);return i>e?e:i}function Md(){return{top:0,right:0,bottom:0,left:0}}function Sd(n){return Object.assign({},Md(),n)}function Ed(n,t){return t.reduce(function(e,i){return e[i]=n,e},{})}var h0=function(t,e){return t=typeof t=="function"?t(Object.assign({},e.rects,{placement:e.placement})):t,Sd(typeof t!="number"?t:Ed(t,Pr))};function f0(n){var t,e=n.state,i=n.name,r=n.options,s=e.elements.arrow,a=e.modifiersData.popperOffsets,o=en(e.placement),l=gl(o),c=[we,He].indexOf(o)>=0,u=c?"height":"width";if(!(!s||!a)){var h=h0(r.padding,e),d=ml(s),m=l==="y"?be:we,_=l==="y"?ze:He,g=e.rects.reference[u]+e.rects.reference[l]-a[l]-e.rects.popper[u],p=a[l]-e.rects.reference[l],f=Ir(s),b=f?l==="y"?f.clientHeight||0:f.clientWidth||0:0,S=g/2-p/2,E=h[m],D=b-d[u]-h[_],w=b/2-d[u]/2+S,T=vr(E,w,D),L=l;e.modifiersData[i]=(t={},t[L]=T,t.centerOffset=T-w,t)}}function p0(n){var t=n.state,e=n.options,i=e.element,r=i===void 0?"[data-popper-arrow]":i;r!=null&&(typeof r=="string"&&(r=t.elements.popper.querySelector(r),!r)||yd(t.elements.popper,r)&&(t.elements.arrow=r))}const m0={name:"arrow",enabled:!0,phase:"main",fn:f0,effect:p0,requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function ji(n){return n.split("-")[1]}var g0={top:"auto",right:"auto",bottom:"auto",left:"auto"};function _0(n,t){var e=n.x,i=n.y,r=t.devicePixelRatio||1;return{x:qi(e*r)/r||0,y:qi(i*r)/r||0}}function lu(n){var t,e=n.popper,i=n.popperRect,r=n.placement,s=n.variation,a=n.offsets,o=n.position,l=n.gpuAcceleration,c=n.adaptive,u=n.roundOffsets,h=n.isFixed,d=a.x,m=d===void 0?0:d,_=a.y,g=_===void 0?0:_,p=typeof u=="function"?u({x:m,y:g}):{x:m,y:g};m=p.x,g=p.y;var f=a.hasOwnProperty("x"),b=a.hasOwnProperty("y"),S=we,E=be,D=window;if(c){var w=Ir(e),T="clientHeight",L="clientWidth";if(w===Pe(e)&&(w=Hn(e),gn(w).position!=="static"&&o==="absolute"&&(T="scrollHeight",L="scrollWidth")),w=w,r===be||(r===we||r===He)&&s===wr){E=ze;var M=h&&w===D&&D.visualViewport?D.visualViewport.height:w[T];g-=M-i.height,g*=l?1:-1}if(r===we||(r===be||r===ze)&&s===wr){S=He;var v=h&&w===D&&D.visualViewport?D.visualViewport.width:w[L];m-=v-i.width,m*=l?1:-1}}var C=Object.assign({position:o},c&&g0),k=u===!0?_0({x:m,y:g},Pe(e)):{x:m,y:g};if(m=k.x,g=k.y,l){var U;return Object.assign({},C,(U={},U[E]=b?"0":"",U[S]=f?"0":"",U.transform=(D.devicePixelRatio||1)<=1?"translate("+m+"px, "+g+"px)":"translate3d("+m+"px, "+g+"px, 0)",U))}return Object.assign({},C,(t={},t[E]=b?g+"px":"",t[S]=f?m+"px":"",t.transform="",t))}function v0(n){var t=n.state,e=n.options,i=e.gpuAcceleration,r=i===void 0?!0:i,s=e.adaptive,a=s===void 0?!0:s,o=e.roundOffsets,l=o===void 0?!0:o,c={placement:en(t.placement),variation:ji(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:r,isFixed:t.options.strategy==="fixed"};t.modifiersData.popperOffsets!=null&&(t.styles.popper=Object.assign({},t.styles.popper,lu(Object.assign({},c,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:a,roundOffsets:l})))),t.modifiersData.arrow!=null&&(t.styles.arrow=Object.assign({},t.styles.arrow,lu(Object.assign({},c,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:l})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})}const x0={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:v0,data:{}};var hs={passive:!0};function y0(n){var t=n.state,e=n.instance,i=n.options,r=i.scroll,s=r===void 0?!0:r,a=i.resize,o=a===void 0?!0:a,l=Pe(t.elements.popper),c=[].concat(t.scrollParents.reference,t.scrollParents.popper);return s&&c.forEach(function(u){u.addEventListener("scroll",e.update,hs)}),o&&l.addEventListener("resize",e.update,hs),function(){s&&c.forEach(function(u){u.removeEventListener("scroll",e.update,hs)}),o&&l.removeEventListener("resize",e.update,hs)}}const M0={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:y0,data:{}};var S0={left:"right",right:"left",bottom:"top",top:"bottom"};function As(n){return n.replace(/left|right|bottom|top/g,function(t){return S0[t]})}var E0={start:"end",end:"start"};function cu(n){return n.replace(/start|end/g,function(t){return E0[t]})}function _l(n){var t=Pe(n),e=t.pageXOffset,i=t.pageYOffset;return{scrollLeft:e,scrollTop:i}}function vl(n){return Yi(Hn(n)).left+_l(n).scrollLeft}function b0(n,t){var e=Pe(n),i=Hn(n),r=e.visualViewport,s=i.clientWidth,a=i.clientHeight,o=0,l=0;if(r){s=r.width,a=r.height;var c=xd();(c||!c&&t==="fixed")&&(o=r.offsetLeft,l=r.offsetTop)}return{width:s,height:a,x:o+vl(n),y:l}}function w0(n){var t,e=Hn(n),i=_l(n),r=(t=n.ownerDocument)==null?void 0:t.body,s=ri(e.scrollWidth,e.clientWidth,r?r.scrollWidth:0,r?r.clientWidth:0),a=ri(e.scrollHeight,e.clientHeight,r?r.scrollHeight:0,r?r.clientHeight:0),o=-i.scrollLeft+vl(n),l=-i.scrollTop;return gn(r||e).direction==="rtl"&&(o+=ri(e.clientWidth,r?r.clientWidth:0)-s),{width:s,height:a,x:o,y:l}}function xl(n){var t=gn(n),e=t.overflow,i=t.overflowX,r=t.overflowY;return/auto|scroll|overlay|hidden/.test(e+r+i)}function bd(n){return["html","body","#document"].indexOf(rn(n))>=0?n.ownerDocument.body:ke(n)&&xl(n)?n:bd(ua(n))}function xr(n,t){var e;t===void 0&&(t=[]);var i=bd(n),r=i===((e=n.ownerDocument)==null?void 0:e.body),s=Pe(i),a=r?[s].concat(s.visualViewport||[],xl(i)?i:[]):i,o=t.concat(a);return r?o:o.concat(xr(ua(a)))}function Fo(n){return Object.assign({},n,{left:n.x,top:n.y,right:n.x+n.width,bottom:n.y+n.height})}function A0(n,t){var e=Yi(n,!1,t==="fixed");return e.top=e.top+n.clientTop,e.left=e.left+n.clientLeft,e.bottom=e.top+n.clientHeight,e.right=e.left+n.clientWidth,e.width=n.clientWidth,e.height=n.clientHeight,e.x=e.left,e.y=e.top,e}function uu(n,t,e){return t===_d?Fo(b0(n,e)):oi(t)?A0(t,e):Fo(w0(Hn(n)))}function T0(n){var t=xr(ua(n)),e=["absolute","fixed"].indexOf(gn(n).position)>=0,i=e&&ke(n)?Ir(n):n;return oi(i)?t.filter(function(r){return oi(r)&&yd(r,i)&&rn(r)!=="body"}):[]}function C0(n,t,e,i){var r=t==="clippingParents"?T0(n):[].concat(t),s=[].concat(r,[e]),a=s[0],o=s.reduce(function(l,c){var u=uu(n,c,i);return l.top=ri(u.top,l.top),l.right=Hs(u.right,l.right),l.bottom=Hs(u.bottom,l.bottom),l.left=ri(u.left,l.left),l},uu(n,a,i));return o.width=o.right-o.left,o.height=o.bottom-o.top,o.x=o.left,o.y=o.top,o}function wd(n){var t=n.reference,e=n.element,i=n.placement,r=i?en(i):null,s=i?ji(i):null,a=t.x+t.width/2-e.width/2,o=t.y+t.height/2-e.height/2,l;switch(r){case be:l={x:a,y:t.y-e.height};break;case ze:l={x:a,y:t.y+t.height};break;case He:l={x:t.x+t.width,y:o};break;case we:l={x:t.x-e.width,y:o};break;default:l={x:t.x,y:t.y}}var c=r?gl(r):null;if(c!=null){var u=c==="y"?"height":"width";switch(s){case Xi:l[c]=l[c]-(t[u]/2-e[u]/2);break;case wr:l[c]=l[c]+(t[u]/2-e[u]/2);break}}return l}function Ar(n,t){t===void 0&&(t={});var e=t,i=e.placement,r=i===void 0?n.placement:i,s=e.strategy,a=s===void 0?n.strategy:s,o=e.boundary,l=o===void 0?jv:o,c=e.rootBoundary,u=c===void 0?_d:c,h=e.elementContext,d=h===void 0?dr:h,m=e.altBoundary,_=m===void 0?!1:m,g=e.padding,p=g===void 0?0:g,f=Sd(typeof p!="number"?p:Ed(p,Pr)),b=d===dr?Kv:dr,S=n.rects.popper,E=n.elements[_?b:d],D=C0(oi(E)?E:E.contextElement||Hn(n.elements.popper),l,u,a),w=Yi(n.elements.reference),T=wd({reference:w,element:S,placement:r}),L=Fo(Object.assign({},S,T)),M=d===dr?L:w,v={top:D.top-M.top+f.top,bottom:M.bottom-D.bottom+f.bottom,left:D.left-M.left+f.left,right:M.right-D.right+f.right},C=n.modifiersData.offset;if(d===dr&&C){var k=C[r];Object.keys(v).forEach(function(U){var z=[He,ze].indexOf(U)>=0?1:-1,G=[be,ze].indexOf(U)>=0?"y":"x";v[U]+=k[G]*z})}return v}function R0(n,t){t===void 0&&(t={});var e=t,i=e.placement,r=e.boundary,s=e.rootBoundary,a=e.padding,o=e.flipVariations,l=e.allowedAutoPlacements,c=l===void 0?vd:l,u=ji(i),h=u?o?au:au.filter(function(_){return ji(_)===u}):Pr,d=h.filter(function(_){return c.indexOf(_)>=0});d.length===0&&(d=h);var m=d.reduce(function(_,g){return _[g]=Ar(n,{placement:g,boundary:r,rootBoundary:s,padding:a})[en(g)],_},{});return Object.keys(m).sort(function(_,g){return m[_]-m[g]})}function D0(n){if(en(n)===fl)return[];var t=As(n);return[cu(n),t,cu(t)]}function L0(n){var t=n.state,e=n.options,i=n.name;if(!t.modifiersData[i]._skip){for(var r=e.mainAxis,s=r===void 0?!0:r,a=e.altAxis,o=a===void 0?!0:a,l=e.fallbackPlacements,c=e.padding,u=e.boundary,h=e.rootBoundary,d=e.altBoundary,m=e.flipVariations,_=m===void 0?!0:m,g=e.allowedAutoPlacements,p=t.options.placement,f=en(p),b=f===p,S=l||(b||!_?[As(p)]:D0(p)),E=[p].concat(S).reduce(function(X,J){return X.concat(en(J)===fl?R0(t,{placement:J,boundary:u,rootBoundary:h,padding:c,flipVariations:_,allowedAutoPlacements:g}):J)},[]),D=t.rects.reference,w=t.rects.popper,T=new Map,L=!0,M=E[0],v=0;v<E.length;v++){var C=E[v],k=en(C),U=ji(C)===Xi,z=[be,ze].indexOf(k)>=0,G=z?"width":"height",V=Ar(t,{placement:C,boundary:u,rootBoundary:h,altBoundary:d,padding:c}),$=z?U?He:we:U?ze:be;D[G]>w[G]&&($=As($));var W=As($),st=[];if(s&&st.push(V[k]<=0),o&&st.push(V[$]<=0,V[W]<=0),st.every(function(X){return X})){M=C,L=!1;break}T.set(C,st)}if(L)for(var lt=_?3:1,ft=function(J){var ut=E.find(function(at){var xt=T.get(at);if(xt)return xt.slice(0,J).every(function(Et){return Et})});if(ut)return M=ut,"break"},Rt=lt;Rt>0;Rt--){var Bt=ft(Rt);if(Bt==="break")break}t.placement!==M&&(t.modifiersData[i]._skip=!0,t.placement=M,t.reset=!0)}}const P0={name:"flip",enabled:!0,phase:"main",fn:L0,requiresIfExists:["offset"],data:{_skip:!1}};function du(n,t,e){return e===void 0&&(e={x:0,y:0}),{top:n.top-t.height-e.y,right:n.right-t.width+e.x,bottom:n.bottom-t.height+e.y,left:n.left-t.width-e.x}}function hu(n){return[be,He,ze,we].some(function(t){return n[t]>=0})}function I0(n){var t=n.state,e=n.name,i=t.rects.reference,r=t.rects.popper,s=t.modifiersData.preventOverflow,a=Ar(t,{elementContext:"reference"}),o=Ar(t,{altBoundary:!0}),l=du(a,i),c=du(o,r,s),u=hu(l),h=hu(c);t.modifiersData[e]={referenceClippingOffsets:l,popperEscapeOffsets:c,isReferenceHidden:u,hasPopperEscaped:h},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":u,"data-popper-escaped":h})}const U0={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:I0};function N0(n,t,e){var i=en(n),r=[we,be].indexOf(i)>=0?-1:1,s=typeof e=="function"?e(Object.assign({},t,{placement:n})):e,a=s[0],o=s[1];return a=a||0,o=(o||0)*r,[we,He].indexOf(i)>=0?{x:o,y:a}:{x:a,y:o}}function O0(n){var t=n.state,e=n.options,i=n.name,r=e.offset,s=r===void 0?[0,0]:r,a=vd.reduce(function(u,h){return u[h]=N0(h,t.rects,s),u},{}),o=a[t.placement],l=o.x,c=o.y;t.modifiersData.popperOffsets!=null&&(t.modifiersData.popperOffsets.x+=l,t.modifiersData.popperOffsets.y+=c),t.modifiersData[i]=a}const F0={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:O0};function k0(n){var t=n.state,e=n.name;t.modifiersData[e]=wd({reference:t.rects.reference,element:t.rects.popper,placement:t.placement})}const B0={name:"popperOffsets",enabled:!0,phase:"read",fn:k0,data:{}};function z0(n){return n==="x"?"y":"x"}function H0(n){var t=n.state,e=n.options,i=n.name,r=e.mainAxis,s=r===void 0?!0:r,a=e.altAxis,o=a===void 0?!1:a,l=e.boundary,c=e.rootBoundary,u=e.altBoundary,h=e.padding,d=e.tether,m=d===void 0?!0:d,_=e.tetherOffset,g=_===void 0?0:_,p=Ar(t,{boundary:l,rootBoundary:c,padding:h,altBoundary:u}),f=en(t.placement),b=ji(t.placement),S=!b,E=gl(f),D=z0(E),w=t.modifiersData.popperOffsets,T=t.rects.reference,L=t.rects.popper,M=typeof g=="function"?g(Object.assign({},t.rects,{placement:t.placement})):g,v=typeof M=="number"?{mainAxis:M,altAxis:M}:Object.assign({mainAxis:0,altAxis:0},M),C=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,k={x:0,y:0};if(w){if(s){var U,z=E==="y"?be:we,G=E==="y"?ze:He,V=E==="y"?"height":"width",$=w[E],W=$+p[z],st=$-p[G],lt=m?-L[V]/2:0,ft=b===Xi?T[V]:L[V],Rt=b===Xi?-L[V]:-T[V],Bt=t.elements.arrow,X=m&&Bt?ml(Bt):{width:0,height:0},J=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:Md(),ut=J[z],at=J[G],xt=vr(0,T[V],X[V]),Et=S?T[V]/2-lt-xt-ut-v.mainAxis:ft-xt-ut-v.mainAxis,Ut=S?-T[V]/2+lt+xt+at+v.mainAxis:Rt+xt+at+v.mainAxis,Kt=t.elements.arrow&&Ir(t.elements.arrow),R=Kt?E==="y"?Kt.clientTop||0:Kt.clientLeft||0:0,Zt=(U=C?.[E])!=null?U:0,Ht=$+Et-Zt-R,Vt=$+Ut-Zt,gt=vr(m?Hs(W,Ht):W,$,m?ri(st,Vt):st);w[E]=gt,k[E]=gt-$}if(o){var Jt,bt=E==="x"?be:we,Tt=E==="x"?ze:He,A=w[D],x=D==="y"?"height":"width",H=A+p[bt],Y=A-p[Tt],Z=[be,we].indexOf(f)!==-1,K=(Jt=C?.[D])!=null?Jt:0,yt=Z?H:A-T[x]-L[x]-K+v.altAxis,it=Z?A+T[x]+L[x]-K-v.altAxis:Y,ct=m&&Z?d0(yt,A,it):vr(m?yt:H,A,m?it:Y);w[D]=ct,k[D]=ct-A}t.modifiersData[i]=k}}const V0={name:"preventOverflow",enabled:!0,phase:"main",fn:H0,requiresIfExists:["offset"]};function G0(n){return{scrollLeft:n.scrollLeft,scrollTop:n.scrollTop}}function W0(n){return n===Pe(n)||!ke(n)?_l(n):G0(n)}function X0(n){var t=n.getBoundingClientRect(),e=qi(t.width)/n.offsetWidth||1,i=qi(t.height)/n.offsetHeight||1;return e!==1||i!==1}function q0(n,t,e){e===void 0&&(e=!1);var i=ke(t),r=ke(t)&&X0(t),s=Hn(t),a=Yi(n,r,e),o={scrollLeft:0,scrollTop:0},l={x:0,y:0};return(i||!i&&!e)&&((rn(t)!=="body"||xl(s))&&(o=W0(t)),ke(t)?(l=Yi(t,!0),l.x+=t.clientLeft,l.y+=t.clientTop):s&&(l.x=vl(s))),{x:a.left+o.scrollLeft-l.x,y:a.top+o.scrollTop-l.y,width:a.width,height:a.height}}function Y0(n){var t=new Map,e=new Set,i=[];n.forEach(function(s){t.set(s.name,s)});function r(s){e.add(s.name);var a=[].concat(s.requires||[],s.requiresIfExists||[]);a.forEach(function(o){if(!e.has(o)){var l=t.get(o);l&&r(l)}}),i.push(s)}return n.forEach(function(s){e.has(s.name)||r(s)}),i}function j0(n){var t=Y0(n);return s0.reduce(function(e,i){return e.concat(t.filter(function(r){return r.phase===i}))},[])}function K0(n){var t;return function(){return t||(t=new Promise(function(e){Promise.resolve().then(function(){t=void 0,e(n())})})),t}}function $0(n){var t=n.reduce(function(e,i){var r=e[i.name];return e[i.name]=r?Object.assign({},r,i,{options:Object.assign({},r.options,i.options),data:Object.assign({},r.data,i.data)}):i,e},{});return Object.keys(t).map(function(e){return t[e]})}var fu={placement:"bottom",modifiers:[],strategy:"absolute"};function pu(){for(var n=arguments.length,t=new Array(n),e=0;e<n;e++)t[e]=arguments[e];return!t.some(function(i){return!(i&&typeof i.getBoundingClientRect=="function")})}function Z0(n){n===void 0&&(n={});var t=n,e=t.defaultModifiers,i=e===void 0?[]:e,r=t.defaultOptions,s=r===void 0?fu:r;return function(o,l,c){c===void 0&&(c=s);var u={placement:"bottom",orderedModifiers:[],options:Object.assign({},fu,s),modifiersData:{},elements:{reference:o,popper:l},attributes:{},styles:{}},h=[],d=!1,m={state:u,setOptions:function(f){var b=typeof f=="function"?f(u.options):f;g(),u.options=Object.assign({},s,u.options,b),u.scrollParents={reference:oi(o)?xr(o):o.contextElement?xr(o.contextElement):[],popper:xr(l)};var S=j0($0([].concat(i,u.options.modifiers)));return u.orderedModifiers=S.filter(function(E){return E.enabled}),_(),m.update()},forceUpdate:function(){if(!d){var f=u.elements,b=f.reference,S=f.popper;if(pu(b,S)){u.rects={reference:q0(b,Ir(S),u.options.strategy==="fixed"),popper:ml(S)},u.reset=!1,u.placement=u.options.placement,u.orderedModifiers.forEach(function(v){return u.modifiersData[v.name]=Object.assign({},v.data)});for(var E=0;E<u.orderedModifiers.length;E++){if(u.reset===!0){u.reset=!1,E=-1;continue}var D=u.orderedModifiers[E],w=D.fn,T=D.options,L=T===void 0?{}:T,M=D.name;typeof w=="function"&&(u=w({state:u,options:L,name:M,instance:m})||u)}}}},update:K0(function(){return new Promise(function(p){m.forceUpdate(),p(u)})}),destroy:function(){g(),d=!0}};if(!pu(o,l))return m;m.setOptions(c).then(function(p){!d&&c.onFirstUpdate&&c.onFirstUpdate(p)});function _(){u.orderedModifiers.forEach(function(p){var f=p.name,b=p.options,S=b===void 0?{}:b,E=p.effect;if(typeof E=="function"){var D=E({state:u,name:f,instance:m,options:S}),w=function(){};h.push(D||w)}})}function g(){h.forEach(function(p){return p()}),h=[]}return m}}var J0=[M0,B0,x0,l0,F0,P0,V0,m0,U0],yl=Z0({defaultModifiers:J0}),Tn=function(){return Tn=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},Tn.apply(this,arguments)},fs=function(n,t,e){if(e||arguments.length===2)for(var i=0,r=t.length,s;i<r;i++)(s||!(i in t))&&(s||(s=Array.prototype.slice.call(t,0,i)),s[i]=t[i]);return n.concat(s||Array.prototype.slice.call(t))},Cn={placement:"bottom",triggerType:"click",offsetSkidding:0,offsetDistance:10,delay:300,ignoreClickOutsideClass:!1,onShow:function(){},onHide:function(){},onToggle:function(){}},Q0={id:null,override:!0},Ad=function(){function n(t,e,i,r){t===void 0&&(t=null),e===void 0&&(e=null),i===void 0&&(i=Cn),r===void 0&&(r=Q0),this._instanceId=r.id?r.id:t.id,this._targetEl=t,this._triggerEl=e,this._options=Tn(Tn({},Cn),i),this._popperInstance=null,this._visible=!1,this._initialized=!1,this.init(),It.addInstance("Dropdown",this,this._instanceId,r.override)}return n.prototype.init=function(){this._triggerEl&&this._targetEl&&!this._initialized&&(this._popperInstance=this._createPopperInstance(),this._setupEventListeners(),this._initialized=!0)},n.prototype.destroy=function(){var t=this,e=this._getTriggerEvents();this._options.triggerType==="click"&&e.showEvents.forEach(function(i){t._triggerEl.removeEventListener(i,t._clickHandler)}),this._options.triggerType==="hover"&&(e.showEvents.forEach(function(i){t._triggerEl.removeEventListener(i,t._hoverShowTriggerElHandler),t._targetEl.removeEventListener(i,t._hoverShowTargetElHandler)}),e.hideEvents.forEach(function(i){t._triggerEl.removeEventListener(i,t._hoverHideHandler),t._targetEl.removeEventListener(i,t._hoverHideHandler)})),this._popperInstance.destroy(),this._initialized=!1},n.prototype.removeInstance=function(){It.removeInstance("Dropdown",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype._setupEventListeners=function(){var t=this,e=this._getTriggerEvents();this._clickHandler=function(){t.toggle()},this._options.triggerType==="click"&&e.showEvents.forEach(function(i){t._triggerEl.addEventListener(i,t._clickHandler)}),this._hoverShowTriggerElHandler=function(i){i.type==="click"?t.toggle():setTimeout(function(){t.show()},t._options.delay)},this._hoverShowTargetElHandler=function(){t.show()},this._hoverHideHandler=function(){setTimeout(function(){t._targetEl.matches(":hover")||t.hide()},t._options.delay)},this._options.triggerType==="hover"&&(e.showEvents.forEach(function(i){t._triggerEl.addEventListener(i,t._hoverShowTriggerElHandler),t._targetEl.addEventListener(i,t._hoverShowTargetElHandler)}),e.hideEvents.forEach(function(i){t._triggerEl.addEventListener(i,t._hoverHideHandler),t._targetEl.addEventListener(i,t._hoverHideHandler)}))},n.prototype._createPopperInstance=function(){return yl(this._triggerEl,this._targetEl,{placement:this._options.placement,modifiers:[{name:"offset",options:{offset:[this._options.offsetSkidding,this._options.offsetDistance]}}]})},n.prototype._setupClickOutsideListener=function(){var t=this;this._clickOutsideEventListener=function(e){t._handleClickOutside(e,t._targetEl)},document.body.addEventListener("click",this._clickOutsideEventListener,!0)},n.prototype._removeClickOutsideListener=function(){document.body.removeEventListener("click",this._clickOutsideEventListener,!0)},n.prototype._handleClickOutside=function(t,e){var i=t.target,r=this._options.ignoreClickOutsideClass,s=!1;if(r){var a=document.querySelectorAll(".".concat(r));a.forEach(function(o){if(o.contains(i)){s=!0;return}})}i!==e&&!e.contains(i)&&!this._triggerEl.contains(i)&&!s&&this.isVisible()&&this.hide()},n.prototype._getTriggerEvents=function(){switch(this._options.triggerType){case"hover":return{showEvents:["mouseenter","click"],hideEvents:["mouseleave"]};case"click":return{showEvents:["click"],hideEvents:[]};case"none":return{showEvents:[],hideEvents:[]};default:return{showEvents:["click"],hideEvents:[]}}},n.prototype.toggle=function(){this.isVisible()?this.hide():this.show(),this._options.onToggle(this)},n.prototype.isVisible=function(){return this._visible},n.prototype.show=function(){this._targetEl.classList.remove("hidden"),this._targetEl.classList.add("block"),this._targetEl.removeAttribute("aria-hidden"),this._popperInstance.setOptions(function(t){return Tn(Tn({},t),{modifiers:fs(fs([],t.modifiers,!0),[{name:"eventListeners",enabled:!0}],!1)})}),this._setupClickOutsideListener(),this._popperInstance.update(),this._visible=!0,this._options.onShow(this)},n.prototype.hide=function(){this._targetEl.classList.remove("block"),this._targetEl.classList.add("hidden"),this._targetEl.setAttribute("aria-hidden","true"),this._popperInstance.setOptions(function(t){return Tn(Tn({},t),{modifiers:fs(fs([],t.modifiers,!0),[{name:"eventListeners",enabled:!1}],!1)})}),this._visible=!1,this._removeClickOutsideListener(),this._options.onHide(this)},n.prototype.updateOnShow=function(t){this._options.onShow=t},n.prototype.updateOnHide=function(t){this._options.onHide=t},n.prototype.updateOnToggle=function(t){this._options.onToggle=t},n}();function Ml(){document.querySelectorAll("[data-dropdown-toggle]").forEach(function(n){var t=n.getAttribute("data-dropdown-toggle"),e=document.getElementById(t);if(e){var i=n.getAttribute("data-dropdown-placement"),r=n.getAttribute("data-dropdown-offset-skidding"),s=n.getAttribute("data-dropdown-offset-distance"),a=n.getAttribute("data-dropdown-trigger"),o=n.getAttribute("data-dropdown-delay"),l=n.getAttribute("data-dropdown-ignore-click-outside-class");new Ad(e,n,{placement:i||Cn.placement,triggerType:a||Cn.triggerType,offsetSkidding:r?parseInt(r):Cn.offsetSkidding,offsetDistance:s?parseInt(s):Cn.offsetDistance,delay:o?parseInt(o):Cn.delay,ignoreClickOutsideClass:l||Cn.ignoreClickOutsideClass})}else console.error('The dropdown element with id "'.concat(t,'" does not exist. Please check the data-dropdown-toggle attribute.'))})}typeof window<"u"&&(window.Dropdown=Ad,window.initDropdowns=Ml);var Vs=function(){return Vs=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},Vs.apply(this,arguments)},Gs={placement:"center",backdropClasses:"bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40",backdrop:"dynamic",closable:!0,onHide:function(){},onShow:function(){},onToggle:function(){}},tx={id:null,override:!0},Td=function(){function n(t,e,i){t===void 0&&(t=null),e===void 0&&(e=Gs),i===void 0&&(i=tx),this._eventListenerInstances=[],this._instanceId=i.id?i.id:t.id,this._targetEl=t,this._options=Vs(Vs({},Gs),e),this._isHidden=!0,this._backdropEl=null,this._initialized=!1,this.init(),It.addInstance("Modal",this,this._instanceId,i.override)}return n.prototype.init=function(){var t=this;this._targetEl&&!this._initialized&&(this._getPlacementClasses().map(function(e){t._targetEl.classList.add(e)}),this._initialized=!0)},n.prototype.destroy=function(){this._initialized&&(this.removeAllEventListenerInstances(),this._destroyBackdropEl(),this._initialized=!1)},n.prototype.removeInstance=function(){It.removeInstance("Modal",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype._createBackdrop=function(){var t;if(this._isHidden){var e=document.createElement("div");(t=e.classList).add.apply(t,this._options.backdropClasses.split(" ")),document.querySelector("body").append(e),this._backdropEl=e}},n.prototype._destroyBackdropEl=function(){!this._isHidden&&this._backdropEl&&(this._backdropEl.remove(),this._backdropEl=null)},n.prototype._setupModalCloseEventListeners=function(){var t=this;this._options.backdrop==="dynamic"&&(this._clickOutsideEventListener=function(e){t._handleOutsideClick(e.target)},this._targetEl.addEventListener("click",this._clickOutsideEventListener,!0)),this._keydownEventListener=function(e){e.key==="Escape"&&t.hide()},document.body.addEventListener("keydown",this._keydownEventListener,!0)},n.prototype._removeModalCloseEventListeners=function(){this._options.backdrop==="dynamic"&&this._targetEl.removeEventListener("click",this._clickOutsideEventListener,!0),document.body.removeEventListener("keydown",this._keydownEventListener,!0)},n.prototype._handleOutsideClick=function(t){(t===this._targetEl||t===this._backdropEl&&this.isVisible())&&this.hide()},n.prototype._getPlacementClasses=function(){switch(this._options.placement){case"top-left":return["justify-start","items-start"];case"top-center":return["justify-center","items-start"];case"top-right":return["justify-end","items-start"];case"center-left":return["justify-start","items-center"];case"center":return["justify-center","items-center"];case"center-right":return["justify-end","items-center"];case"bottom-left":return["justify-start","items-end"];case"bottom-center":return["justify-center","items-end"];case"bottom-right":return["justify-end","items-end"];default:return["justify-center","items-center"]}},n.prototype.toggle=function(){this._isHidden?this.show():this.hide(),this._options.onToggle(this)},n.prototype.show=function(){this.isHidden&&(this._targetEl.classList.add("flex"),this._targetEl.classList.remove("hidden"),this._targetEl.setAttribute("aria-modal","true"),this._targetEl.setAttribute("role","dialog"),this._targetEl.removeAttribute("aria-hidden"),this._createBackdrop(),this._isHidden=!1,this._options.closable&&this._setupModalCloseEventListeners(),document.body.classList.add("overflow-hidden"),this._options.onShow(this))},n.prototype.hide=function(){this.isVisible&&(this._targetEl.classList.add("hidden"),this._targetEl.classList.remove("flex"),this._targetEl.setAttribute("aria-hidden","true"),this._targetEl.removeAttribute("aria-modal"),this._targetEl.removeAttribute("role"),this._destroyBackdropEl(),this._isHidden=!0,document.body.classList.remove("overflow-hidden"),this._options.closable&&this._removeModalCloseEventListeners(),this._options.onHide(this))},n.prototype.isVisible=function(){return!this._isHidden},n.prototype.isHidden=function(){return this._isHidden},n.prototype.addEventListenerInstance=function(t,e,i){this._eventListenerInstances.push({element:t,type:e,handler:i})},n.prototype.removeAllEventListenerInstances=function(){this._eventListenerInstances.map(function(t){t.element.removeEventListener(t.type,t.handler)}),this._eventListenerInstances=[]},n.prototype.getAllEventListenerInstances=function(){return this._eventListenerInstances},n.prototype.updateOnShow=function(t){this._options.onShow=t},n.prototype.updateOnHide=function(t){this._options.onHide=t},n.prototype.updateOnToggle=function(t){this._options.onToggle=t},n}();function Sl(){document.querySelectorAll("[data-modal-target]").forEach(function(n){var t=n.getAttribute("data-modal-target"),e=document.getElementById(t);if(e){var i=e.getAttribute("data-modal-placement"),r=e.getAttribute("data-modal-backdrop");new Td(e,{placement:i||Gs.placement,backdrop:r||Gs.backdrop})}else console.error("Modal with id ".concat(t," does not exist. Are you sure that the data-modal-target attribute points to the correct modal id?."))}),document.querySelectorAll("[data-modal-toggle]").forEach(function(n){var t=n.getAttribute("data-modal-toggle"),e=document.getElementById(t);if(e){var i=It.getInstance("Modal",t);if(i){var r=function(){i.toggle()};n.addEventListener("click",r),i.addEventListenerInstance(n,"click",r)}else console.error("Modal with id ".concat(t," has not been initialized. Please initialize it using the data-modal-target attribute."))}else console.error("Modal with id ".concat(t," does not exist. Are you sure that the data-modal-toggle attribute points to the correct modal id?"))}),document.querySelectorAll("[data-modal-show]").forEach(function(n){var t=n.getAttribute("data-modal-show"),e=document.getElementById(t);if(e){var i=It.getInstance("Modal",t);if(i){var r=function(){i.show()};n.addEventListener("click",r),i.addEventListenerInstance(n,"click",r)}else console.error("Modal with id ".concat(t," has not been initialized. Please initialize it using the data-modal-target attribute."))}else console.error("Modal with id ".concat(t," does not exist. Are you sure that the data-modal-show attribute points to the correct modal id?"))}),document.querySelectorAll("[data-modal-hide]").forEach(function(n){var t=n.getAttribute("data-modal-hide"),e=document.getElementById(t);if(e){var i=It.getInstance("Modal",t);if(i){var r=function(){i.hide()};n.addEventListener("click",r),i.addEventListenerInstance(n,"click",r)}else console.error("Modal with id ".concat(t," has not been initialized. Please initialize it using the data-modal-target attribute."))}else console.error("Modal with id ".concat(t," does not exist. Are you sure that the data-modal-hide attribute points to the correct modal id?"))})}typeof window<"u"&&(window.Modal=Td,window.initModals=Sl);var Ws=function(){return Ws=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},Ws.apply(this,arguments)},ei={placement:"left",bodyScrolling:!1,backdrop:!0,edge:!1,edgeOffset:"bottom-[60px]",backdropClasses:"bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-30",onShow:function(){},onHide:function(){},onToggle:function(){}},ex={id:null,override:!0},Cd=function(){function n(t,e,i){t===void 0&&(t=null),e===void 0&&(e=ei),i===void 0&&(i=ex),this._eventListenerInstances=[],this._instanceId=i.id?i.id:t.id,this._targetEl=t,this._options=Ws(Ws({},ei),e),this._visible=!1,this._initialized=!1,this.init(),It.addInstance("Drawer",this,this._instanceId,i.override)}return n.prototype.init=function(){var t=this;this._targetEl&&!this._initialized&&(this._targetEl.setAttribute("aria-hidden","true"),this._targetEl.classList.add("transition-transform"),this._getPlacementClasses(this._options.placement).base.map(function(e){t._targetEl.classList.add(e)}),this._handleEscapeKey=function(e){e.key==="Escape"&&t.isVisible()&&t.hide()},document.addEventListener("keydown",this._handleEscapeKey),this._initialized=!0)},n.prototype.destroy=function(){this._initialized&&(this.removeAllEventListenerInstances(),this._destroyBackdropEl(),document.removeEventListener("keydown",this._handleEscapeKey),this._initialized=!1)},n.prototype.removeInstance=function(){It.removeInstance("Drawer",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype.hide=function(){var t=this;this._options.edge?(this._getPlacementClasses(this._options.placement+"-edge").active.map(function(e){t._targetEl.classList.remove(e)}),this._getPlacementClasses(this._options.placement+"-edge").inactive.map(function(e){t._targetEl.classList.add(e)})):(this._getPlacementClasses(this._options.placement).active.map(function(e){t._targetEl.classList.remove(e)}),this._getPlacementClasses(this._options.placement).inactive.map(function(e){t._targetEl.classList.add(e)})),this._targetEl.setAttribute("aria-hidden","true"),this._targetEl.removeAttribute("aria-modal"),this._targetEl.removeAttribute("role"),this._options.bodyScrolling||document.body.classList.remove("overflow-hidden"),this._options.backdrop&&this._destroyBackdropEl(),this._visible=!1,this._options.onHide(this)},n.prototype.show=function(){var t=this;this._options.edge?(this._getPlacementClasses(this._options.placement+"-edge").active.map(function(e){t._targetEl.classList.add(e)}),this._getPlacementClasses(this._options.placement+"-edge").inactive.map(function(e){t._targetEl.classList.remove(e)})):(this._getPlacementClasses(this._options.placement).active.map(function(e){t._targetEl.classList.add(e)}),this._getPlacementClasses(this._options.placement).inactive.map(function(e){t._targetEl.classList.remove(e)})),this._targetEl.setAttribute("aria-modal","true"),this._targetEl.setAttribute("role","dialog"),this._targetEl.removeAttribute("aria-hidden"),this._options.bodyScrolling||document.body.classList.add("overflow-hidden"),this._options.backdrop&&this._createBackdrop(),this._visible=!0,this._options.onShow(this)},n.prototype.toggle=function(){this.isVisible()?this.hide():this.show()},n.prototype._createBackdrop=function(){var t,e=this;if(!this._visible){var i=document.createElement("div");i.setAttribute("drawer-backdrop",""),(t=i.classList).add.apply(t,this._options.backdropClasses.split(" ")),document.querySelector("body").append(i),i.addEventListener("click",function(){e.hide()})}},n.prototype._destroyBackdropEl=function(){this._visible&&document.querySelector("[drawer-backdrop]")!==null&&document.querySelector("[drawer-backdrop]").remove()},n.prototype._getPlacementClasses=function(t){switch(t){case"top":return{base:["top-0","left-0","right-0"],active:["transform-none"],inactive:["-translate-y-full"]};case"right":return{base:["right-0","top-0"],active:["transform-none"],inactive:["translate-x-full"]};case"bottom":return{base:["bottom-0","left-0","right-0"],active:["transform-none"],inactive:["translate-y-full"]};case"left":return{base:["left-0","top-0"],active:["transform-none"],inactive:["-translate-x-full"]};case"bottom-edge":return{base:["left-0","top-0"],active:["transform-none"],inactive:["translate-y-full",this._options.edgeOffset]};default:return{base:["left-0","top-0"],active:["transform-none"],inactive:["-translate-x-full"]}}},n.prototype.isHidden=function(){return!this._visible},n.prototype.isVisible=function(){return this._visible},n.prototype.addEventListenerInstance=function(t,e,i){this._eventListenerInstances.push({element:t,type:e,handler:i})},n.prototype.removeAllEventListenerInstances=function(){this._eventListenerInstances.map(function(t){t.element.removeEventListener(t.type,t.handler)}),this._eventListenerInstances=[]},n.prototype.getAllEventListenerInstances=function(){return this._eventListenerInstances},n.prototype.updateOnShow=function(t){this._options.onShow=t},n.prototype.updateOnHide=function(t){this._options.onHide=t},n.prototype.updateOnToggle=function(t){this._options.onToggle=t},n}();function El(){document.querySelectorAll("[data-drawer-target]").forEach(function(n){var t=n.getAttribute("data-drawer-target"),e=document.getElementById(t);if(e){var i=n.getAttribute("data-drawer-placement"),r=n.getAttribute("data-drawer-body-scrolling"),s=n.getAttribute("data-drawer-backdrop"),a=n.getAttribute("data-drawer-edge"),o=n.getAttribute("data-drawer-edge-offset");new Cd(e,{placement:i||ei.placement,bodyScrolling:r?r==="true":ei.bodyScrolling,backdrop:s?s==="true":ei.backdrop,edge:a?a==="true":ei.edge,edgeOffset:o||ei.edgeOffset})}else console.error("Drawer with id ".concat(t," not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"))}),document.querySelectorAll("[data-drawer-toggle]").forEach(function(n){var t=n.getAttribute("data-drawer-toggle"),e=document.getElementById(t);if(e){var i=It.getInstance("Drawer",t);if(i){var r=function(){i.toggle()};n.addEventListener("click",r),i.addEventListenerInstance(n,"click",r)}else console.error("Drawer with id ".concat(t," has not been initialized. Please initialize it using the data-drawer-target attribute."))}else console.error("Drawer with id ".concat(t," not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"))}),document.querySelectorAll("[data-drawer-dismiss], [data-drawer-hide]").forEach(function(n){var t=n.getAttribute("data-drawer-dismiss")?n.getAttribute("data-drawer-dismiss"):n.getAttribute("data-drawer-hide"),e=document.getElementById(t);if(e){var i=It.getInstance("Drawer",t);if(i){var r=function(){i.hide()};n.addEventListener("click",r),i.addEventListenerInstance(n,"click",r)}else console.error("Drawer with id ".concat(t," has not been initialized. Please initialize it using the data-drawer-target attribute."))}else console.error("Drawer with id ".concat(t," not found. Are you sure that the data-drawer-target attribute points to the correct drawer id"))}),document.querySelectorAll("[data-drawer-show]").forEach(function(n){var t=n.getAttribute("data-drawer-show"),e=document.getElementById(t);if(e){var i=It.getInstance("Drawer",t);if(i){var r=function(){i.show()};n.addEventListener("click",r),i.addEventListenerInstance(n,"click",r)}else console.error("Drawer with id ".concat(t," has not been initialized. Please initialize it using the data-drawer-target attribute."))}else console.error("Drawer with id ".concat(t," not found. Are you sure that the data-drawer-target attribute points to the correct drawer id?"))})}typeof window<"u"&&(window.Drawer=Cd,window.initDrawers=El);var Xs=function(){return Xs=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},Xs.apply(this,arguments)},qs={defaultTabId:null,activeClasses:"text-blue-600 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-500 border-blue-600 dark:border-blue-500",inactiveClasses:"dark:border-transparent text-gray-500 hover:text-gray-600 dark:text-gray-400 border-gray-100 hover:border-gray-300 dark:border-gray-700 dark:hover:text-gray-300",onShow:function(){}},nx={id:null,override:!0},Rd=function(){function n(t,e,i,r){t===void 0&&(t=null),e===void 0&&(e=[]),i===void 0&&(i=qs),r===void 0&&(r=nx),this._instanceId=r.id?r.id:t.id,this._tabsEl=t,this._items=e,this._activeTab=i?this.getTab(i.defaultTabId):null,this._options=Xs(Xs({},qs),i),this._initialized=!1,this.init(),It.addInstance("Tabs",this,this._instanceId,r.override)}return n.prototype.init=function(){var t=this;this._items.length&&!this._initialized&&(this._activeTab||this.setActiveTab(this._items[0]),this.show(this._activeTab.id,!0),this._items.map(function(e){e.triggerEl.addEventListener("click",function(i){i.preventDefault(),t.show(e.id)})}))},n.prototype.destroy=function(){this._initialized&&(this._initialized=!1)},n.prototype.removeInstance=function(){this.destroy(),It.removeInstance("Tabs",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype.getActiveTab=function(){return this._activeTab},n.prototype.setActiveTab=function(t){this._activeTab=t},n.prototype.getTab=function(t){return this._items.filter(function(e){return e.id===t})[0]},n.prototype.show=function(t,e){var i,r,s=this;e===void 0&&(e=!1);var a=this.getTab(t);a===this._activeTab&&!e||(this._items.map(function(o){var l,c;o!==a&&((l=o.triggerEl.classList).remove.apply(l,s._options.activeClasses.split(" ")),(c=o.triggerEl.classList).add.apply(c,s._options.inactiveClasses.split(" ")),o.targetEl.classList.add("hidden"),o.triggerEl.setAttribute("aria-selected","false"))}),(i=a.triggerEl.classList).add.apply(i,this._options.activeClasses.split(" ")),(r=a.triggerEl.classList).remove.apply(r,this._options.inactiveClasses.split(" ")),a.triggerEl.setAttribute("aria-selected","true"),a.targetEl.classList.remove("hidden"),this.setActiveTab(a),this._options.onShow(this,a))},n.prototype.updateOnShow=function(t){this._options.onShow=t},n}();function bl(){document.querySelectorAll("[data-tabs-toggle]").forEach(function(n){var t=[],e=n.getAttribute("data-tabs-active-classes"),i=n.getAttribute("data-tabs-inactive-classes"),r=null;n.querySelectorAll('[role="tab"]').forEach(function(s){var a=s.getAttribute("aria-selected")==="true",o={id:s.getAttribute("data-tabs-target"),triggerEl:s,targetEl:document.querySelector(s.getAttribute("data-tabs-target"))};t.push(o),a&&(r=o.id)}),new Rd(n,t,{defaultTabId:r,activeClasses:e||qs.activeClasses,inactiveClasses:i||qs.inactiveClasses})})}typeof window<"u"&&(window.Tabs=Rd,window.initTabs=bl);var Rn=function(){return Rn=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},Rn.apply(this,arguments)},ps=function(n,t,e){if(e||arguments.length===2)for(var i=0,r=t.length,s;i<r;i++)(s||!(i in t))&&(s||(s=Array.prototype.slice.call(t,0,i)),s[i]=t[i]);return n.concat(s||Array.prototype.slice.call(t))},Ys={placement:"top",triggerType:"hover",onShow:function(){},onHide:function(){},onToggle:function(){}},ix={id:null,override:!0},Dd=function(){function n(t,e,i,r){t===void 0&&(t=null),e===void 0&&(e=null),i===void 0&&(i=Ys),r===void 0&&(r=ix),this._instanceId=r.id?r.id:t.id,this._targetEl=t,this._triggerEl=e,this._options=Rn(Rn({},Ys),i),this._popperInstance=null,this._visible=!1,this._initialized=!1,this.init(),It.addInstance("Tooltip",this,this._instanceId,r.override)}return n.prototype.init=function(){this._triggerEl&&this._targetEl&&!this._initialized&&(this._setupEventListeners(),this._popperInstance=this._createPopperInstance(),this._initialized=!0)},n.prototype.destroy=function(){var t=this;if(this._initialized){var e=this._getTriggerEvents();e.showEvents.forEach(function(i){t._triggerEl.removeEventListener(i,t._showHandler)}),e.hideEvents.forEach(function(i){t._triggerEl.removeEventListener(i,t._hideHandler)}),this._removeKeydownListener(),this._removeClickOutsideListener(),this._popperInstance&&this._popperInstance.destroy(),this._initialized=!1}},n.prototype.removeInstance=function(){It.removeInstance("Tooltip",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype._setupEventListeners=function(){var t=this,e=this._getTriggerEvents();this._showHandler=function(){t.show()},this._hideHandler=function(){t.hide()},e.showEvents.forEach(function(i){t._triggerEl.addEventListener(i,t._showHandler)}),e.hideEvents.forEach(function(i){t._triggerEl.addEventListener(i,t._hideHandler)})},n.prototype._createPopperInstance=function(){return yl(this._triggerEl,this._targetEl,{placement:this._options.placement,modifiers:[{name:"offset",options:{offset:[0,8]}}]})},n.prototype._getTriggerEvents=function(){switch(this._options.triggerType){case"hover":return{showEvents:["mouseenter","focus"],hideEvents:["mouseleave","blur"]};case"click":return{showEvents:["click","focus"],hideEvents:["focusout","blur"]};case"none":return{showEvents:[],hideEvents:[]};default:return{showEvents:["mouseenter","focus"],hideEvents:["mouseleave","blur"]}}},n.prototype._setupKeydownListener=function(){var t=this;this._keydownEventListener=function(e){e.key==="Escape"&&t.hide()},document.body.addEventListener("keydown",this._keydownEventListener,!0)},n.prototype._removeKeydownListener=function(){document.body.removeEventListener("keydown",this._keydownEventListener,!0)},n.prototype._setupClickOutsideListener=function(){var t=this;this._clickOutsideEventListener=function(e){t._handleClickOutside(e,t._targetEl)},document.body.addEventListener("click",this._clickOutsideEventListener,!0)},n.prototype._removeClickOutsideListener=function(){document.body.removeEventListener("click",this._clickOutsideEventListener,!0)},n.prototype._handleClickOutside=function(t,e){var i=t.target;i!==e&&!e.contains(i)&&!this._triggerEl.contains(i)&&this.isVisible()&&this.hide()},n.prototype.isVisible=function(){return this._visible},n.prototype.toggle=function(){this.isVisible()?this.hide():this.show()},n.prototype.show=function(){this._targetEl.classList.remove("opacity-0","invisible"),this._targetEl.classList.add("opacity-100","visible"),this._popperInstance.setOptions(function(t){return Rn(Rn({},t),{modifiers:ps(ps([],t.modifiers,!0),[{name:"eventListeners",enabled:!0}],!1)})}),this._setupClickOutsideListener(),this._setupKeydownListener(),this._popperInstance.update(),this._visible=!0,this._options.onShow(this)},n.prototype.hide=function(){this._targetEl.classList.remove("opacity-100","visible"),this._targetEl.classList.add("opacity-0","invisible"),this._popperInstance.setOptions(function(t){return Rn(Rn({},t),{modifiers:ps(ps([],t.modifiers,!0),[{name:"eventListeners",enabled:!1}],!1)})}),this._removeClickOutsideListener(),this._removeKeydownListener(),this._visible=!1,this._options.onHide(this)},n.prototype.updateOnShow=function(t){this._options.onShow=t},n.prototype.updateOnHide=function(t){this._options.onHide=t},n.prototype.updateOnToggle=function(t){this._options.onToggle=t},n}();function wl(){document.querySelectorAll("[data-tooltip-target]").forEach(function(n){var t=n.getAttribute("data-tooltip-target"),e=document.getElementById(t);if(e){var i=n.getAttribute("data-tooltip-trigger"),r=n.getAttribute("data-tooltip-placement");new Dd(e,n,{placement:r||Ys.placement,triggerType:i||Ys.triggerType})}else console.error('The tooltip element with id "'.concat(t,'" does not exist. Please check the data-tooltip-target attribute.'))})}typeof window<"u"&&(window.Tooltip=Dd,window.initTooltips=wl);var Dn=function(){return Dn=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},Dn.apply(this,arguments)},ms=function(n,t,e){if(e||arguments.length===2)for(var i=0,r=t.length,s;i<r;i++)(s||!(i in t))&&(s||(s=Array.prototype.slice.call(t,0,i)),s[i]=t[i]);return n.concat(s||Array.prototype.slice.call(t))},yr={placement:"top",offset:10,triggerType:"hover",onShow:function(){},onHide:function(){},onToggle:function(){}},rx={id:null,override:!0},Ld=function(){function n(t,e,i,r){t===void 0&&(t=null),e===void 0&&(e=null),i===void 0&&(i=yr),r===void 0&&(r=rx),this._instanceId=r.id?r.id:t.id,this._targetEl=t,this._triggerEl=e,this._options=Dn(Dn({},yr),i),this._popperInstance=null,this._visible=!1,this._initialized=!1,this.init(),It.addInstance("Popover",this,r.id?r.id:this._targetEl.id,r.override)}return n.prototype.init=function(){this._triggerEl&&this._targetEl&&!this._initialized&&(this._setupEventListeners(),this._popperInstance=this._createPopperInstance(),this._initialized=!0)},n.prototype.destroy=function(){var t=this;if(this._initialized){var e=this._getTriggerEvents();e.showEvents.forEach(function(i){t._triggerEl.removeEventListener(i,t._showHandler),t._targetEl.removeEventListener(i,t._showHandler)}),e.hideEvents.forEach(function(i){t._triggerEl.removeEventListener(i,t._hideHandler),t._targetEl.removeEventListener(i,t._hideHandler)}),this._removeKeydownListener(),this._removeClickOutsideListener(),this._popperInstance&&this._popperInstance.destroy(),this._initialized=!1}},n.prototype.removeInstance=function(){It.removeInstance("Popover",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype._setupEventListeners=function(){var t=this,e=this._getTriggerEvents();this._showHandler=function(){t.show()},this._hideHandler=function(){setTimeout(function(){t._targetEl.matches(":hover")||t.hide()},100)},e.showEvents.forEach(function(i){t._triggerEl.addEventListener(i,t._showHandler),t._targetEl.addEventListener(i,t._showHandler)}),e.hideEvents.forEach(function(i){t._triggerEl.addEventListener(i,t._hideHandler),t._targetEl.addEventListener(i,t._hideHandler)})},n.prototype._createPopperInstance=function(){return yl(this._triggerEl,this._targetEl,{placement:this._options.placement,modifiers:[{name:"offset",options:{offset:[0,this._options.offset]}}]})},n.prototype._getTriggerEvents=function(){switch(this._options.triggerType){case"hover":return{showEvents:["mouseenter","focus"],hideEvents:["mouseleave","blur"]};case"click":return{showEvents:["click","focus"],hideEvents:["focusout","blur"]};case"none":return{showEvents:[],hideEvents:[]};default:return{showEvents:["mouseenter","focus"],hideEvents:["mouseleave","blur"]}}},n.prototype._setupKeydownListener=function(){var t=this;this._keydownEventListener=function(e){e.key==="Escape"&&t.hide()},document.body.addEventListener("keydown",this._keydownEventListener,!0)},n.prototype._removeKeydownListener=function(){document.body.removeEventListener("keydown",this._keydownEventListener,!0)},n.prototype._setupClickOutsideListener=function(){var t=this;this._clickOutsideEventListener=function(e){t._handleClickOutside(e,t._targetEl)},document.body.addEventListener("click",this._clickOutsideEventListener,!0)},n.prototype._removeClickOutsideListener=function(){document.body.removeEventListener("click",this._clickOutsideEventListener,!0)},n.prototype._handleClickOutside=function(t,e){var i=t.target;i!==e&&!e.contains(i)&&!this._triggerEl.contains(i)&&this.isVisible()&&this.hide()},n.prototype.isVisible=function(){return this._visible},n.prototype.toggle=function(){this.isVisible()?this.hide():this.show(),this._options.onToggle(this)},n.prototype.show=function(){this._targetEl.classList.remove("opacity-0","invisible"),this._targetEl.classList.add("opacity-100","visible"),this._popperInstance.setOptions(function(t){return Dn(Dn({},t),{modifiers:ms(ms([],t.modifiers,!0),[{name:"eventListeners",enabled:!0}],!1)})}),this._setupClickOutsideListener(),this._setupKeydownListener(),this._popperInstance.update(),this._visible=!0,this._options.onShow(this)},n.prototype.hide=function(){this._targetEl.classList.remove("opacity-100","visible"),this._targetEl.classList.add("opacity-0","invisible"),this._popperInstance.setOptions(function(t){return Dn(Dn({},t),{modifiers:ms(ms([],t.modifiers,!0),[{name:"eventListeners",enabled:!1}],!1)})}),this._removeClickOutsideListener(),this._removeKeydownListener(),this._visible=!1,this._options.onHide(this)},n.prototype.updateOnShow=function(t){this._options.onShow=t},n.prototype.updateOnHide=function(t){this._options.onHide=t},n.prototype.updateOnToggle=function(t){this._options.onToggle=t},n}();function Al(){document.querySelectorAll("[data-popover-target]").forEach(function(n){var t=n.getAttribute("data-popover-target"),e=document.getElementById(t);if(e){var i=n.getAttribute("data-popover-trigger"),r=n.getAttribute("data-popover-placement"),s=n.getAttribute("data-popover-offset");new Ld(e,n,{placement:r||yr.placement,offset:s?parseInt(s):yr.offset,triggerType:i||yr.triggerType})}else console.error('The popover element with id "'.concat(t,'" does not exist. Please check the data-popover-target attribute.'))})}typeof window<"u"&&(window.Popover=Ld,window.initPopovers=Al);var js=function(){return js=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},js.apply(this,arguments)},ko={triggerType:"hover",onShow:function(){},onHide:function(){},onToggle:function(){}},sx={id:null,override:!0},Pd=function(){function n(t,e,i,r,s){t===void 0&&(t=null),e===void 0&&(e=null),i===void 0&&(i=null),r===void 0&&(r=ko),s===void 0&&(s=sx),this._instanceId=s.id?s.id:i.id,this._parentEl=t,this._triggerEl=e,this._targetEl=i,this._options=js(js({},ko),r),this._visible=!1,this._initialized=!1,this.init(),It.addInstance("Dial",this,this._instanceId,s.override)}return n.prototype.init=function(){var t=this;if(this._triggerEl&&this._targetEl&&!this._initialized){var e=this._getTriggerEventTypes(this._options.triggerType);this._showEventHandler=function(){t.show()},e.showEvents.forEach(function(i){t._triggerEl.addEventListener(i,t._showEventHandler),t._targetEl.addEventListener(i,t._showEventHandler)}),this._hideEventHandler=function(){t._parentEl.matches(":hover")||t.hide()},e.hideEvents.forEach(function(i){t._parentEl.addEventListener(i,t._hideEventHandler)}),this._initialized=!0}},n.prototype.destroy=function(){var t=this;if(this._initialized){var e=this._getTriggerEventTypes(this._options.triggerType);e.showEvents.forEach(function(i){t._triggerEl.removeEventListener(i,t._showEventHandler),t._targetEl.removeEventListener(i,t._showEventHandler)}),e.hideEvents.forEach(function(i){t._parentEl.removeEventListener(i,t._hideEventHandler)}),this._initialized=!1}},n.prototype.removeInstance=function(){It.removeInstance("Dial",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype.hide=function(){this._targetEl.classList.add("hidden"),this._triggerEl&&this._triggerEl.setAttribute("aria-expanded","false"),this._visible=!1,this._options.onHide(this)},n.prototype.show=function(){this._targetEl.classList.remove("hidden"),this._triggerEl&&this._triggerEl.setAttribute("aria-expanded","true"),this._visible=!0,this._options.onShow(this)},n.prototype.toggle=function(){this._visible?this.hide():this.show()},n.prototype.isHidden=function(){return!this._visible},n.prototype.isVisible=function(){return this._visible},n.prototype._getTriggerEventTypes=function(t){switch(t){case"hover":return{showEvents:["mouseenter","focus"],hideEvents:["mouseleave","blur"]};case"click":return{showEvents:["click","focus"],hideEvents:["focusout","blur"]};case"none":return{showEvents:[],hideEvents:[]};default:return{showEvents:["mouseenter","focus"],hideEvents:["mouseleave","blur"]}}},n.prototype.updateOnShow=function(t){this._options.onShow=t},n.prototype.updateOnHide=function(t){this._options.onHide=t},n.prototype.updateOnToggle=function(t){this._options.onToggle=t},n}();function Tl(){document.querySelectorAll("[data-dial-init]").forEach(function(n){var t=n.querySelector("[data-dial-toggle]");if(t){var e=t.getAttribute("data-dial-toggle"),i=document.getElementById(e);if(i){var r=t.getAttribute("data-dial-trigger");new Pd(n,t,i,{triggerType:r||ko.triggerType})}else console.error("Dial with id ".concat(e," does not exist. Are you sure that the data-dial-toggle attribute points to the correct modal id?"))}else console.error("Dial with id ".concat(n.id," does not have a trigger element. Are you sure that the data-dial-toggle attribute exists?"))})}typeof window<"u"&&(window.Dial=Pd,window.initDials=Tl);var Ks=function(){return Ks=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},Ks.apply(this,arguments)},mu={minValue:null,maxValue:null,onIncrement:function(){},onDecrement:function(){}},ax={id:null,override:!0},Id=function(){function n(t,e,i,r,s){t===void 0&&(t=null),e===void 0&&(e=null),i===void 0&&(i=null),r===void 0&&(r=mu),s===void 0&&(s=ax),this._instanceId=s.id?s.id:t.id,this._targetEl=t,this._incrementEl=e,this._decrementEl=i,this._options=Ks(Ks({},mu),r),this._initialized=!1,this.init(),It.addInstance("InputCounter",this,this._instanceId,s.override)}return n.prototype.init=function(){var t=this;this._targetEl&&!this._initialized&&(this._inputHandler=function(e){{var i=e.target;/^\d*$/.test(i.value)||(i.value=i.value.replace(/[^\d]/g,"")),t._options.maxValue!==null&&parseInt(i.value)>t._options.maxValue&&(i.value=t._options.maxValue.toString()),t._options.minValue!==null&&parseInt(i.value)<t._options.minValue&&(i.value=t._options.minValue.toString())}},this._incrementClickHandler=function(){t.increment()},this._decrementClickHandler=function(){t.decrement()},this._targetEl.addEventListener("input",this._inputHandler),this._incrementEl&&this._incrementEl.addEventListener("click",this._incrementClickHandler),this._decrementEl&&this._decrementEl.addEventListener("click",this._decrementClickHandler),this._initialized=!0)},n.prototype.destroy=function(){this._targetEl&&this._initialized&&(this._targetEl.removeEventListener("input",this._inputHandler),this._incrementEl&&this._incrementEl.removeEventListener("click",this._incrementClickHandler),this._decrementEl&&this._decrementEl.removeEventListener("click",this._decrementClickHandler),this._initialized=!1)},n.prototype.removeInstance=function(){It.removeInstance("InputCounter",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype.getCurrentValue=function(){return parseInt(this._targetEl.value)||0},n.prototype.increment=function(){this._options.maxValue!==null&&this.getCurrentValue()>=this._options.maxValue||(this._targetEl.value=(this.getCurrentValue()+1).toString(),this._options.onIncrement(this))},n.prototype.decrement=function(){this._options.minValue!==null&&this.getCurrentValue()<=this._options.minValue||(this._targetEl.value=(this.getCurrentValue()-1).toString(),this._options.onDecrement(this))},n.prototype.updateOnIncrement=function(t){this._options.onIncrement=t},n.prototype.updateOnDecrement=function(t){this._options.onDecrement=t},n}();function Cl(){document.querySelectorAll("[data-input-counter]").forEach(function(n){var t=n.id,e=document.querySelector('[data-input-counter-increment="'+t+'"]'),i=document.querySelector('[data-input-counter-decrement="'+t+'"]'),r=n.getAttribute("data-input-counter-min"),s=n.getAttribute("data-input-counter-max");n?It.instanceExists("InputCounter",n.getAttribute("id"))||new Id(n,e||null,i||null,{minValue:r?parseInt(r):null,maxValue:s?parseInt(s):null}):console.error('The target element with id "'.concat(t,'" does not exist. Please check the data-input-counter attribute.'))})}typeof window<"u"&&(window.InputCounter=Id,window.initInputCounters=Cl);var $s=function(){return $s=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},$s.apply(this,arguments)},Zs={htmlEntities:!1,contentType:"input",onCopy:function(){}},ox={id:null,override:!0},Ud=function(){function n(t,e,i,r){t===void 0&&(t=null),e===void 0&&(e=null),i===void 0&&(i=Zs),r===void 0&&(r=ox),this._instanceId=r.id?r.id:e.id,this._triggerEl=t,this._targetEl=e,this._options=$s($s({},Zs),i),this._initialized=!1,this.init(),It.addInstance("CopyClipboard",this,this._instanceId,r.override)}return n.prototype.init=function(){var t=this;this._targetEl&&this._triggerEl&&!this._initialized&&(this._triggerElClickHandler=function(){t.copy()},this._triggerEl&&this._triggerEl.addEventListener("click",this._triggerElClickHandler),this._initialized=!0)},n.prototype.destroy=function(){this._triggerEl&&this._targetEl&&this._initialized&&(this._triggerEl&&this._triggerEl.removeEventListener("click",this._triggerElClickHandler),this._initialized=!1)},n.prototype.removeInstance=function(){It.removeInstance("CopyClipboard",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype.getTargetValue=function(){if(this._options.contentType==="input")return this._targetEl.value;if(this._options.contentType==="innerHTML")return this._targetEl.innerHTML;if(this._options.contentType==="textContent")return this._targetEl.textContent.replace(/\s+/g," ").trim()},n.prototype.copy=function(){var t=this.getTargetValue();this._options.htmlEntities&&(t=this.decodeHTML(t));var e=document.createElement("textarea");return e.value=t,document.body.appendChild(e),e.select(),document.execCommand("copy"),document.body.removeChild(e),this._options.onCopy(this),t},n.prototype.decodeHTML=function(t){var e=document.createElement("textarea");return e.innerHTML=t,e.textContent},n.prototype.updateOnCopyCallback=function(t){this._options.onCopy=t},n}();function Rl(){document.querySelectorAll("[data-copy-to-clipboard-target]").forEach(function(n){var t=n.getAttribute("data-copy-to-clipboard-target"),e=document.getElementById(t),i=n.getAttribute("data-copy-to-clipboard-content-type"),r=n.getAttribute("data-copy-to-clipboard-html-entities");e?It.instanceExists("CopyClipboard",e.getAttribute("id"))||new Ud(n,e,{htmlEntities:r&&r==="true"?!0:Zs.htmlEntities,contentType:i||Zs.contentType}):console.error('The target element with id "'.concat(t,'" does not exist. Please check the data-copy-to-clipboard-target attribute.'))})}typeof window<"u"&&(window.CopyClipboard=Ud,window.initClipboards=Rl);function Bo(n,t){(t==null||t>n.length)&&(t=n.length);for(var e=0,i=Array(t);e<t;e++)i[e]=n[e];return i}function lx(n){if(Array.isArray(n))return n}function cx(n){if(Array.isArray(n))return Bo(n)}function ux(n){if(n===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return n}function Dl(n,t,e){return t=kn(t),mx(n,Nd()?Reflect.construct(t,e||[],kn(n).constructor):t.apply(n,e))}function ui(n,t){if(!(n instanceof t))throw new TypeError("Cannot call a class as a function")}function gu(n,t){for(var e=0;e<t.length;e++){var i=t[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(n,vx(i.key),i)}}function di(n,t,e){return t&&gu(n.prototype,t),e&&gu(n,e),Object.defineProperty(n,"prototype",{writable:!1}),n}function Tr(){return Tr=typeof Reflect<"u"&&Reflect.get?Reflect.get.bind():function(n,t,e){var i=gx(n,t);if(i){var r=Object.getOwnPropertyDescriptor(i,t);return r.get?r.get.call(arguments.length<3?n:e):r.value}},Tr.apply(null,arguments)}function kn(n){return kn=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(t){return t.__proto__||Object.getPrototypeOf(t)},kn(n)}function Ll(n,t){if(typeof t!="function"&&t!==null)throw new TypeError("Super expression must either be null or a function");n.prototype=Object.create(t&&t.prototype,{constructor:{value:n,writable:!0,configurable:!0}}),Object.defineProperty(n,"prototype",{writable:!1}),t&&zo(n,t)}function Nd(){try{var n=!Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){}))}catch{}return(Nd=function(){return!!n})()}function dx(n){if(typeof Symbol<"u"&&n[Symbol.iterator]!=null||n["@@iterator"]!=null)return Array.from(n)}function hx(n,t){var e=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(e!=null){var i,r,s,a,o=[],l=!0,c=!1;try{if(s=(e=e.call(n)).next,t===0){if(Object(e)!==e)return;l=!1}else for(;!(l=(i=s.call(e)).done)&&(o.push(i.value),o.length!==t);l=!0);}catch(u){c=!0,r=u}finally{try{if(!l&&e.return!=null&&(a=e.return(),Object(a)!==a))return}finally{if(c)throw r}}return o}}function fx(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function px(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function mx(n,t){if(t&&(typeof t=="object"||typeof t=="function"))return t;if(t!==void 0)throw new TypeError("Derived constructors may only return object or undefined");return ux(n)}function zo(n,t){return zo=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,i){return e.__proto__=i,e},zo(n,t)}function Le(n,t){return lx(n)||hx(n,t)||Od(n,t)||fx()}function gx(n,t){for(;!{}.hasOwnProperty.call(n,t)&&(n=kn(n))!==null;);return n}function Ur(n){return cx(n)||dx(n)||Od(n)||px()}function _x(n,t){if(typeof n!="object"||!n)return n;var e=n[Symbol.toPrimitive];if(e!==void 0){var i=e.call(n,t);if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(n)}function vx(n){var t=_x(n,"string");return typeof t=="symbol"?t:t+""}function Js(n){"@babel/helpers - typeof";return Js=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},Js(n)}function Od(n,t){if(n){if(typeof n=="string")return Bo(n,t);var e={}.toString.call(n).slice(8,-1);return e==="Object"&&n.constructor&&(e=n.constructor.name),e==="Map"||e==="Set"?Array.from(n):e==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?Bo(n,t):void 0}}function _n(n,t){return Object.prototype.hasOwnProperty.call(n,t)}function Pl(n){return n[n.length-1]}function li(n){for(var t=arguments.length,e=new Array(t>1?t-1:0),i=1;i<t;i++)e[i-1]=arguments[i];return e.forEach(function(r){n.includes(r)||n.push(r)}),n}function Xa(n,t){return n?n.split(t):[]}function Il(n,t,e){var i=t===void 0||n>=t,r=e===void 0||n<=e;return i&&r}function Fd(n,t,e){return n<t?t:n>e?e:n}function Ki(n,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:0,r=arguments.length>4&&arguments[4]!==void 0?arguments[4]:"",s=Object.keys(e).reduce(function(o,l){var c=e[l];return typeof c=="function"&&(c=c(i)),"".concat(o," ").concat(l,'="').concat(c,'"')},n);r+="<".concat(s,"></").concat(n,">");var a=i+1;return a<t?Ki(n,t,e,a,r):r}function Ul(n){return n.replace(/>\s+/g,">").replace(/\s+</,"<")}function Ho(n){return new Date(n).setHours(0,0,0,0)}function hi(){return new Date().setHours(0,0,0,0)}function Nn(){switch(arguments.length){case 0:return hi();case 1:return Ho(arguments.length<=0?void 0:arguments[0])}var n=new Date(0);return n.setFullYear.apply(n,arguments),n.setHours(0,0,0,0)}function Fi(n,t){var e=new Date(n);return e.setDate(e.getDate()+t)}function xx(n,t){return Fi(n,t*7)}function Qs(n,t){var e=new Date(n),i=e.getMonth()+t,r=i%12;r<0&&(r+=12);var s=e.setMonth(i);return e.getMonth()!==r?e.setDate(0):s}function ki(n,t){var e=new Date(n),i=e.getMonth(),r=e.setFullYear(e.getFullYear()+t);return i===1&&e.getMonth()===2?e.setDate(0):r}function _u(n,t){return(n-t+7)%7}function ta(n,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:0,i=new Date(n).getDay();return Fi(n,_u(t,e)-_u(i,e))}function yx(n){var t=ta(n,4,1),e=ta(new Date(t).setMonth(0,4),4,1);return Math.round((t-e)/6048e5)+1}function Zn(n,t){var e=new Date(n).getFullYear();return Math.floor(e/t)*t}var Vo=/dd?|DD?|mm?|MM?|yy?(?:yy)?/,Mx=/[\s!-/:-@[-`{-~年月日]+/,qa={},vu={y:function(t,e){return new Date(t).setFullYear(parseInt(e,10))},m:function(t,e,i){var r=new Date(t),s=parseInt(e,10)-1;if(isNaN(s)){if(!e)return NaN;var a=e.toLowerCase(),o=function(c){return c.toLowerCase().startsWith(a)};if(s=i.monthsShort.findIndex(o),s<0&&(s=i.months.findIndex(o)),s<0)return NaN}return r.setMonth(s),r.getMonth()!==kd(s)?r.setDate(0):r.getTime()},d:function(t,e){return new Date(t).setDate(parseInt(e,10))}},Sx={d:function(t){return t.getDate()},dd:function(t){return gs(t.getDate(),2)},D:function(t,e){return e.daysShort[t.getDay()]},DD:function(t,e){return e.days[t.getDay()]},m:function(t){return t.getMonth()+1},mm:function(t){return gs(t.getMonth()+1,2)},M:function(t,e){return e.monthsShort[t.getMonth()]},MM:function(t,e){return e.months[t.getMonth()]},y:function(t){return t.getFullYear()},yy:function(t){return gs(t.getFullYear(),2).slice(-2)},yyyy:function(t){return gs(t.getFullYear(),4)}};function kd(n){return n>-1?n%12:kd(n+12)}function gs(n,t){return n.toString().padStart(t,"0")}function Bd(n){if(typeof n!="string")throw new Error("Invalid date format.");if(n in qa)return qa[n];var t=n.split(Vo),e=n.match(new RegExp(Vo,"g"));if(t.length===0||!e)throw new Error("Invalid date format.");var i=e.map(function(s){return Sx[s]}),r=Object.keys(vu).reduce(function(s,a){var o=e.find(function(l){return l[0]!=="D"&&l[0].toLowerCase()===a});return o&&s.push(a),s},[]);return qa[n]={parser:function(a,o){var l=a.split(Mx).reduce(function(c,u,h){if(u.length>0&&e[h]){var d=e[h][0];d==="M"?c.m=u:d!=="D"&&(c[d]=u)}return c},{});return r.reduce(function(c,u){var h=vu[u](c,l[u],o);return isNaN(h)?c:h},hi())},formatter:function(a,o){var l=i.reduce(function(c,u,h){return c+="".concat(t[h]).concat(u(a,o))},"");return l+=Pl(t)}}}function Cr(n,t,e){if(n instanceof Date||typeof n=="number"){var i=Ho(n);return isNaN(i)?void 0:i}if(n){if(n==="today")return hi();if(t&&t.toValue){var r=t.toValue(n,t,e);return isNaN(r)?void 0:Ho(r)}return Bd(t).parser(n,e)}}function Rr(n,t,e){if(isNaN(n)||!n&&n!==0)return"";var i=typeof n=="number"?new Date(n):n;return t.toDisplay?t.toDisplay(i,t,e):Bd(t).formatter(i,e)}var ea=new WeakMap,zd=EventTarget.prototype,xu=zd.addEventListener,yu=zd.removeEventListener;function Nl(n,t){var e=ea.get(n);e||(e=[],ea.set(n,e)),t.forEach(function(i){xu.call.apply(xu,Ur(i)),e.push(i)})}function Hd(n){var t=ea.get(n);t&&(t.forEach(function(e){yu.call.apply(yu,Ur(e))}),ea.delete(n))}if(!Event.prototype.composedPath){var Ex=function n(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];e.push(t);var i;return t.parentNode?i=t.parentNode:t.host?i=t.host:t.defaultView&&(i=t.defaultView),i?n(i,e):e};Event.prototype.composedPath=function(){return Ex(this.target)}}function Vd(n,t,e){var i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:0,r=n[i];return t(r)?r:r===e||!r.parentElement?void 0:Vd(n,t,e,i+1)}function Gd(n,t){var e=typeof t=="function"?t:function(i){return i.matches(t)};return Vd(n.composedPath(),e,n.currentTarget)}var hr={en:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],daysShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],daysMin:["Su","Mo","Tu","We","Th","Fr","Sa"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],monthsShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],today:"Today",clear:"Clear",titleFormat:"MM y"}},Nr={autohide:!1,beforeShowDay:null,beforeShowDecade:null,beforeShowMonth:null,beforeShowYear:null,calendarWeeks:!1,clearBtn:!1,dateDelimiter:",",datesDisabled:[],daysOfWeekDisabled:[],daysOfWeekHighlighted:[],defaultViewDate:void 0,disableTouchKeyboard:!1,format:"mm/dd/yyyy",language:"en",maxDate:null,maxNumberOfDates:1,maxView:3,minDate:null,nextArrow:'<svg class="w-4 h-4 rtl:rotate-180 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/></svg>',orientation:"auto",pickLevel:0,prevArrow:'<svg class="w-4 h-4 rtl:rotate-180 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4"/></svg>',showDaysOfWeek:!0,showOnClick:!0,showOnFocus:!0,startView:0,title:"",todayBtn:!1,todayBtnMode:0,todayHighlight:!1,updateOnBlur:!0,weekStart:0},Ya=null;function vn(n){return Ya==null&&(Ya=document.createRange()),Ya.createContextualFragment(n)}function Mr(n){n.style.display!=="none"&&(n.style.display&&(n.dataset.styleDisplay=n.style.display),n.style.display="none")}function Sr(n){n.style.display==="none"&&(n.dataset.styleDisplay?(n.style.display=n.dataset.styleDisplay,delete n.dataset.styleDisplay):n.style.display="")}function na(n){n.firstChild&&(n.removeChild(n.firstChild),na(n))}function bx(n,t){na(n),t instanceof DocumentFragment?n.appendChild(t):typeof t=="string"?n.appendChild(vn(t)):typeof t.forEach=="function"&&t.forEach(function(e){n.appendChild(e)})}var ja=Nr.language,wx=Nr.format,Ax=Nr.weekStart;function Mu(n,t){return n.length<6&&t>=0&&t<7?li(n,t):n}function Su(n){return(n+6)%7}function Eu(n,t,e,i){var r=Cr(n,t,e);return r!==void 0?r:i}function Ka(n,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:3,i=parseInt(n,10);return i>=0&&i<=e?i:t}function $a(n,t){var e=Object.assign({},n),i={},r=t.constructor.locales,s=t.config||{},a=s.format,o=s.language,l=s.locale,c=s.maxDate,u=s.maxView,h=s.minDate,d=s.pickLevel,m=s.startView,_=s.weekStart;if(e.language){var g;if(e.language!==o&&(r[e.language]?g=e.language:(g=e.language.split("-")[0],r[g]===void 0&&(g=!1))),delete e.language,g){o=i.language=g;var p=l||r[ja];l=Object.assign({format:wx,weekStart:Ax},r[ja]),o!==ja&&Object.assign(l,r[o]),i.locale=l,a===p.format&&(a=i.format=l.format),_===p.weekStart&&(_=i.weekStart=l.weekStart,i.weekEnd=Su(l.weekStart))}}if(e.format){var f=typeof e.format.toDisplay=="function",b=typeof e.format.toValue=="function",S=Vo.test(e.format);(f&&b||S)&&(a=i.format=e.format),delete e.format}var E=h,D=c;if(e.minDate!==void 0&&(E=e.minDate===null?Nn(0,0,1):Eu(e.minDate,a,l,E),delete e.minDate),e.maxDate!==void 0&&(D=e.maxDate===null?void 0:Eu(e.maxDate,a,l,D),delete e.maxDate),D<E?(h=i.minDate=D,c=i.maxDate=E):(h!==E&&(h=i.minDate=E),c!==D&&(c=i.maxDate=D)),e.datesDisabled&&(i.datesDisabled=e.datesDisabled.reduce(function(G,V){var $=Cr(V,a,l);return $!==void 0?li(G,$):G},[]),delete e.datesDisabled),e.defaultViewDate!==void 0){var w=Cr(e.defaultViewDate,a,l);w!==void 0&&(i.defaultViewDate=w),delete e.defaultViewDate}if(e.weekStart!==void 0){var T=Number(e.weekStart)%7;isNaN(T)||(_=i.weekStart=T,i.weekEnd=Su(T)),delete e.weekStart}if(e.daysOfWeekDisabled&&(i.daysOfWeekDisabled=e.daysOfWeekDisabled.reduce(Mu,[]),delete e.daysOfWeekDisabled),e.daysOfWeekHighlighted&&(i.daysOfWeekHighlighted=e.daysOfWeekHighlighted.reduce(Mu,[]),delete e.daysOfWeekHighlighted),e.maxNumberOfDates!==void 0){var L=parseInt(e.maxNumberOfDates,10);L>=0&&(i.maxNumberOfDates=L,i.multidate=L!==1),delete e.maxNumberOfDates}e.dateDelimiter&&(i.dateDelimiter=String(e.dateDelimiter),delete e.dateDelimiter);var M=d;e.pickLevel!==void 0&&(M=Ka(e.pickLevel,2),delete e.pickLevel),M!==d&&(d=i.pickLevel=M);var v=u;e.maxView!==void 0&&(v=Ka(e.maxView,u),delete e.maxView),v=d>v?d:v,v!==u&&(u=i.maxView=v);var C=m;if(e.startView!==void 0&&(C=Ka(e.startView,C),delete e.startView),C<d?C=d:C>u&&(C=u),C!==m&&(i.startView=C),e.prevArrow){var k=vn(e.prevArrow);k.childNodes.length>0&&(i.prevArrow=k.childNodes),delete e.prevArrow}if(e.nextArrow){var U=vn(e.nextArrow);U.childNodes.length>0&&(i.nextArrow=U.childNodes),delete e.nextArrow}if(e.disableTouchKeyboard!==void 0&&(i.disableTouchKeyboard="ontouchstart"in document&&!!e.disableTouchKeyboard,delete e.disableTouchKeyboard),e.orientation){var z=e.orientation.toLowerCase().split(/\s+/g);i.orientation={x:z.find(function(G){return G==="left"||G==="right"})||"auto",y:z.find(function(G){return G==="top"||G==="bottom"})||"auto"},delete e.orientation}if(e.todayBtnMode!==void 0){switch(e.todayBtnMode){case 0:case 1:i.todayBtnMode=e.todayBtnMode}delete e.todayBtnMode}return Object.keys(e).forEach(function(G){e[G]!==void 0&&_n(Nr,G)&&(i[G]=e[G])}),i}var Tx=Ul(`<div class="datepicker hidden">
  <div class="datepicker-picker inline-block rounded-lg bg-white dark:bg-gray-700 shadow-lg p-4">
    <div class="datepicker-header">
      <div class="datepicker-title bg-white dark:bg-gray-700 dark:text-white px-2 py-3 text-center font-semibold"></div>
      <div class="datepicker-controls flex justify-between mb-2">
        <button type="button" class="bg-white dark:bg-gray-700 rounded-lg text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 prev-btn"></button>
        <button type="button" class="text-sm rounded-lg text-gray-900 dark:text-white bg-white dark:bg-gray-700 font-semibold py-2.5 px-5 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200 view-switch"></button>
        <button type="button" class="bg-white dark:bg-gray-700 rounded-lg text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200 next-btn"></button>
      </div>
    </div>
    <div class="datepicker-main p-1"></div>
    <div class="datepicker-footer">
      <div class="datepicker-controls flex space-x-2 rtl:space-x-reverse mt-2">
        <button type="button" class="%buttonClass% today-btn text-white bg-blue-700 !bg-primary-700 dark:bg-blue-600 dark:!bg-primary-600 hover:bg-blue-800 hover:!bg-primary-800 dark:hover:bg-blue-700 dark:hover:!bg-primary-700 focus:ring-4 focus:ring-blue-300 focus:!ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center w-1/2"></button>
        <button type="button" class="%buttonClass% clear-btn text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 focus:!ring-primary-300 font-medium rounded-lg text-sm px-5 py-2 text-center w-1/2"></button>
      </div>
    </div>
  </div>
</div>`),Cx=Ul(`<div class="days">
  <div class="days-of-week grid grid-cols-7 mb-1">`.concat(Ki("span",7,{class:"dow block flex-1 leading-9 border-0 rounded-lg cursor-default text-center text-gray-900 font-semibold text-sm"}),`</div>
  <div class="datepicker-grid w-64 grid grid-cols-7">`).concat(Ki("span",42,{class:"block flex-1 leading-9 border-0 rounded-lg cursor-default text-center text-gray-900 font-semibold text-sm h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400"}),`</div>
</div>`)),Rx=Ul(`<div class="calendar-weeks">
  <div class="days-of-week flex"><span class="dow h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400"></span></div>
  <div class="weeks">`.concat(Ki("span",6,{class:"week block flex-1 leading-9 border-0 rounded-lg cursor-default text-center text-gray-900 font-semibold text-sm"}),`</div>
</div>`)),Ol=function(){function n(t,e){ui(this,n),Object.assign(this,e,{picker:t,element:vn('<div class="datepicker-view flex"></div>').firstChild,selected:[]}),this.init(this.picker.datepicker.config)}return di(n,[{key:"init",value:function(e){e.pickLevel!==void 0&&(this.isMinView=this.id===e.pickLevel),this.setOptions(e),this.updateFocus(),this.updateSelection()}},{key:"performBeforeHook",value:function(e,i,r){var s=this.beforeShow(new Date(r));switch(Js(s)){case"boolean":s={enabled:s};break;case"string":s={classes:s}}if(s){if(s.enabled===!1&&(e.classList.add("disabled"),li(this.disabled,i)),s.classes){var a,o=s.classes.split(/\s+/);(a=e.classList).add.apply(a,Ur(o)),o.includes("disabled")&&li(this.disabled,i)}s.content&&bx(e,s.content)}}}])}(),Dx=function(n){function t(e){return ui(this,t),Dl(this,t,[e,{id:0,name:"days",cellClass:"day"}])}return Ll(t,n),di(t,[{key:"init",value:function(i){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;if(r){var s=vn(Cx).firstChild;this.dow=s.firstChild,this.grid=s.lastChild,this.element.appendChild(s)}Tr(kn(t.prototype),"init",this).call(this,i)}},{key:"setOptions",value:function(i){var r=this,s;if(_n(i,"minDate")&&(this.minDate=i.minDate),_n(i,"maxDate")&&(this.maxDate=i.maxDate),i.datesDisabled&&(this.datesDisabled=i.datesDisabled),i.daysOfWeekDisabled&&(this.daysOfWeekDisabled=i.daysOfWeekDisabled,s=!0),i.daysOfWeekHighlighted&&(this.daysOfWeekHighlighted=i.daysOfWeekHighlighted),i.todayHighlight!==void 0&&(this.todayHighlight=i.todayHighlight),i.weekStart!==void 0&&(this.weekStart=i.weekStart,this.weekEnd=i.weekEnd,s=!0),i.locale){var a=this.locale=i.locale;this.dayNames=a.daysMin,this.switchLabelFormat=a.titleFormat,s=!0}if(i.beforeShowDay!==void 0&&(this.beforeShow=typeof i.beforeShowDay=="function"?i.beforeShowDay:void 0),i.calendarWeeks!==void 0)if(i.calendarWeeks&&!this.calendarWeeks){var o=vn(Rx).firstChild;this.calendarWeeks={element:o,dow:o.firstChild,weeks:o.lastChild},this.element.insertBefore(o,this.element.firstChild)}else this.calendarWeeks&&!i.calendarWeeks&&(this.element.removeChild(this.calendarWeeks.element),this.calendarWeeks=null);i.showDaysOfWeek!==void 0&&(i.showDaysOfWeek?(Sr(this.dow),this.calendarWeeks&&Sr(this.calendarWeeks.dow)):(Mr(this.dow),this.calendarWeeks&&Mr(this.calendarWeeks.dow))),s&&Array.from(this.dow.children).forEach(function(l,c){var u=(r.weekStart+c)%7;l.textContent=r.dayNames[u],l.className=r.daysOfWeekDisabled.includes(u)?"dow disabled text-center h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400 cursor-not-allowed":"dow text-center h-6 leading-6 text-sm font-medium text-gray-500 dark:text-gray-400"})}},{key:"updateFocus",value:function(){var i=new Date(this.picker.viewDate),r=i.getFullYear(),s=i.getMonth(),a=Nn(r,s,1),o=ta(a,this.weekStart,this.weekStart);this.first=a,this.last=Nn(r,s+1,0),this.start=o,this.focused=this.picker.viewDate}},{key:"updateSelection",value:function(){var i=this.picker.datepicker,r=i.dates,s=i.rangepicker;this.selected=r,s&&(this.range=s.dates)}},{key:"render",value:function(){var i=this;this.today=this.todayHighlight?hi():void 0,this.disabled=Ur(this.datesDisabled);var r=Rr(this.focused,this.switchLabelFormat,this.locale);if(this.picker.setViewSwitchLabel(r),this.picker.setPrevBtnDisabled(this.first<=this.minDate),this.picker.setNextBtnDisabled(this.last>=this.maxDate),this.calendarWeeks){var s=ta(this.first,1,1);Array.from(this.calendarWeeks.weeks.children).forEach(function(a,o){a.textContent=yx(xx(s,o))})}Array.from(this.grid.children).forEach(function(a,o){var l=a.classList,c=Fi(i.start,o),u=new Date(c),h=u.getDay();if(a.className="datepicker-cell hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 leading-9 border-0 rounded-lg cursor-pointer text-center text-gray-900 dark:text-white font-semibold text-sm ".concat(i.cellClass),a.dataset.date=c,a.textContent=u.getDate(),c<i.first?l.add("prev","text-gray-500","dark:text-white"):c>i.last&&l.add("next","text-gray-500","dark:text-white"),i.today===c&&l.add("today","bg-gray-100","dark:bg-gray-600"),(c<i.minDate||c>i.maxDate||i.disabled.includes(c))&&(l.add("disabled","cursor-not-allowed","text-gray-400","dark:text-gray-500"),l.remove("hover:bg-gray-100","dark:hover:bg-gray-600","text-gray-900","dark:text-white","cursor-pointer")),i.daysOfWeekDisabled.includes(h)&&(l.add("disabled","cursor-not-allowed","text-gray-400","dark:text-gray-500"),l.remove("hover:bg-gray-100","dark:hover:bg-gray-600","text-gray-900","dark:text-white","cursor-pointer"),li(i.disabled,c)),i.daysOfWeekHighlighted.includes(h)&&l.add("highlighted"),i.range){var d=Le(i.range,2),m=d[0],_=d[1];c>m&&c<_&&(l.add("range","bg-gray-200","dark:bg-gray-600"),l.remove("rounded-lg","rounded-l-lg","rounded-r-lg")),c===m&&(l.add("range-start","bg-gray-100","dark:bg-gray-600","rounded-l-lg"),l.remove("rounded-lg","rounded-r-lg")),c===_&&(l.add("range-end","bg-gray-100","dark:bg-gray-600","rounded-r-lg"),l.remove("rounded-lg","rounded-l-lg"))}i.selected.includes(c)&&(l.add("selected","bg-blue-700","!bg-primary-700","text-white","dark:bg-blue-600","dark:!bg-primary-600","dark:text-white"),l.remove("text-gray-900","text-gray-500","hover:bg-gray-100","dark:text-white","dark:hover:bg-gray-600","dark:bg-gray-600","bg-gray-100","bg-gray-200")),c===i.focused&&l.add("focused"),i.beforeShow&&i.performBeforeHook(a,c,c)})}},{key:"refresh",value:function(){var i=this,r=this.range||[],s=Le(r,2),a=s[0],o=s[1];this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach(function(l){l.classList.remove("range","range-start","range-end","selected","bg-blue-700","!bg-primary-700","text-white","dark:bg-blue-600","dark:!bg-primary-600","dark:text-white","focused"),l.classList.add("text-gray-900","rounded-lg","dark:text-white")}),Array.from(this.grid.children).forEach(function(l){var c=Number(l.dataset.date),u=l.classList;u.remove("bg-gray-200","dark:bg-gray-600","rounded-l-lg","rounded-r-lg"),c>a&&c<o&&(u.add("range","bg-gray-200","dark:bg-gray-600"),u.remove("rounded-lg")),c===a&&(u.add("range-start","bg-gray-200","dark:bg-gray-600","rounded-l-lg"),u.remove("rounded-lg")),c===o&&(u.add("range-end","bg-gray-200","dark:bg-gray-600","rounded-r-lg"),u.remove("rounded-lg")),i.selected.includes(c)&&(u.add("selected","bg-blue-700","!bg-primary-700","text-white","dark:bg-blue-600","dark:!bg-primary-600","dark:text-white"),u.remove("text-gray-900","hover:bg-gray-100","dark:text-white","dark:hover:bg-gray-600","bg-gray-100","bg-gray-200","dark:bg-gray-600")),c===i.focused&&u.add("focused")})}},{key:"refreshFocus",value:function(){var i=Math.round((this.focused-this.start)/864e5);this.grid.querySelectorAll(".focused").forEach(function(r){r.classList.remove("focused")}),this.grid.children[i].classList.add("focused")}}])}(Ol);function bu(n,t){if(!(!n||!n[0]||!n[1])){var e=Le(n,2),i=Le(e[0],2),r=i[0],s=i[1],a=Le(e[1],2),o=a[0],l=a[1];if(!(r>t||o<t))return[r===t?s:-1,o===t?l:12]}}var Lx=function(n){function t(e){return ui(this,t),Dl(this,t,[e,{id:1,name:"months",cellClass:"month"}])}return Ll(t,n),di(t,[{key:"init",value:function(i){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;r&&(this.grid=this.element,this.element.classList.add("months","datepicker-grid","w-64","grid","grid-cols-4"),this.grid.appendChild(vn(Ki("span",12,{"data-month":function(a){return a}})))),Tr(kn(t.prototype),"init",this).call(this,i)}},{key:"setOptions",value:function(i){if(i.locale&&(this.monthNames=i.locale.monthsShort),_n(i,"minDate"))if(i.minDate===void 0)this.minYear=this.minMonth=this.minDate=void 0;else{var r=new Date(i.minDate);this.minYear=r.getFullYear(),this.minMonth=r.getMonth(),this.minDate=r.setDate(1)}if(_n(i,"maxDate"))if(i.maxDate===void 0)this.maxYear=this.maxMonth=this.maxDate=void 0;else{var s=new Date(i.maxDate);this.maxYear=s.getFullYear(),this.maxMonth=s.getMonth(),this.maxDate=Nn(this.maxYear,this.maxMonth+1,0)}i.beforeShowMonth!==void 0&&(this.beforeShow=typeof i.beforeShowMonth=="function"?i.beforeShowMonth:void 0)}},{key:"updateFocus",value:function(){var i=new Date(this.picker.viewDate);this.year=i.getFullYear(),this.focused=i.getMonth()}},{key:"updateSelection",value:function(){var i=this.picker.datepicker,r=i.dates,s=i.rangepicker;this.selected=r.reduce(function(a,o){var l=new Date(o),c=l.getFullYear(),u=l.getMonth();return a[c]===void 0?a[c]=[u]:li(a[c],u),a},{}),s&&s.dates&&(this.range=s.dates.map(function(a){var o=new Date(a);return isNaN(o)?void 0:[o.getFullYear(),o.getMonth()]}))}},{key:"render",value:function(){var i=this;this.disabled=[],this.picker.setViewSwitchLabel(this.year),this.picker.setPrevBtnDisabled(this.year<=this.minYear),this.picker.setNextBtnDisabled(this.year>=this.maxYear);var r=this.selected[this.year]||[],s=this.year<this.minYear||this.year>this.maxYear,a=this.year===this.minYear,o=this.year===this.maxYear,l=bu(this.range,this.year);Array.from(this.grid.children).forEach(function(c,u){var h=c.classList,d=Nn(i.year,u,1);if(c.className="datepicker-cell hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 leading-9 border-0 rounded-lg cursor-pointer text-center text-gray-900 dark:text-white font-semibold text-sm ".concat(i.cellClass),i.isMinView&&(c.dataset.date=d),c.textContent=i.monthNames[u],(s||a&&u<i.minMonth||o&&u>i.maxMonth)&&h.add("disabled"),l){var m=Le(l,2),_=m[0],g=m[1];u>_&&u<g&&h.add("range"),u===_&&h.add("range-start"),u===g&&h.add("range-end")}r.includes(u)&&(h.add("selected","bg-blue-700","!bg-primary-700","text-white","dark:bg-blue-600","dark:!bg-primary-600","dark:text-white"),h.remove("text-gray-900","hover:bg-gray-100","dark:text-white","dark:hover:bg-gray-600")),u===i.focused&&h.add("focused"),i.beforeShow&&i.performBeforeHook(c,u,d)})}},{key:"refresh",value:function(){var i=this,r=this.selected[this.year]||[],s=bu(this.range,this.year)||[],a=Le(s,2),o=a[0],l=a[1];this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach(function(c){c.classList.remove("range","range-start","range-end","selected","bg-blue-700","!bg-primary-700","dark:bg-blue-600","dark:!bg-primary-700","dark:text-white","text-white","focused"),c.classList.add("text-gray-900","hover:bg-gray-100","dark:text-white","dark:hover:bg-gray-600")}),Array.from(this.grid.children).forEach(function(c,u){var h=c.classList;u>o&&u<l&&h.add("range"),u===o&&h.add("range-start"),u===l&&h.add("range-end"),r.includes(u)&&(h.add("selected","bg-blue-700","!bg-primary-700","text-white","dark:bg-blue-600","dark:!bg-primary-600","dark:text-white"),h.remove("text-gray-900","hover:bg-gray-100","dark:text-white","dark:hover:bg-gray-600")),u===i.focused&&h.add("focused")})}},{key:"refreshFocus",value:function(){this.grid.querySelectorAll(".focused").forEach(function(i){i.classList.remove("focused")}),this.grid.children[this.focused].classList.add("focused")}}])}(Ol);function Px(n){return Ur(n).reduce(function(t,e,i){return t+=i?e:e.toUpperCase()},"")}var wu=function(n){function t(e,i){return ui(this,t),Dl(this,t,[e,i])}return Ll(t,n),di(t,[{key:"init",value:function(i){var r=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;r&&(this.navStep=this.step*10,this.beforeShowOption="beforeShow".concat(Px(this.cellClass)),this.grid=this.element,this.element.classList.add(this.name,"datepicker-grid","w-64","grid","grid-cols-4"),this.grid.appendChild(vn(Ki("span",12)))),Tr(kn(t.prototype),"init",this).call(this,i)}},{key:"setOptions",value:function(i){if(_n(i,"minDate")&&(i.minDate===void 0?this.minYear=this.minDate=void 0:(this.minYear=Zn(i.minDate,this.step),this.minDate=Nn(this.minYear,0,1))),_n(i,"maxDate")&&(i.maxDate===void 0?this.maxYear=this.maxDate=void 0:(this.maxYear=Zn(i.maxDate,this.step),this.maxDate=Nn(this.maxYear,11,31))),i[this.beforeShowOption]!==void 0){var r=i[this.beforeShowOption];this.beforeShow=typeof r=="function"?r:void 0}}},{key:"updateFocus",value:function(){var i=new Date(this.picker.viewDate),r=Zn(i,this.navStep),s=r+9*this.step;this.first=r,this.last=s,this.start=r-this.step,this.focused=Zn(i,this.step)}},{key:"updateSelection",value:function(){var i=this,r=this.picker.datepicker,s=r.dates,a=r.rangepicker;this.selected=s.reduce(function(o,l){return li(o,Zn(l,i.step))},[]),a&&a.dates&&(this.range=a.dates.map(function(o){if(o!==void 0)return Zn(o,i.step)}))}},{key:"render",value:function(){var i=this;this.disabled=[],this.picker.setViewSwitchLabel("".concat(this.first,"-").concat(this.last)),this.picker.setPrevBtnDisabled(this.first<=this.minYear),this.picker.setNextBtnDisabled(this.last>=this.maxYear),Array.from(this.grid.children).forEach(function(r,s){var a=r.classList,o=i.start+s*i.step,l=Nn(o,0,1);if(r.className="datepicker-cell hover:bg-gray-100 dark:hover:bg-gray-600 block flex-1 leading-9 border-0 rounded-lg cursor-pointer text-center text-gray-900 dark:text-white font-semibold text-sm ".concat(i.cellClass),i.isMinView&&(r.dataset.date=l),r.textContent=r.dataset.year=o,s===0?a.add("prev"):s===11&&a.add("next"),(o<i.minYear||o>i.maxYear)&&a.add("disabled"),i.range){var c=Le(i.range,2),u=c[0],h=c[1];o>u&&o<h&&a.add("range"),o===u&&a.add("range-start"),o===h&&a.add("range-end")}i.selected.includes(o)&&(a.add("selected","bg-blue-700","!bg-primary-700","text-white","dark:bg-blue-600","dark:!bg-primary-600","dark:text-white"),a.remove("text-gray-900","hover:bg-gray-100","dark:text-white","dark:hover:bg-gray-600")),o===i.focused&&a.add("focused"),i.beforeShow&&i.performBeforeHook(r,o,l)})}},{key:"refresh",value:function(){var i=this,r=this.range||[],s=Le(r,2),a=s[0],o=s[1];this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach(function(l){l.classList.remove("range","range-start","range-end","selected","bg-blue-700","!bg-primary-700","text-white","dark:bg-blue-600","dark!bg-primary-600","dark:text-white","focused")}),Array.from(this.grid.children).forEach(function(l){var c=Number(l.textContent),u=l.classList;c>a&&c<o&&u.add("range"),c===a&&u.add("range-start"),c===o&&u.add("range-end"),i.selected.includes(c)&&(u.add("selected","bg-blue-700","!bg-primary-700","text-white","dark:bg-blue-600","dark:!bg-primary-600","dark:text-white"),u.remove("text-gray-900","hover:bg-gray-100","dark:text-white","dark:hover:bg-gray-600")),c===i.focused&&u.add("focused")})}},{key:"refreshFocus",value:function(){var i=Math.round((this.focused-this.start)/this.step);this.grid.querySelectorAll(".focused").forEach(function(r){r.classList.remove("focused")}),this.grid.children[i].classList.add("focused")}}])}(Ol);function Bi(n,t){var e={date:n.getDate(),viewDate:new Date(n.picker.viewDate),viewId:n.picker.currentView.id,datepicker:n};n.element.dispatchEvent(new CustomEvent(t,{detail:e}))}function ia(n,t){var e=n.config,i=e.minDate,r=e.maxDate,s=n.picker,a=s.currentView,o=s.viewDate,l;switch(a.id){case 0:l=Qs(o,t);break;case 1:l=ki(o,t);break;default:l=ki(o,t*a.navStep)}l=Fd(l,i,r),n.picker.changeFocus(l).render()}function Wd(n){var t=n.picker.currentView.id;t!==n.config.maxView&&n.picker.changeView(t+1).render()}function Xd(n){n.config.updateOnBlur?n.update({autohide:!0}):(n.refresh("input"),n.hide())}function Au(n,t){var e=n.picker,i=new Date(e.viewDate),r=e.currentView.id,s=r===1?Qs(i,t-i.getMonth()):ki(i,t-i.getFullYear());e.changeFocus(s).changeView(r-1).render()}function Ix(n){var t=n.picker,e=hi();if(n.config.todayBtnMode===1){if(n.config.autohide){n.setDate(e);return}n.setDate(e,{render:!1}),t.update()}t.viewDate!==e&&t.changeFocus(e),t.changeView(0).render()}function Ux(n){n.setDate({clear:!0})}function Nx(n){Wd(n)}function Ox(n){ia(n,-1)}function Fx(n){ia(n,1)}function kx(n,t){var e=Gd(t,".datepicker-cell");if(!(!e||e.classList.contains("disabled"))){var i=n.picker.currentView,r=i.id,s=i.isMinView;s?n.setDate(Number(e.dataset.date)):r===1?Au(n,Number(e.dataset.month)):Au(n,Number(e.dataset.year))}}function Bx(n){!n.inline&&!n.config.disableTouchKeyboard&&n.inputField.focus()}function Tu(n,t){if(t.title!==void 0&&(t.title?(n.controls.title.textContent=t.title,Sr(n.controls.title)):(n.controls.title.textContent="",Mr(n.controls.title))),t.prevArrow){var e=n.controls.prevBtn;na(e),t.prevArrow.forEach(function(o){e.appendChild(o.cloneNode(!0))})}if(t.nextArrow){var i=n.controls.nextBtn;na(i),t.nextArrow.forEach(function(o){i.appendChild(o.cloneNode(!0))})}if(t.locale&&(n.controls.todayBtn.textContent=t.locale.today,n.controls.clearBtn.textContent=t.locale.clear),t.todayBtn!==void 0&&(t.todayBtn?Sr(n.controls.todayBtn):Mr(n.controls.todayBtn)),_n(t,"minDate")||_n(t,"maxDate")){var r=n.datepicker.config,s=r.minDate,a=r.maxDate;n.controls.todayBtn.disabled=!Il(hi(),s,a)}t.clearBtn!==void 0&&(t.clearBtn?Sr(n.controls.clearBtn):Mr(n.controls.clearBtn))}function Cu(n){var t=n.dates,e=n.config,i=t.length>0?Pl(t):e.defaultViewDate;return Fd(i,e.minDate,e.maxDate)}function Ru(n,t){var e=new Date(n.viewDate),i=new Date(t),r=n.currentView,s=r.id,a=r.year,o=r.first,l=r.last,c=i.getFullYear();switch(n.viewDate=t,c!==e.getFullYear()&&Bi(n.datepicker,"changeYear"),i.getMonth()!==e.getMonth()&&Bi(n.datepicker,"changeMonth"),s){case 0:return t<o||t>l;case 1:return c!==a;default:return c<o||c>l}}function Za(n){return window.getComputedStyle(n).direction}var zx=function(){function n(t){ui(this,n),this.datepicker=t;var e=Tx.replace(/%buttonClass%/g,t.config.buttonClass),i=this.element=vn(e).firstChild,r=Le(i.firstChild.children,3),s=r[0],a=r[1],o=r[2],l=s.firstElementChild,c=Le(s.lastElementChild.children,3),u=c[0],h=c[1],d=c[2],m=Le(o.firstChild.children,2),_=m[0],g=m[1],p={title:l,prevBtn:u,viewSwitch:h,nextBtn:d,todayBtn:_,clearBtn:g};this.main=a,this.controls=p;var f=t.inline?"inline":"dropdown";i.classList.add("datepicker-".concat(f)),f==="dropdown"&&i.classList.add("dropdown","absolute","top-0","left-0","z-50","pt-2"),Tu(this,t.config),this.viewDate=Cu(t),Nl(t,[[i,"click",Bx.bind(null,t),{capture:!0}],[a,"click",kx.bind(null,t)],[p.viewSwitch,"click",Nx.bind(null,t)],[p.prevBtn,"click",Ox.bind(null,t)],[p.nextBtn,"click",Fx.bind(null,t)],[p.todayBtn,"click",Ix.bind(null,t)],[p.clearBtn,"click",Ux.bind(null,t)]]),this.views=[new Dx(this),new Lx(this),new wu(this,{id:2,name:"years",cellClass:"year",step:1}),new wu(this,{id:3,name:"decades",cellClass:"decade",step:10})],this.currentView=this.views[t.config.startView],this.currentView.render(),this.main.appendChild(this.currentView.element),t.config.container.appendChild(this.element)}return di(n,[{key:"setOptions",value:function(e){Tu(this,e),this.views.forEach(function(i){i.init(e,!1)}),this.currentView.render()}},{key:"detach",value:function(){this.datepicker.config.container.removeChild(this.element)}},{key:"show",value:function(){if(!this.active){this.element.classList.add("active","block"),this.element.classList.remove("hidden"),this.active=!0;var e=this.datepicker;if(!e.inline){var i=Za(e.inputField);i!==Za(e.config.container)?this.element.dir=i:this.element.dir&&this.element.removeAttribute("dir"),this.place(),e.config.disableTouchKeyboard&&e.inputField.blur()}Bi(e,"show")}}},{key:"hide",value:function(){this.active&&(this.datepicker.exitEditMode(),this.element.classList.remove("active","block"),this.element.classList.add("active","block","hidden"),this.active=!1,Bi(this.datepicker,"hide"))}},{key:"place",value:function(){var e=this.element,i=e.classList,r=e.style,s=this.datepicker,a=s.config,o=s.inputField,l=a.container,c=this.element.getBoundingClientRect(),u=c.width,h=c.height,d=l.getBoundingClientRect(),m=d.left,_=d.top,g=d.width,p=o.getBoundingClientRect(),f=p.left,b=p.top,S=p.width,E=p.height,D=a.orientation,w=D.x,T=D.y,L,M,v;l===document.body?(L=window.scrollY,M=f+window.scrollX,v=b+L):(L=l.scrollTop,M=f-m,v=b-_+L),w==="auto"&&(M<0?(w="left",M=10):M+u>g?w="right":w=Za(o)==="rtl"?"right":"left"),w==="right"&&(M-=u-S),T==="auto"&&(T=v-h<L?"bottom":"top"),T==="top"?v-=h:v+=E,i.remove("datepicker-orient-top","datepicker-orient-bottom","datepicker-orient-right","datepicker-orient-left"),i.add("datepicker-orient-".concat(T),"datepicker-orient-".concat(w)),r.top=v&&"".concat(v,"px"),r.left=M&&"".concat(M,"px")}},{key:"setViewSwitchLabel",value:function(e){this.controls.viewSwitch.textContent=e}},{key:"setPrevBtnDisabled",value:function(e){this.controls.prevBtn.disabled=e}},{key:"setNextBtnDisabled",value:function(e){this.controls.nextBtn.disabled=e}},{key:"changeView",value:function(e){var i=this.currentView,r=this.views[e];return r.id!==i.id&&(this.currentView=r,this._renderMethod="render",Bi(this.datepicker,"changeView"),this.main.replaceChild(r.element,i.element)),this}},{key:"changeFocus",value:function(e){return this._renderMethod=Ru(this,e)?"render":"refreshFocus",this.views.forEach(function(i){i.updateFocus()}),this}},{key:"update",value:function(){var e=Cu(this.datepicker);return this._renderMethod=Ru(this,e)?"render":"refresh",this.views.forEach(function(i){i.updateFocus(),i.updateSelection()}),this}},{key:"render",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!0,i=e&&this._renderMethod||"render";delete this._renderMethod,this.currentView[i]()}}])}();function qd(n,t,e,i,r,s){if(Il(n,r,s)){if(i(n)){var a=t(n,e);return qd(a,t,e,i,r,s)}return n}}function _s(n,t,e,i){var r=n.picker,s=r.currentView,a=s.step||1,o=r.viewDate,l,c;switch(s.id){case 0:i?o=Fi(o,e*7):t.ctrlKey||t.metaKey?o=ki(o,e):o=Fi(o,e),l=Fi,c=function(h){return s.disabled.includes(h)};break;case 1:o=Qs(o,i?e*4:e),l=Qs,c=function(h){var d=new Date(h),m=s.year,_=s.disabled;return d.getFullYear()===m&&_.includes(d.getMonth())};break;default:o=ki(o,e*(i?4:1)*a),l=ki,c=function(h){return s.disabled.includes(Zn(h,a))}}o=qd(o,l,e<0?-a:a,c,s.minDate,s.maxDate),o!==void 0&&r.changeFocus(o).render()}function Hx(n,t){if(t.key==="Tab"){Xd(n);return}var e=n.picker,i=e.currentView,r=i.id,s=i.isMinView;if(e.active)if(n.editMode)switch(t.key){case"Escape":e.hide();break;case"Enter":n.exitEditMode({update:!0,autohide:n.config.autohide});break;default:return}else switch(t.key){case"Escape":e.hide();break;case"ArrowLeft":if(t.ctrlKey||t.metaKey)ia(n,-1);else if(t.shiftKey){n.enterEditMode();return}else _s(n,t,-1,!1);break;case"ArrowRight":if(t.ctrlKey||t.metaKey)ia(n,1);else if(t.shiftKey){n.enterEditMode();return}else _s(n,t,1,!1);break;case"ArrowUp":if(t.ctrlKey||t.metaKey)Wd(n);else if(t.shiftKey){n.enterEditMode();return}else _s(n,t,-1,!0);break;case"ArrowDown":if(t.shiftKey&&!t.ctrlKey&&!t.metaKey){n.enterEditMode();return}_s(n,t,1,!0);break;case"Enter":s?n.setDate(e.viewDate):e.changeView(r-1).render();break;case"Backspace":case"Delete":n.enterEditMode();return;default:t.key.length===1&&!t.ctrlKey&&!t.metaKey&&n.enterEditMode();return}else switch(t.key){case"ArrowDown":case"Escape":e.show();break;case"Enter":n.update();break;default:return}t.preventDefault(),t.stopPropagation()}function Vx(n){n.config.showOnFocus&&!n._showing&&n.show()}function Gx(n,t){var e=t.target;(n.picker.active||n.config.showOnClick)&&(e._active=e===document.activeElement,e._clicking=setTimeout(function(){delete e._active,delete e._clicking},2e3))}function Wx(n,t){var e=t.target;e._clicking&&(clearTimeout(e._clicking),delete e._clicking,e._active&&n.enterEditMode(),delete e._active,n.config.showOnClick&&n.show())}function Xx(n,t){t.clipboardData.types.includes("text/plain")&&n.enterEditMode()}function qx(n,t){var e=n.element;if(e===document.activeElement){var i=n.picker.element;Gd(t,function(r){return r===e||r===i})||Xd(n)}}function Yd(n,t){return n.map(function(e){return Rr(e,t.format,t.locale)}).join(t.dateDelimiter)}function jd(n,t){var e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!1,i=n.config,r=n.dates,s=n.rangepicker;if(t.length===0)return e?[]:void 0;var a=s&&n===s.datepickers[1],o=t.reduce(function(l,c){var u=Cr(c,i.format,i.locale);if(u===void 0)return l;if(i.pickLevel>0){var h=new Date(u);i.pickLevel===1?u=a?h.setMonth(h.getMonth()+1,0):h.setDate(1):u=a?h.setFullYear(h.getFullYear()+1,0,0):h.setMonth(0,1)}return Il(u,i.minDate,i.maxDate)&&!l.includes(u)&&!i.datesDisabled.includes(u)&&!i.daysOfWeekDisabled.includes(new Date(u).getDay())&&l.push(u),l},[]);if(o.length!==0)return i.multidate&&!e&&(o=o.reduce(function(l,c){return r.includes(c)||l.push(c),l},r.filter(function(l){return!o.includes(l)}))),i.maxNumberOfDates&&o.length>i.maxNumberOfDates?o.slice(i.maxNumberOfDates*-1):o}function ra(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:3,e=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!0,i=n.config,r=n.picker,s=n.inputField;if(t&2){var a=r.active?i.pickLevel:i.startView;r.update().changeView(a).render(e)}t&1&&s&&(s.value=Yd(n.dates,i))}function Du(n,t,e){var i=e.clear,r=e.render,s=e.autohide;r===void 0&&(r=!0),r?s===void 0&&(s=n.config.autohide):s=!1;var a=jd(n,t,i);a&&(a.toString()!==n.dates.toString()?(n.dates=a,ra(n,r?3:1),Bi(n,"changeDate")):ra(n,1),s&&n.hide())}var Ts=function(){function n(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:void 0;ui(this,n),t.datepicker=this,this.element=t;var r=this.config=Object.assign({buttonClass:e.buttonClass&&String(e.buttonClass)||"button",container:document.body,defaultViewDate:hi(),maxDate:void 0,minDate:void 0},$a(Nr,this));this._options=e,Object.assign(r,$a(e,this));var s=this.inline=t.tagName!=="INPUT",a,o;if(s)r.container=t,o=Xa(t.dataset.date,r.dateDelimiter),delete t.dataset.date;else{var l=e.container?document.querySelector(e.container):null;l&&(r.container=l),a=this.inputField=t,a.classList.add("datepicker-input"),o=Xa(a.value,r.dateDelimiter)}if(i){var c=i.inputs.indexOf(a),u=i.datepickers;if(c<0||c>1||!Array.isArray(u))throw Error("Invalid rangepicker object.");u[c]=this,Object.defineProperty(this,"rangepicker",{get:function(){return i}})}this.dates=[];var h=jd(this,o);h&&h.length>0&&(this.dates=h),a&&(a.value=Yd(this.dates,r));var d=this.picker=new zx(this);if(s)this.show();else{var m=qx.bind(null,this),_=[[a,"keydown",Hx.bind(null,this)],[a,"focus",Vx.bind(null,this)],[a,"mousedown",Gx.bind(null,this)],[a,"click",Wx.bind(null,this)],[a,"paste",Xx.bind(null,this)],[document,"mousedown",m],[document,"touchstart",m],[window,"resize",d.place.bind(d)]];Nl(this,_)}}return di(n,[{key:"active",get:function(){return!!(this.picker&&this.picker.active)}},{key:"pickerElement",get:function(){return this.picker?this.picker.element:void 0}},{key:"setOptions",value:function(e){var i=this.picker,r=$a(e,this);Object.assign(this._options,e),Object.assign(this.config,r),i.setOptions(r),ra(this,3)}},{key:"show",value:function(){if(this.inputField){if(this.inputField.disabled)return;this.inputField!==document.activeElement&&(this._showing=!0,this.inputField.focus(),delete this._showing)}this.picker.show()}},{key:"hide",value:function(){this.inline||(this.picker.hide(),this.picker.update().changeView(this.config.startView).render())}},{key:"destroy",value:function(){return this.hide(),Hd(this),this.picker.detach(),this.inline||this.inputField.classList.remove("datepicker-input"),delete this.element.datepicker,this}},{key:"getDate",value:function(){var e=this,i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:void 0,r=i?function(s){return Rr(s,i,e.config.locale)}:function(s){return new Date(s)};if(this.config.multidate)return this.dates.map(r);if(this.dates.length>0)return r(this.dates[0])}},{key:"setDate",value:function(){for(var e=arguments.length,i=new Array(e),r=0;r<e;r++)i[r]=arguments[r];var s=[].concat(i),a={},o=Pl(i);Js(o)==="object"&&!Array.isArray(o)&&!(o instanceof Date)&&o&&Object.assign(a,s.pop());var l=Array.isArray(s[0])?s[0]:s;Du(this,l,a)}},{key:"update",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:void 0;if(!this.inline){var i={clear:!0,autohide:!!(e&&e.autohide)},r=Xa(this.inputField.value,this.config.dateDelimiter);Du(this,r,i)}}},{key:"refresh",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:void 0,i=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;e&&typeof e!="string"&&(i=e,e=void 0);var r;e==="picker"?r=2:e==="input"?r=1:r=3,ra(this,r,!i)}},{key:"enterEditMode",value:function(){this.inline||!this.picker.active||this.editMode||(this.editMode=!0,this.inputField.classList.add("in-edit","border-blue-700","!border-primary-700"))}},{key:"exitEditMode",value:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:void 0;if(!(this.inline||!this.editMode)){var i=Object.assign({update:!1},e);delete this.editMode,this.inputField.classList.remove("in-edit","border-blue-700","!border-primary-700"),i.update&&this.update(i)}}}],[{key:"formatDate",value:function(e,i,r){return Rr(e,i,r&&hr[r]||hr.en)}},{key:"parseDate",value:function(e,i,r){return Cr(e,i,r&&hr[r]||hr.en)}},{key:"locales",get:function(){return hr}}])}();function Lu(n){var t=Object.assign({},n);return delete t.inputs,delete t.allowOneSidedRange,delete t.maxNumberOfDates,t}function Pu(n,t,e,i){Nl(n,[[e,"changeDate",t]]),new Ts(e,i,n)}function fr(n,t){if(!n._updating){n._updating=!0;var e=t.target;if(e.datepicker!==void 0){var i=n.datepickers,r={render:!1},s=n.inputs.indexOf(e),a=s===0?1:0,o=i[s].dates[0],l=i[a].dates[0];o!==void 0&&l!==void 0?s===0&&o>l?(i[0].setDate(l,r),i[1].setDate(o,r)):s===1&&o<l&&(i[0].setDate(o,r),i[1].setDate(l,r)):n.allowOneSidedRange||(o!==void 0||l!==void 0)&&(r.clear=!0,i[a].setDate(i[s].dates,r)),i[0].picker.update().render(),i[1].picker.update().render(),delete n._updating}}}var Ja=function(){function n(t){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};ui(this,n);var i=Array.isArray(e.inputs)?e.inputs:Array.from(t.querySelectorAll("input"));if(!(i.length<2)){t.rangepicker=this,this.element=t,this.inputs=i.slice(0,2),this.allowOneSidedRange=!!e.allowOneSidedRange;var r=fr.bind(null,this),s=Lu(e),a=[];Object.defineProperty(this,"datepickers",{get:function(){return a}}),Pu(this,r,this.inputs[0],s),Pu(this,r,this.inputs[1],s),Object.freeze(a),a[0].dates.length>0?fr(this,{target:this.inputs[0]}):a[1].dates.length>0&&fr(this,{target:this.inputs[1]})}}return di(n,[{key:"dates",get:function(){return this.datepickers.length===2?[this.datepickers[0].dates[0],this.datepickers[1].dates[0]]:void 0}},{key:"setOptions",value:function(e){this.allowOneSidedRange=!!e.allowOneSidedRange;var i=Lu(e);this.datepickers[0].setOptions(i),this.datepickers[1].setOptions(i)}},{key:"destroy",value:function(){this.datepickers[0].destroy(),this.datepickers[1].destroy(),Hd(this),delete this.element.rangepicker}},{key:"getDates",value:function(){var e=this,i=arguments.length>0&&arguments[0]!==void 0?arguments[0]:void 0,r=i?function(s){return Rr(s,i,e.datepickers[0].config.locale)}:function(s){return new Date(s)};return this.dates.map(function(s){return s===void 0?s:r(s)})}},{key:"setDates",value:function(e,i){var r=Le(this.datepickers,2),s=r[0],a=r[1],o=this.dates;this._updating=!0,s.setDate(e),a.setDate(i),delete this._updating,a.dates[0]!==o[1]?fr(this,{target:this.inputs[1]}):s.dates[0]!==o[0]&&fr(this,{target:this.inputs[0]})}}])}(),sa=function(){return sa=Object.assign||function(n){for(var t,e=1,i=arguments.length;e<i;e++){t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},sa.apply(this,arguments)},Oe={defaultDatepickerId:null,autohide:!1,format:"mm/dd/yyyy",maxDate:null,minDate:null,orientation:"bottom",buttons:!1,autoSelectToday:0,title:null,language:"en",rangePicker:!1,onShow:function(){},onHide:function(){}},Yx={id:null,override:!0},Kd=function(){function n(t,e,i){t===void 0&&(t=null),e===void 0&&(e=Oe),i===void 0&&(i=Yx),this._instanceId=i.id?i.id:t.id,this._datepickerEl=t,this._datepickerInstance=null,this._options=sa(sa({},Oe),e),this._initialized=!1,this.init(),It.addInstance("Datepicker",this,this._instanceId,i.override)}return n.prototype.init=function(){this._datepickerEl&&!this._initialized&&(this._options.rangePicker?this._datepickerInstance=new Ja(this._datepickerEl,this._getDatepickerOptions(this._options)):this._datepickerInstance=new Ts(this._datepickerEl,this._getDatepickerOptions(this._options)),this._initialized=!0)},n.prototype.destroy=function(){this._initialized&&(this._initialized=!1,this._datepickerInstance.destroy())},n.prototype.removeInstance=function(){this.destroy(),It.removeInstance("Datepicker",this._instanceId)},n.prototype.destroyAndRemoveInstance=function(){this.destroy(),this.removeInstance()},n.prototype.getDatepickerInstance=function(){return this._datepickerInstance},n.prototype.getDate=function(){if(this._options.rangePicker&&this._datepickerInstance instanceof Ja)return this._datepickerInstance.getDates();if(!this._options.rangePicker&&this._datepickerInstance instanceof Ts)return this._datepickerInstance.getDate()},n.prototype.setDate=function(t){if(this._options.rangePicker&&this._datepickerInstance instanceof Ja)return this._datepickerInstance.setDates(t);if(!this._options.rangePicker&&this._datepickerInstance instanceof Ts)return this._datepickerInstance.setDate(t)},n.prototype.show=function(){this._datepickerInstance.show(),this._options.onShow(this)},n.prototype.hide=function(){this._datepickerInstance.hide(),this._options.onHide(this)},n.prototype._getDatepickerOptions=function(t){var e={};return t.buttons&&(e.todayBtn=!0,e.clearBtn=!0,t.autoSelectToday&&(e.todayBtnMode=1)),t.autohide&&(e.autohide=!0),t.format&&(e.format=t.format),t.maxDate&&(e.maxDate=t.maxDate),t.minDate&&(e.minDate=t.minDate),t.orientation&&(e.orientation=t.orientation),t.title&&(e.title=t.title),t.language&&(e.language=t.language),e},n.prototype.updateOnShow=function(t){this._options.onShow=t},n.prototype.updateOnHide=function(t){this._options.onHide=t},n}();function Fl(){document.querySelectorAll("[datepicker], [inline-datepicker], [date-rangepicker]").forEach(function(n){if(n){var t=n.hasAttribute("datepicker-buttons"),e=n.hasAttribute("datepicker-autoselect-today"),i=n.hasAttribute("datepicker-autohide"),r=n.getAttribute("datepicker-format"),s=n.getAttribute("datepicker-max-date"),a=n.getAttribute("datepicker-min-date"),o=n.getAttribute("datepicker-orientation"),l=n.getAttribute("datepicker-title"),c=n.getAttribute("datepicker-language"),u=n.hasAttribute("date-rangepicker");new Kd(n,{buttons:t||Oe.buttons,autoSelectToday:e||Oe.autoSelectToday,autohide:i||Oe.autohide,format:r||Oe.format,maxDate:s||Oe.maxDate,minDate:a||Oe.minDate,orientation:o||Oe.orientation,title:l||Oe.title,language:c||Oe.language,rangePicker:u||Oe.rangePicker})}else console.error("The datepicker element does not exist. Please check the datepicker attribute.")})}typeof window<"u"&&(window.Datepicker=Kd,window.initDatepickers=Fl);function jx(){cl(),ul(),dl(),hl(),Ml(),Sl(),El(),bl(),wl(),Al(),Tl(),Cl(),Rl(),Fl()}typeof window<"u"&&(window.initFlowbite=jx);var Kx=new Vv("load",[cl,ul,dl,hl,Ml,Sl,El,bl,wl,Al,Tl,Cl,Rl,Fl]);Kx.init();function $d(n){const t=new DOMParser().parseFromString(n,"application/xml"),e=[],i=Array.from(t.getElementsByTagName("trkpt"));for(const r of i){const s=r.getAttribute("lat"),a=r.getAttribute("lon"),o=r.getElementsByTagName("ele")[0]?.textContent;s&&a&&o&&e.push({lat:Number.parseFloat(s),lon:Number.parseFloat(a),ele:Number.parseFloat(o)})}return e}function Zd(n){if(n.length===0)return{path3D:[]};const t=6371e3,e=n[0].lat*Math.PI/180,i=n[0].lon*Math.PI/180,r=n[0].ele,s=[];for(const a of n){const o=a.lat*Math.PI/180,c=(a.lon*Math.PI/180-i)*Math.cos(e)*t,u=(o-e)*t,h=a.ele-r;s.push(new O(c,h,u))}return{path3D:s}}async function $x(n,t){const e=document.getElementById(n);if(!e)return;const i="/",s=await(await fetch(`${i}gpx/index.json`)).json();if(!s.length){const a=document.createElement("li");a.textContent="Aucun parcours trouvé",a.classList.add("p-2","text-sm","text-gray-500","dark:text-gray-400"),e.appendChild(a);return}for(const a of s){const o=document.createElement("li");o.classList.add("cursor-pointer","px-4","py-2","bg-white","hover:bg-gray-100","dark:bg-gray-800","dark:hover:bg-gray-700");const l=document.createElement("div");l.textContent=a.name,l.classList.add("mb-0.5","text-sm","font-medium","text-gray-900","dark:text-white"),o.appendChild(l),e.appendChild(o);const c=await fetch(`${i}${a.url}`);if(!c.ok){const g=document.createElement("div");g.classList.add("text-red-600","dark:text-red-400"),g.textContent="Fichier invalide",o.appendChild(g);continue}const u=await c.text(),h=$d(u);if(!h.length){const g=document.createElement("div");g.classList.add("text-red-600","dark:text-red-400"),g.textContent="Fichier invalide",o.appendChild(g);continue}const{path3D:d}=Zd(h),m=document.createElement("canvas");m.width=120,m.height=40,o.appendChild(m);const _=m.getContext("2d");if(_&&d.length){const g=[0];for(let E=1;E<d.length;E++)g[E]=g[E-1]+d[E].distanceTo(d[E-1]);const p=g[g.length-1]||1,f=Math.min(...d.map(E=>E.y)),S=Math.max(...d.map(E=>E.y))-f||1;_.strokeStyle="#fff",_.beginPath();for(let E=0;E<d.length;E++){const D=g[E]/p*m.width,w=m.height-(d[E].y-f)/S*m.height;E===0?_.moveTo(D,w):_.lineTo(D,w)}_.stroke()}o.addEventListener("click",()=>t(d,h,a.url))}}function Zx(n,t){const e=new Float32Array(t*3);if(n.length<2)return e;const i=n[0],r=n[1],s=r.x-i.x,a=r.z-i.z,o=Math.hypot(s,a)||1,l=s/o,c=a/o,u=-c,h=l;for(let d=0;d<t;d++){const m=Math.floor(d/9),_=d%9-4,g=i.x+l*m*1.2+u*_*1,p=i.z+c*m*1.2+h*_*1;e[d*3+0]=g,e[d*3+1]=i.y+1,e[d*3+2]=p}return e}let Go=0;function kl(n,t){return Go=(n%t+t)%t,Go}function Jx(n,t){return kl(Go+n,t)}class Qx{constructor(t,e,i={}){this._posVelocity=new O,this._smoothedQuat=new Un,this._prevRiderPositions=[],this.camera=t,this.followOffset=i.followOffset?.clone()??new O(0,6,-10),this.posDamping=i.posDamping??6,this.rotDamping=i.rotDamping??8,this.maxYawRate=(i.maxYawRate??120)*hn.DEG2RAD,this.maxPitchRate=(i.maxPitchRate??90)*hn.DEG2RAD,this.deadzoneDeg=i.deadzoneDeg??8,this.lookAheadTime=i.lookAheadTime??.3,this.chicaneBypassWeight=i.chicaneBypassWeight??.7,this.lowPassAlpha=i.lowPassAlpha??.12,this._smoothedQuat.copy(t.quaternion),this._followArrow=new iu(new O,t.position.clone(),5,65280),this._bypassArrow=new iu(new O,t.position.clone(),5,16711680);const r=new Ie;r.setAttribute("position",new pe(12,3));const s=new ol({color:16776960});this._deadzoneLines=new Uv(r,s),e.add(this._followArrow),e.add(this._bypassArrow),e.add(this._deadzoneLines)}setFollowOffset(t){this.followOffset.copy(t)}setPosDamping(t){this.posDamping=t}setRotDamping(t){this.rotDamping=t}setMaxYawRate(t){this.maxYawRate=t*hn.DEG2RAD}setMaxPitchRate(t){this.maxPitchRate=t*hn.DEG2RAD}setDeadzoneDeg(t){this.deadzoneDeg=t}setLookAheadTime(t){this.lookAheadTime=t}setChicaneBypassWeight(t){this.chicaneBypassWeight=t}setLowPassAlpha(t){this.lowPassAlpha=t}update(t,e){if(e.length===0)return;const i=new zn,r=new O;this._prevRiderPositions.length!==e.length&&(this._prevRiderPositions=e.map(U=>U.position.clone()));for(let U=0;U<e.length;U++){const z=e[U].position;i.expandByPoint(z);const G=new O().subVectors(z,this._prevRiderPositions[U]).divideScalar(t||1);r.add(G),this._prevRiderPositions[U].copy(z)}r.divideScalar(e.length);const a=i.getCenter(new O).addScaledVector(r,this.lookAheadTime),o=a.clone().add(this.followOffset),l=1-Math.exp(-this.posDamping*t);this.camera.position.lerp(o,l);const c=a.clone().sub(this.camera.position).normalize(),u=r.clone().setY(0);u.lengthSq()>1e-6?u.normalize():u.copy(c);const h=c.clone().lerp(u,this.chicaneBypassWeight).normalize();this._followArrow.position.copy(this.camera.position),this._followArrow.setDirection(c),this._bypassArrow.position.copy(this.camera.position),this._bypassArrow.setDirection(u);const d=hn.degToRad(this.deadzoneDeg),m=this.camera.getWorldDirection(new O),_=new O(0,1,0),g=m.clone().applyAxisAngle(_,d),p=m.clone().applyAxisAngle(_,-d),f=this._deadzoneLines.geometry.getAttribute("position"),b=this.camera.position,S=5;if(f.setXYZ(0,b.x,b.y,b.z),f.setXYZ(1,b.x+g.x*S,b.y+g.y*S,b.z+g.z*S),f.setXYZ(2,b.x,b.y,b.z),f.setXYZ(3,b.x+p.x*S,b.y+p.y*S,b.z+p.z*S),f.needsUpdate=!0,hn.radToDeg(c.angleTo(m))<this.deadzoneDeg){this._smoothedQuat.copy(this.camera.quaternion);return}const D=new Un().setFromRotationMatrix(new jt().lookAt(this.camera.position,this.camera.position.clone().add(h),_)),w=this.camera.quaternion.clone().slerp(D,this.lowPassAlpha),T=new Be().setFromQuaternion(this.camera.quaternion,"YXZ"),L=new Be().setFromQuaternion(w,"YXZ"),M=(U,z)=>Math.atan2(Math.sin(z-U),Math.cos(z-U)),v=hn.clamp(M(T.y,L.y),-this.maxYawRate*t,this.maxYawRate*t),C=hn.clamp(M(T.x,L.x),-this.maxPitchRate*t,this.maxPitchRate*t);T.y+=v,T.x+=C;const k=new Un().setFromEuler(T);this.camera.quaternion.slerp(k,1-Math.exp(-this.rotDamping*t)),this._smoothedQuat.copy(this.camera.quaternion)}}const ye=184,ci=document.getElementById("app"),vs=document.getElementById("loader"),Iu=document.getElementById("loader-progress"),Wo=document.getElementById("home-btn"),da=new Rv({canvas:ci,antialias:!0});da.setPixelRatio(Math.min(devicePixelRatio,2));da.setSize(window.innerWidth,window.innerHeight);Wo.addEventListener("click",()=>{cy(),ci.classList.add("hidden"),gy(),Wo.classList.add("hidden")});const Ke=new Dv;Ke.background=new kt(1119e3);const nn=new Fe(65,window.innerWidth/window.innerHeight,.1,1e3);nn.position.set(0,10,26);nn.lookAt(0,0,0);const Bl=new Qx(nn,Ke),ty=20,ey=100;ci.addEventListener("wheel",n=>{n.preventDefault(),nn.fov=hn.clamp(nn.fov+n.deltaY*.05,ty,ey),nn.updateProjectionMatrix()},{passive:!1});const ny=new Nv(16777215,2236996,.9);Ke.add(ny);const Jd=new kv(16777215,.8);Jd.position.set(10,20,10);Ke.add(Jd);const iy=new Lr(200,40),ry=new ca({color:2040619,roughness:1}),Qd=new ve(iy,ry);Qd.rotation.x=-Math.PI/2;Ke.add(Qd);const sy=new er(2,2,.7),ay=new ca({color:3843839,metalness:.2,roughness:.7}),xn=new Iv(sy,ay,ye);xn.instanceMatrix.setUsage(ef);Ke.add(xn);const Or=Array.from({length:ye},()=>new ne),Me=new ne;for(let n=0;n<ye;n++){const t=Math.floor(n/9),e=n%9;Me.position.set(-20+t*1.2,1,-4+e*1),Me.rotation.set(0,-Math.PI/2,0),Me.updateMatrix(),xn.setMatrixAt(n,Me.matrix),Or[n].position.copy(Me.position)}xn.instanceMatrix.needsUpdate=!0;const zl=new Worker(new URL("/assets/worker-DrODSUIV.js",import.meta.url),{type:"module"});let De=new Float32Array(ye*4),Xo=performance.now(),$i=!1;const Uu=new Bv,Qa=new Ot;function oy(n){const t=document.getElementById("ui-root");if(!t)return;const e=document.createElement("div");e.className="absolute top-4 right-4 bg-gray-800/70 text-white p-2 rounded pointer-events-auto space-y-1",e.innerHTML=`
    <label class="flex items-center gap-2 text-xs">Deadzone
      <input id="deadzone" type="range" min="0" max="30" value="${n.deadzoneDeg}" class="w-24" />
      <span id="deadzoneVal">${n.deadzoneDeg}</span>
    </label>
    <label class="flex items-center gap-2 text-xs">Damping
      <input id="damping" type="range" min="1" max="20" value="${n.posDamping}" class="w-24" />
      <span id="dampingVal">${n.posDamping}</span>
    </label>
    <label class="flex items-center gap-2 text-xs">Bypass
      <input id="bypass" type="range" min="0" max="1" step="0.01" value="${n.chicaneBypassWeight}" class="w-24" />
      <span id="bypassVal">${n.chicaneBypassWeight}</span>
    </label>
  `,t.appendChild(e);const i=e.querySelector("#deadzone"),r=e.querySelector("#damping"),s=e.querySelector("#bypass"),a=e.querySelector("#deadzoneVal"),o=e.querySelector("#dampingVal"),l=e.querySelector("#bypassVal");i.addEventListener("input",()=>{const c=parseFloat(i.value);n.setDeadzoneDeg(c),a.textContent=c.toFixed(1)}),r.addEventListener("input",()=>{const c=parseFloat(r.value);n.setPosDamping(c),o.textContent=c.toFixed(1)}),s.addEventListener("input",()=>{const c=parseFloat(s.value);n.setChicaneBypassWeight(c),l.textContent=c.toFixed(2)})}oy(Bl);zl.onmessage=n=>{const{type:t,data:e}=n.data||{};if(t==="state"){De=new Float32Array(e);for(let i=0;i<ye;i++){const r=i*4,s=De[r+0],a=De[r+1],o=De[r+2],l=De[r+3];Me.position.set(s,a,o),Me.rotation.set(0,l-Math.PI/2,0),Me.updateMatrix(),xn.setMatrixAt(i,Me.matrix),Or[i].position.set(s,a,o)}xn.instanceMatrix.needsUpdate=!0,$i||ly()}};addEventListener("resize",()=>{nn.aspect=window.innerWidth/window.innerHeight,nn.updateProjectionMatrix(),da.setSize(window.innerWidth,window.innerHeight)});function th(n){Bl.update(n,Or)}function eh(){th(.016)}function nh(){if(!$i)return;const n=performance.now(),t=Math.min(.05,(n-Xo)/1e3);Xo=n,th(t),zl.postMessage({type:"step",payload:{dt:t}}),da.render(Ke,nn),$i&&requestAnimationFrame(nh)}ci.addEventListener("click",n=>{const t=ci.getBoundingClientRect();Qa.x=(n.clientX-t.left)/t.width*2-1,Qa.y=-((n.clientY-t.top)/t.height)*2+1,Uu.setFromCamera(Qa,nn);const e=Uu.intersectObject(xn);e.length&&e[0].instanceId!==void 0&&(kl(e[0].instanceId,ye),eh())});document.addEventListener("keydown",n=>{let t=0;switch(n.key){case"ArrowLeft":t=-1;break;case"ArrowRight":t=1;break;case"ArrowUp":t=-9;break;case"ArrowDown":t=9;break;default:return}n.preventDefault(),Jx(t,ye),Bl.update(.016,Or)});function ly(){$i||($i=!0,Xo=performance.now(),requestAnimationFrame(nh))}function cy(){$i=!1}const uy=8,dy=2,hy=10,fy=.15;let Cs=null;async function py(n,t){const e=await fetch(n),i=Number(e.headers.get("Content-Length"))||0,r=e.body?.getReader(),s=[];let a=0;for(;;){const{done:m,value:_}=await r.read();if(m)break;_&&(s.push(_),a+=_.length,i&&t(Math.round(a/i*100)))}const o=s.reduce((m,_)=>m+_.length,0),l=new Uint8Array(o);let c=0;for(const m of s)l.set(m,c),c+=m.length;i||t(100);const u=new TextDecoder().decode(l),h=$d(u),{path3D:d}=Zd(h);return{path3D:d,points:h}}function my(){document.getElementById("route-list")?.classList.add("hidden")}function gy(){document.getElementById("route-list")?.classList.remove("hidden")}function _y(){if(!Cs)return;Nu("routeMesh"),Nu("centerMarkings");const n=yy(Cs,uy);n.name="routeMesh",Ke.add(n);const t=My(Cs,fy,dy,hy);t.name="centerMarkings",Ke.add(t)}document.addEventListener("DOMContentLoaded",()=>{const n=document.getElementById("version");n&&(n.textContent=`v${Hv.version}`),$x("route-list",async(t,e,i)=>{vs.classList.add("flex"),vs.classList.toggle("hidden",!1),Iu.style.width="0%",ci.classList.toggle("hidden",!0);const{path3D:r,points:s}=await py(i,d=>{Iu.style.width=`${d}%`});my();const a=xy(r,1),{totalGain:o,totalLoss:l}=vy(s);Cs=a,_y();const c=Zx(a,ye);De=new Float32Array(ye*4);for(let d=0;d<ye;d++)De[d*4+0]=c[d*3+0],De[d*4+1]=c[d*3+1],De[d*4+2]=c[d*3+2],De[d*4+3]=0;const u=Math.floor(ye/2);kl(u,ye);const h=new Float32Array(a.length*3);for(let d=0;d<a.length;d++){const m=a[d];h[d*3+0]=m.x,h[d*3+1]=m.y,h[d*3+2]=m.z}zl.postMessage({type:"init",payload:{N:ye,positions:c.buffer,path:h.buffer}},[c.buffer,h.buffer]);for(let d=0;d<ye;d++){const m=d*4,_=De[m+0],g=De[m+1],p=De[m+2];Me.position.set(_,g,p),Me.rotation.set(0,0,0),Me.updateMatrix(),xn.setMatrixAt(d,Me.matrix),Or[d].position.copy(Me.position)}xn.instanceMatrix.needsUpdate=!0,eh(),console.log(`D+ ${Math.round(o)} m · D- ${Math.round(l)} m`),vs.classList.remove("flex"),vs.classList.toggle("hidden",!0),ci.classList.toggle("hidden",!1),Wo.classList.remove("hidden")})});function vy(n){let t=0,e=0;for(let i=1;i<n.length;i++){const r=n[i].ele-n[i-1].ele;r>0?t+=r:e-=r}return{totalGain:t,totalLoss:e}}function xy(n,t){if(n.length<3)return[...n];const e=new Array(n.length).fill(!1);e[0]=e[n.length-1]=!0;const i=[[0,n.length-1]],r=(a,o,l)=>{const c=a.x,u=a.z,h=o.x,d=o.z,m=l.x,_=l.z,g=m-h,p=_-d;if(g===0&&p===0)return Math.hypot(c-h,u-d);const f=((c-h)*g+(u-d)*p)/(g*g+p*p),b=h+f*g,S=d+f*p;return Math.hypot(c-b,u-S)};for(;i.length;){const[a,o]=i.pop();let l=0,c=-1;for(let u=a+1;u<o;u++){const h=r(n[u],n[a],n[o]);h>l&&(l=h,c=u)}c!==-1&&l>t&&(e[c]=!0,i.push([a,c],[c,o]))}const s=[];for(let a=0;a<n.length;a++)e[a]&&s.push(n[a]);return s}function yy(n,t){const e=[],i=[],r=t/2,s=new O(0,1,0);for(let l=0;l<n.length;l++){const c=n[l],u=n[l-1]??c,d=(n[l+1]??c).clone().sub(u).setY(0).normalize(),m=new O().crossVectors(d,s).normalize(),_=c.clone().addScaledVector(m,-r),g=c.clone().addScaledVector(m,r);if(e.push(_.x,_.y,_.z,g.x,g.y,g.z),l<n.length-1){const p=l*2;i.push(p,p+1,p+3,p,p+3,p+2)}}const a=new Ie;a.setAttribute("position",new pe(e,3)),a.setIndex(i),a.computeVertexNormals();const o=new ca({color:2236962,roughness:.8});return new ve(a,o)}function My(n,t,e,i){const r=[],s=[],a=new O(0,1,0),o=t/2;let l=0;for(let h=0;h<n.length-1;h++){const d=n[h],_=n[h+1].clone().sub(d),g=_.length(),p=_.clone().normalize(),f=new O().crossVectors(p,a).normalize();for(let b=0;b<g;b+=e+i){const S=b,E=Math.min(g,b+e),D=d.clone().addScaledVector(p,S),w=d.clone().addScaledVector(p,E),T=D.clone().addScaledVector(f,-o).setY(D.y+.01),L=D.clone().addScaledVector(f,o).setY(D.y+.01),M=w.clone().addScaledVector(f,-o).setY(w.y+.01),v=w.clone().addScaledVector(f,o).setY(w.y+.01);r.push(T.x,T.y,T.z,L.x,L.y,L.z,M.x,M.y,M.z,v.x,v.y,v.z),s.push(l,l+1,l+3,l,l+3,l+2),l+=4}}const c=new Ie;c.setAttribute("position",new pe(r,3)),c.setIndex(s),c.computeVertexNormals();const u=new ca({color:16777215});return new ve(c,u)}function Nu(n){const t=Ke.getObjectByName(n);t&&Ke.remove(t)}
