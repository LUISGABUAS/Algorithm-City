
/* ================= CIUDAD TECNOLÓGICA (v3) ================= */
var ROADS=[];          // filas de calle (fila superior de cada calle de 2 carriles)
var CROSS={};          // "x,y" -> true para cruces peatonales
function isStreet(g){return g==="p"||g==="s"}

/* ---------- sprites urbanos ---------- */
var OFFICE=[
 {nm:"startup",glass:"#7fb8d9",glass2:"#5f9ac0",frame:"#2b3a55",base:"#b65a3c",base2:"#8a3f28",accent:"#f4a020",extra:18,roof:["garden","ac"]},
 {nm:"glass",glass:"#5cc8c0",glass2:"#3aa69e",frame:"#1c6663",base:"#d5dde2",base2:"#aab6bd",accent:"#2dd4bf",extra:44,roof:["ac","ac2"]},
 {nm:"eco",glass:"#a9d6a0",glass2:"#86bd7c",frame:"#356428",base:"#c9b48c",base2:"#a8926b",accent:"#6ab04c",extra:30,roof:["trees"],vines:true},
 {nm:"datacenter",glass:"#8d939c",glass2:"#7a808a",frame:"#4a505b",base:"#6f7580",base2:"#5a606a",accent:"#e04b4b",extra:10,roof:["ac","ac2","ac3"],solid:true},
 {nm:"network",glass:"#9fc4f0",glass2:"#7aa6dc",frame:"#2b528f",base:"#e2e8f0",base2:"#b9c3d0",accent:"#3f74c4",extra:26,roof:["dish","antenna"]},
 {nm:"lab",glass:"#2b3a55",glass2:"#1f2a44",frame:"#cfd6de",base:"#eef2f5",base2:"#c9d1d9",accent:"#9aa3ad",extra:22,roof:["dome"],strips:true},
 {nm:"maker",glass:"#9aa3ad",glass2:"#7d8590",frame:"#4a505b",base:"#7d8590",base2:"#5f6670",accent:"#f4a020",extra:6,roof:["solar"],garage:true},
 {nm:"tower",glass:"#34406b",glass2:"#28325a",frame:"#1a1f33",base:"#2a2f45",base2:"#1c2033",accent:"#9b5de5",extra:124,roof:["helipad","spire"],lit:true}
];
function officeSprite(w){
  var st=OFFICE[w],W=112,top=22+st.extra,H=80+top,a=mk(W,H),c=a[1],Y0=top,i,j;
  var bodyTop=Y0+10-st.extra,bx=6,bw=W-12;
  R(c,"rgba(10,15,30,.28)",W-7,bodyTop+12,7,Y0+80-bodyTop-12);R(c,"rgba(10,15,30,.2)",6,Y0+78,W-6,2);
  // cuerpo de vidrio / panel
  R(c,OL,bx-1,bodyTop-1,bw+2,Y0+79-bodyTop+1);
  if(st.solid){R(c,st.glass,bx,bodyTop,bw,Y0+50-bodyTop);for(j=bodyTop+6;j<Y0+48;j+=8){for(i=bx+6;i<bx+bw-6;i+=10){R(c,st.glass2,i,j,7,4);R(c,"#2b2f3a",i+1,j+1,5,2)}}
    for(j=bodyTop+8;j<Y0+44;j+=8)for(i=bx+8;i<bx+bw-8;i+=10){if(hash(i,j)%3===0)R(c,hash(i+1,j)%2?"#4ade80":"#e04b4b",i+2,j+5,1,1)}}
  else if(st.strips){R(c,st.base,bx,bodyTop,bw,Y0+50-bodyTop);for(j=bodyTop+6;j<Y0+46;j+=10){R(c,st.glass,bx+4,j,bw-8,5);R(c,"#4a6a9a",bx+6,j+1,20,1)}}
  else{R(c,st.glass,bx,bodyTop,bw,Y0+50-bodyTop);
    for(j=bodyTop;j<Y0+50;j++){var d=(j-bodyTop)%40;if(d<3)R(c,st.glass2,bx,j,bw,1)}
    for(i=0;i<5;i++){var sx=bx+10+i*22;for(j=0;j<Y0+50-bodyTop;j++){R(c,"rgba(255,255,255,.18)",sx+Math.round(j*.35)%bw,bodyTop+j,4,1)}}
    for(i=bx;i<bx+bw;i+=12)R(c,st.frame,i,bodyTop,1,Y0+50-bodyTop);for(j=bodyTop;j<Y0+50;j+=10)R(c,st.frame,bx,j,bw,1);
    if(st.lit)for(j=bodyTop+2;j<Y0+48;j+=10)for(i=bx+2;i<bx+bw-10;i+=12){if(hash(i,j*3)%3===0)R(c,"#ffd166",i+1,j+2,9,6)}
    if(st.vines)for(j=bodyTop+8;j<Y0+48;j+=20){R(c,"#3f8a3a",bx,j,bw,3);for(i=bx;i<bx+bw;i+=5)R(c,"#5fae4d",i,j-1+(hash(i,j)%3),3,3)}}
  R(c,"rgba(0,0,0,.18)",bx+bw-6,bodyTop,6,Y0+50-bodyTop);
  // planta baja
  R(c,st.base,bx,Y0+48,bw,30);R(c,st.base2,bx,Y0+74,bw,4);
  if(st.base==="#b65a3c"||st.garage){for(j=Y0+50;j<Y0+74;j+=4){R(c,st.base2,bx,j+3,bw,1);if(!st.garage)for(i=bx+((j/4)%2?4:0);i<bx+bw;i+=8)R(c,st.base2,i,j,1,3)}}
  R(c,st.accent,bx,Y0+46,bw,4);for(i=bx+4;i<bx+bw;i+=8)R(c,"rgba(255,255,255,.55)",i,Y0+47,2,2);
  // vitrinas laterales
  [bx+6,bx+bw-30].forEach(function(px){if(st.garage&&px===bx+6){R(c,OL,px-1,Y0+53,27,22);for(var g=0;g<20;g+=3)R(c,g%6?"#9aa3ad":"#6f7580",px,Y0+54+g,25,3);return}
    R(c,OL,px-1,Y0+53,26,19);R(c,"#9fd3f2",px,Y0+54,24,17);R(c,"#d9f1ff",px+2,Y0+55,6,2);R(c,st.frame,px+11,Y0+54,2,17)});
  // entrada de vidrio + marquesina
  R(c,OL,41,Y0+50,30,29);R(c,"#9fd3f2",42,Y0+52,28,26);R(c,"#d9f1ff",44,Y0+54,4,8);R(c,st.frame,55,Y0+52,2,26);R(c,"#5a6474",42,Y0+76,28,2);
  R(c,OL,37,Y0+48,38,4);R(c,st.accent,38,Y0+49,36,2);
  R(c,"#a39e93",38,Y0+78,36,2);
  // techo
  R(c,OL,bx-2,bodyTop-4,bw+4,5);R(c,st.base2,bx-1,bodyTop-3,bw+2,3);
  var rt=bodyTop-4;
  st.roof.forEach(function(r,k){
    if(r==="ac"||r==="ac2"||r==="ac3"){var ax=bx+8+k*26;R(c,OL,ax,rt-9,18,10);R(c,"#c9ced6",ax+1,rt-8,16,8);disc(c,ax+9,rt-4,3,"#7c8592");R(c,"#5a606a",ax+8,rt-5,2,2)}
    if(r==="garden"){R(c,"#3f8a3a",bx+4,rt-3,bw-8,3);for(var g2=bx+8;g2<bx+bw-8;g2+=12){disc(c,g2,rt-6,4,"#2f6b34");disc(c,g2,rt-7,3,"#5fae4d")}for(var l=bx+6;l<bx+bw-6;l+=6)R(c,l%12?"#ffd166":"#f78c6b",l,rt-12,1,1)}
    if(r==="trees"){for(var t2=bx+10;t2<bx+bw-6;t2+=18){R(c,"#5b3a1f",t2,rt-8,2,6);disc(c,t2+1,rt-12,6,"#24572a");disc(c,t2,rt-13,5,"#3f8f3e")}}
    if(r==="dish"){disc(c,bx+80,rt-12,10,OL,.7);disc(c,bx+80,rt-12,9,"#e8eef2",.7);disc(c,bx+80,rt-12,4,"#c9ced6",.7);R(c,OL,bx+79,rt-12,2,12);R(c,"#e04b4b",bx+79,rt-14,2,2)}
    if(r==="antenna"){R(c,OL,bx+20,rt-30,2,30);for(var q=0;q<4;q++)R(c,OL,bx+16+q,rt-24+q*6,10-q*2,1);R(c,"#e04b4b",bx+20,rt-32,2,2)}
    if(r==="dome"){for(var dy=0;dy<16;dy++){var hw=Math.round(Math.sqrt(256-(16-dy)*(16-dy)));R(c,OL,56-hw-1,rt-16+dy,hw*2+2,1);R(c,dy<3?"#ffffff":"#d5dde2",56-hw,rt-16+dy,hw*2,1)}R(c,"#2b3a55",54,rt-15,4,14);R(c,OL,40,rt-1,32,2)}
    if(r==="solar"){for(var p=0;p<4;p++){R(c,OL,bx+6+p*25,rt-8,22,8);R(c,"#2b528f",bx+7+p*25,rt-7,20,6);R(c,"#6b9be0",bx+7+p*25,rt-7,20,1);R(c,"#1c3a6a",bx+17+p*25,rt-7,1,6)}}
    if(r==="helipad"){disc(c,56,rt-6,14,OL,.35);disc(c,56,rt-6,13,"#3b4250",.35);txt(c,"H",52,rt-10,"#ffd166",8)}
    if(r==="spire"){R(c,OL,86,rt-34,3,34);R(c,"#c9ced6",87,rt-33,1,32);R(c,"#e04b4b",86,rt-36,3,3)}
  });
  return {c:a[0],top:top,chim:null,flag:[W-20,bodyTop-12]};
}
function sprPlanter(){var a=mk(32,42),c=a[1];disc(c,16,40,10,"rgba(0,0,0,.2)",.3);R(c,OL,7,32,18,9);R(c,"#9aa3ad",8,33,16,7);R(c,"#c9ced6",8,33,16,2);R(c,"#5b3a1f",15,24,3,9);
  disc(c,16,16,12,"#1f3d22");disc(c,16,17,11,"#2f6b34");disc(c,15,15,10,"#3f8f3e");disc(c,12,11,5,"#56a84a");disc(c,10,9,2,"#7cc860");return a[0]}
