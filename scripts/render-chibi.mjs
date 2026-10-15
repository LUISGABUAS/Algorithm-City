// Herramienta de desarrollo: renderiza el chibi a un PNG para poder VERLO.
// Uso: node scripts/render-chibi.mjs [salida.png]
import { readFileSync, writeFileSync } from "node:fs";
import zlib from "node:zlib";

const avatarSrc = readFileSync("src/js/avatar.js", "utf8");
// extraer AVC {...} y lighten(...)
const avcStart = avatarSrc.indexOf("var AVC=");
const avcEnd = avatarSrc.indexOf("\n};", avcStart) + 3;
const AVCsrc = avatarSrc.slice(avcStart, avcEnd);
const lightenSrc = avatarSrc.slice(avatarSrc.indexOf("function lighten(hex,k)")).split("\n")[0];

let chibiSrc = readFileSync("src/js/chibi.js", "utf8").replace(/window\.__AVF[\s\S]*$/, "");
const M = new Function(AVCsrc + "\n" + lightenSrc + "\n" + chibiSrc + "\n;return {chibi:chibi, WALK8:WALK8, CW:CW, CH:CH};")();

const CW = M.CW, CH = M.CH, WALK8 = M.WALK8;
// avatar de ejemplo (sudadera roja, pelo café) — con personalización activa
const a = { skin: 3, hairC: 1, eyes: 1, hair: 0, beard: 0, top: 1, topC: 2, pants: 0, shoes: 2, head: 0, face: 0, body: 0, accC: 0 };

// parámetros de caminata (igual que chibiFrames)
function sideP(k, s) { return { st: Math.round(s * 3), ax: -Math.round(s * 2), up: (k % 4 === 2) ? 1 : 0 }; }
function frontP(k, s) { return { legA: Math.round(Math.max(0, s) * 2), legB: Math.round(Math.max(0, -s) * 2), armA: Math.round(-s * 1.5) + 1, armB: Math.round(s * 1.5) + 1, up: (k % 4 === 2) ? 1 : 0 }; }

// filas a renderizar: [etiqueta, buffers...]
const rows = [
  ["reposo", [M.chibi(a, "down", {}), M.chibi(a, "up", {}), M.chibi(a, "side", {})]],
  ["lado (8 cuadros)", WALK8.map(w => M.chibi(a, "side", sideP(w.k, w.s)))],
  ["frente (8 cuadros)", WALK8.map(w => M.chibi(a, "down", frontP(w.k, w.s)))],
];

const SC = 6, GAP = 6, cols = 8;
const cellW = CW * SC + GAP, cellH = CH * SC + GAP;
const W = cellW * cols + GAP, H = cellH * rows.length + GAP;
const buf = new Uint8Array(W * H * 4);
// fondo
for (let i = 0; i < W * H; i++) { buf[i*4]=0x1a; buf[i*4+1]=0x20; buf[i*4+2]=0x33; buf[i*4+3]=255; }
function hex(c){ const n=parseInt(c.slice(1),16); return [n>>16&255, n>>8&255, n&255]; }
function put(px,py,r,g,b){ if(px<0||py<0||px>=W||py>=H)return; const i=(py*W+px)*4; buf[i]=r;buf[i+1]=g;buf[i+2]=b;buf[i+3]=255; }
function drawFrame(B, ox, oy){
  for(let y=0;y<CH;y++)for(let x=0;x<CW;x++){ const c=B[y]&&B[y][x]; if(!c)continue; const [r,g,b]=hex(c);
    for(let dy=0;dy<SC;dy++)for(let dx=0;dx<SC;dx++)put(ox+x*SC+dx, oy+y*SC+dy, r,g,b); }
}
rows.forEach((row, ri) => {
  row[1].forEach((B, ci) => drawFrame(B, GAP + ci * cellW, GAP + ri * cellH));
});

function crc32(b){ let c=~0; for(let i=0;i<b.length;i++){ c^=b[i]; for(let k=0;k<8;k++) c=(c>>>1)^(0xEDB88320&-(c&1)); } return ~c>>>0; }
function chunk(type,data){ const l=Buffer.alloc(4); l.writeUInt32BE(data.length); const body=Buffer.concat([Buffer.from(type),data]); const cc=Buffer.alloc(4); cc.writeUInt32BE(crc32(body)); return Buffer.concat([l,body,cc]); }
const sig=Buffer.from([137,80,78,71,13,10,26,10]);
const ihdr=Buffer.alloc(13); ihdr.writeUInt32BE(W,0); ihdr.writeUInt32BE(H,4); ihdr[8]=8; ihdr[9]=6;
const stride=W*4+1, raw=Buffer.alloc(stride*H);
for(let y=0;y<H;y++){ raw[y*stride]=0; Buffer.from(buf.buffer, y*W*4, W*4).copy(raw, y*stride+1); }
const out=Buffer.concat([sig, chunk("IHDR",ihdr), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
const file = process.argv[2] || "/tmp/chibi.png";
writeFileSync(file, out);
console.log("PNG:", file, W + "x" + H);
