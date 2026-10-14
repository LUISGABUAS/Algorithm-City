
/* ================= PERSONAJES CHIBI 32×48 (más detalle) ================= */
var CW=32,CH=48;
function darken(hex,k){var n=parseInt(hex.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;r=Math.round(r*(1-k));g=Math.round(g*(1-k));b=Math.round(b*(1-k));return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
function mix(a,b,k){var A=parseInt(a.slice(1),16),B=parseInt(b.slice(1),16);function ch(s){return Math.round(((A>>s)&255)*(1-k)+((B>>s)&255)*k)}return "#"+((1<<24)+(ch(16)<<16)+(ch(8)<<8)+ch(0)).toString(16).slice(1)}
function Buf(){var b=[];for(var y=0;y<CH;y++){b.push(new Array(CW).fill(null))}return b}
function chibi(a,view,P){P=P||{};
  var B=Buf(),D=view==="down",U=view==="up",S=view==="side";
  function px(x,y,c){x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<CW&&y<CH&&c)B[y][x]=c}
  function rect(x,y,w,h,c){for(var j=0;j<h;j++)for(var i=0;i<w;i++)px(x+i,y+j,c)}
  function ell(cx,cy,rx,ry,c){for(var y=Math.floor(cy-ry);y<=Math.ceil(cy+ry);y++)for(var x=Math.floor(cx-rx);x<=Math.ceil(cx+rx);x++){var dx=(x-cx)/(rx+.35),dy=(y-cy)/(ry+.35);if(dx*dx+dy*dy<=1)px(x,y,c)}}
  function rrect(x,y,w,h,r,c){for(var j=0;j<h;j++)for(var i=0;i<w;i++){var cx=i<r?r-i:(i>w-1-r?i-(w-1-r):0),cy=j<r?r-j:(j>h-1-r?j-(h-1-r):0);if(cx*cx+cy*cy<=r*r+.5)px(x+i,y+j,c)}}
  function get(x,y){return (B[y]&&B[y][x])||null}
  /* paleta */
  var sk=AVC.skin[a.skin],hc=AVC.hairC[a.hairC],tc=AVC.topC[a.topC],pc=AVC.pants[a.pants],ac=AVC.accC[a.accC];
  var s1=sk[1],s2=sk[2],s3=darken(sk[2],.18),h1=hc[1],hL=hc[2],hD=darken(hc[1],.35),e=AVC.eyes[a.eyes][1];
  var c1=tc[1],c2=tc[2],cL=lighten(tc[1],.25),p1=pc[1],p2=pc[2],sh=AVC.shoes[a.shoes][1],shD=darken(sh,.35),k1=ac[1],k2=ac[2];
  var under="#e8eef8",underD="#b9c2d4",sleeveLong=a.top!==0;
  if(a.top===4){/* chaleco: camisa clara debajo, chaleco con el color elegido */}
  var top={c:a.top===4?under:c1,d:a.top===4?underD:c2};
  /* medidas */
  var up=P.up||0,hy=4-up,hx=5,hw=22,hh=20,ty=26-up,ly=38,fy=45,legA=P.legA||0,legB=P.legB||0,st=P.st||0,armA=P.armA||0,armB=P.armB||0,blink=!!P.blink;
  /* ---------- pelo detrás (largo, afro, coleta) ---------- */
  if(a.hair===6&&a.head!==2&&a.head!==3){if(S)ell(13,hy+8,12,11,h1);else ell(16,hy+8,14,11,h1)}
  if(a.hair===2){if(D||S){rect(S?6:3,hy+6,S?9:26,22,h1);if(D){for(var y0=hy+6;y0<hy+28;y0++){px(3,y0,hD);px(28,y0,hD)}}}if(U)rect(4,hy+4,24,24,h1)}
  if(a.hair===5&&!a.head){if(U){rect(14,hy+14,4,14,h1);rect(15,hy+14,1,14,hL);ell(16,hy+28,2,2,h1)}if(S){rect(4,hy+6,4,14,h1);ell(5,hy+20,2,2,h1)}}
  /* ---------- piernas y tenis ---------- */
  if(D||U){
    var fA=fy-legA,fB=fy-legB;
    rect(10,ly,6,fA-ly,p1);rect(16,ly,6,fB-ly,p1);rect(15,ly,1,fA-ly,p2);rect(21,ly,1,fB-ly,p2);
    if(legA)rect(10,fA-1,6,1,p2);if(legB)rect(16,fB-1,6,1,p2);
    rect(9,fA,7,2,sh);rect(16,fB,7,2,sh);rect(9,fA+1,7,1,"#f4f6fa");rect(16,fB+1,7,1,"#f4f6fa");
    if(D){px(10,fA,shD);px(21,fB,shD)}
  }else{
    if(!st){rect(11,ly,10,fy-ly,p1);rect(11,ly,1,fy-ly,p2);rect(15,ly+1,1,fy-ly-1,p2);rect(11,fy,12,2,sh);rect(11,fy+1,12,1,"#f4f6fa");px(22,fy,shD)}
    else{var bx=12-st,fx=12+st,lift=Math.max(0,2-Math.abs(st));
      rect(bx,ly,6,fy-ly,p2);rect(bx-1,fy,8,2,shD);rect(bx-1,fy+1,8,1,"#dfe4ec");
      rect(fx,ly,6,fy-ly-lift,p1);rect(fx,ly,1,fy-ly-lift,p2);rect(fx+1,fy-lift,8,2,sh);rect(fx+1,fy+1-lift,8,1,"#f4f6fa")}
  }
  /* ---------- torso ---------- */
  var tx=S?10:9,tw=S?12:14;
  rrect(tx,ty,tw,12,2,top.c);rect(tx,ty+10,tw,2,top.c);
  if(D){rect(tx+tw-2,ty+2,2,10,top.d);rect(tx,ty+11,tw,1,top.d)}
  if(U){rect(15,ty+2,1,9,top.d);rect(tx,ty+11,tw,1,top.d)}
  if(S){rect(tx,ty+2,1,10,top.d);rect(tx,ty+11,tw,1,top.d)}
  rect(tx+1,ty+12,tw-2,1+up,darken(p1,.2)); // cinturón
  /* cuello */
  rect(13,hy+hh-1,6,ty-(hy+hh)+2,s2);
  /* detalles de la ropa (frente) */
  if(D){
    if(a.top===0){rect(13,ty,6,1,cL);px(13,ty+1,cL);px(18,ty+1,cL);rect(14,ty,4,1,s2)}
    if(a.top===1){rect(11,ty,10,2,c2);rect(13,ty,6,1,s2);rect(14,ty+2,1,4,"#f8fafc");rect(17,ty+2,1,4,"#f8fafc");rect(12,ty+7,8,1,c2);rect(12,ty+8,1,3,c2);rect(19,ty+8,1,3,c2)}
    if(a.top===2){rect(14,ty,4,2,s2);px(13,ty,"#f8fafc");px(12,ty,"#f8fafc");px(13,ty+1,"#f8fafc");px(18,ty,"#f8fafc");px(19,ty,"#f8fafc");px(18,ty+1,"#f8fafc");[ty+3,ty+6,ty+9].forEach(function(yy){px(16,yy,c2)})}
    if(a.top===3){rect(14,ty,4,12,under);rect(13,ty,1,12,c2);rect(18,ty,1,12,c2);rect(15,ty+2,2,1,darken(under,.15))}
    if(a.top===4){rect(10,ty+1,5,11,c1);rect(17,ty+1,5,11,c1);rect(14,ty,1,12,c2);rect(17,ty,1,12,c2);rect(20,ty+2,2,10,c2);px(12,ty+6,c2);px(19,ty+6,c2)}
    if(a.top===5){rect(14,ty,4,4,"#f8fafc");rect(15,ty+1,2,7,"#c0282e");px(15,ty+8,"#8a1c20");px(16,ty+8,"#8a1c20");px(13,ty,c2);px(18,ty,c2);px(13,ty+1,c2);px(18,ty+1,c2)}
  }
  if(U&&a.top===1){rect(11,ty,10,4,c2);rect(12,ty+1,8,2,darken(c2,.15))}
  if(S){
    if(a.top===1){rect(11,ty,4,3,c2)}
    if(a.top===2){px(19,ty,"#f8fafc");px(18,ty,"#f8fafc")}
    if(a.top===3){rect(19,ty,2,12,under)}
    if(a.top===4){rect(11,ty+1,10,11,c1);rect(18,ty+1,2,11,under)}
    if(a.top===5){rect(19,ty,2,3,"#f8fafc");rect(20,ty+1,1,6,"#c0282e")}
  }
  /* mochila (atrás) */
  if(a.body===2){if(U){rrect(8,ty+1,16,13,2,k1);rect(8,ty+11,16,2,k2);rrect(11,ty+6,10,5,1,k2);rect(13,ty,6,1,k2)}
    if(S){rrect(5,ty+1,7,12,2,k1);rect(5,ty+10,7,2,k2)}}
  /* ---------- brazos ---------- */
  function arm(x,y,len){var sl=sleeveLong?len:3;rect(x,y,3,sl,top.c);rect(x+2,y,1,sl,top.d);if(!sleeveLong){rect(x,y+3,3,len-3,s1);rect(x+2,y+3,1,len-3,s2)}rect(x,y+len,3,2,s1);px(x+2,y+len+1,s2)}
  var armTop=a.top===4?under:null;
  if(D||U){arm(6,ty+1+armA,9);arm(23,ty+1+armB,9);var sep=darken(top.c,.4);rect(9,ty+3,1,8,sep);rect(22,ty+3,1,8,sep)}
  else{var ax=14+(P.ax||0),axB=9-(P.ax||0);
    rect(axB,ty+2,3,7,darken(top.c,.32));rect(axB,ty+9,3,2,darken(s1,.18)); // brazo de atrás (más oscuro, da profundidad)
    arm(ax,ty+1,9);rect(ax+3,ty+1,1,9,top.d);rect(ax-1,ty+3,1,7,darken(top.c,.4))}
  if(a.top===4&&(D||U)){/* mangas claras ya por top.c */}
  /* tirantes de mochila (frente) */
  if(a.body===2&&D){rect(11,ty,2,10,k2);rect(19,ty,2,10,k2)}
  if(a.body===2&&S){rect(12,ty,2,9,k2)}
  /* gafete */
  if(a.body===1&&D){for(var i=0;i<5;i++){px(12+Math.floor(i*0.6),ty+i,k1);px(19-Math.floor(i*0.6),ty+i,k1)}rect(13,ty+5,6,6,"#f8fafc");rect(13,ty+5,6,1,k1);rect(14,ty+7,2,2,s2);rect(17,ty+7,1,1,"#97a3c7");rect(17,ty+9,1,1,"#97a3c7");px(15,ty+10,"#97a3c7")}
  if(a.body===1&&S){rect(19,ty,1,5,k1);rect(19,ty+5,3,5,"#f8fafc")}
  /* ---------- cabeza ---------- */
  if(D||U){rrect(hx,hy,hw,hh,5,s1);rect(hx,hy+hh-4,hw,1,s1);rect(hx+2,hy+hh-2,hw-4,2,s1);
    rect(hx+hw-3,hy+6,3,hh-10,s2);rect(hx+3,hy+hh-1,hw-6,1,s2);
    px(hx-1,hy+10,s1);px(hx-1,hy+11,s1);px(hx-1,hy+12,s2);px(hx+hw,hy+10,s2);px(hx+hw,hy+11,s2);px(hx+hw,hy+12,s3)}
  else{rrect(8,hy,18,hh,5,s1);rect(8,hy+hh-5,8,3,s1);rect(23,hy+8,3,8,s1);px(26,hy+11,s1);px(26,hy+12,s2);rect(10,hy+hh-2,12,1,s2);
    rect(14,hy+9,3,4,s1);rect(15,hy+10,1,2,s2)}
  /* cara */
  if(D){
    var ey=hy+10,lx=10,rx=20;
    if(blink){rect(lx,ey+2,2,1,darken(s2,.25));rect(rx,ey+2,2,1,darken(s2,.25))}else{rect(lx,ey,2,3,e);rect(rx,ey,2,3,e);px(lx,ey,"#ffffff");px(rx,ey,"#ffffff");px(lx+1,ey+2,darken(e,.3));px(rx+1,ey+2,darken(e,.3))}
    rect(lx-1,ey-2,4,1,hD);rect(rx-1,ey-2,4,1,hD);
    px(16,ey+3,s2);
    rect(14,ey+5,4,1,"#8a3b2e");px(13,ey+4,"#8a3b2e");px(18,ey+4,"#8a3b2e");
    var bl=mix(s1,"#ff7a7a",.35);px(8,ey+3,bl);px(9,ey+3,bl);px(22,ey+3,bl);px(23,ey+3,bl);
  }
  if(S){var ey2=hy+10;if(blink)rect(20,ey2+2,2,1,darken(s2,.25));else{rect(20,ey2,2,3,e);px(20,ey2,"#ffffff")}rect(19,ey2-2,4,1,hD);px(26,ey2+2,s1);px(26,ey2+3,s1);px(25,ey2+4,s2);rect(22,ey2+5,3,1,"#8a3b2e");px(24,ey2+4,"#8a3b2e");px(18,ey2+3,mix(s1,"#ff7a7a",.35))}
  /* vello facial */
  if(a.beard&&!U){var bc=hD;
    if(D){var my=hy+15;if(a.beard===1){rect(13,my-1,6,1,bc);px(12,my,bc);px(19,my,bc)}
      if(a.beard===2){rect(14,my+1,4,3,bc);rect(15,my+4,2,1,bc);rect(13,my-1,6,1,bc)}
      if(a.beard===3){rect(hx+1,hy+10,2,8,bc);rect(hx+hw-3,hy+10,2,8,bc);rect(hx+2,hy+16,hw-4,4,bc);rect(14,my,4,1,"#8a3b2e");rect(13,my-1,6,1,bc);rect(hx+4,hy+hh,hw-8,1,bc)}}
    if(S){var my2=hy+15;if(a.beard===1)rect(21,my2-1,4,1,bc);if(a.beard===2)rect(21,my2+1,3,3,bc);if(a.beard===3){rect(14,hy+11,10,9,bc);rect(15,hy+9,2,3,bc);rect(22,my2,3,1,"#8a3b2e");}}
  }
  /* ---------- pelo ---------- */
  var capH=a.hair===1?5:7;
  function capFront(){rrect(hx-1,hy-1,hw+2,capH+1,6,h1);rect(hx-1,hy+3,hw+2,capH-3,h1);
    if(a.hair!==1){for(var x=hx;x<hx+hw;x++){if((x*7)%5<3)px(x,hy+capH,h1);if((x*3)%7===0)px(x,hy+capH+1,h1)}rect(hx-1,hy+capH-1,3,6,h1);rect(hx+hw-2,hy+capH-1,3,6,h1);rect(hx-1,hy+capH+4,2,1,hD);rect(hx+hw-1,hy+capH+4,2,1,hD)}
    rect(hx+4,hy+1,6,1,hL);rect(hx+3,hy+2,3,1,hL);rect(hx+hw-6,hy+capH-2,4,1,hD);rect(hx,hy+capH-1,hw,1,a.hair===1?hD:h1)}
  function capBack(){var bh=a.hair===1?hh-3:hh-1;rrect(hx-1,hy-1,hw+2,bh,6,h1);rect(hx-1,hy+4,hw+2,bh-8,h1);rect(hx+3,hy+1,5,1,hL);rect(hx+1,hy+bh-3,hw-2,2,hD)}
  function capSide(){rrect(7,hy-1,20,capH+1,6,h1);rect(7,hy+2,8,a.hair===1?12:16,h1);rect(7,hy+(a.hair===1?13:17),7,1,hD);
    if(a.hair!==1){for(var x=17;x<26;x++){if((x*7)%5<3)px(x,hy+capH,h1)}rect(16,hy+capH-1,2,4,h1)}rect(10,hy+1,6,1,hL)}
  if(a.hair!==3){
    if(D)capFront();if(U)capBack();if(S)capSide();
    if(a.hair===4){ell(16,hy-1,4,3,h1);rect(14,hy-3,3,1,hL);rect(13,hy+1,7,1,hD)}
    if(a.hair===7){[[8,0],[12,-1],[16,-2],[20,-1],[24,0]].forEach(function(p){var bx=S?p[0]+2:p[0];for(var j=0;j<4;j++)rect(bx-1+Math.floor(j/2),hy+p[1]-3+j,3-Math.floor(j/2),1,h1);px(bx,hy+p[1]-3,hL)})}
    if(a.hair===6&&D){rect(hx-2,hy+2,4,10,h1);rect(hx+hw-2,hy+2,4,10,h1)}
    if(a.hair===2&&D){rect(hx-2,hy+4,3,18,h1);rect(hx+hw-1,hy+4,3,18,h1)}
  }else{rect(hx+5,hy+2,4,1,lighten(s1,.35))}
  /* ---------- accesorios de cara ---------- */
  if(a.face&&!U){var g="#1b1b2f",L=a.face===2?"#141a30":"rgba(191,230,255,.55)",ey3=hy+10;
    if(D){[[9,ey3],[19,ey3]].forEach(function(q){for(var y1=q[1]-1;y1<=q[1]+3;y1++)for(var x1=q[0]-1;x1<=q[0]+3;x1++){var edge=y1===q[1]-1||y1===q[1]+3||x1===q[0]-1||x1===q[0]+3;if(edge)px(x1,y1,g);else if(a.face===2)px(x1,y1,L)}});rect(13,ey3,6,1,g);px(7,ey3,g);px(24,ey3,g);if(a.face===2){px(10,ey3,"#5a6a8a");px(20,ey3,"#5a6a8a")}}
    if(S){for(var y2=ey3-1;y2<=ey3+3;y2++)for(var x2=19;x2<=23;x2++){var ed=y2===ey3-1||y2===ey3+3||x2===19||x2===23;if(ed)px(x2,y2,g);else if(a.face===2)px(x2,y2,L)}rect(14,ey3,5,1,g)}}
  /* ---------- accesorios de cabeza ---------- */
  if(a.head===1){if(D||U){rect(hx+1,hy-2,hw-2,2,k1);rect(hx-1,hy,2,3,k1);rect(hx+hw-1,hy,2,3,k1);rrect(hx-3,hy+7,4,7,1,k1);rrect(hx+hw-1,hy+7,4,7,1,k1);rect(hx-3,hy+12,4,1,k2);rect(hx+hw-1,hy+12,4,1,k2)}
    if(S){rect(12,hy-2,8,2,k1);rect(15,hy,2,6,k1);rrect(13,hy+7,6,7,2,k1);rect(14,hy+9,4,3,k2)}}
  if(a.head===2){if(D){rrect(hx-1,hy-2,hw+2,9,4,k1);rect(hx-1,hy+4,hw+2,3,k1);rect(hx-2,hy+7,hw+4,2,k2);rect(14,hy,4,3,k2);rect(hx+3,hy-1,5,1,lighten(k1,.3))}
    if(U){rrect(hx-1,hy-2,hw+2,10,4,k1);rect(13,hy+6,6,2,k2)}
    if(S){rrect(7,hy-2,20,9,4,k1);rect(7,hy+4,20,3,k1);rect(22,hy+6,8,2,k2)}}
  if(a.head===3){var bx0=S?7:hx-1,bw=S?20:hw+2;rrect(bx0,hy-3,bw,12,5,k1);rect(bx0,hy+6,bw,3,k2);for(var x3=bx0+1;x3<bx0+bw;x3+=2)px(x3,hy+7,darken(k2,.2));ell(S?14:16,hy-4,2,2,"#f8fafc")}
  /* ---------- inclinación hacia adelante (caminata de lado) ---------- */
  if(S&&P.lean){var shB=Buf();for(var sy=0;sy<CH;sy++){var off=sy<ly?Math.round(P.lean*(ly-sy)/ly):0;for(var sx=0;sx<CW;sx++){if(B[sy][sx]){var nx2=sx+off;if(nx2>=0&&nx2<CW)shB[sy][nx2]=B[sy][sx]}}}B=shB}
  /* ---------- contorno ---------- */
  var OLc="#1b1b2f",out=Buf();
  for(var y=0;y<CH;y++)for(var x=0;x<CW;x++){if(B[y][x]){out[y][x]=B[y][x];continue}
    if(get(x-1,y)||get(x+1,y)||get(x,y-1)||get(x,y+1))out[y][x]=OLc}
  return out}
function bufCanvas(buf){var a=mk(CW,CH),c=a[1];for(var y=0;y<CH;y++)for(var x=0;x<CW;x++)if(buf[y][x]){c.fillStyle=buf[y][x];c.fillRect(x,y,1,1)}a[0]._chibi=1;return a[0]}
var CHC={};
var WALK8=[0,1,2,3,4,5,6,7].map(function(k){var sn=Math.sin(k*Math.PI/4);return {k:k,s:sn}});
function chibiFrames(a){var key=JSON.stringify(a);if(CHC[key])return CHC[key];var fr={};
  ["down","up","side"].forEach(function(v){
    fr[v+"idle"]=bufCanvas(chibi(a,v,{}));fr[v+"idle1"]=bufCanvas(chibi(a,v,{up:1}));fr[v+"blink"]=bufCanvas(chibi(a,v,{blink:1}));
    WALK8.forEach(function(w){var s=w.s,k=w.k,P;
      var vb=Math.round(Math.abs(Math.cos(k*Math.PI/4)));        // rebote sutil (0-1), fase correcta
      if(v==="side")P={st:Math.round(s*5),ax:Math.round(s*3),up:vb,lean:2};  // vista de lado: zancada amplia + inclinación
      else P={legA:Math.round(Math.max(0,s)*2),legB:Math.round(Math.max(0,-s)*2),armA:Math.round(-s*1.5)+1,armB:Math.round(s*1.5)+1,up:vb}; // frente/espalda: suave
      fr[v+"w"+w.k]=bufCanvas(chibi(a,v,P))});
    fr[v+"a"]=fr[v+"w2"];fr[v+"b"]=fr[v+"w6"]});
  CHC[key]=fr;return fr}
/* fotograma según el momento: respira, parpadea, camina */
function animKey(dir,moving,dist,t,seed){var v=(dir==="left"||dir==="right")?"side":dir;seed=seed||0;
  if(moving)return v+"w"+(Math.floor(dist*4)%8);
  var bt=(t+seed%7*.53)%4.2;if(bt<.13&&v!=="up")return v+"blink";
  return v+(Math.sin(t*2.2+seed)>.2?"idle1":"idle")}
/* NPC: apariencia derivada de una semilla */
function seedAv(seed){if(seed===424242)return {skin:5,hairC:0,eyes:1,hair:4,beard:0,top:2,topC:1,pants:1,shoes:1,head:0,face:1,body:1,accC:3};
  var r=function(k,n){return (hash(seed,k)%n)};
  var hair=[0,0,2,2,4,5,6,1,7,3][r(1,10)],hc=r(2,10);hc=hc<7?hc:[7,8,10][hc-7];
  return {skin:r(3,8),hairC:hc,eyes:r(4,6),hair:hair,beard:(r(5,4)===0&&hair!==2&&hair!==4&&hair!==5)?1+r(6,3):0,top:[0,0,1,1,2,3,4][r(7,7)],topC:r(8,10),pants:r(9,4),shoes:r(10,3),
    head:r(11,7)===0?1+r(12,3):0,face:r(13,4)===0?1:0,body:r(14,6)===0?1:(r(14,6)===1?2:0),accC:r(15,5)}}
avFrames=function(a){return chibiFrames(a)};
walkerFrames=function(seed){return chibiFrames(seedAv(seed))};
var NPCC2={};
npcSprite=function(seed){if(!NPCC2[seed])NPCC2[seed]=chibiFrames(seedAv(seed));var fr=NPCC2[seed];return Math.sin(performance.now()/1000*2.2+seed%9)>.2?fr.downidle1:fr.downidle};
function portrait(cv,img){if(!cv)return;cv.width=32;cv.height=32;var c=cv.getContext("2d");c.imageSmoothingEnabled=false;c.clearRect(0,0,32,32);c.drawImage(img,0,0,32,32,0,1,32,32)}
window.__AVF=function(o){var a=JSON.parse(JSON.stringify(AV_DEF));for(var k in o)a[k]=o[k];CHC={};return avFrames(a)};