function sprLED(){var a=mk(16,40),c=a[1];disc(c,8,38,5,"rgba(0,0,0,.2)",.35);R(c,OL,7,6,3,32);R(c,"#4a5160",8,7,1,30);R(c,OL,6,36,5,3);R(c,OL,4,2,12,5);R(c,"#2b2f3a",5,3,10,3);R(c,"#e8f6ff",5,5,10,1);return a[0]}
function sprBenchM(){var a=mk(16,16),c=a[1];R(c,"rgba(0,0,0,.2)",1,12,15,3);R(c,OL,0,4,16,7);R(c,"#9aa3ad",1,5,14,2);R(c,"#c9ced6",1,8,14,2);R(c,OL,2,10,2,4);R(c,OL,12,10,2,4);return a[0]}
function sprBikes(){var a=mk(32,16),c=a[1];R(c,"rgba(0,0,0,.2)",2,13,28,3);for(var i=0;i<3;i++){var x=3+i*10;disc(c,x+2,10,3,OL);disc(c,x+2,10,2,"#c9ced6");disc(c,x+7,10,3,OL);disc(c,x+7,10,2,"#c9ced6");R(c,["#e04b4b","#3f74c4","#2a9d6f"][i],x+2,6,6,2);R(c,OL,x+6,4,2,3)}return a[0]}
function sprVend(){var a=mk(16,26),c=a[1];R(c,"rgba(0,0,0,.2)",2,23,14,3);R(c,OL,1,1,14,23);R(c,"#e04b4b",2,2,12,21);R(c,"#9fd3f2",3,4,7,12);for(var i=0;i<3;i++)R(c,["#ffd166","#4ade80","#f8fafc"][i],4,5+i*4,5,2);R(c,"#2b2f3a",11,6,2,6);R(c,"#2b2f3a",3,18,7,3);return a[0]}
function sprBillboard(){var a=mk(48,44),c=a[1];R(c,"rgba(0,0,0,.2)",8,41,34,3);R(c,OL,10,24,3,18);R(c,OL,35,24,3,18);R(c,OL,1,1,46,26);R(c,"#0f1a2b",2,2,44,24);
  var cols=["#c9a8ff","#5eead4","#ffd166","#9fd3f2","#f78c6b"];for(var i=0;i<6;i++)R(c,cols[i%5],5+(i%3)*3,5+i*3.4,10+hash(i,9)%22,2);R(c,"#5eead4",38,20,5,3);return a[0]}
