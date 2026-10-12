/* ================= ALGORITHM CITY · MAPA ================= */
var T=16,MW=32,MH=146,WPX=MW*T,WPY=MH*T;
var MAPON=false,RAF=0,LASTW=-1,CV=null,CX=null,VW=22,VH=14;
var GROUND=null,MINIBASE=null,GT=null,SOL=null,DOORS=null,OBJS=[],SMOKE=[],CHIMS=[],BUTTERS=[];
var P={tx:23,ty:23,sx:23,sy:23,fx:23,fy:23,t:0,moving:false,dir:"down",dist:0,path:[],pend:-1};
var CAM={x:0,y:0},HELD=[],MARK=null,LAST=0,TIME0=performance.now();

function mk(w,h){var c=document.createElement("canvas");c.width=w;c.height=h;var x=c.getContext("2d");x.imageSmoothingEnabled=false;return [c,x]}
function R(c,col,x,y,w,h){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function disc(c,cx,cy,r,col,sy){sy=sy||1;for(var dy=-r;dy<=r;dy++){var w=Math.floor(Math.sqrt(r*r-dy*dy)+0.35);R(c,col,cx-w,cy+Math.round(dy*sy),w*2+1,Math.max(1,Math.ceil(sy)))}}
function line(c,x0,y0,x1,y1,col,th){th=th||1;var dx=Math.abs(x1-x0),dy=Math.abs(y1-y0),n=Math.max(dx,dy)||1;for(var i=0;i<=n;i++){R(c,col,x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,th,th)}}
function hash(x,y){var n=(x*374761393+y*668265263)|0;n=Math.imul(n^(n>>>13),1274126177);return (n^(n>>>16))>>>0}
var OL="#1b1b2f";

/* ---------- PERSONAJE ---------- */
var PAL={o:"#1b1b2f",h:"#4a2c17",H:"#7a4c28",s:"#f2c9a0",S:"#d9a57c",e:"#1b1b2f",c:"#2ec4b6",C:"#1f968b",w:"#eafffb",p:"#33447a",P:"#222d52",b:"#3b2a20"};
var HEAD=["................", ".....oooooo.....", "....ohhhhhho....", "...ohhHHhhhho...", "...ohhhhhhhho..."];
var LEGS={"idle": ["....opPoopPo....", "....opPoopPo....", "....obboobbo....", "....oooooooo...."], "a": ["...opPo..opPo...", "...opPo..opPo...", "...obbo..obbo...", "...oooo..oooo..."], "b": ["....opPoopPo....", "....opPoopPo....", "...obbo..obbo...", "...oooo..oooo..."]};
var BODY_D=["...ohssssssho...", "...osssssssso...", "...ossessesso...", "...ossessesso...", "...oSssssssSo...", "....ossSSsso....", ".....osssso.....", "....occwwcco....", "...occcccccco...", "..ocCccccccCco..", "..ocCccccccCco..", "..osCccccccCso..", "...ooCCCCCCoo...", "....oppppppo....", "....opppPppo...."];
var BODY_U=["...ohhhhhhhho...", "...ohhhHHhhho...", "...ohhhhhhhho...", "...ohhhhhhhho...", "...oShhhhhhSo...", "....oShhhhSo....", ".....osssso.....", "....occcccco....", "...occcccccco...", "..ocCccCCccCco..", "..ocCccCCccCco..", "..osCccccccCso..", "...ooCCCCCCoo...", "....oppppppo....", "....opppPppo...."];
var SIDE=["................", ".....oooooo.....", "....ohhhhhhho...", "...ohhhHHhhhho..", "...ohhhhhhhhho..", "...ohhhhssssso..", "...ohhhsssssso..", "...ohhssssseso..", "...ohhssssseso..", "...ohSssssssso..", "....oSssssSo....", ".....osssso.....", ".....occwco.....", "....occcccco....", "....occCccco....", "....occCccco....", "....occsccco....", "....oCCCCCCo....", ".....oppppo.....", ".....oppPpo....."];
var SLEG={"idle": [".....opPPpo.....", ".....opPPpo.....", ".....obbbbbo....", ".....ooooooo...."], "a": ["....opPo.opo....", "....opPo..opo...", "...obbo...obbo..", "...oooo...oooo.."], "b": ["....opo.opPo....", "...opo..opPo....", "..obbo..obbo....", "..oooo..oooo...."]};
var FR={};
function spr(rows,pal){pal=pal||PAL;var a=mk(16,rows.length),c=a[1];rows.forEach(function(r,y){for(var x=0;x<16;x++){var k=r[x];if(k&&k!=="."&&pal[k])R(c,pal[k],x,y,1,1)}});return a[0]}
function buildPlayer(){
  ["idle","a","b"].forEach(function(f){
    FR["down"+f]=spr(HEAD.concat(BODY_D,LEGS[f]));
    FR["up"+f]=spr(HEAD.concat(BODY_U,LEGS[f]));
    FR["side"+f]=spr(SIDE.concat(SLEG[f]));
  });
}

/* ---------- SPRITES DEL ENTORNO ---------- */
var SP={};
function sprOak(fruit,tone){
  var a=mk(32,40),c=a[1];
  disc(c,16,37,9,"rgba(0,0,0,.22)",.35);
  R(c,OL,12,26,8,13);R(c,"#7a4c28",13,26,6,12);R(c,"#5b3a1f",17,26,2,12);R(c,"#5b3a1f",11,36,3,2);R(c,"#5b3a1f",18,36,3,2);
  var g=tone||["#1f3d22","#2f6b34","#3f8f3e","#56a84a","#7cc860"];
  disc(c,16,16,14,g[0]);disc(c,16,17,13,g[1]);disc(c,15,15,12,g[2]);disc(c,12,11,7,g[3]);disc(c,10,8,3,g[4]);
  for(var i=0;i<14;i++){var h=hash(i,fruit?7:3);R(c,g[1],6+h%20,8+(h>>5)%18,2,1);if(i%3===0)R(c,g[3],8+(h>>9)%16,6+(h>>13)%14,1,1)}
  if(fruit)[[9,16],[20,12],[22,20],[14,22],[17,9]].forEach(function(p){R(c,"#b3261e",p[0],p[1],3,3);R(c,"#ef5b4b",p[0],p[1],2,2)});
  return a[0];
}
function sprPine(){
  var a=mk(32,46),c=a[1];
  disc(c,16,43,8,"rgba(0,0,0,.22)",.35);
  R(c,OL,13,34,6,10);R(c,"#6b4426",14,34,4,9);
  for(var k=0;k<4;k++){var top=2+k*8,h=14,mw=5+k*3.2;
    for(var r=0;r<h;r++){var hw=Math.round(1+r*(mw/h));R(c,"#173d2b",16-hw-1,top+r,hw*2+2,1);R(c,"#2f7a52",16-hw,top+r,hw*2,1);R(c,"#43a06a",16-hw,top+r,Math.max(1,Math.floor(hw*.7)),1)}
    R(c,"#1f5a3c",16-Math.round(1+mw)+1,top+h-1,Math.round(mw)*2,1);}
  return a[0];
}
function sprPalm(){
  var a=mk(32,44),c=a[1];
  disc(c,16,41,7,"rgba(0,0,0,.2)",.35);
  for(var i=0;i<26;i++){var x=14+Math.round(Math.sin(i/8)*2.5);R(c,OL,x-1,40-i,5,1);R(c,i%4===0?"#8a6232":"#b78a52",x,40-i,3,1)}
  var cx=16,cy=13;[[2,20],[30,20],[4,8],[28,7],[16,1],[9,22],[24,22]].forEach(function(e){line(c,cx,cy,e[0],e[1],"#25602a",3)});
  [[2,20],[30,20],[4,8],[28,7],[16,1],[9,22],[24,22]].forEach(function(e){line(c,cx,cy,e[0]+.5,e[1]+.5,"#3f9b3a",2)});
  R(c,"#6b4426",13,14,3,3);R(c,"#6b4426",17,15,3,3);
  return a[0];
}
function sprBush(){var a=mk(16,16),c=a[1];disc(c,8,14,6,"rgba(0,0,0,.2)",.35);disc(c,8,9,7,"#1f4a24");disc(c,8,9,6,"#3f8a3a");disc(c,6,7,3,"#5fae4d");R(c,"#e9e2f5",11,9,1,1);R(c,"#f6d55c",5,11,1,1);return a[0]}
function sprRock(){var a=mk(16,16),c=a[1];disc(c,8,13,6,"rgba(0,0,0,.2)",.35);disc(c,8,10,6,"#4f4c48",.8);disc(c,8,10,5,"#8e8a84",.8);disc(c,6,8,2,"#b9b5ae");return a[0]}
function sprBoulder(){var a=mk(32,30),c=a[1];disc(c,16,26,13,"rgba(0,0,0,.22)",.3);disc(c,12,16,10,"#4c4944");disc(c,21,15,9,"#4c4944");disc(c,12,16,9,"#8f8a82");disc(c,21,15,8,"#9d988f");disc(c,9,12,4,"#c2bdb4");disc(c,19,10,3,"#c2bdb4");R(c,"#5f8f45",22,20,4,2);R(c,"#5f8f45",8,21,3,1);return a[0]}
function sprLamp(){var a=mk(16,32),c=a[1];disc(c,8,30,5,"rgba(0,0,0,.2)",.35);R(c,OL,6,10,4,20);R(c,"#3b4250",7,10,2,19);R(c,OL,4,27,8,3);R(c,"#3b4250",5,27,6,2);R(c,OL,3,2,10,9);R(c,"#3b4250",4,3,8,7);R(c,"#ffe08a",5,4,6,5);R(c,"#fff4c4",6,5,2,2);R(c,OL,2,1,12,2);return a[0]}
function sprBench(){var a=mk(16,16),c=a[1];R(c,"rgba(0,0,0,.2)",1,12,15,3);R(c,OL,0,2,16,9);R(c,"#a8743f",1,3,14,3);R(c,"#c08a4f",1,7,14,3);R(c,"#7d5430",1,5,14,1);R(c,OL,1,10,2,4);R(c,OL,13,10,2,4);return a[0]}
function sprBarrel(){var a=mk(16,16),c=a[1];disc(c,8,14,5,"rgba(0,0,0,.2)",.35);R(c,OL,2,2,12,13);R(c,"#9a6234",3,3,10,11);R(c,"#b97c44",4,3,3,11);R(c,"#4a3a2e",3,5,10,1);R(c,"#4a3a2e",3,11,10,1);R(c,"#c89b63",3,2,10,2);return a[0]}
function sprCrate(){var a=mk(16,16),c=a[1];R(c,"rgba(0,0,0,.2)",3,13,13,3);R(c,OL,1,2,14,13);R(c,"#c08a4f",2,3,12,11);R(c,"#7d5430",2,3,12,1);R(c,"#7d5430",2,13,12,1);line(c,3,4,12,12,"#8f6237");line(c,12,4,3,12,"#8f6237");R(c,"#dba86a",2,4,1,9);return a[0]}
function sprAnvil(){var a=mk(16,16),c=a[1];R(c,"rgba(0,0,0,.2)",2,13,13,3);R(c,"#6b4426",4,10,8,5);R(c,OL,1,4,14,5);R(c,"#5a5f6b",2,5,12,3);R(c,"#8a90a0",3,5,9,1);R(c,OL,6,8,4,3);R(c,"#5a5f6b",7,8,2,2);return a[0]}
function sprSign(){var a=mk(32,26),c=a[1];R(c,"rgba(0,0,0,.2)",4,23,26,3);R(c,OL,6,12,3,13);R(c,OL,23,12,3,13);R(c,"#7d5430",7,12,1,12);R(c,"#7d5430",24,12,1,12);R(c,OL,1,1,30,14);R(c,"#c08a4f",2,2,28,12);R(c,"#dba86a",2,2,28,2);R(c,"#5b3a1f",5,6,22,2);R(c,"#5b3a1f",8,10,16,1);return a[0]}
function sprCrystal(){var a=mk(16,20),c=a[1];disc(c,8,18,5,"rgba(0,0,0,.2)",.35);var pts=[[8,1],[13,9],[8,18],[3,9]];for(var y=1;y<18;y++){var hw=y<9?Math.round((y-1)*5/8):Math.round((18-y)*5/9);R(c,OL,8-hw-1,y,hw*2+3,1);R(c,"#9b6fe0",8-hw,y,hw*2+1,1);R(c,"#c9a8ff",8-hw,y,Math.max(1,hw),1)}R(c,"#fff",7,5,1,2);return a[0]}

/* ---------- EDIFICIOS ---------- */
var BST=[
 {wall:"#f3e3c3",wall2:"#d8c294",pat:"tudor",beam:"#6b4428",roof:"#d9573b",roof2:"#a63a25",roofHi:"#ef7d5c",trim:"#6b4428",door:"#8a5a33",chim:true,flowers:true},
 {wall:"#e2f0f2",wall2:"#b8d3d8",pat:"wood",roof:"#2a8f8a",roof2:"#1c6663",roofHi:"#4bb8ae",trim:"#2f4f6a",door:"#2f4f6a",chim:false,flowers:false},
 {wall:"#b07646",wall2:"#7f522c",pat:"log",roof:"#4f8a3c",roof2:"#356428",roofHi:"#70b057",trim:"#5a3a1e",door:"#5a3a1e",chim:true,flowers:true},
 {type:"castle"},
 {wall:"#f4f7f8",wall2:"#d0dde1",pat:"plaster",roof:"#3f74c4",roof2:"#2b528f",roofHi:"#6b9be0",trim:"#2b528f",door:"#2b528f",chim:false,flowers:true},
 {wall:"#bdb7ac",wall2:"#8a8479",pat:"stone",roof:"#5d6472",roof2:"#3f4552",roofHi:"#808897",trim:"#4a3a2e",door:"#5a3a1e",chim:true},
 {wall:"#b65a3c",wall2:"#86391f",pat:"brick",roof:"#4b4f58",roof2:"#30333a",roofHi:"#6c717c",trim:"#3a2a20",door:"#6b4428",chim:true},
 {type:"tower"}
];
var BLD=[{x:4,y:6},{x:13,y:6},{x:27,y:6},{x:37,y:6},{x:4,y:24},{x:13,y:24},{x:27,y:24},{x:37,y:24}];

function wallFill(c,st,x,y,w,h){
  R(c,st.wall,x,y,w,h);
  var p=st.pat,i,j;
  if(p==="wood"){for(j=y+4;j<y+h;j+=5)R(c,st.wall2,x,j,w,1)}
  else if(p==="log"){for(j=y;j<y+h;j+=6){R(c,"#c48a57",x,j,w,1);R(c,st.wall2,x,j+5,w,1);R(c,"#8f5e33",x,j+1,2,4);R(c,"#8f5e33",x+w-2,j+1,2,4)}}
  else if(p==="brick"){for(j=y;j<y+h;j+=4){R(c,st.wall2,x,j+3,w,1);for(i=x+((j-y)/4%2?4:0);i<x+w;i+=8)R(c,st.wall2,i,j,1,3)}}
  else if(p==="stone"){for(j=y;j<y+h;j+=6)for(i=x+((j-y)/6%2?5:0)-5;i<x+w;i+=10){var hh=hash(i,j);R(c,st.wall2,Math.max(x,i),j,1,6);R(c,st.wall2,Math.max(x,i),j+5,Math.min(10,x+w-Math.max(x,i)),1);if(hh%3===0)R(c,"#d2cdc3",Math.max(x,i)+2,j+1,3,1)}}
  else{for(i=0;i<w*h/40;i++){var q=hash(x+i,y);R(c,st.wall2,x+q%w,y+(q>>8)%h,1,1)}}
  if(p==="tudor"){R(c,st.beam,x,y,w,2);R(c,st.beam,x,y+Math.floor(h/2)-1,w,2);R(c,st.beam,x,y,2,h);R(c,st.beam,x+w-2,y,2,h);R(c,st.beam,x+30,y,2,h);R(c,st.beam,x+w-32,y,2,h)}
}
function windowAt(c,st,x,y,flowers){
  R(c,OL,x-1,y-1,16,14);R(c,st.trim,x,y,14,12);R(c,"#9fd3f2",x+2,y+2,10,8);R(c,"#d9f1ff",x+3,y+3,2,2);R(c,"#d9f1ff",x+5,y+3,1,1);
  R(c,st.trim,x+6,y+2,2,8);R(c,st.trim,x+2,y+5,10,1);
  if(flowers){R(c,OL,x-2,y+12,18,4);R(c,"#8a5a33",x-1,y+12,16,3);for(var i=0;i<6;i++)R(c,["#ef476f","#ffd166","#f78c6b"][i%3],x+i*3,y+10+(i%2),2,2)}
}
function doorAt(c,st,x,y,h){
  R(c,OL,x-1,y-1,18,h+1);R(c,st.door,x,y+2,16,h-2);R(c,st.door,x+2,y,12,2);
  R(c,"rgba(0,0,0,.25)",x+5,y+2,1,h-2);R(c,"rgba(0,0,0,.25)",x+10,y+2,1,h-2);R(c,"rgba(255,255,255,.15)",x+1,y+3,1,h-4);
  R(c,"#f2c14e",x+12,y+Math.floor(h/2),2,2);R(c,"#a39e93",x-3,y+h-1,22,2);
}
function houseSprite(st){
  var W=112,top=22,H=80+top,a=mk(W,H),c=a[1],Y0=top;
  R(c,"rgba(20,30,20,.25)",W-8,Y0+44,8,36);R(c,"rgba(20,30,20,.18)",6,Y0+78,W-6,2);
  var wx=6,ww=W-12,wy=Y0+40,wh=38;
  wallFill(c,st,wx,wy,ww,wh);
  R(c,"#7e776a",wx,wy+wh-4,ww,4);R(c,"#9c9486",wx,wy+wh-4,ww,1);
  R(c,OL,wx-1,wy,1,wh+1);R(c,OL,wx+ww,wy,1,wh+1);R(c,OL,wx-1,wy+wh,ww+2,1);
  windowAt(c,st,wx+11,wy+10,st.flowers);windowAt(c,st,wx+ww-25,wy+10,st.flowers);
  doorAt(c,st,48,Y0+57,23);
  if(st.chim){R(c,OL,W-31,Y0-8,12,24);R(c,"#9a4a35",W-30,Y0-7,10,22);R(c,"#6e3122",W-30,Y0-7,10,3);for(var k=0;k<4;k++)R(c,"#6e3122",W-30+(k%2)*5,Y0-2+k*5,1,4)}
  // tejado a cuatro aguas
  var ry=Y0+2,rh=42;
  for(var i=0;i<rh;i++){var ins=Math.max(0,Math.round(10-i*1.1)),x0=1+ins,w0=W-2-ins*2,y=ry+i;
    var col=i<3?st.roofHi:(i>=rh-4?st.roof2:((i-3)%6===5?st.roof2:st.roof));
    R(c,OL,x0-1,y,w0+2,1);R(c,col,x0,y,w0,1);
    if(i>=3&&i<rh-4&&(i-3)%6===2){for(var xx=x0+((i/6|0)%2?3:7);xx<x0+w0-2;xx+=9)R(c,st.roof2,xx,y,1,3)}
    if(i>=3&&i<rh-4&&(i-3)%6===0)R(c,"rgba(255,255,255,.12)",x0,y,w0,1);
  }
  R(c,OL,1+10,ry-1,W-24,1);R(c,OL,0,ry+rh,W,1);
  // frontón sobre la puerta
  var by=Y0+44,ay=Y0+16,cx=56;
  for(var y2=ay;y2<by;y2++){var hw=Math.round((y2-ay)/(by-ay)*24);R(c,OL,cx-hw-3,y2,hw*2+6,1);R(c,st.roof2,cx-hw-2,y2,hw*2+4,1);if(hw>3)R(c,st.wall,cx-hw+1,y2,hw*2-2,1)}
  disc(c,cx,Y0+34,4,OL);disc(c,cx,Y0+34,3,"#9fd3f2");R(c,"#d9f1ff",cx-1,Y0+32,1,1);R(c,st.trim,cx,Y0+31,1,7);R(c,st.trim,cx-3,Y0+34,7,1);
  return {c:a[0],top:top,chim:st.chim?[W-25,Y0-10]:null,flag:[W-20,Y0-2]};
}
function castleSprite(){
  var W=112,top=48,H=80+top,a=mk(W,H),c=a[1],Y0=top,st={wall:"#bcb6ab",wall2:"#8d877c",pat:"stone"};
  R(c,"rgba(20,30,20,.25)",W-6,Y0+30,6,50);
  wallFill(c,st,14,Y0+22,84,56);R(c,OL,13,Y0+22,1,57);R(c,OL,98,Y0+22,1,57);R(c,OL,13,Y0+78,86,1);
  for(var x=14;x<98;x+=10){R(c,OL,x-1,Y0+13,8,10);R(c,"#cdc7bc",x,Y0+14,6,9);R(c,"#e2ddd3",x,Y0+14,6,2)}R(c,OL,13,Y0+22,86,1);
  [[0],[86]].forEach(function(t){var tx=t[0];
    wallFill(c,{wall:"#aea89c",wall2:"#837d72",pat:"stone"},tx,Y0-6,26,84);R(c,OL,tx-1,Y0-6,1,85);R(c,OL,tx+26,Y0-6,1,85);R(c,OL,tx-1,Y0+78,28,1);
    for(var yy=Y0-30,k=0;yy<Y0-6;yy++,k++){var hw=Math.round(k/24*16);R(c,OL,tx+13-hw-1,yy,hw*2+2,1);R(c,k%5===4?"#8e1f1a":"#c0392b",tx+13-hw,yy,hw*2,1);R(c,"#e2574c",tx+13-hw,yy,Math.max(1,hw-2),1)}
    R(c,OL,tx-2,Y0-6,30,2);R(c,OL,tx+12,Y0-44,2,15);R(c,"#ffd166",tx+14,Y0-44,9,6);R(c,"#f4a020",tx+14,Y0-40,9,2);
    R(c,OL,tx+11,Y0+8,4,10);R(c,"#2b2f3a",tx+12,Y0+9,2,8);R(c,OL,tx+11,Y0+40,4,10);R(c,"#2b2f3a",tx+12,Y0+41,2,8);
  });
  [30,76].forEach(function(bx){R(c,OL,bx-1,Y0+29,12,22);R(c,"#b3261e",bx,Y0+30,10,19);R(c,"#ffd166",bx+3,Y0+36,4,4);R(c,"#8e1f1a",bx,Y0+30,10,2);R(c,"#b3261e",bx,Y0+49,4,2);R(c,"#b3261e",bx+6,Y0+49,4,2)});
  R(c,"#7f7a70",42,Y0+46,28,32);
  for(var y=0;y<32;y++){var w=y<8?Math.round(Math.sqrt(64-(8-y)*(8-y))*1.5):12;R(c,OL,56-w-1,Y0+48+y,w*2+2,1);R(c,"#3a2a20",56-w,Y0+48+y,w*2,1)}
  for(var bx2=46;bx2<68;bx2+=4)R(c,"#6b6f7a",bx2,Y0+52,1,26);for(var by2=Y0+56;by2<Y0+78;by2+=6)R(c,"#6b6f7a",45,by2,22,1);
  return {c:a[0],top:top,chim:null,flag:[60,Y0+6]};
}
function towerSprite(){
  var W=112,top=84,H=80+top,a=mk(W,H),c=a[1],Y0=top;
  var an={wall:"#ece4f6",wall2:"#d2c6e6",pat:"plaster",roof:"#7b4fb8",roof2:"#55328a",roofHi:"#9d76d6",trim:"#55328a",door:"#55328a"};
  R(c,"rgba(20,30,20,.25)",W-8,Y0+50,8,30);
  wallFill(c,an,6,Y0+46,100,32);R(c,"#7e776a",6,Y0+74,100,4);R(c,OL,5,Y0+46,1,33);R(c,OL,106,Y0+46,1,33);R(c,OL,5,Y0+78,102,1);
  for(var i=0;i<14;i++){var ins=Math.max(0,8-i);R(c,OL,1+ins,Y0+32+i,110-ins*2,1);R(c,i<2?an.roofHi:(i>11?an.roof2:an.roof),2+ins,Y0+32+i,108-ins*2,1)}
  windowAt(c,an,14,Y0+54,true);windowAt(c,an,84,Y0+54,true);
  var tx=34,tw=44;
  wallFill(c,{wall:"#9b8ec4",wall2:"#76699f",pat:"stone"},tx,Y0-44,tw,122);R(c,OL,tx-1,Y0-44,1,123);R(c,OL,tx+tw,Y0-44,1,123);
  for(var k=0;k<3;k++){var wy=Y0-34+k*22;R(c,OL,51,wy-1,10,14);R(c,"#ffd166",52,wy+2,8,10);R(c,"#ffd166",53,wy,6,2);R(c,"#fff1b8",53,wy+3,2,3)}
  R(c,OL,tx-3,Y0-47,tw+6,4);R(c,"#c9bfe6",tx-2,Y0-46,tw+4,2);
  for(var y=0;y<38;y++){var hw=Math.round(y/38*27);R(c,OL,56-hw-1,Y0-84+y,hw*2+2,1);R(c,y%6===5?"#55328a":"#6a3fa0",56-hw,Y0-84+y,hw*2,1);R(c,"#8a62c4",56-hw,Y0-84+y,Math.max(1,Math.floor(hw*.5)),1)}
  disc(c,56,Y0-84,3,OL);disc(c,56,Y0-84,2,"#ffd166");
  doorAt(c,an,48,Y0+57,23);
  return {c:a[0],top:top,chim:null,flag:[70,Y0-46]};
}

/* ---------- MUNDO ---------- */
function setG(x,y,v){if(x>=0&&y>=0&&x<MW&&y<MH)GT[y*MW+x]=v}
function G(x,y){return (x<0||y<0||x>=MW||y>=MH)?"x":GT[y*MW+x]}
function solid(x,y){return x<0||y<0||x>=MW||y>=MH||SOL[y*MW+x]===1}
function walkable(x,y){var g=G(x,y);return !solid(x,y)&&g!=="w"&&g!=="f"&&g!=="x"&&g!=="a"}
function rect(x,y,w,h,v){for(var j=y;j<y+h;j++)for(var i=x;i<x+w;i++)setG(i,j,v)}
function block(x,y){if(x>=0&&y>=0&&x<MW&&y<MH)SOL[y*MW+x]=1}
function addObj(sprite,tx,ty,ox,oy,isSolid){OBJS.push({s:sprite,x:tx*T+ox,y:ty*T+oy,by:ty*T+T});if(isSolid!==false)block(tx,ty)}

function buildWorld(){
  GT=new Array(MW*MH).fill("g");SOL=new Uint8Array(MW*MH);DOORS={};OBJS=[];CHIMS=[];
  SP.oak=sprOak();SP.oak2=sprOak(false,["#1d3a2c","#2a6648","#368055","#4e9e66","#76c487"]);SP.fruit=sprOak(true);SP.pine=sprPine();SP.palm=sprPalm();
  SP.bush=sprBush();SP.rock=sprRock();SP.boulder=sprBoulder();SP.lamp=sprLamp();SP.bench=sprBench();SP.barrel=sprBarrel();SP.crate=sprCrate();SP.anvil=sprAnvil();SP.sign=sprSign();SP.crystal=sprCrystal();
  // caminos
  rect(2,18,44,2,"p");rect(23,8,2,27,"p");rect(4,31,42,2,"p");rect(44,18,2,15,"p");rect(0,34,MW,1,"k");rect(0,35,MW,2,"a");rect(0,37,MW,1,"k");
  for(var y=12;y<=25;y++)for(var x=16;x<=31;x++){var dx=(x+.5-24)/6.6,dy=(y+.5-19)/5.8;if(dx*dx+dy*dy<=1)setG(x,y,"s")}
  // agua
  for(y=2;y<=4;y++)for(x=10;x<=22;x++){if((y===2||y===4)&&(x===10||x===22))continue;setG(x,y,"w")}
  setG(18,4,"d");setG(18,5,"d");setG(18,3,"d");
  for(y=20;y<=22;y++)for(x=2;x<=11;x++){if((y===20||y===22)&&(x===2||x===11))continue;setG(x,y,"w")}
  setG(6,21,"g");setG(7,21,"g");
  // huerto
  rect(9,12,4,3,"f");
  // edificios
  BLD.forEach(function(b,w){
    var st=BST[w],sp=st.type==="castle"?castleSprite():st.type==="tower"?towerSprite():houseSprite(st);
    b.sp=sp;b.dx=b.x+3;b.dy=b.y+4;b.ax=b.x+3;b.ay=b.y+5;
    for(var j=0;j<5;j++)for(var i=0;i<7;i++)block(b.x+i,b.y+j);
    DOORS[b.dx+","+b.dy]=w;
    OBJS.push({b:w,x:b.x*T,y:b.y*T-sp.top,by:(b.y+5)*T-1});
    if(sp.chim)CHIMS.push([b.x*T+sp.chim[0],b.y*T-sp.top+sp.chim[1]]);
    if(b.y<18)rect(b.ax,b.ay,1,18-b.ay,"p");else rect(b.ax,b.ay,1,31-b.ay,"p");
    addObj(SP.lamp,b.ax-1,b.ay,0,-16);addObj(SP.lamp,b.ax+1,b.ay,0,-16);
  });
  // bordes de bosque
  for(x=0;x<MW;x++)for(y=0;y<MH;y++){if((x<2||y<2||x>=MW-2||y>=MH-2)&&G(x,y)!=="k"&&G(x,y)!=="a"){var h=hash(x,y);addObj(h%3===0?SP.pine:(h%3===1?SP.oak2:SP.oak),x,y,-8,h%3===0?-30:-24)}}
  [6,15,32,41].forEach(function(x){addObj(SP.lamp,x,33,0,-16)});
  // plaza
  OBJS.push({fountain:true,x:22*T,y:17*T,by:21*T-1});for(y=17;y<21;y++)for(x=22;x<26;x++)block(x,y);
  [[19,15],[28,15],[19,23],[28,23]].forEach(function(p){addObj(SP.bench,p[0],p[1],0,0)});
  [[18,17],[29,17],[18,21],[29,21]].forEach(function(p){addObj(SP.lamp,p[0],p[1],0,-16)});
  addObj(SP.sign,25,11,0,-10);block(26,11);OBJS[OBJS.length-1].sign=true;
  // decoración temática
  [[11,8],[20,8],[21,9]].forEach(function(p){addObj(SP.barrel,p[0],p[1],0,0)});
  [[25,3],[26,4],[28,2],[30,3],[32,2],[34,4],[35,3],[36,2],[26,9],[35,8],[34,11],[32,13],[34,14],[36,12],[33,16]].forEach(function(p,i){addObj(i%2?SP.pine:SP.oak2,p[0],p[1],-8,i%2?-30:-24)});
  [[36,13],[44,9],[45,12]].forEach(function(p){addObj(SP.rock,p[0],p[1],0,0)});
  addObj(SP.palm,6,21,-8,-28);[[3,24],[11,26],[2,27],[11,29]].forEach(function(p){addObj(SP.palm,p[0],p[1],-8,-28)});
  [[11,24],[20,26],[21,29]].forEach(function(p){addObj(SP.boulder,p[0],p[1],-8,-14)});
  [[13,21],[18,22],[20,21],[15,21]].forEach(function(p){addObj(SP.pine,p[0],p[1],-8,-30)});
  [[26,26],[26,27],[34,25]].forEach(function(p){addObj(SP.crate,p[0],p[1],0,0)});addObj(SP.anvil,35,27,0,0);addObj(SP.barrel,34,28,0,0);
  [[36,25],[36,28],[38,30],[42,30]].forEach(function(p){addObj(SP.crystal,p[0],p[1],0,-4)});
  [[8,16],[13,16],[2,13],[42,13],[30,22],[33,21],[21,22],[42,22]].forEach(function(p){addObj(SP.fruit,p[0],p[1],-8,-24)});
  for(x=8;x<=13;x++){block(x,11);block(x,15)}for(y=11;y<=15;y++){block(8,y);block(13,y)}
  // dispersos
  for(y=3;y<MH-3;y++)for(x=3;x<MW-3;x++){
    var ok=true;for(var j=-1;j<=1&&ok;j++)for(var i=-1;i<=1;i++){if(G(x+i,y+j)!=="g"||solid(x+i,y+j)){ok=false;break}}
    if(!ok||(Math.abs(x-23.5)<4&&Math.abs(y-24)<3))continue;
    var hh=hash(x*3,y*7);if(hh%17===0)addObj(hh%2?SP.oak:SP.fruit,x,y,-8,-24);else if(hh%23===0)addObj(SP.bush,x,y,0,0);else if(hh%29===0)addObj(SP.rock,x,y,0,0);
  }
  drawGround();
}

function drawGround(){
  var a=mk(WPX,WPY),c=a[1],x,y;
  for(y=0;y<MH;y++)for(x=0;x<MW;x++){
    var g=G(x,y),X=x*T,Y=y*T,h=hash(x,y);
    if(g==="g"||g==="f"||g==="n"){
      R(c,h%4===0?"#72b856":"#7bc15c",X,Y,T,T);
      for(var k=0;k<4;k++){var q=hash(x*7+k,y*13);R(c,k%2?"#68ab4d":"#93d36f",X+q%15,Y+(q>>6)%15,1,2)}
      if(h%9===0){R(c,"#5a9c41",X+4,Y+8,1,4);R(c,"#5a9c41",X+6,Y+7,1,5);R(c,"#5a9c41",X+8,Y+8,1,4);R(c,"#86c967",X+5,Y+9,1,3)}
      if(h%13===0){var fc=["#ffffff","#ffd166","#ff8fab","#a0c4ff"][h%4];R(c,fc,X+9,Y+4,1,1);R(c,fc,X+8,Y+5,3,1);R(c,fc,X+9,Y+6,1,1);R(c,"#f4a020",X+9,Y+5,1,1)}
      if(h%15===0){var fc2=["#ffffff","#ffd166","#ff8fab"][h%3];R(c,fc2,X+3,Y+11,1,1);R(c,fc2,X+2,Y+12,3,1);R(c,fc2,X+3,Y+13,1,1)}
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(function(d){if(G(x+d[0],y+d[1])==="w"){var sx=d[0]===1?X+13:X,sy=d[1]===1?Y+13:Y,sw=d[0]?3:T,sh=d[1]?3:T;R(c,"#e8d6a0",sx,sy,sw,sh)}});
    }
    if(g==="f"){R(c,"#8b5e3c",X,Y,T,T);for(var r=2;r<T;r+=5){R(c,"#6e4529",X,Y+r+2,T,1);R(c,"#5fbf4a",X+3,Y+r-1,3,3);R(c,"#3f9b3a",X+4,Y+r+1,1,1);R(c,"#5fbf4a",X+10,Y+r,3,3)}}
    if(g==="p"){
      R(c,"#d9bf8a",X,Y,T,T);
      for(var s=0;s<4;s++){var sx2=X+(s%2)*8+(h>>s&1),sy2=Y+(s>>1)*8+((h>>(s+3))&1);R(c,"#c4a771",sx2+1,sy2+1,6,6);R(c,"#e6d1a4",sx2+1,sy2+1,5,1);R(c,"#b39159",sx2+1,sy2+6,6,1)}
    }
    if(g==="k"){R(c,"#c9c4b8",X,Y,T,T);R(c,"#aaa496",X,Y+15,T,1);R(c,"#aaa496",X+15,Y,1,T);R(c,"#dcd8ce",X+1,Y+1,6,1)}
    if(g==="a"){R(c,"#3d414d",X,Y,T,T);if(h%5===0)R(c,"#454a57",X+(h%10),Y+(h>>>4)%12,3,2);
      if(y===STREET_Y+1&&x%2===0)R(c,"#f2d36b",X+2,Y,10,2);
      if(G(x,y-1)==="k")R(c,"#8e8a80",X,Y,T,2);if(G(x,y+1)==="k")R(c,"#8e8a80",X,Y+14,T,2);}
    if(g==="s"){R(c,"#d6cfc0",X,Y,T,T);R(c,"#bdb4a1",X,Y+7,T,1);R(c,"#bdb4a1",X+((y%2)?3:11),Y,1,7);R(c,"#bdb4a1",X+((y%2)?11:3),Y+8,1,8);R(c,"#e8e2d6",X+1,Y+1,5,1);R(c,"#e8e2d6",X+8,Y+9,5,1)}
    if(g==="w"){R(c,(h%5===0)?"#3e93d6":"#4aa3e0",X,Y,T,T);if(h%3===0)R(c,"#3a88cc",X+2+h%8,Y+6+(h>>4)%6,5,1)}
    if(g==="d"){R(c,"#4aa3e0",X,Y,T,T);R(c,OL,X+1,Y,14,T);R(c,"#b07a46",X+2,Y,12,T);for(var pl=0;pl<T;pl+=4)R(c,"#7d5430",X+2,Y+pl,12,1);R(c,"#5b3a1f",X,Y+2,2,4);R(c,"#5b3a1f",X+14,Y+2,2,4)}
    if(g==="p"||g==="s"){
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(function(d){var n=G(x+d[0],y+d[1]);if(n!=="p"&&n!=="s"&&n!=="x"){
        if(d[1]===-1){R(c,"#a88a55",X,Y,T,1);R(c,"#7bc15c",X+(h%12),Y,2,1)}
        if(d[1]===1){R(c,"#a88a55",X,Y+15,T,1)}
        if(d[0]===-1){R(c,"#a88a55",X,Y,1,T);R(c,"#7bc15c",X,Y+(h%12),1,2)}
        if(d[0]===1){R(c,"#a88a55",X+15,Y,1,T)}}});
    }
    if(g==="w"){[[0,-1],[0,1],[-1,0],[1,0]].forEach(function(d){var n=G(x+d[0],y+d[1]);if(n!=="w"&&n!=="d"&&n!=="x"){if(d[1]===-1)R(c,"#bfe6fb",X,Y,T,2);if(d[1]===1)R(c,"#2f78b8",X,Y+14,T,2);if(d[0]===-1)R(c,"#bfe6fb",X,Y,2,T);if(d[0]===1)R(c,"#bfe6fb",X+14,Y,2,T)}})}
  }
  drawFences(c);
  GROUND=a[0];
  var m=mk(MW*2,MH*2);m[1].imageSmoothingEnabled=true;m[1].drawImage(GROUND,0,0,MW*2,MH*2);
  OBJS.forEach(function(o){if(o.s===SP.pine||o.s===SP.oak||o.s===SP.oak2||o.s===SP.fruit||o.s===SP.palm)R(m[1],"#2f6b34",Math.floor((o.x+8)/8),Math.floor((o.by-8)/8),2,2)});
  BLD.forEach(function(b,w){R(m[1],BST[w].roof||(w===3?"#c0392b":"#7b4fb8"),b.x*2,b.y*2,14,10)});
  MINIBASE=m[0];
}

/* ---------- MOVIMIENTO ---------- */
var DIRS={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
var SPEED=5.2;
function nextDir(){
  if(P.path.length){var n=P.path[0],dx=n[0]-P.tx,dy=n[1]-P.ty;P.path.shift();
    if(Math.abs(dx)+Math.abs(dy)!==1){P.path=[];return null}
    return dx===1?"right":dx===-1?"left":dy===1?"down":"up";}
  if(P.turnT>0)return null;
  return HELD.length?HELD[HELD.length-1]:null;
}
function walkerAt(x,y){for(var i=0;i<WALKERS.length;i++){var w=WALKERS[i];if((w.tx===x&&w.ty===y)||(w.moving&&w.sx===x&&w.sy===y))return w}return null}
function tryStart(dir){
  var d=DIRS[dir];P.dir=dir;var nx=P.tx+d[0],ny=P.ty+d[1];
  if(!walkable(nx,ny)){P.path=[];if(P.goal&&G(nx,ny)==="z")P.repath=.4;return false}
  if(walkerAt(nx,ny)){
    if(P.path.length||P.goal){var g=P.goal;P.path=[];if(g){P.repath=.35;P.path=[]}}
    return false}
  P.sx=P.tx;P.sy=P.ty;P.tx=nx;P.ty=ny;P.t=0;P.moving=true;return true;
}
function update(dt){
  if(P.repath>0){P.repath-=dt;if(P.repath<=0&&P.goal&&!P.moving){var np=bfsAvoid(P.tx,P.ty,P.goal[0],P.goal[1]);if(np&&np.length){P.path=np}else if(!np){P.goal=null;P.pend=-1;MARK=null}}}
  if(P.turnT>0)P.turnT-=dt;
  if(P.moving){
    P.t+=dt*SPEED;P.dist+=dt*SPEED;
    if(P.t>=1){var extra=P.t-1;P.moving=false;P.fx=P.tx;P.fy=P.ty;
      if(!P.path.length&&P.pend>=0){var w=P.pend;P.pend=-1;MARK=null;if(P.tx===BLD[w].ax&&P.ty===BLD[w].ay){P.dir="up";enterSoon(w);return}}
      if(!P.path.length){MARK=null;P.goal=null}
      var nd=nextDir();if(nd&&tryStart(nd))P.t=Math.min(extra,.9);
    }
  }else{var nd2=nextDir();if(nd2)tryStart(nd2)}
  P.fx=P.moving?P.sx+(P.tx-P.sx)*P.t:P.tx;P.fy=P.moving?P.sy+(P.ty-P.sy)*P.t:P.ty;
}
function bfs(sx,sy,tx,ty){
  var prev={},q=[[sx,sy]],h=0;prev[sx+","+sy]=null;
  while(h<q.length){var c=q[h++];if(c[0]===tx&&c[1]===ty)break;
    for(var k in DIRS){var d=DIRS[k],nx=c[0]+d[0],ny=c[1]+d[1],nk=nx+","+ny;if(nk in prev||!walkable(nx,ny))continue;prev[nk]=c;q.push([nx,ny])}}
  if(!((tx+","+ty) in prev))return null;
  var p=[],cur=[tx,ty];while(cur&&!(cur[0]===sx&&cur[1]===sy)){p.unshift(cur);cur=prev[cur[0]+","+cur[1]]}return p;
}
function bldAt(x,y){for(var w=0;w<BLD.length;w++){var b=BLD[w];if(x>=b.x&&x<b.x+7&&y>=b.y-1&&y<b.y+5)return w}return -1}
function tapTo(x,y){
  if(!P.moving){for(var i=0;i<WALKERS.length;i++){var wk=WALKERS[i];if(Math.round(wk.fx)===x&&Math.round(wk.fy)===y&&Math.abs(x-P.tx)+Math.abs(y-P.ty)===1){P.dir=x>P.tx?"right":x<P.tx?"left":y>P.ty?"down":"up";wk.tx=x;wk.ty=y;talk(wk);return}}}
  var w=bldAt(x,y),tx=x,ty=y;
  if(w>=0){tx=BLD[w].ax;ty=BLD[w].ay}
  if(!walkable(tx,ty)){MARK={x:x,y:y,bad:true,t:0};return}
  var p=bfs(P.tx,P.ty,tx,ty);if(!p){MARK={x:x,y:y,bad:true,t:0};return}
  if(MDLG)closeDlg();HELD=[];P.path=p;P.pend=w;P.goal=[tx,ty];MARK={x:tx,y:ty,t:0};
  if(!p.length&&w>=0){P.pend=-1;MARK=null;P.dir="up";enterSoon(w)}
}
function press(d){if(MDLG)closeDlg();if(P.moving||ENTERING)return;if(P.dir!==d){P.dir=d;P.turnT=.1}else tryStart(d)}
function facing(){var d=DIRS[P.dir];return [P.tx+d[0],P.ty+d[1]]}
function facingDoor(){if(P.moving)return -1;var f=facing(),w=DOORS[f[0]+","+f[1]];return w===undefined?-1:w}
function facingSign(){if(P.moving)return false;var f=facing();return (f[0]===25||f[0]===26)&&f[1]===11}
function act(){
  if(MDLG){closeDlg();return}
  var wk=facingWalker();if(wk){talk(wk);return}
  var gw=facingGate();if(gw>=0&&gateLocked(gw)){toast("🔒 Acredita "+WORLDS[gw].nm+" en su Aula Magna para abrir esta reja");return}
  var w=facingDoor();if(w>=0){enterSoon(w);return}
  if(facingSign()){var f=facing();toast(SIGNS[f[0]+","+f[1]])}
}
var ENTERING=false;
function enterSoon(w){
  if(ENTERING)return;ENTERING=true;HELD=[];P.path=[];
  var f=$("fade");f.classList.add("on");
  setTimeout(function(){ENTERING=false;building(w);f.classList.remove("on")},240);
}

/* ---------- DIBUJO ---------- */
function sizeView(){
  var hud=$("hud");if(hud)document.documentElement.style.setProperty("--hudh",hud.offsetHeight+"px");
  var mw=$("mw");if(!mw||!CV)return;
  var cw=Math.max(200,mw.clientWidth),ch=Math.max(200,mw.clientHeight);
  var sc=cw>=1400?3.2:cw>=900?2.8:cw>=600?2.4:2;sc=Math.max(sc,cw/WPX,ch/WPY);
  CV.width=Math.round(cw/sc)*2;CV.height=Math.round(ch/sc)*2;VW=CV.width/2/T;VH=CV.height/2/T;
  CX=CV.getContext("2d");CX.setTransform(2,0,0,2,0,0);CX.imageSmoothingEnabled=false;
}
function camTarget(){return [Math.max(0,Math.min(WPX-VW*T,P.fx*T+8-VW*T/2)),Math.max(0,Math.min(WPY-VH*T,P.fy*T+8-VH*T/2))]}
function drawFountain(c,o,cx,cy,t){
  var x=o.x-cx,y=o.y-cy;
  disc(c,x+32,y+44,30,"rgba(0,0,0,.18)",.6);
  disc(c,x+32,y+38,30,"#6f685c",.75);disc(c,x+32,y+37,28,"#c9c1b1",.75);disc(c,x+32,y+36,26,"#ddd6c7",.75);
  disc(c,x+32,y+39,22,"#3f93d6",.62);disc(c,x+32,y+39,20,"#5ab0e6",.62);
  for(var k=0;k<3;k++){var rr=((t*10+k*7)%21)+1;for(var a=0;a<16;a++){var an=a/16*Math.PI*2;R(c,"#bfe6fb",x+32+Math.cos(an)*rr,y+39+Math.sin(an)*rr*.62,1,1)}}
  R(c,OL,x+28,y+16,8,24);R(c,"#d6cfc0",x+29,y+17,6,22);R(c,"#efe9dd",x+29,y+17,2,22);
  disc(c,x+32,y+16,8,OL,.5);disc(c,x+32,y+16,7,"#d6cfc0",.5);disc(c,x+32,y+15,5,"#5ab0e6",.4);
  for(var i=0;i<12;i++){var ph=(t*1.3+i/12)%1,sd=(i%2?1:-1)*(3+(i%4)*2);R(c,"#e2f5ff",x+32+sd*ph*1.6,y+12-Math.sin(ph*Math.PI)*14+ph*20,2,2)}
}
function drawPlayer(c,cx,cy){
  var bob=0;
  var x=Math.round(P.fx*T-cx),y=Math.round(P.fy*T-cy)-9;
  disc(c,x+8,y+23,5,"rgba(0,0,0,.3)",.35);
  var key=animKey(P.dir,P.moving,P.dist,performance.now()/1000,3),img=FR[key]||FR.downidle;
  if(P.dir==="left"){c.save();c.translate(x+16,y-bob);c.scale(-1,1);c.drawImage(img,0,0,16,24);c.restore()}else c.drawImage(img,x,y-bob,16,24);
}
function draw(t){
  var c=CX,vw=VW*T,vh=VH*T,cx=Math.round(CAM.x),cy=Math.round(CAM.y);
  c.drawImage(GROUND,cx,cy,vw,vh,0,0,vw,vh);
  var x0=Math.floor(cx/T),y0=Math.floor(cy/T);
  for(var y=y0;y<=y0+VH;y++)for(var x=x0;x<=x0+VW;x++){if(G(x,y)!=="w"||!CFG_FX())continue;var h=hash(x,y),ph=Math.floor(t*1.5+(h%10)/3);if((h+ph)%5===0)R(c,"#d9f1ff",x*T-cx+3+(h%7),y*T-cy+4+((h>>3)%8),3,1)}
  if(MARK){MARK.t+=1/60;var mx=MARK.x*T-cx,my=MARK.y*T-cy,pul=Math.floor(t*4)%2;
    if(MARK.bad){if(MARK.t<.5){line(c,mx+3,my+3,mx+12,my+12,"#f87171",2);line(c,mx+12,my+3,mx+3,my+12,"#f87171",2)}else MARK=null}
    else{var col="#fffbe8";R(c,col,mx+pul,my+pul,4,1);R(c,col,mx+pul,my+pul,1,4);R(c,col,mx+12-pul,my+pul,4,1);R(c,col,mx+15-pul,my+pul,1,4);R(c,col,mx+pul,my+15-pul,4,1);R(c,col,mx+pul,my+12-pul,1,4);R(c,col,mx+12-pul,my+15-pul,4,1);R(c,col,mx+15-pul,my+12-pul,1,4)}}
  drawTrail(c,cx,cy,t);
  var vis=[];
  OBJS.forEach(function(o){if(o.by<cy-8||o.y>cy+vh+8)return;var ow=o.b!==undefined?112:(o.fountain?64:(o.gate!==undefined?48:(o.s?o.s.width:16)));if(o.x+ow<cx||o.x>cx+vw)return;vis.push(o)});
  vis.push({player:true,by:P.fy*T+T-0.5});pushLife(vis,cx,cy,vw,vh);
  vis.sort(function(a,b){return a.by-b.by});
  var fd=facingDoor();
  vis.forEach(function(o){
    if(o.player)drawPlayer(c,cx,cy);
    else if(o.walker)drawWalker(c,o.walker,cx,cy);
    else if(o.car)drawCar(c,o.car,cx,cy);
    else if(o.gate!==undefined)drawGate(c,o,cx,cy,t);
    else if(o.fountain)drawFountain(c,o,cx,cy,t);
    else if(o.b!==undefined){var b=BLD[o.b];c.drawImage(b.sp.c,o.x-cx,o.y-cy);
      if(fd===o.b){var dx=b.dx*T-cx,dy=b.dy*T-cy;c.globalAlpha=.35+.25*Math.sin(t*6);R(c,"#fff4c4",dx,dy+1,16,15);c.globalAlpha=1}
      if(worldDone(o.b)){var fx=o.x-cx+b.sp.flag[0],fy=o.y-cy+b.sp.flag[1];R(c,OL,fx,fy-14,2,16);for(var i=0;i<10;i++){var wv=Math.round(Math.sin(t*5+i*.6)*1.2);R(c,"#fbbf24",fx+2+i,fy-14+wv,1,7);R(c,"#f59e0b",fx+2+i,fy-8+wv,1,1)}}}
    else c.drawImage(o.s,o.x-cx,o.y-cy);
  });
  for(var s=SMOKE.length-1;s>=0;s--){var p=SMOKE[s];p.life-=1/60;if(p.life<=0){SMOKE.splice(s,1);continue}p.y-=.25;p.x+=Math.sin(p.life*3+p.seed)*.15;var sz=Math.round(2+(1-p.life/2.2)*4);c.globalAlpha=Math.min(.7,p.life/2.2);R(c,"#e9eef2",p.x-cx-sz/2,p.y-cy-sz/2,sz,sz);c.globalAlpha=1}
  if(CFG_FX()&&Math.random()<.12)CHIMS.forEach(function(ch){if(ch[0]>cx-20&&ch[0]<cx+vw+20&&ch[1]>cy-60&&ch[1]<cy+vh+20)SMOKE.push({x:ch[0]+(Math.random()*4-2),y:ch[1],life:2.2,seed:Math.random()*6})});
  (CFG_FX()?BUTTERS:[]).forEach(function(bf,i){var bx=bf.x+Math.sin(t*.7+i)*26+Math.sin(t*2.1+i*3)*6,by=bf.y+Math.cos(t*.5+i*2)*14+Math.sin(t*3+i)*3,wing=Math.floor(t*10+i)%2;R(c,bf.c,bx-cx-(wing?2:1),by-cy,wing?2:1,2);R(c,bf.c,bx-cx+1,by-cy,wing?2:1,2);R(c,OL,bx-cx,by-cy,1,2)});
}
function overlays(){
  var mw=$("mw");if(!mw)return;var sc=CV.clientWidth/(CV.width/2),cx=Math.round(CAM.x),cy=Math.round(CAM.y),W=CV.clientWidth,H=CV.clientHeight;
  BLD.forEach(function(b,w){var el=$("bl"+w);if(!el)return;var x=(b.x*T+56-cx)*sc,y=(b.y*T-b.sp.top-2-cy)*sc;
    if(x<40||x>W-40||y<38||y>H+20){el.style.display="none";return}el.style.display="block";el.style.transform="translate("+Math.round(x)+"px,"+Math.round(y)+"px) translate(-50%,-100%)"});
  var bub=$("bub"),fd=facingDoor(),sg=facingSign(),wk=MDLG?null:facingWalker(),gt=facingGate(),kk=(document.body.classList.contains("touch")?"A":"Enter");
  if(gt>=0&&!gateLocked(gt))gt=-1;
  if((fd>=0||sg||wk||gt>=0)&&!ENTERING&&!MDLG){var px=(P.fx*T+8-cx)*sc,py=(P.fy*T-14-cy)*sc;bub.innerHTML=wk?"Hablar con "+esc(wk.name)+" · <b>"+kk+"</b>":(fd>=0?"Entrar a "+esc(WORLDS[fd].nm)+" · <b>"+kk+"</b>":(gt>=0?"🔒 Cerrado · acredita "+esc(WORLDS[gt].nm):"Leer letrero · <b>"+kk+"</b>"));bub.style.display="block";bub.style.transform="translate("+Math.round(px)+"px,"+Math.round(py)+"px) translate(-50%,-100%)"}
  else bub.style.display="none";
  var m=$("mini");if(m){var mc=m.getContext("2d");mc.imageSmoothingEnabled=false;mc.drawImage(MINIBASE,0,0);mc.strokeStyle="rgba(255,255,255,.8)";mc.lineWidth=1;mc.strokeRect(cx/8+.5,cy/8+.5,VW*2-1,VH*2-1);var bl=Math.floor(performance.now()/300)%2;mc.fillStyle=bl?"#fff":"#2ec4b6";mc.fillRect(Math.round(P.fx*2)-1,Math.round(P.fy*2)-1,3,3)}
}
function loop(now){
  if(!MAPON)return;
  var dt=Math.min(.05,(now-LAST)/1000||0);LAST=now;
  if(!ENTERING){update(dt);updateLife(dt);updateTrail(dt);zoneBanner();if(MDLG&&(P.moving||Math.abs(MDLG.tx-P.tx)+Math.abs(MDLG.ty-P.ty)>1))closeDlg()}
  var tg=camTarget(),k=1-Math.exp(-dt*9);CAM.x+=(tg[0]-CAM.x)*k;CAM.y+=(tg[1]-CAM.y)*k;
  draw((now-TIME0)/1000);overlays();
  RAF=requestAnimationFrame(loop);
}
function worldDone(w){return !!ST.exam[w]}

/* ---------- ENTRADA ---------- */
var KEYMAP={ArrowUp:"up",ArrowDown:"down",ArrowLeft:"left",ArrowRight:"right",w:"up",s:"down",a:"left",d:"right",W:"up",S:"down",A:"left",D:"right"};
document.addEventListener("keydown",function(e){
  if(!MAPON)return;var d=KEYMAP[e.key];
  if(d){e.preventDefault();if(HELD.indexOf(d)<0){HELD.push(d);P.path=[];P.pend=-1;P.goal=null;MARK=null;press(d)}return}
  if(e.key==="Enter"||e.key===" "||e.key==="e"||e.key==="E"){e.preventDefault();act()}
});
document.addEventListener("keyup",function(e){var d=KEYMAP[e.key];if(d)HELD=HELD.filter(function(x){return x!==d})});
window.addEventListener("blur",function(){HELD=[]});
window.addEventListener("resize",function(){if(MAPON){sizeView();var tg=camTarget();CAM.x=tg[0];CAM.y=tg[1]}});
try{if(window.matchMedia("(pointer:coarse)").matches)document.body.classList.add("touch")}catch(e){}

function campus(){
  stop();RUN=null;if(!GROUND){buildWorld();buildPlayer();0}
  if(LASTW>=0){var b=BLD[LASTW];P.tx=P.sx=b.ax;P.ty=P.sy=b.ay;P.dir="down"}
  P.moving=false;P.path=[];P.pend=-1;P.fx=P.tx;P.fy=P.ty;HELD=[];MARK=null;MDLG=null;if(!WALKERS.length)initLife();LASTZONE=null;
  document.body.classList.add("mapmode");document.body.classList.remove("bmode");
  var touch=document.body.classList.contains("touch");
  var h='<div class="mapwrap" id="mw"><canvas id="map"></canvas><div class="vig"></div><div class="quest" id="quest"></div><div class="route" id="route"></div><div class="zban" id="zban"></div>';
  WORLDS.forEach(function(W,w){var ws=worldStats(w);h+='<div class="blbl'+(ws.exam?' done':'')+'" id="bl'+w+'"><span class="bn">'+W.ico+' '+esc(W.nm)+'</span><small>'+(ws.exam?'🏆 ACREDITADO':'★ '+ws.stars+'/'+ws.maxStars+' · '+ws.solved+'/'+ws.total+' casos')+'</small><i class="bp"><b style="width:'+Math.round(ws.dom*100)+'%"></b></i></div>'});
  h+='<div class="bubble" id="bub"></div><div class="pad"><button class="u" data-d="up">▲</button><button class="l" data-d="left">◀</button><button class="r" data-d="right">▶</button><button class="d" data-d="down">▼</button></div><button class="abtn" id="abtn">A</button>'
    +'<div class="mdlg" id="mdlg"><canvas id="mdlgp" width="32" height="32"></canvas><div style="flex:1;min-width:0"><div class="nm" id="mdlgn"></div><div class="say" id="mdlgt"></div></div></div>'
    +'<div class="maphint" id="mhint">'+(touch?'Usa la cruceta o toca un lugar para caminar · frente a una puerta toca <b>A</b>':'Camina con <b>flechas / WASD</b> o haz clic · frente a una puerta presiona <b>Enter</b>')+'</div></div>';
  $("main").innerHTML=h;
  if(!campus._hinted){campus._hinted=1;setTimeout(function(){var e=$("mhint");if(e)e.classList.add("off")},7000)}else{var e0=$("mhint");if(e0)e0.classList.add("off")}
  CV=$("map");sizeView();
  CV.addEventListener("pointerdown",function(e){
    var r=CV.getBoundingClientRect(),wx=CAM.x+(e.clientX-r.left)/r.width*CV.width/2,wy=CAM.y+(e.clientY-r.top)/r.height*CV.height/2;
    tapTo(Math.floor(wx/T),Math.floor(wy/T));
  });
  [].forEach.call(document.querySelectorAll(".pad button"),function(bt){
    var d=bt.dataset.d;
    bt.addEventListener("pointerdown",function(e){e.preventDefault();e.stopPropagation();try{bt.setPointerCapture(e.pointerId)}catch(_){}HELD=HELD.filter(function(x){return x!==d});HELD.push(d);P.path=[];P.pend=-1;MARK=null;press(d)});
    ["pointerup","pointercancel","lostpointercapture"].forEach(function(ev){bt.addEventListener(ev,function(){HELD=HELD.filter(function(x){return x!==d})})});
  });
  $("abtn").addEventListener("pointerdown",function(e){e.preventDefault();e.stopPropagation();act()});
  $("bub").addEventListener("pointerdown",function(e){e.stopPropagation();act()});
  var tg=camTarget();CAM.x=tg[0];CAM.y=tg[1];
  MAPON=true;cancelAnimationFrame(RAF);LAST=performance.now();RAF=requestAnimationFrame(loop);
  hud();questUI();window.scrollTo(0,0);
}
window.__AV={life:function(){return WALKERS},act:function(){act()},P:P,BLD:BLD,walkable:walkable,bfs:bfs,tapTo:tapTo,campus:function(){return campus()}};


/* ---------- VIDA EN EL PUEBLO: NPCs y carros ---------- */
var WALKERS=[],CARS=[],MDLG=null;
var TIPS=[
 "Si buscas algo muchas veces dentro de un ciclo, un diccionario suele convertir O(n²) en O(n).",
 "Arreglo ordenado + buscar un par → piensa en two pointers antes que en un hash map.",
 "¿Subarreglo contiguo que cumple algo? Sliding window casi siempre es la respuesta.",
 "Camino más corto con pasos iguales: BFS. Con pesos distintos: Dijkstra.",
 "Antes de programar, di en voz alta la solución fuerza bruta y su complejidad.",
 "Prueba siempre la lista vacía y la de un solo elemento. Ahí se rompen los índices.",
 "Memoización = recursión + diccionario. Evita recalcular subproblemas.",
 "Para los k más grandes, un min-heap de tamaño k. La raíz es el que sale.",
 "En BFS marca como visitado al meter a la cola, no al sacar.",
 "Si te piden contar subarreglos con suma k, piensa en prefix sum + diccionario.",
 "Un commit = un cambio con sentido propio. Tu yo del futuro te lo agradecerá.",
 "En la entrevista, piensa en voz alta: el entrevistador evalúa cómo razonas.",
 "Búsqueda binaria no es solo para arreglos: también sirve para buscar la respuesta.",
 "Stack monótono: ideal para 'el siguiente mayor' o 'cuántos días hasta…'.",
 "Grafo con dependencias y ciclos posibles → orden topológico (Kahn).",
 "Greedy solo funciona si puedes justificar que la elección local es la óptima."
];
function isStreet(g){return g==="p"||g==="s"||g==="k"}
function walkerFrames(seed){
  var p=npcPal(seed),fr={};
  ["idle","a","b"].forEach(function(f){fr["down"+f]=spr(HEAD.concat(BODY_D,LEGS[f]),p);fr["up"+f]=spr(HEAD.concat(BODY_U,LEGS[f]),p);fr["side"+f]=spr(SIDE.concat(SLEG[f]),p)});
  return fr;
}
function initLife(){
  var spots=[[20,19],[29,19],[10,18],[37,19],[23,12],[24,27],[16,31],[40,31],[5,34],[30,34]];
  WALKERS=spots.filter(function(s){return walkable(s[0],s[1])&&isStreet(G(s[0],s[1]))}).map(function(s,i){
    var seed=hash(i*17+3,99);
    return {tx:s[0],ty:s[1],sx:s[0],sy:s[1],fx:s[0],fy:s[1],t:0,moving:false,dir:"down",dist:0,wait:Math.random()*2,seed:seed,fr:walkerFrames(seed),name:NAMES[seed%NAMES.length],role:ROLES[(seed>>>5)%ROLES.length],tip:TIPS[i%TIPS.length],talk:0};
  });
  var cols=["#e04b4b","#3f74c4","#f4a020","#2a9d6f","#e8eef8","#9b5de5"];
  CARS=[];for(var i=0;i<6;i++){var lane=i%2;CARS.push({lane:lane,x:(i*170)%WPX,speed:(lane?-1:1)*(55+hash(i,5)%40),spr:carSprite(cols[i%cols.length])})}
}
function carSprite(col){
  var a=mk(30,18),c=a[1];
  R(c,"rgba(0,0,0,.25)",2,14,27,3);
  R(c,OL,1,6,28,9);R(c,col,2,7,26,7);R(c,"rgba(255,255,255,.3)",2,7,26,1);R(c,"rgba(0,0,0,.18)",2,12,26,2);
  R(c,OL,8,1,15,7);R(c,col,9,2,13,5);R(c,"#9fd3f2",10,2,5,4);R(c,"#9fd3f2",16,2,5,4);R(c,"#d9f1ff",10,2,2,1);
  R(c,"#fff4c4",27,8,2,2);R(c,"#e04b4b",1,8,2,2);
  R(c,OL,5,13,6,4);R(c,"#5a5f6b",6,14,4,2);R(c,OL,19,13,6,4);R(c,"#5a5f6b",20,14,4,2);
  return a[0];
}
function occupied(x,y,self){
  if((P.tx===x&&P.ty===y)||(P.sx===x&&P.sy===y&&P.moving))return true;
  for(var i=0;i<WALKERS.length;i++){var w=WALKERS[i];if(w===self)continue;if((w.tx===x&&w.ty===y)||(w.moving&&w.sx===x&&w.sy===y))return true}
  return false;
}
function updateLife(dt){
  WALKERS.forEach(function(w){
    if(w.talk>0){w.talk-=dt;return}
    if(w.moving){w.t+=dt*2.4;w.dist+=dt*2.4;if(w.t>=1){w.moving=false;w.t=0;w.wait=Math.random()<.3?1+Math.random()*2.5:0}
      w.fx=w.moving?w.sx+(w.tx-w.sx)*w.t:w.tx;w.fy=w.moving?w.sy+(w.ty-w.sy)*w.t:w.ty;return}
    if(w.wait>0){w.wait-=dt;return}
    var dirs=["up","down","left","right"],opts=[];
    dirs.forEach(function(d){var v=DIRS[d],nx=w.tx+v[0],ny=w.ty+v[1];if(walkable(nx,ny)&&isStreet(G(nx,ny))&&!occupied(nx,ny,w))opts.push(d)});
    if(!opts.length){w.wait=.6;return}
    var back={up:"down",down:"up",left:"right",right:"left"}[w.dir];
    var fwd=opts.filter(function(d){return d!==back});
    var d=(fwd.indexOf(w.dir)>=0&&Math.random()<.7)?w.dir:(fwd.length?fwd[Math.floor(Math.random()*fwd.length)]:opts[0]);
    var v=DIRS[d];w.dir=d;w.sx=w.tx;w.sy=w.ty;w.tx+=v[0];w.ty+=v[1];w.t=0;w.moving=true;
  });
  CARS.forEach(function(car){car.x+=car.speed*dt;if(car.speed>0&&car.x>WPX+40)car.x=-40;if(car.speed<0&&car.x<-40)car.x=WPX+40});
}
function pushLife(vis,cx,cy,vw,vh){
  WALKERS.forEach(function(w){var x=w.fx*T,y=w.fy*T;if(x>cx-20&&x<cx+vw+20&&y>cy-20&&y<cy+vh+20)vis.push({walker:w,by:y+T-0.6})});
  CARS.forEach(function(car){var y=(35+car.lane)*T;if(car.x>cx-40&&car.x<cx+vw+40&&y>cy-20&&y<cy+vh+20)vis.push({car:car,by:y+T})});
}
function drawWalker(c,w,cx,cy){
  var bob=0;
  var x=Math.round(w.fx*T-cx),y=Math.round(w.fy*T-cy)-9;
  disc(c,x+8,y+23,5,"rgba(0,0,0,.28)",.35);
  var img=w.fr[animKey(w.dir,w.moving,w.dist,performance.now()/1000,w.seed)]||w.fr.downidle;
  if(w.dir==="left"){c.save();c.translate(x+16,y-bob);c.scale(-1,1);c.drawImage(img,0,0,16,24);c.restore()}else c.drawImage(img,x,y-bob,16,24);
  if(w.talk>0){R(c,OL,x+4,y-10,9,9);R(c,"#fffbe8",x+5,y-9,7,7);R(c,OL,x+6,y-6,1,1);R(c,OL,x+8,y-6,1,1);R(c,OL,x+10,y-6,1,1)}
}
function drawCar(c,car,cx,cy){
  var x=Math.round(car.x-cx),y=(35+car.lane)*T-cy-2;
  if(car.speed<0){c.save();c.translate(x+30,y);c.scale(-1,1);c.drawImage(car.spr,0,0);c.restore()}else c.drawImage(car.spr,x,y);
}
function facingWalker(){if(P.moving)return null;var f=facing();for(var i=0;i<WALKERS.length;i++){var w=WALKERS[i];if((w.tx===f[0]&&w.ty===f[1])||(w.moving&&w.sx===f[0]&&w.sy===f[1]))return w}return null}
function talk(w){
  w.talk=8;w.moving=false;w.fx=w.tx;w.fy=w.ty;w.dir={up:"down",down:"up",left:"right",right:"left"}[P.dir];
  var d=$("mdlg");if(!d)return;MDLG=w;
  var pc=$("mdlgp").getContext("2d");pc.imageSmoothingEnabled=false;pc.clearRect(0,0,32,32);pc.drawImage(w.fr.downidle,0,0,32,32,0,1,32,31);
  $("mdlgn").textContent=w.name+" · "+w.role;d.style.display="flex";
  typeInto($("mdlgt"),"Oye, un tip: "+w.tip);
  w.tip=TIPS[(TIPS.indexOf(w.tip)+5)%TIPS.length];
}
function closeDlg(){var d=$("mdlg");if(d)d.style.display="none";if(MDLG)MDLG.talk=.5;MDLG=null;if(TW){clearInterval(TW);TW=null}}

function bfsAvoid(sx,sy,tx,ty){
  var prev={},q=[[sx,sy]],h=0;prev[sx+","+sy]=null;
  while(h<q.length){var c=q[h++];if(c[0]===tx&&c[1]===ty)break;
    for(var k in DIRS){var d=DIRS[k],nx=c[0]+d[0],ny=c[1]+d[1],nk=nx+","+ny;if(nk in prev||!walkable(nx,ny)||walkerAt(nx,ny))continue;prev[nk]=c;q.push([nx,ny])}}
  if(!((tx+","+ty) in prev))return walkerAt(tx,ty)?[]:null;
  var p=[],cur=[tx,ty];while(cur&&!(cur[0]===sx&&cur[1]===sy)){p.unshift(cur);cur=prev[cur[0]+","+cur[1]]}return p;
}


/* ================= MAPA LINEAL v2 ================= */
var ZH=16,STREET_Y=140,GATE_AT={},GATES=[],SIGNS={},TRAIL=[],TRAIL_T=0,LASTZONE=null,QUEST_T=0;
function ZT(w){return 2+(7-w)*ZH}
function GC(w){return w<0?15:(w%2===0?22:8)}
function zoneOf(y){for(var w=0;w<8;w++){var z=ZT(w);if(y>=z&&y<z+ZH)return w}return -1}
function gateLocked(w){return !ST.exam[w]}

function walkable(x,y){
  var g=G(x,y);
  if(solid(x,y)||g==="w"||g==="f"||g==="x"||g==="a"||g==="n")return false;
  var gw=GATE_AT[x+","+y];if(gw!==undefined&&gateLocked(gw))return false;
  return true;
}
function fenceRow(y,x0,x1){for(var x=x0;x<=x1;x++){setG(x,y,"n");block(x,y)}}
function tree(x,y,kind){var k=kind||["oak","oak2","pine","fruit"][hash(x,y)%4];addObj(SP[k],x,y,-8,k==="pine"?-30:(k==="palm"?-28:-24))}

function buildWorld(){
  GT=new Array(MW*MH).fill("g");SOL=new Uint8Array(MW*MH);DOORS={};OBJS=[];CHIMS=[];GATE_AT={};GATES=[];SIGNS={};
  SP.oak=sprOak();SP.oak2=sprOak(false,["#1d3a2c","#2a6648","#368055","#4e9e66","#76c487"]);SP.fruit=sprOak(true);SP.pine=sprPine();SP.palm=sprPalm();
  SP.bush=sprBush();SP.rock=sprRock();SP.boulder=sprBoulder();SP.lamp=sprLamp();SP.bench=sprBench();SP.barrel=sprBarrel();SP.crate=sprCrate();SP.anvil=sprAnvil();SP.sign=sprSign();SP.crystal=sprCrystal();
  var x,y,w,i;
  /* ---- zonas ---- */
  for(w=0;w<8;w++){
    var Z=ZT(w),B=GC(w-1),E=w<7?GC(w):null,left=(w%2===0);
    var bx=left?4:19,b=BLD[w];b.x=bx;b.y=Z+2;
    var ax=bx+3;
    rect(B,Z+9,2,7,"p");                                 // entrada (abajo)
    var hx0=Math.min(B,ax,E===null?ax:E),hx1=Math.max(B+1,ax,E===null?ax:E+1);
    rect(hx0,Z+8,hx1-hx0+1,2,"p");                       // tramo horizontal
    rect(ax,Z+7,1,1,"p");                                // frente del edificio
    if(E!==null){rect(E,Z+1,2,7,"p");fenceRow(Z,2,MW-3);   // salida y reja
      for(i=0;i<2;i++){setG(E+i,Z,"p");SOL[Z*MW+E+i]=0;GATE_AT[(E+i)+","+Z]=w}
      GATES.push({w:w,x:E,y:Z});OBJS.push({gate:w,x:E*T,y:Z*T-18,by:(Z+1)*T-1});
    }
  }
  /* ---- plaza de inicio ---- */
  var S=130;fenceRow(S,2,MW-3);for(i=0;i<2;i++){setG(15+i,S,"p");SOL[S*MW+15+i]=0}
  for(y=131;y<=138;y++)for(x=4;x<=27;x++){var dx=(x+.5-16)/11.5,dy=(y+.5-134.5)/4.6;if(dx*dx+dy*dy<=1)setG(x,y,"s")}
  rect(15,131,2,8,"p");rect(0,139,MW,1,"k");rect(0,140,MW,2,"a");rect(0,142,MW,1,"k");
  /* ---- edificios ---- */
  BLD.forEach(function(b,w){
    var st=BST[w],sp=st.type==="castle"?castleSprite():st.type==="tower"?towerSprite():houseSprite(st);
    b.sp=sp;b.dx=b.x+3;b.dy=b.y+4;b.ax=b.x+3;b.ay=b.y+5;
    for(var j=0;j<5;j++)for(var i2=0;i2<7;i2++)block(b.x+i2,b.y+j);
    DOORS[b.dx+","+b.dy]=w;
    OBJS.push({b:w,x:b.x*T,y:b.y*T-sp.top,by:(b.y+5)*T-1});
    if(sp.chim)CHIMS.push([b.x*T+sp.chim[0],b.y*T-sp.top+sp.chim[1]]);
    addObj(SP.lamp,b.ax-1,b.ay,0,-16);addObj(SP.lamp,b.ax+1,b.ay,0,-16);
  });
  /* ---- decoración por mundo ---- */
  for(w=0;w<8;w++){var Z2=ZT(w),L=(w%2===0);
    var lx0=L?13:3,lx1=L?28:18,ly0=Z2+11,ly1=Z2+14;        // zona baja libre
    var ux0=L?12:11,ux1=L?19:17,uy0=Z2+2,uy1=Z2+6;         // zona alta libre
    if(w===0){rect(19,ly0,6,3,"f");for(x=18;x<=25;x++){fenceRow(ly0-1,x,x);fenceRow(ly1,x,x)}for(y=ly0-1;y<=ly1;y++){fenceRow(y,18,18);fenceRow(y,25,25)}
      [[27,ly0],[27,ly0+3],[12,uy0+1],[17,uy0],[4,ly0+1],[11,ly0+2]].forEach(function(p){tree(p[0],p[1],"fruit")});addObj(SP.barrel,11,Z2+6,0,0);addObj(SP.bench,14,Z2+5,0,0);}
    if(w===1){for(y=ly0-1;y<=ly1;y++)for(x=3;x<=16;x++){if((y===ly0-1||y===ly1)&&(x===3||x===16))continue;setG(x,y,"w")}
      for(y=ly0-1;y<=ly0+1;y++)setG(10,y,"d");BOATS=[[5*T+2,(ly0+1)*T]];
      [[17,Z2+3],[17,Z2+5],[18,Z2+4]].forEach(function(p){addObj(SP.barrel,p[0],p[1],0,0)});[[12,uy0],[14,uy0+2]].forEach(function(p){tree(p[0],p[1],"palm")})}
    if(w===2){for(y=Z2+1;y<=Z2+15;y++)for(x=2;x<MW-2;x++){var gg=G(x,y);if(gg!=="g"||solid(x,y))continue;var nearP=false;for(var a2=-1;a2<=1;a2++)for(var b2=-1;b2<=1;b2++){var q=G(x+a2,y+b2);if(q!=="g"&&q!=="n")nearP=true}if(!nearP&&y>Z2+1&&hash(x,y)%3!==0)tree(x,y,hash(x*7,y)%2?"pine":"oak2")}}
    if(w===3){for(y=Z2+7;y<=Z2+10;y++)for(x=16;x<=28;x++)if(G(x,y)==="g")setG(x,y,"s");[[13,ly0],[18,ly0+1],[24,ly0],[27,ly0+2],[15,uy0+1]].forEach(function(p){addObj(SP.rock,p[0],p[1],0,0)});[[20,ly0+2],[25,uy0+1]].forEach(function(p){addObj(SP.boulder,p[0],p[1],-8,-14)})}
    if(w===4){for(y=ly0-1;y<=ly1;y++)for(x=13;x<=28;x++){if((y===ly0-1||y===ly1)&&(x===13||x===28))continue;setG(x,y,"w")}
      [[17,ly0],[18,ly0],[17,ly0+1],[18,ly0+1],[24,ly0+1],[25,ly0+1]].forEach(function(p){setG(p[0],p[1],"g")});[[17,ly0],[24,ly0+1]].forEach(function(p){tree(p[0],p[1],"palm")});[[13,uy0+1],[18,uy0+3]].forEach(function(p){tree(p[0],p[1],"palm")})}
    if(w===5){[[4,ly0],[12,ly0+2],[16,ly0]].forEach(function(p){addObj(SP.boulder,p[0],p[1],-8,-14)});[[7,ly0+1],[14,ly0+3],[13,uy0+2]].forEach(function(p){addObj(SP.rock,p[0],p[1],0,0)});[[3,ly0+3],[9,ly0+3],[18,ly0+2],[15,uy0],[12,uy0+4]].forEach(function(p){tree(p[0],p[1],"pine")})}
    if(w===6){[[14,ly0],[14,ly0+1],[18,ly0+2],[25,ly0]].forEach(function(p){addObj(SP.crate,p[0],p[1],0,0)});addObj(SP.anvil,20,ly0+1,0,0);[[22,ly0+2],[27,ly0+1],[16,uy0+2]].forEach(function(p){addObj(SP.barrel,p[0],p[1],0,0)})}
    if(w===7){[[5,ly0],[9,ly0+2],[14,ly0],[17,ly0+3],[13,uy0+1],[15,uy0+4]].forEach(function(p){addObj(SP.crystal,p[0],p[1],0,-4)});[[7,ly0+3],[12,ly0+1]].forEach(function(p){addObj(SP.lamp,p[0],p[1],0,-16)})}
  }
  /* ---- plaza: fuente, bancas, faroles, letrero ---- */
  OBJS.push({fountain:true,x:19*T,y:132*T,by:136*T-1});for(y=132;y<136;y++)for(x=19;x<23;x++)block(x,y);
  [[8,133],[8,136],[25,133]].forEach(function(p){addObj(SP.bench,p[0],p[1],0,0)});
  [[13,132],[18,137],[13,137],[24,137]].forEach(function(p){addObj(SP.lamp,p[0],p[1],0,-16)});
  addObj(SP.sign,10,131,0,-10);block(11,131);OBJS[OBJS.length-1].sign=true;SIGNS["10,131"]=SIGNS["11,131"]="Algorithm City · sigue el camino hacia el norte: cada reja se abre al acreditar un mundo.";
  [4,10,22,28].forEach(function(x2){addObj(SP.lamp,x2,138,0,-16)});
  /* ---- bordes ---- */
  for(x=0;x<MW;x++)for(y=0;y<MH;y++){if((x<2||y<2||x>=MW-2||y>=MH-2)&&G(x,y)!=="k"&&G(x,y)!=="a"&&G(x,y)!=="n"){tree(x,y,hash(x,y)%3===0?"pine":(hash(x,y)%3===1?"oak2":"oak"))}}
  /* ---- dispersos ---- */
  for(y=3;y<MH-3;y++)for(x=3;x<MW-3;x++){
    var ok=true;for(var j=-1;j<=1&&ok;j++)for(var i3=-1;i3<=1;i3++){if(G(x+i3,y+j)!=="g"||solid(x+i3,y+j)){ok=false;break}}
    if(!ok||y>=130)continue;
    var hh=hash(x*3,y*7);if(hh%11===0)tree(x,y);else if(hh%19===0)addObj(SP.bush,x,y,0,0);else if(hh%29===0)addObj(SP.rock,x,y,0,0);
  }
  BUTTERS=[{x:10*T,y:134*T,c:"#ffd166"},{x:24*T,y:120*T,c:"#a0c4ff"},{x:8*T,y:100*T,c:"#ff8fab"},{x:20*T,y:70*T,c:"#ffd166"}];
  if(P.tx===23&&P.ty===23){P.tx=P.sx=15;P.ty=P.sy=136;P.fx=15;P.fy=136;P.dir="up"}
  drawGround();
}
var BOATS=[];
function drawFences(c){
  for(var y=0;y<MH;y++)for(var x=0;x<MW;x++){if(G(x,y)!=="n")continue;var X=x*T,Y=y*T,l=G(x-1,y)==="n",r=G(x+1,y)==="n",u=G(x,y-1)==="n",d=G(x,y+1)==="n";
    if(l||r||(!u&&!d)){R(c,OL,X,Y+5,T,4);R(c,"#c89b63",X,Y+6,T,2)}
    if(u||d){R(c,OL,X+6,Y,4,T);R(c,"#c89b63",X+7,Y,2,T)}
    R(c,OL,X+6,Y+3,4,11);R(c,"#c89b63",X+7,Y+4,2,9);R(c,"#e0b98a",X+7,Y+4,2,1)}
  BOATS.forEach(function(b){var bx=b[0],by=b[1];R(c,OL,bx,by+3,22,9);R(c,"#9a6234",bx+1,by+4,20,6);R(c,"#c08a4f",bx+2,by+4,18,2);R(c,OL,bx+10,by-6,1,10);R(c,"#f3eee0",bx+11,by-6,6,7)});
}
function drawGate(c,o,cx,cy,t){
  var g=GATES.filter(function(q){return q.w===o.gate})[0],x=g.x*T-cx,y=g.y*T-cy,locked=gateLocked(o.gate);
  [[-6],[30]].forEach(function(p){var px=x+p[0];R(c,OL,px,y-14,8,30);R(c,"#9aa3ad",px+1,y-13,6,28);R(c,"#c9ced6",px+1,y-13,2,28);R(c,OL,px-1,y-16,10,4);R(c,"#7c8592",px,y-15,8,2)});
  if(locked){for(var i=0;i<8;i++)R(c,"#3b4250",x+3+i*4,y-8,2,22);R(c,OL,x+2,y-9,30,2);R(c,OL,x+2,y+3,30,2);
    R(c,OL,x+12,y-4,10,10);R(c,"#fbbf24",x+13,y-3,8,8);R(c,OL,x+16,y-1,2,3);R(c,OL,x+14,y-8,6,1);R(c,OL,x+14,y-8,1,4);R(c,OL,x+19,y-8,1,4)}
  else{for(var k=0;k<3;k++){R(c,"#3b4250",x-1+k*3,y-8,2,20);R(c,"#3b4250",x+26+k*3,y-8,2,20)}R(c,"#4ade80",x+14,y-12,6,3)}
}
function facingSign(){if(P.moving)return false;var f=facing();return !!SIGNS[f[0]+","+f[1]]}
function facingGate(){if(P.moving)return -1;var f=facing(),w=GATE_AT[f[0]+","+f[1]];return w===undefined?-1:w}

/* ---- NPCs: guardias, mentora y paseantes ---- */
function initLife(){
  WALKERS=[];
  function add(x,y,i,opts){var seed=opts.seed||hash(i*17+3,99);var o={tx:x,ty:y,sx:x,sy:y,fx:x,fy:y,t:0,moving:false,dir:opts.dir||"down",dist:0,wait:Math.random()*2,seed:seed,fr:walkerFrames(seed),name:opts.name||NAMES[seed%NAMES.length],role:opts.role||ROLES[(seed>>>5)%ROLES.length],tip:TIPS[i%TIPS.length],talk:0,static:!!opts.static,say:opts.say||null,zone:zoneOf(y)};WALKERS.push(o);return o}
  add(13,134,0,{static:true,seed:424242,name:"Profe Ada",role:"Mentora",dir:"right",say:function(){var q=questInfo();return "¡Bienvenido a Algorithm City! Cada edificio es un mundo de algoritmos y van en orden, de abajo hacia arriba. "+q.say}});
  GATES.forEach(function(g,i){add(g.x+2,g.y+1,50+i,{static:true,seed:7000+i*131,name:"Guardia",role:"Mundo "+(g.w+1),dir:"down",say:function(){return gateLocked(g.w)?"Alto ahí. Para pasar a "+WORLDS[g.w+1].nm+" primero acredita "+WORLDS[g.w].nm+" en su Aula Magna.":"¡Adelante! "+WORLDS[g.w+1].nm+" te espera."}})});
  var spots=[[16,133],[14,131],[8,124],[9,118],[23,108],[22,101],[8,92],[9,86],[23,76],[22,70],[8,60],[9,54],[23,44],[22,38],[8,28],[9,22],[23,12]];
  spots.forEach(function(s,i){if(walkable(s[0],s[1])&&isStreet(G(s[0],s[1]))&&!walkerAt(s[0],s[1]))add(s[0],s[1],i,{})});
  var cols=["#e04b4b","#3f74c4","#f4a020","#2a9d6f","#e8eef8","#9b5de5"];
  CARS=[];for(var i=0;i<4;i++){var lane=i%2;CARS.push({lane:lane,x:(i*150)%WPX,speed:(lane?-1:1)*(50+hash(i,5)%40),spr:carSprite(cols[i%cols.length])})}
}
function updateLife(dt){
  WALKERS.forEach(function(w){
    if(w.static){if(w.talk>0)w.talk-=dt;return}
    if(w.talk>0){w.talk-=dt;return}
    if(w.moving){w.t+=dt*2.4;w.dist+=dt*2.4;if(w.t>=1){w.moving=false;w.t=0;w.wait=Math.random()<.3?1+Math.random()*2.5:0}
      w.fx=w.moving?w.sx+(w.tx-w.sx)*w.t:w.tx;w.fy=w.moving?w.sy+(w.ty-w.sy)*w.t:w.ty;return}
    if(w.wait>0){w.wait-=dt;return}
    var opts=[];
    ["up","down","left","right"].forEach(function(d){var v=DIRS[d],nx=w.tx+v[0],ny=w.ty+v[1];if(walkable(nx,ny)&&isStreet(G(nx,ny))&&GATE_AT[nx+","+ny]===undefined&&zoneOf(ny)===w.zone&&!occupied(nx,ny,w))opts.push(d)});
    if(!opts.length){w.wait=.6;return}
    var back={up:"down",down:"up",left:"right",right:"left"}[w.dir],fwd=opts.filter(function(d){return d!==back});
    var d=(fwd.indexOf(w.dir)>=0&&Math.random()<.7)?w.dir:(fwd.length?fwd[Math.floor(Math.random()*fwd.length)]:opts[0]);
    var v=DIRS[d];w.dir=d;w.sx=w.tx;w.sy=w.ty;w.tx+=v[0];w.ty+=v[1];w.t=0;w.moving=true;
  });
  CARS.forEach(function(car){car.x+=car.speed*dt;if(car.speed>0&&car.x>WPX+40)car.x=-40;if(car.speed<0&&car.x<-40)car.x=WPX+40});
}
function pushLife(vis,cx,cy,vw,vh){
  WALKERS.forEach(function(w){var x=w.fx*T,y=w.fy*T;if(x>cx-20&&x<cx+vw+20&&y>cy-20&&y<cy+vh+30)vis.push({walker:w,by:y+T-0.6})});
  CARS.forEach(function(car){var y=(STREET_Y+car.lane)*T;if(car.x>cx-40&&car.x<cx+vw+40&&y>cy-20&&y<cy+vh+20)vis.push({car:car,by:y+T})});
}
function drawCar(c,car,cx,cy){
  var x=Math.round(car.x-cx),y=(STREET_Y+car.lane)*T-cy-2;
  if(car.speed<0){c.save();c.translate(x+30,y);c.scale(-1,1);c.drawImage(car.spr,0,0);c.restore()}else c.drawImage(car.spr,x,y);
}
function talk(w){
  w.talk=8;if(!w.static){w.moving=false;w.fx=w.tx;w.fy=w.ty}w.dir={up:"down",down:"up",left:"right",right:"left"}[P.dir];
  var d=$("mdlg");if(!d)return;MDLG=w;
  var pc=$("mdlgp").getContext("2d");pc.imageSmoothingEnabled=false;pc.clearRect(0,0,32,32);pc.drawImage(w.fr.downidle,0,0,32,32,0,1,32,31);
  $("mdlgn").textContent=w.name+" · "+w.role;d.style.display="flex";
  typeInto($("mdlgt"),w.say?w.say():"Oye, un tip: "+w.tip);
  if(!w.say)w.tip=TIPS[(TIPS.indexOf(w.tip)+5)%TIPS.length];
}

/* ---- misión, rastro dorado, banner y ruta ---- */
function questInfo(){
  for(var w=0;w<8;w++)if(!ST.exam[w]){
    var nm=WORLDS[w].nm,les=typeof LESSONS!=="undefined"&&(LESSONS["w"+(w+1)+":0"]||[]).some(function(l){return !ST.lesson[l.id]});
    return {w:w,text:(les?"Entra a <b>"+esc(nm)+"</b> y toma tu primera clase":"Acredita <b>"+esc(nm)+"</b> (Mundo "+(w+1)+") en su Aula Magna"),say:"Tu misión ahora: "+(les?"entra a "+nm+" y toma tu primera clase.":"acreditar "+nm+".")+" Sigue las huellas doradas."};
  }
  return {w:-1,text:"¡Acreditaste toda la Ciudad! 🏆",say:"¡Acreditaste los 8 mundos! Eres leyenda de la Ciudad."};
}
function updateTrail(dt){
  TRAIL_T-=dt;if(TRAIL_T>0)return;TRAIL_T=.4;
  var q=questInfo();if(q.w<0){TRAIL=[];return}
  var b=BLD[q.w];if(P.tx===b.ax&&P.ty===b.ay){TRAIL=[];return}
  TRAIL=bfs(P.moving?P.tx:P.tx,P.ty,b.ax,b.ay)||[];
}
function drawTrail(c,cx,cy,t){
  var q=questInfo();
  for(var i=1;i<TRAIL.length;i+=2){var p=TRAIL[i],x=p[0]*T-cx,y=p[1]*T-cy;if(x<-16||y<-16||x>VW*T+16||y>VH*T+16)continue;
    var a=.45+.4*Math.sin(t*4-i*.5);c.globalAlpha=Math.max(.15,a);R(c,"#fbbf24",x+4,y+6,3,4);R(c,"#fbbf24",x+9,y+3,3,4);R(c,"#fff1b8",x+4,y+6,1,1);R(c,"#fff1b8",x+9,y+3,1,1);c.globalAlpha=1}
  if(q.w>=0){var b=BLD[q.w],ax=b.dx*T-cx+3,ay=b.dy*T-cy-24+Math.round(Math.sin(t*5)*3);R(c,OL,ax-1,ay-1,12,9);R(c,"#fbbf24",ax,ay,10,7);R(c,OL,ax+2,ay+7,6,2);R(c,"#fbbf24",ax+3,ay+7,4,1);R(c,OL,ax+4,ay+9,2,2)}
}
function questUI(){
  var el=$("quest");if(el){var q=questInfo();el.innerHTML='<span class="qk">🎯 MISIÓN</span>'+q.text+(q.w>=0?'<span class="qs">Sigue las huellas doradas 👣</span>':'')}
  var r=$("route");if(!r)return;var z=zoneOf(P.ty),h="";
  for(var w=7;w>=0;w--){var st=ST.exam[w]?"done":(w===0||ST.exam[w-1]?"open":"lock");h+='<div class="rn '+st+(z===w?' here':'')+'"><span>'+(st==="done"?"🏆":st==="lock"?"🔒":WORLDS[w].ico)+'</span><b>'+(w+1)+'</b><em>'+esc(WORLDS[w].nm)+'</em></div>'}
  h+='<div class="rn start'+(z<0?' here':'')+'"><span>⛲</span><b>0</b><em>Plaza</em></div>';r.innerHTML=h;
}
function zoneBanner(){
  var z=zoneOf(P.ty);if(z===LASTZONE)return;var first=LASTZONE===null;LASTZONE=z;questUI();if(first)return;
  var el=$("zban");if(!el)return;el.innerHTML=z<0?'<small>INICIO</small>Plaza de Algorithm City':'<small>MUNDO '+(z+1)+'</small>'+WORLDS[z].ico+' '+esc(WORLDS[z].nm);
  el.classList.remove("on");void el.offsetWidth;el.classList.add("on");
}
