const $=id=>document.getElementById(id),c=$('c'),x=c.getContext('2d'),W=1080,H=1350;
const TH={putih:{bg:'#ffffff',ink:'#111111'},krem:{bg:'#fbf3e4',ink:'#2a1f14'},biru:{bg:'#eaf3fb',ink:'#0f1c2b'},gelap:{bg:'#141414',ink:'#f4f4f4'}};
const IDS=['iso','ss','ap','wb','brand','tt','ig','ac','th','ls','lw'];
let photo=null,logo=null,logoRaw=null,photoSrc='',logoSrc='',tm;
const gv=k=>{const e=$(k);return e.type==='checkbox'?e.checked:e.value};
const sv=(k,v)=>{const e=$(k);if(e.type==='checkbox')e.checked=!!v;else e.value=v};
function toImg(src,cb){const i=new Image();i.onload=()=>cb(i);i.src=src}
async function load(file,max,jpg,cb){if(!file)return;
try{if(/heic|heif/i.test(file.type+file.name)){if(!window.heic2any){alert('Pustaka HEIC belum termuat, coba lagi.');return}const o=await heic2any({blob:file,toType:'image/jpeg',quality:.92});file=Array.isArray(o)?o[0]:o}}catch(e){alert('Gagal membaca file HEIC.');return}
const r=new FileReader();r.onload=()=>toImg(r.result,i=>{const s=Math.min(1,max/Math.max(i.width,i.height)),t=document.createElement('canvas');t.width=Math.round(i.width*s);t.height=Math.round(i.height*s);const g=t.getContext('2d');g.imageSmoothingQuality='high';g.drawImage(i,0,0,t.width,t.height);const d=t.toDataURL(jpg?'image/jpeg':'image/png',.9);toImg(d,j=>cb(j,d))});r.readAsDataURL(file)}
function save(){clearTimeout(tm);tm=setTimeout(()=>{try{const f={};IDS.forEach(k=>f[k]=gv(k));localStorage.setItem('wm_state2',JSON.stringify({f,photo:photoSrc,logo:logoSrc}))}catch(e){}},400)}
function restore(){try{const s=JSON.parse(localStorage.getItem('wm_state2')||'null');if(!s)return;IDS.forEach(k=>{if(s.f&&s.f[k]!=null)sv(k,s.f[k])});
if(s.photo){photoSrc=s.photo;toImg(s.photo,i=>{photo=i;draw()})}
if(s.logo){logoSrc=s.logo;toImg(s.logo,i=>{logoRaw=i;buildLogo();draw()})}draw()}catch(e){}}
function buildLogo(){if(!logoRaw){logo=null;return}
const t=document.createElement('canvas');t.width=logoRaw.width;t.height=logoRaw.height;const g=t.getContext('2d');g.drawImage(logoRaw,0,0);
if($('lw').checked){const d=g.getImageData(0,0,t.width,t.height),p=d.data;for(let i=0;i<p.length;i+=4){const m=Math.min(p[i],p[i+1],p[i+2]);if(m>=235)p[i+3]=0;else if(m>190)p[i+3]=p[i+3]*(235-m)/45}g.putImageData(d,0,0)}
logo=t}
function cover(img,bx,by,bw,bh){const s=Math.max(bw/img.width,bh/img.height),w=img.width*s,h=img.height*s;x.save();x.beginPath();x.rect(bx,by,bw,bh);x.clip();x.drawImage(img,bx+(bw-w)/2,by+(bh-h)/2,w,h);x.restore()}
function contain(img,cx,cy,bw,bh){const s=Math.min(bw/img.width,bh/img.height),w=img.width*s,h=img.height*s;x.drawImage(img,cx-w/2,cy-h/2,w,h)}
function fit(t,maxW,size,font){do{x.font=size+'px '+font;size-=2}while(x.measureText(t).width>maxW&&size>10)}
function star(cx,cy,r){x.beginPath();x.moveTo(cx,cy-r);x.quadraticCurveTo(cx,cy,cx+r,cy);x.quadraticCurveTo(cx,cy,cx,cy+r);x.quadraticCurveTo(cx,cy,cx-r,cy);x.quadraticCurveTo(cx,cy,cx,cy-r);x.fill()}
function aperture(cx,cy,ink){x.strokeStyle=ink;x.lineWidth=3;x.beginPath();x.arc(cx,cy,20,0,7);x.stroke();for(let i=0;i<6;i++){const a=i*Math.PI/3;x.beginPath();x.moveTo(cx+Math.cos(a)*20,cy+Math.sin(a)*20);x.lineTo(cx+Math.cos(a+1.2)*8,cy+Math.sin(a+1.2)*8);x.stroke()}}
function camera(cx,cy,ink){x.strokeStyle=ink;x.fillStyle=ink;x.lineWidth=3;x.beginPath();x.roundRect(cx-23,cy-13,46,32,6);x.stroke();x.beginPath();x.arc(cx,cy+3,9,0,7);x.stroke();x.fillRect(cx-9,cy-20,18,6)}
function draw(){
const T=TH[gv('th')]||TH.putih,ink=T.ink,ac=gv('ac');
x.setTransform(1,0,0,1,0,0);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
x.fillStyle=T.bg;x.fillRect(0,0,W,H);
// foto
if(photo)cover(photo,40,80,1000,780);else{x.fillStyle=ink;x.font='86px Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('Foto/Video',540,470)}
// garis
x.strokeStyle=ink;x.lineWidth=4;x.lineCap='butt';x.lineJoin='miter';
x.strokeRect(40,80,1000,780);x.strokeRect(40,860,1000,125);x.beginPath();x.moveTo(600,860);x.lineTo(600,985);x.stroke();
// siku di sudut foto
x.strokeStyle=ac;x.lineWidth=8;x.lineCap='square';
[[40,80,1,1],[1040,80,-1,1],[40,860,1,-1],[1040,860,-1,-1]].forEach(([px,py,dx,dy])=>{x.beginPath();x.moveTo(px+dx*56,py);x.lineTo(px,py);x.lineTo(px,py+dy*56);x.stroke()});
// info
x.fillStyle=ink;x.textAlign='center';x.textBaseline='middle';
aperture(90,923,ink);camera(650,923,ink);
const ex=[gv('iso'),gv('ss'),gv('ap'),gv('wb')].filter(Boolean).join('  |  ');
x.fillStyle=ink;fit(ex,440,34,'Arial,sans-serif');x.fillText(ex,350,923);
const b=gv('brand');fit(b,320,34,'Arial,sans-serif');x.fillText(b,835,923);

// sosmed
const F='Arvo,Rockwell,Georgia,serif';x.textAlign='left';
x.fillStyle=ink;x.beginPath();x.arc(66,1213,26,0,7);x.fill();
x.fillStyle=T.bg;x.beginPath();x.arc(62,1219,7,0,7);x.fill();x.fillRect(66,1196,5,24);
x.beginPath();x.moveTo(71,1196);x.quadraticCurveTo(72,1206,81,1207);x.lineTo(81,1202);x.quadraticCurveTo(75,1201,75,1196);x.closePath();x.fill();
x.fillStyle=ink;x.font='bold 36px '+F;x.fillText(gv('tt'),108,1213);
const g=x.createLinearGradient(40,1312,92,1260);g.addColorStop(0,'#fd9a1c');g.addColorStop(.5,'#e1306c');g.addColorStop(1,'#833ab4');
x.fillStyle=g;x.beginPath();x.roundRect(40,1260,52,52,14);x.fill();
x.strokeStyle='#fff';x.lineWidth=4;x.beginPath();x.roundRect(49,1269,34,34,10);x.stroke();
x.beginPath();x.arc(66,1286,8,0,7);x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(76,1277,2.5,0,7);x.fill();
x.fillStyle=ink;x.font='bold 36px '+F;x.fillText(gv('ig'),108,1286);
// logo
const k=gv('ls')/100;
if(logo)contain(logo,900,1230,320*k,180*k);
else{x.fillStyle=ink;x.textAlign='center';x.font='italic '+Math.round(40*k)+'px Georgia,serif';x.fillText('DEONAE',900,1210);x.fillText('VISUAL',900,1210+46*k)}
// bingkai luar (paling atas)
x.strokeStyle=ink;x.lineWidth=4;x.lineCap='butt';x.strokeRect(2,2,W-4,H-4);
$('out').src=c.toDataURL('image/png');
}
$('photo').onchange=e=>load(e.target.files[0],1800,true,(i,d)=>{photo=i;photoSrc=d;draw();save()});
$('logo').onchange=e=>load(e.target.files[0],1000,false,(i,d)=>{logoRaw=i;logoSrc=d;buildLogo();draw();save()});
IDS.forEach(k=>{$(k).oninput=()=>{if(k==='lw')buildLogo();if(k==='ls')$('logo-size-value').textContent=gv('ls')+'%';draw();save()}});
$('rs').onclick=()=>{if(!confirm('Hapus semua isian dan foto yang tersimpan di browser ini?'))return;try{localStorage.removeItem('wm_state2')}catch(e){}location.reload()};
const toBlob=(cv,t,q)=>new Promise(r=>cv.toBlob(r,t,q));
const u8=async b=>new Uint8Array(await b.arrayBuffer());
const crcT=(()=>{const t=[];for(let n=0;n<256;n++){let k=n;for(let i=0;i<8;i++)k=k&1?0xEDB88320^(k>>>1):k>>>1;t[n]=k>>>0}return t})();
function crc(u){let k=~0;for(let i=0;i<u.length;i++)k=crcT[(k^u[i])&255]^(k>>>8);return ~k>>>0}
function zip(files){const enc=new TextEncoder(),parts=[],cd=[];let off=0,cs=0;
for(const f of files){const n=enc.encode(f.name),cr=crc(f.data),L=f.data.length,h=new DataView(new ArrayBuffer(30));
h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint32(14,cr,true);h.setUint32(18,L,true);h.setUint32(22,L,true);h.setUint16(26,n.length,true);parts.push(h.buffer,n,f.data);
const e=new DataView(new ArrayBuffer(46));e.setUint32(0,0x02014b50,true);e.setUint16(4,20,true);e.setUint16(6,20,true);e.setUint32(16,cr,true);e.setUint32(20,L,true);e.setUint32(24,L,true);e.setUint16(28,n.length,true);e.setUint32(42,off,true);cd.push(e.buffer,n);cs+=46+n.length;off+=30+n.length+L}
const z=new DataView(new ArrayBuffer(22));z.setUint32(0,0x06054b50,true);z.setUint16(8,files.length,true);z.setUint16(10,files.length,true);z.setUint32(12,cs,true);z.setUint32(16,off,true);
return new Blob([...parts,...cd,z.buffer],{type:'application/zip'})}
async function pdf(cv){const w=cv.width,h=cv.height,jd=await u8(await toBlob(cv,'image/jpeg',.95)),enc=new TextEncoder(),parts=[],offs=[];let len=0;
const add=d=>{const u=typeof d==='string'?enc.encode(d):d;parts.push(u);len+=u.length};
const obj=(n,b)=>{offs[n]=len;add(n+' 0 obj\n'+b+'\nendobj\n')};
add('%PDF-1.4\n');obj(1,'<</Type/Catalog/Pages 2 0 R>>');obj(2,'<</Type/Pages/Kids[3 0 R]/Count 1>>');
obj(3,`<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${w} ${h}]/Resources<</XObject<</Im0 4 0 R>>>>/Contents 5 0 R>>`);
offs[4]=len;add(`4 0 obj\n<</Type/XObject/Subtype/Image/Width ${w}/Height ${h}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${jd.length}>>\nstream\n`);add(jd);add('\nendstream\nendobj\n');
const cs=`q ${w} 0 0 ${h} 0 0 cm /Im0 Do Q`;obj(5,`<</Length ${cs.length}>>\nstream\n${cs}\nendstream`);
const xr=len;let t='xref\n0 6\n0000000000 65535 f \n';for(let i=1;i<=5;i++)t+=String(offs[i]).padStart(10,'0')+' 00000 n \n';
add(t+`trailer\n<</Size 6/Root 1 0 R>>\nstartxref\n${xr}\n%%EOF`);return new Blob(parts,{type:'application/pdf'})}
async function render(cv,f){
if(f==='png')return toBlob(cv,'image/png');if(f==='jpg')return toBlob(cv,'image/jpeg',.95);if(f==='webp')return toBlob(cv,'image/webp',.95);if(f==='pdf')return pdf(cv);
return new Blob(['<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><image width="1080" height="1350" href="'+cv.toDataURL('image/png')+'"/></svg>'],{type:'image/svg+xml'})}
async function saveFile(name,blob){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500)}
async function exportCv(cv,f){const nm='foto-template-'+Date.now();
if(f==='zip'){const fs=[];for(const k of ['png','jpg','webp','svg','pdf'])fs.push({name:nm+'.'+k,data:await u8(await render(cv,k))});return saveFile(nm+'.zip',zip(fs))}
return saveFile(nm+'.'+f,await render(cv,f))}
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open('wm_hist',1);r.onupgradeneeded=()=>r.result.createObjectStore('h',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function hAll(){const d=await idb();return new Promise((res,rej)=>{const q=d.transaction('h').objectStore('h').getAll();q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)})}
async function hPut(o){const d=await idb();return new Promise((res,rej)=>{const t=d.transaction('h','readwrite');t.objectStore('h').put(o);t.oncomplete=res;t.onerror=()=>rej(t.error)})}
async function hDel(id){const d=await idb();return new Promise((res,rej)=>{const t=d.transaction('h','readwrite');t.objectStore('h').delete(id);t.oncomplete=res;t.onerror=()=>rej(t.error)})}
let urls=[];
async function renderGal(){const g=$('gal');try{const all=(await hAll()).sort((a,b)=>b.id-a.id);urls.forEach(u=>URL.revokeObjectURL(u));urls=[];g.innerHTML='';
if(!all.length){g.textContent='Belum ada hasil tersimpan.';return}
all.forEach(o=>{const u=URL.createObjectURL(o.blob);urls.push(u);const d=document.createElement('div'),im=new Image();im.src=u;
const b1=document.createElement('button');b1.textContent='Unduh';b1.onclick=async()=>{const bm=await createImageBitmap(o.blob),t=document.createElement('canvas');t.width=1080;t.height=1350;t.getContext('2d').drawImage(bm,0,0);exportCv(t,$('fmt').value)};
const b2=document.createElement('button');b2.textContent='Hapus';b2.className='ghost';b2.onclick=async()=>{await hDel(o.id);renderGal()};
d.append(im,b1,b2);g.append(d)})}catch(e){g.textContent='Riwayat tidak tersedia di browser ini.'}}
$('sv').onclick=async()=>{try{await hPut({id:Date.now(),blob:await toBlob(c,'image/png')});await renderGal();$('history-status').textContent='Hasil berhasil disimpan.'}catch(e){alert('Gagal menyimpan ke riwayat.')}};
$('dl').onclick=async()=>{const b=$('dl');b.disabled=true;b.textContent='Menyiapkan file…';try{await exportCv(c,$('fmt').value)}catch(e){console.error(e);alert('File gagal dibuat. Coba gunakan format PNG atau JPG.')}finally{b.disabled=false;b.textContent='Unduh hasil'}};
renderGal();restore();draw();
if(document.fonts)document.fonts.load('bold 36px Arvo').then(draw).catch(()=>{});