function sprTruck(){var a=mk(48,30),c=a[1];R(c,"rgba(0,0,0,.25)",3,26,44,4);R(c,OL,2,4,44,21);R(c,"#f4a020",3,5,42,15);R(c,"#e8eef8",3,20,42,4);R(c,"#9fd3f2",33,7,10,7);R(c,"#2b2f3a",6,8,22,8);R(c,"#ffd166",8,10,6,4);R(c,"#e04b4b",16,10,10,4);
  R(c,"#e04b4b",4,2,24,4);for(var i=4;i<28;i+=4)R(c,"#fff",i,2,2,4);disc(c,12,25,4,OL);disc(c,12,25,2,"#5a606a");disc(c,36,25,4,OL);disc(c,36,25,2,"#5a606a");return a[0]}
function sprBusStop(){var a=mk(32,34),c=a[1];R(c,"rgba(0,0,0,.2)",2,31,30,3);R(c,OL,1,1,30,4);R(c,"#3f74c4",2,2,28,2);R(c,OL,2,4,2,28);R(c,OL,28,4,2,28);R(c,"rgba(159,211,242,.55)",4,6,24,18);R(c,"#9aa3ad",5,24,22,3);R(c,"#ffd166",22,8,4,8);return a[0]}
function sprTowerBG(seed){var h=56+hash(seed,3)%40,a=mk(32,h),c=a[1],cols=[["#3b4664","#4a5678"],["#56607a","#6a7590"],["#2f3a55","#3d4a6b"],["#5d5a6e","#73708a"]][seed%4];
  R(c,OL,0,0,32,h);R(c,cols[0],1,1,30,h-1);R(c,cols[1],1,1,4,h-1);for(var y=4;y<h-4;y+=6)for(var x=7;x<29;x+=5){R(c,hash(x,y+seed)%4===0?"#ffd166":"#24304d",x,y,3,3)}R(c,"#1b2033",0,0,32,3);return a[0]}

/* ---------- mundo ---------- */
function buildWorld(){
  GT=new Array(MW*MH).fill("k");SOL=new Uint8Array(MW*MH);DOORS={};OBJS=[];CHIMS=[];GATE_AT={};GATES=[];SIGNS={};ROADS=[];CROSS={};BOATS=[];
  SP.oak=sprOak();SP.oak2=sprOak(false,["#1d3a2c","#2a6648","#368055","#4e9e66","#76c487"]);SP.fruit=sprOak(true);SP.pine=sprPine();SP.palm=sprPalm();
  SP.bush=sprBush();SP.rock=sprRock();SP.boulder=sprBoulder();SP.lamp=sprLED();SP.bench=sprBenchM();SP.barrel=sprBarrel();SP.crate=sprCrate();SP.anvil=sprAnvil();SP.sign=sprBillboard();SP.crystal=sprCrystal();
  SP.planter=sprPlanter();SP.bikes=sprBikes();SP.vend=sprVend();SP.truck=sprTruck();SP.bus=sprBusStop();
  var x,y,w,i;
  function road(y0){for(var x2=2;x2<MW-2;x2++){setG(x2,y0,"a");setG(x2,y0+1,"a")}ROADS.push(y0)}
  for(w=0;w<8;w++){
    var Z=ZT(w),B=GC(w-1),E=w<7?GC(w):null,left=(w%2===0),b=BLD[w];b.x=left?4:19;b.y=Z+2;var ax=b.x+3;
    road(Z+11);
    rect(B,Z+9,2,2,"p");rect(B,Z+13,2,3,"p");
    for(i=0;i<2;i++){setG(B+i,Z+11,"z");setG(B+i,Z+12,"z");CROSS[(B+i)+","+(Z+11)]=CROSS[(B+i)+","+(Z+12)]=1}
    var hx0=Math.min(B,ax,E===null?ax:E),hx1=Math.max(B+1,ax,E===null?ax:E+1);
    rect(hx0,Z+8,hx1-hx0+1,2,"p");rect(ax,Z+7,1,1,"p");
    if(E!==null){rect(E,Z+1,2,7,"p");fenceRow(Z,2,MW-3);for(i=0;i<2;i++){setG(E+i,Z,"p");SOL[Z*MW+E+i]=0;GATE_AT[(E+i)+","+Z]=w}
      GATES.push({w:w,x:E,y:Z});OBJS.push({gate:w,x:E*T,y:Z*T-18,by:(Z+1)*T-1})}
  }
  var S=130;fenceRow(S,2,MW-3);for(i=0;i<2;i++){setG(15+i,S,"p");SOL[S*MW+15+i]=0}
  for(y=131;y<=138;y++)for(x=4;x<=27;x++){var dx=(x+.5-16)/11.5,dy=(y+.5-134.5)/4.6;if(dx*dx+dy*dy<=1)setG(x,y,"s")}
  rect(15,131,2,8,"p");rect(0,140,MW,2,"a");ROADS.push(140);for(i=0;i<2;i++){setG(15+i,140,"z");setG(15+i,141,"z");CROSS[(15+i)+",140"]=CROSS[(15+i)+",141"]=1}
  BLD.forEach(function(b,w2){
    var sp=officeSprite(w2);b.sp=sp;b.dx=b.x+3;b.dy=b.y+4;b.ax=b.x+3;b.ay=b.y+5;
    for(var j=0;j<5;j++)for(var i2=0;i2<7;i2++)block(b.x+i2,b.y+j);
    DOORS[b.dx+","+b.dy]=w2;OBJS.push({b:w2,x:b.x*T,y:b.y*T-sp.top,by:(b.y+5)*T-1});
    addObj(SP.lamp,b.ax-2,b.ay,0,-24);addObj(SP.lamp,b.ax+2,b.ay,0,-24);
  });
  /* decoración por mundo */
  for(w=0;w<8;w++){var Z2=ZT(w),L=(w%2===0),B2=GC(w-1);
    var mx0=L?12:11,mx1=L?20:17,uy0=Z2+1,uy1=Z2+6;           // zona media alta
    var ox0=L?25:2,ox1=L?29:6;                                 // costado alto
    var parkL=[2,B2-2],parkR=[B2+3,MW-3];                     // parques bajos (filas Z+13..Z+15)
    [parkL,parkR].forEach(function(pk,pi){if(pk[1]-pk[0]<2)return;for(var yy=Z2+14;yy<=Z2+15;yy++)for(var xx=pk[0]+1;xx<pk[1];xx++)if(G(xx,yy)==="k")setG(xx,yy,"g")});
    if(w===1||w===4){for(y=uy0+1;y<=uy1-1;y++)for(x=mx0;x<=mx1;x++){if((y===uy0+1||y===uy1-1)&&(x===mx0||x===mx1))continue;setG(x,y,"w")}
      if(w===4){setG(mx0+3,uy0+3,"g");setG(mx0+4,uy0+3,"g");tree(mx0+3,uy0+3,"palm")}else{for(y=uy0+2;y<=uy1-2;y++)setG(mx0+3,y,"d");BOATS.push([(mx0+5)*T,(uy0+2)*T])}}
    else if(w===0){addObj(SP.truck,mx0+1,uy0+3,-8,-14);addObj(SP.bench,mx0+5,uy0+4,0,0);addObj(SP.vend,mx1-1,uy0+1,0,-10);block(mx0+2,uy0+3)}
    else if(w===3){for(y=uy0+1;y<=uy1;y++)fenceRow(y,mx0,mx0);fenceRow(uy1,mx0,mx1);for(x=mx0+2;x<=mx1;x+=3)addObj(SP.vend,x,uy0+2,0,-10)}
    else if(w===6){[[mx0+1,uy0+2],[mx0+2,uy0+2],[mx0+4,uy0+4]].forEach(function(p){addObj(SP.crate,p[0],p[1],0,0)});addObj(SP.anvil,mx0+5,uy0+2,0,0);addObj(SP.bikes,mx0+1,uy0+5,0,0);block(mx0+2,uy0+5)}
    else if(w===7){[[mx0+1,uy0+1],[mx0+4,uy0+3],[mx0+2,uy0+5]].forEach(function(p){addObj(SP.crystal,p[0],p[1],0,-4)})}
    else{addObj(SP.sign,mx0+1,uy0+2,-8,-30);block(mx0+2,uy0+2);addObj(SP.bench,mx0+4,uy0+4,0,0)}
    for(y=uy0;y<=uy1;y+=3)addObj(SP.planter,ox0+1,y,-8,-26);
    [[B2-1,Z2+10],[B2+2,Z2+10]].forEach(function(p){if(G(p[0],p[1])==="k")addObj(SP.lamp,p[0],p[1],0,-24)});
    if(B2+3<MW-3&&G(B2+3,Z2+13)==="k")addObj(SP.bus,B2+3,Z2+13,-8,-18);
  }
  /* plaza de inicio */
  OBJS.push({fountain:true,x:19*T,y:132*T,by:136*T-1});for(y=132;y<136;y++)for(x=19;x<23;x++)block(x,y);
  [[8,133],[8,136],[25,133]].forEach(function(p){addObj(SP.bench,p[0],p[1],0,0)});
  [[13,132],[18,137],[13,137],[24,137]].forEach(function(p){addObj(SP.lamp,p[0],p[1],0,-24)});
  addObj(SP.sign,10,131,-8,-30);block(11,131);OBJS[OBJS.length-1].sign=true;SIGNS["10,131"]=SIGNS["11,131"]="Algorithm City · la ciudad donde se construye tecnología. Sigue el paseo hacia el norte: cada control de acceso se abre al acreditar un distrito.";
  addObj(SP.truck,5,138,-8,-14);block(6,138);addObj(SP.bikes,24,138,0,0);block(25,138);addObj(SP.vend,27,135,0,-10);
  /* bordes: rascacielos */
  for(y=0;y<MH;y+=2){[0,MW-2].forEach(function(x2){if(G(x2,y)==="a"||G(x2,y+1)==="a")return;OBJS.push({s:sprTowerBG(hash(x2,y)),x:x2*T,y:(y+2)*T-(56+hash(hash(x2,y),3)%40),by:(y+2)*T-1});for(var a2=0;a2<2;a2++)for(var b2=0;b2<2;b2++)block(x2+a2,y+b2)})}
  for(x=2;x<MW-2;x+=2){[0,MH-2].forEach(function(y2){OBJS.push({s:sprTowerBG(hash(x,y2)),x:x*T,y:(y2+2)*T-(56+hash(hash(x,y2),3)%40),by:(y2+2)*T-1});for(var a3=0;a3<2;a3++)for(var b3=0;b3<2;b3++)block(x+a3,y2+b3)})}
  /* jardineras dispersas en banquetas */
  for(y=3;y<MH-3;y++)for(x=3;x<MW-3;x++){
    var ok=true;for(var j2=-1;j2<=1&&ok;j2++)for(var i3=-1;i3<=1;i3++){var gg=G(x+i3,y+j2);if((gg!=="k"&&gg!=="g")||solid(x+i3,y+j2)){ok=false;break}}
    if(!ok||y>=130)continue;var hh=hash(x*3,y*7);
    if(G(x,y)==="g"){if(hh%5===0)tree(x,y,hh%2?"oak":"oak2");else if(hh%7===0)addObj(SP.bush,x,y,0,0)}
    else if(hh%13===0)addObj(SP.planter,x,y,-8,-26);else if(hh%31===0)addObj(SP.bench,x,y,0,0);
  }
  BUTTERS=[{x:10*T,y:134*T,c:"#ffd166"},{x:24*T,y:118*T,c:"#a0c4ff"},{x:8*T,y:100*T,c:"#ff8fab"}];
  if(P.tx===23&&P.ty===23){P.tx=P.sx=15;P.ty=P.sy=136;P.fx=15;P.fy=136;P.dir="up"}
  drawGround();
}

/* ---------- suelo ---------- */
function drawGround(){
  var a=mk(WPX,WPY),c=a[1],x,y;
  for(y=0;y<MH;y++)for(x=0;x<MW;x++){
    var g=G(x,y),X=x*T,Y=y*T,h=hash(x,y);
    if(g==="k"||g==="n"||g==="x"){R(c,(h%5===0)?"#c4c2bd":"#cbc9c4",X,Y,T,T);R(c,"#b3b0aa",X,Y+15,T,1);R(c,"#b3b0aa",X+15,Y,1,T);R(c,"#d9d7d2",X+1,Y+1,6,1);if(h%9===0)R(c,"#bab7b1",X+4+h%7,Y+5+(h>>>4)%6,2,1)}
    if(g==="g"){R(c,h%4===0?"#6cb056":"#74b85c",X,Y,T,T);for(var k=0;k<3;k++){var q=hash(x*7+k,y*13);R(c,k%2?"#5fa04a":"#8fd06c",X+q%15,Y+(q>>>6)%15,1,2)}
      if(h%11===0){var fc=["#ffffff","#ffd166","#ff8fab"][h%3];R(c,fc,X+8,Y+5,1,1);R(c,fc,X+7,Y+6,3,1);R(c,fc,X+8,Y+7,1,1)}
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(function(d){if(G(x+d[0],y+d[1])!=="g"){if(d[1]===-1)R(c,"#8e8a82",X,Y,T,2);if(d[1]===1)R(c,"#8e8a82",X,Y+14,T,2);if(d[0]===-1)R(c,"#8e8a82",X,Y,2,T);if(d[0]===1)R(c,"#8e8a82",X+14,Y,2,T)}})}
    if(g==="p"){R(c,"#a8998b",X,Y,T,T);for(var r=0;r<4;r++)for(var s=0;s<2;s++){var ox=(r%2)*4+s*8;R(c,(hash(x*4+r,y*2+s)%3)?"#b9aa9b":"#ad9e90",X+ox,Y+r*4,7,3)}R(c,"rgba(255,255,255,.08)",X,Y,T,1)}
    if(g==="s"){R(c,"#d9dde3",X,Y,T,T);R(c,"#c3c8d0",X,Y+15,T,1);R(c,"#c3c8d0",X+15,Y,1,T);R(c,"#eef1f5",X+1,Y+1,7,1)}
    if(g==="a"||g==="z"){R(c,"#3a3f4b",X,Y,T,T);if(h%6===0)R(c,"#424856",X+(h%10),Y+(h>>>4)%12,3,2);
      var top=G(x,y-1)!=="a"&&G(x,y-1)!=="z",bot=G(x,y+1)!=="a"&&G(x,y+1)!=="z";
      if(top){R(c,"#8e8a82",X,Y,T,2)}else if(x%2===0&&g==="a")R(c,"#f2d36b",X+2,Y,10,2);
      if(bot)R(c,"#8e8a82",X,Y+14,T,2);
      if(g==="z")for(var zz=1;zz<T;zz+=4)R(c,"#eef1f5",X+zz,Y+(top?3:0),2,top?13:(bot?13:16))}
    if(g==="w"){R(c,(h%5===0)?"#3e93d6":"#4aa3e0",X,Y,T,T);if(h%3===0)R(c,"#3a88cc",X+2+h%8,Y+6+(h>>>4)%6,5,1);
      [[0,-1],[0,1],[-1,0],[1,0]].forEach(function(d){var n=G(x+d[0],y+d[1]);if(n!=="w"&&n!=="d"){if(d[1]===-1)R(c,"#9aa3ad",X,Y,T,3);if(d[1]===1)R(c,"#6f7580",X,Y+13,T,3);if(d[0]===-1)R(c,"#9aa3ad",X,Y,3,T);if(d[0]===1)R(c,"#9aa3ad",X+13,Y,3,T)}})}
    if(g==="d"){R(c,"#4aa3e0",X,Y,T,T);R(c,OL,X+1,Y,14,T);R(c,"#b07a46",X+2,Y,12,T);for(var pl=0;pl<T;pl+=4)R(c,"#7d5430",X+2,Y+pl,12,1)}
    if(g==="p"||g==="s"){[[0,-1],[0,1],[-1,0],[1,0]].forEach(function(d){var n=G(x+d[0],y+d[1]);if(n!=="p"&&n!=="s"&&n!=="z"&&n!=="x"){if(d[1]===-1)R(c,"#8f8172",X,Y,T,1);if(d[1]===1)R(c,"#8f8172",X,Y+15,T,1);if(d[0]===-1)R(c,"#8f8172",X,Y,1,T);if(d[0]===1)R(c,"#8f8172",X+15,Y,1,T)}})}
    if(g==="n"){var l=G(x-1,y)==="n",rr=G(x+1,y)==="n",u=G(x,y-1)==="n",dd=G(x,y+1)==="n";
      if(l||rr||(!u&&!dd)){R(c,OL,X,Y+5,T,3);R(c,"#9aa3b1",X,Y+6,T,1);R(c,OL,X,Y+10,T,2)}
      if(u||dd){R(c,OL,X+7,Y,3,T);R(c,"#9aa3b1",X+8,Y,1,T)}
      R(c,OL,X+6,Y+2,4,12);R(c,"#5a6474",X+7,Y+3,2,10)}
  }
  BOATS.forEach(function(b){var bx=b[0],by=b[1];R(c,OL,bx,by+3,22,9);R(c,"#e8eef8",bx+1,by+4,20,6);R(c,"#3f74c4",bx+2,by+8,18,2);R(c,OL,bx+10,by-6,1,10);R(c,"#f3eee0",bx+11,by-6,6,7)});
  GROUND=a[0];MINIBASE=mk(4,4)[0];
}

/* ---------- control de acceso (antes reja) ---------- */
function drawGate(c,o,cx,cy,t){
  var g=GATES.filter(function(q){return q.w===o.gate})[0],x=g.x*T-cx,y=g.y*T-cy,locked=gateLocked(o.gate);
  [[-8],[30]].forEach(function(p){var px=x+p[0];R(c,OL,px,y-16,10,32);R(c,"#2b2f3a",px+1,y-15,8,30);R(c,"#9fd3f2",px+2,y-12,6,8);R(c,locked?"#e04b4b":"#4ade80",px+3,y-2,4,3);R(c,"#5a6474",px+2,y+4,6,8)});
  if(locked){R(c,OL,x+1,y-3,31,5);for(var i=0;i<30;i+=6){R(c,"#e04b4b",x+2+i,y-2,3,3);R(c,"#f8fafc",x+5+i,y-2,3,3)}
    R(c,OL,x+12,y+4,10,9);R(c,"#fbbf24",x+13,y+5,8,7);R(c,OL,x+16,y+7,2,3)}
  else{R(c,OL,x+1,y-26,5,26);for(var k=0;k<24;k+=6){R(c,"#e04b4b",x+2,y-25+k,3,3);R(c,"#f8fafc",x+2,y-22+k,3,3)}}
}

/* ---------- carros por calle ---------- */
function walkable(x,y){
  var g=G(x,y);
  if(solid(x,y)||g==="w"||g==="f"||g==="x"||g==="a"||g==="n")return false;
  var gw=GATE_AT[x+","+y];if(gw!==undefined&&gateLocked(gw))return false;
  if(g==="z"&&carOn(x,y))return false;
  return true;
}
function carOn(x,y){for(var i=0;i<CARS.length;i++){var c=CARS[i];if(c.row!==y||Math.abs(c.speed)<8)continue;var cx0=c.x,cx1=c.x+30;if(cx1>x*T-2&&cx0<x*T+T+2)return true}return false}
function personOnCross(x0,x1,row){
  var hit=function(px,py){return (py===row)&&px>=x0&&px<=x1&&CROSS[px+","+py]};
  if(hit(P.tx,P.ty)||hit(Math.round(P.fx),Math.round(P.fy)))return true;
  for(var i=0;i<WALKERS.length;i++){var w=WALKERS[i];if(hit(w.tx,w.ty))return true}return false}
var _initLifeCity=initLife;
initLife=function(){_initLifeCity();
  var cols=["#e04b4b","#3f74c4","#f4a020","#2a9d6f","#e8eef8","#9b5de5","#2b2f3a"];CARS=[];
  ROADS.forEach(function(r,ri){for(var k=0;k<2;k++){var lane=k%2;CARS.push({row:r+lane,lane:lane,x:(hash(ri,k)%WPX),v:(lane?-1:1)*(46+hash(ri,k+3)%34),speed:0,spr:carSprite(cols[(ri*2+k)%cols.length])})}});
  WALKERS.forEach(function(w){if(w.name==="Guardia")w.name="Seguridad"});
};
var _updLifeCity=updateLife;
updateLife=function(dt){
  var saved=CARS;CARS=[];_updLifeCity(dt);CARS=saved;
  CARS.forEach(function(car){
    var dir=car.v>0?1:-1,front=dir>0?car.x+30:car.x,lookA=dir>0?front:front-22,lookB=dir>0?front+22:front;
    var tx0=Math.floor(lookA/T),tx1=Math.floor(lookB/T),stop=false;
    for(var tx=tx0;tx<=tx1;tx++){if(CROSS[tx+","+car.row]&&personOnCross(tx,tx,car.row))stop=true;if(CROSS[tx+","+car.row]&&nearCross(tx,car.row))stop=true}
    var target=stop?0:car.v;car.speed+= (target-car.speed)*Math.min(1,dt*6);
    car.x+=car.speed*dt;if(car.v>0&&car.x>WPX+40)car.x=-40;if(car.v<0&&car.x<-40)car.x=WPX+40;
  });
};
function nearCross(tx,row){var other=CROSS[tx+","+(row-1)]?row-1:row+1;return (P.tx===tx||P.tx===tx-1||P.tx===tx+1)&&(P.ty===row||P.ty===other)&&CROSS[P.tx+","+P.ty]}
function pushLife(vis,cx,cy,vw,vh){
  WALKERS.forEach(function(w){var x=w.fx*T,y=w.fy*T;if(x>cx-20&&x<cx+vw+20&&y>cy-20&&y<cy+vh+30)vis.push({walker:w,by:y+T-0.6})});
  CARS.forEach(function(car){var y=car.row*T;if(car.x>cx-40&&car.x<cx+vw+40&&y>cy-20&&y<cy+vh+20)vis.push({car:car,by:y+T})});
}
function drawCar(c,car,cx,cy){var x=Math.round(car.x-cx),y=car.row*T-cy-2;if(car.v<0){c.save();c.translate(x+30,y);c.scale(-1,1);c.drawImage(car.spr,0,0);c.restore()}else c.drawImage(car.spr,x,y)}
