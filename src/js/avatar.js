
/* ================= PERSONAJE PERSONALIZABLE · VESTIDORES · CAMINO DE NIVELES ================= */
/* catálogo: [nombre, datos..., nivel requerido] */
var AVC={
 skin:[["Muy clara","#f6d7b8","#e0b48f",1],["Clara","#f2c9a0","#d9a57c",1],["Trigueña clara","#e8b48a","#c98f66",1],["Trigueña","#d39a6a","#b07a4f",1],["Morena clara","#b97a4a","#955d35",1],["Morena","#9a6238","#7a4a28",1],["Oscura","#7a4a2a","#5c361d",1],["Muy oscura","#5a3420","#40241a",1]],
 hairC:[["Negro","#1f1a1a","#3a302c",1],["Café oscuro","#3b2414","#5c3a20",1],["Café","#4a2c17","#7a4c28",1],["Castaño","#7a4a24","#a06a38",1],["Rubio","#c9a24a","#ecd088",1],["Pelirrojo","#a8442a","#d06a3c",1],["Canoso","#8a909a","#c0c5cc",1],
   ["Azul eléctrico","#2b5fb8","#4f86e0",3],["Rosa","#c8508a","#f080b0",5],["Morado","#6a3fb0","#9068d8",8],["Menta","#2a9d8f","#5ed1c2",12],["Rojo fuego","#c0282e","#ec4a4e",16],["Verde neón","#30b868","#7cf0a8",22],["Plateado","#a8b2c0","#e6ecf5",28],["Dorado","#c9a227","#f2d266",40]],
 eyes:[["Negros","#1b1b2f",1],["Cafés","#5a3416",1],["Azules","#2b5fb8",1],["Verdes","#2f7a4a",1],["Grises","#5a6270",1],["Miel","#9a6a20",1]],
 hair:[["Corto",1],["Rapado",1],["Largo",1],["Calvo",1],["Chongo",2],["Coleta",2],["Afro",3],["Picos",4]],
 beard:[["Sin vello facial",1],["Bigote",2],["Candado",4],["Barba",6]],
 top:[["Playera",1],["Sudadera",1],["Camisa",2],["Chamarra",3],["Chaleco tech",5],["Traje",9]],
 topC:[["Turquesa","#2ec4b6","#1f968b",1],["Azul","#3f74c4","#2b528f",1],["Rojo","#e04b4b","#b03434",1],["Naranja","#f4a020","#c17c0e",1],["Verde","#43aa8b","#2f7a64",1],["Morado","#9b5de5","#7440b8",1],["Blanco","#e8eef8","#b9c2d4",1],["Negro","#2a2f45","#171a28",1],["Gris","#7a8496","#5a6274",1],
   ["Rosa","#ef7fb0","#c8558a",3],["Amarillo","#f6d55c","#c9a92e",6],["Neón","#4ade80","#22a858",11],["Vino","#8a2a44","#621c30",14],["Galaxia","#3b2a7a","#24185a",18],["Dorado","#e0b030","#a87e10",30]],
 pants:[["Mezclilla","#33447a","#222d52",1],["Negro","#2a2a33","#18181f",1],["Gris","#6a7080","#4a505e",1],["Caqui","#b59a6a","#8a7448",1],["Cargo","#5a6a3a","#3e4a28",7],["Blanco","#e8eef8","#b9c2d4",10]],
 shoes:[["Cafés","#3b2a20",1],["Negros","#1b1b22",1],["Blancos","#e8eef8",1],["Rojos","#d03838",3],["Azules","#3f74c4",7],["Neón","#4ade80",13],["Dorados","#e0b030",35]],
 head:[["Nada",1],["Audífonos",3],["Gorra",5],["Gorro",7]],
 face:[["Nada",1],["Lentes",2],["Lentes de sol",10]],
 body:[["Nada",1],["Gafete",4],["Mochila",8]],
 accC:[["Negro","#2a2f45","#171a28",1],["Blanco","#e8eef8","#b9c2d4",1],["Rojo","#e04b4b","#b03434",1],["Azul","#3f74c4","#2b528f",1],["Verde","#43aa8b","#2f7a64",3],["Amarillo","#f6d55c","#c9a92e",6],["Rosa","#ef7fb0","#c8558a",9],["Dorado","#e0b030","#a87e10",25]]
};
var AV_LABEL={skin:"Tono de piel",hairC:"Color de cabello",eyes:"Color de ojos",hair:"Peinado",beard:"Vello facial",top:"Ropa",topC:"Color de la ropa",pants:"Pantalón",shoes:"Tenis",head:"Cabeza",face:"Cara",body:"Extra",accC:"Color de accesorios"};
var AV_DEF={skin:1,hairC:2,eyes:0,hair:0,beard:0,top:0,topC:0,pants:0,shoes:0,head:0,face:0,body:0,accC:0};
function avCur(){var a={},s=ST.av||{};for(var k in AV_DEF)a[k]=(s[k]!==undefined&&AVC[k][s[k]])?s[k]:AV_DEF[k];return a}
function itemLv(slot,i){var it=AVC[slot][i];return it[it.length-1]}
function curLv(){return levelInfo().lv}
function itemOpen(slot,i){return itemLv(slot,i)<=curLv()}

/* ---- composición del sprite ---- */
function G2(rows){return rows.map(function(r){return r.split("")})}
function avGrid(view,f){var rows=view==="down"?HEAD.concat(BODY_D,LEGS[f]):view==="up"?HEAD.concat(BODY_U,LEGS[f]):SIDE.concat(SLEG[f]);return G2(rows)}
function avPal(a){var p={};for(var k in PAL)p[k]=PAL[k];
  var s=AVC.skin[a.skin],h=AVC.hairC[a.hairC],t=AVC.topC[a.topC],pn=AVC.pants[a.pants],ac=AVC.accC[a.accC];
  p.s=s[1];p.S=s[2];p.h=h[1];p.H=h[2];p.e=AVC.eyes[a.eyes][1];p.c=t[1];p.C=t[2];p.w=lighten(t[1],.35);p.p=pn[1];p.P=pn[2];p.b=AVC.shoes[a.shoes][1];
  p.k=ac[1];p.K=ac[2];p.g="#1b1b2f";p.L="#bfe6ff";p.W="#f8fafc";p.u="#e8eef8";p.v=t[1];p.V=t[2];p.r="#d03838";p.d=h[1];
  if(a.face===2){p.L="#1b2238";p.g="#0f1222"}
  if(a.top===2){p.w="#f8fafc"}            // camisa: cuello blanco
  if(a.top===4){p.c="#e8eef8";p.C="#b9c2d4";p.w="#e8eef8"}   // chaleco: playera clara debajo
  if(a.top===5){p.w="#f8fafc"}
  return p}
function lighten(hex,k){var n=parseInt(hex.slice(1),16),r=n>>16,g=(n>>8)&255,b=n&255;r=Math.round(r+(255-r)*k);g=Math.round(g+(255-g)*k);b=Math.round(b+(255-b)*k);return "#"+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}
function S_(g,x,y,ch){if(g[y]&&x>=0&&x<16)g[y][x]=ch}
function rep(g,y0,y1,x0,x1,from,to){for(var y=y0;y<=y1;y++)for(var x=x0;x<=x1;x++)if(g[y]&&from.indexOf(g[y][x])>=0)g[y][x]=to}
function avMods(g,view,a){
  var D=view==="down",U=view==="up",Sd=view==="side";
  /* peinados */
  switch(a.hair){
    case 1: rep(g,1,1,0,15,"o",".");rep(g,2,2,0,15,"h","o");rep(g,3,10,0,15,"h","H");if(D){S_(g,4,5,"s");S_(g,11,5,"s")}break;               // rapado
    case 2: if(D){for(var y=5;y<=12;y++){S_(g,3,y,"h");S_(g,12,y,"h");S_(g,2,y,"o");S_(g,13,y,"o")}S_(g,2,13,".");S_(g,13,13,".")}
            if(U){for(var y2=11;y2<=14;y2++)for(var x2=4;x2<=11;x2++)S_(g,x2,y2,"h");for(var y3=11;y3<=14;y3++){S_(g,3,y3,"o");S_(g,12,y3,"o")}for(var x3=4;x3<=11;x3++)S_(g,x3,15,"o")}
            if(Sd){for(var y4=5;y4<=12;y4++){S_(g,3,y4,"h");S_(g,4,y4,"h");S_(g,2,y4,"o")}}break;    // largo
    case 3: rep(g,1,11,0,15,"hH","s");break;                                                   // calvo
    case 4: for(var x4=6;x4<=9;x4++){S_(g,x4,0,"o");S_(g,x4,1,"h")}break;                      // chongo
    case 5: if(U){for(var y5=8;y5<=14;y5++){S_(g,7,y5,"h");S_(g,8,y5,"h");S_(g,6,y5,"o");S_(g,9,y5,"o")}}
            if(Sd){for(var y6=4;y6<=10;y6++){S_(g,2,y6,"h");S_(g,1,y6,"o")}}
            if(D){S_(g,12,6,"h");S_(g,12,7,"h");S_(g,13,6,"o");S_(g,13,7,"o")}break;          // coleta
    case 6: for(var x6=4;x6<=11;x6++)S_(g,x6,0,"o");for(var x7=3;x7<=12;x7++)S_(g,x7,1,"h");S_(g,2,1,"o");S_(g,13,1,"o");
            for(var y7=2;y7<=(U?10:6);y7++){S_(g,2,y7,"o");S_(g,13,y7,"o");S_(g,3,y7,"h");S_(g,12,y7,"h")}if(D)for(var x8=4;x8<=11;x8++)S_(g,x8,2,"h");break;  // afro
    case 7: [6,8,10].forEach(function(x){S_(g,x,0,"o");S_(g,x,1,"h")});break; // picos
  }
  /* vello facial */
  if(a.beard&&!U){var bc="H";
    if(a.beard===1){if(D){for(var x9=6;x9<=9;x9++)S_(g,x9,9,"d")}else{S_(g,10,9,"d");S_(g,11,9,"d");S_(g,12,9,"d")}}
    if(a.beard===2){if(D){S_(g,6,9,"d");S_(g,9,9,"d");S_(g,7,10,"d");S_(g,8,10,"d")}else{S_(g,10,9,"d");S_(g,11,9,"d");S_(g,10,10,"d")}}
    if(a.beard===3){if(D){S_(g,4,9,"d");S_(g,5,9,"d");S_(g,10,9,"d");S_(g,11,9,"d");for(var xa=5;xa<=10;xa++)S_(g,xa,10,"d");S_(g,6,9,"d");S_(g,9,9,"d")}else{for(var xb=6;xb<=12;xb++)S_(g,xb,9,"d");for(var xc=6;xc<=10;xc++)S_(g,xc,10,"d")}}
  }
  /* ropa */
  var T0=D?12:(U?12:12);
  if(a.top===1){ // sudadera
    if(D){for(var xd=5;xd<=10;xd++)S_(g,xd,12,"C");S_(g,6,13,"W");S_(g,9,13,"W");S_(g,6,14,"W");S_(g,9,14,"W");for(var xe=6;xe<=9;xe++)S_(g,xe,16,"C")}
    if(U){for(var xf=5;xf<=10;xf++){S_(g,xf,12,"C");S_(g,xf,13,"C")}}
    if(Sd){S_(g,6,12,"C");S_(g,7,12,"C");S_(g,8,12,"C")}}
  if(a.top===2){ // camisa
    if(D){S_(g,5,12,"w");S_(g,6,12,"w");S_(g,9,12,"w");S_(g,10,12,"w");S_(g,7,12,"s");S_(g,8,12,"s");for(var yg=13;yg<=16;yg++)S_(g,7,yg,"C")}
    if(Sd){S_(g,8,12,"w");S_(g,9,12,"w")}}
  if(a.top===3){ // chamarra abierta
    if(D){for(var yh=12;yh<=16;yh++){S_(g,7,yh,"u");S_(g,8,yh,"u")}S_(g,6,12,"C");S_(g,9,12,"C");S_(g,6,13,"C");S_(g,9,13,"C")}
    if(Sd){for(var yi=13;yi<=16;yi++)S_(g,10,yi,"u")}}
  if(a.top===4){ // chaleco
    if(D){for(var yj=13;yj<=16;yj++)for(var xj=5;xj<=10;xj++)if(xj!==7&&xj!==8)S_(g,xj,yj,yj===16?"V":"v");for(var yk=13;yk<=16;yk++){S_(g,7,yk,"c");S_(g,8,yk,"c")}for(var xk=4;xk<=11;xk++)if(g[17][xk]==="C")g[17][xk]="V"}
    if(U){for(var yl=13;yl<=16;yl++)for(var xl=4;xl<=11;xl++)S_(g,xl,yl,yl===16?"V":"v")}
    if(Sd){for(var ym=13;ym<=16;ym++)for(var xm=5;xm<=10;xm++)if(g[ym][xm]==="c")g[ym][xm]="v"}}
  if(a.top===5){ // traje
    if(D){S_(g,7,12,"w");S_(g,8,12,"w");for(var yn=13;yn<=15;yn++){S_(g,7,yn,"r");S_(g,8,yn,yn===13?"w":"r")}S_(g,6,12,"C");S_(g,9,12,"C")}
    if(Sd){S_(g,9,12,"w");S_(g,9,13,"r")}}
  /* accesorios: cara */
  if(a.face&&!U){if(D){[4,5,7,8,10,11].forEach(function(x){S_(g,x,7,"g")});S_(g,6,7,"L");S_(g,9,7,"L")}else{[6,7,8,9,10,12].forEach(function(x){S_(g,x,7,"g")});S_(g,11,7,"L")}}
  /* accesorios: extra */
  if(a.body===1){if(D){S_(g,5,12,"k");S_(g,10,12,"k");S_(g,6,13,"k");S_(g,9,13,"k");S_(g,7,14,"k");S_(g,8,14,"k");S_(g,7,15,"W");S_(g,8,15,"W");S_(g,7,16,"K");S_(g,8,16,"W")}
    if(Sd){S_(g,9,13,"k");S_(g,10,14,"k");S_(g,10,15,"W");S_(g,10,16,"W")}}
  if(a.body===2){if(D){for(var yo=12;yo<=16;yo++){S_(g,4,yo,"K");S_(g,11,yo,"K")}}
    if(U){for(var yp=12;yp<=17;yp++)for(var xp=4;xp<=11;xp++)S_(g,xp,yp,(yp===12||yp===17)?"o":"k");for(var yq=12;yq<=17;yq++){S_(g,3,yq,"o");S_(g,12,yq,"o")}for(var xq=6;xq<=9;xq++)S_(g,xq,15,"K")}
    if(Sd){for(var yr=12;yr<=17;yr++){S_(g,2,yr,"k");S_(g,3,yr,"k");S_(g,1,yr,"o")}S_(g,5,13,"K");S_(g,5,14,"K")}}
  /* accesorios: cabeza */
  if(a.head===1){ // audífonos
    if(D||U){for(var xs=5;xs<=10;xs++)S_(g,xs,1,"k");S_(g,4,2,"k");S_(g,11,2,"k");for(var yt=5;yt<=8;yt++){S_(g,3,yt,"k");S_(g,12,yt,"k");S_(g,2,yt,"o");S_(g,13,yt,"o")}}
    if(Sd){for(var xu=5;xu<=9;xu++)S_(g,xu,1,"k");for(var yu=5;yu<=8;yu++){S_(g,6,yu,"k");S_(g,7,yu,"k")}S_(g,6,4,"k")}}
  if(a.head===2||a.head===3){ // gorra / gorro
    for(var yv=1;yv<=(a.head===2?3:4);yv++)for(var xv=3;xv<=12;xv++)if(g[yv][xv]!=="."&&g[yv][xv]!=="o")g[yv][xv]=(a.head===3&&yv===4)?"K":"k";
    if(a.head===3){S_(g,7,0,"k");S_(g,8,0,"k")}
    if(a.head===2){if(D){for(var xw=4;xw<=11;xw++)S_(g,xw,4,"K")}if(Sd){for(var xx=10;xx<=14;xx++)S_(g,xx,4,"K");S_(g,15,4,"o")}}}
}
var AVCACHE={};
function avFrames(a){var key=JSON.stringify(a);if(AVCACHE[key])return AVCACHE[key];var p=avPal(a),fr={};
  ["idle","a","b"].forEach(function(f){["down","up","side"].forEach(function(v){var g=avGrid(v,f);avMods(g,v,a);fr[v+f]=spr(g.map(function(r){return r.join("")}),p)})});
  AVCACHE[key]=fr;return fr}
var _buildPlayerA=buildPlayer;
buildPlayer=function(){var fr=avFrames(avCur());for(var k in fr)FR[k]=fr[k]};

/* ---- Vestidores ---- */
var WD=null;
function openWardrobe(mode){ // mode: "new" | "edit"
  closeProfile();if($("wd"))return;HELD=[];
  WD={mode:mode||"edit",a:avCur(),orig:avCur(),tab:"look",dir:0,anim:"idle",play:true,t:0,goal:ST.goal||"",name:(mode==="new"&&ST.name==="Programador")?"":(ST.name||"")};
  var d=document.createElement("div");d.id="wd";d.className="wd";document.body.appendChild(d);renderWD();
  cancelAnimationFrame(WD.raf);var t0=performance.now();(function fr(now){if(!WD||!$("wd"))return;WD.raf=requestAnimationFrame(fr);if(WD.play)WD.t=(now-t0)/1000;drawMirror()})(t0);
}
function closeWardrobe(){if(WD)cancelAnimationFrame(WD.raf);var d=$("wd");if(d)d.remove();WD=null}
function wdSave(){ST.av=WD.a;ST.name=(WD.name||"").trim()||ST.name||"Programador";ST.goal=WD.goal;save();buildPlayer();hud();var m=WD.mode;closeWardrobe();
  if(m==="new"){if(ST.lvl===undefined)levelPicker(true);else toast("¡Listo! Sigue las huellas doradas 👣")}else toast("👕 ¡Nuevo look guardado!")}
var GOALS=["Google","Apple","Microsoft","Meta","Amazon","Netflix","Mi propia startup","Aún no sé"];
function renderWD(){var a=WD.a,isNew=WD.mode==="new",lv=curLv();
  function stepper(slot){var n=AVC[slot].length,i=a[slot],it=AVC[slot][i],lock=!itemOpen(slot,i);
    return '<div class="wcard"><div class="wch"><b>'+AV_LABEL[slot]+'</b><span>'+(i+1)+'/'+n+'</span></div><div class="wstep"><button class="pbtn" data-st="'+slot+'" data-d="-1" aria-label="Anterior">◀</button><select data-sel="'+slot+'">'
      +AVC[slot].map(function(x,k){var L=itemLv(slot,k);return '<option value="'+k+'"'+(k===i?' selected':'')+'>'+esc(x[0])+(L>lv?' 🔒 NV '+L:'')+'</option>'}).join("")
      +'</select><button class="pbtn" data-st="'+slot+'" data-d="1" aria-label="Siguiente">▶</button></div>'+(lock?'<div class="wlock">🔒 Se desbloquea en el nivel '+itemLv(slot,i)+'</div>':'')+'</div>'}
  function swatches(slot){var it=AVC[slot][a[slot]];
    return '<div class="wcard"><div class="wch"><b>'+AV_LABEL[slot]+'</b><span>'+esc(it[0])+'</span></div><div class="wsw">'
      +AVC[slot].map(function(x,k){var L=itemLv(slot,k),op=L<=lv;return '<button class="sw'+(k===a[slot]?' on':'')+(op?'':' lk')+'" data-sw="'+slot+'" data-k="'+k+'" title="'+esc(x[0])+(op?'':' · nivel '+L)+'" style="--c:'+x[1]+'">'+(op?'':'<small>NV '+L+'</small>')+'</button>'}).join("")+'</div></div>'}
  var body="";
  if(WD.tab==="look")body='<div class="wgrid">'+stepper("hair")+swatches("hairC")+swatches("skin")+swatches("eyes")+stepper("beard")+stepper("top")+swatches("topC")+swatches("pants")+swatches("shoes")+'</div>';
  if(WD.tab==="gear")body='<div class="wgrid">'+stepper("head")+stepper("face")+stepper("body")+swatches("accC")+'</div><p class="wnote">Más accesorios y colores se desbloquean al subir de nivel. Mira todos los premios en el <button class="linkb" id="wpath">Camino de niveles</button>.</p>';
  if(WD.tab==="prof")body='<div class="wgrid one"><div class="wcard"><div class="wch"><b>Tu nombre</b><span>Obligatorio</span></div><input id="wname" maxlength="22" value="'+esc(WD.name)+'" placeholder="Ej. Luis Gabuardi"><small class="wsub">Así te llaman en la villa y aparece en tu ficha.</small></div>'
    +'<div class="wcard"><div class="wch"><b>Tu meta</b><span>Opcional</span></div><select id="wgoal"><option value="">Elige dónde quieres trabajar</option>'+GOALS.map(function(g){return '<option'+(g===WD.goal?' selected':'')+'>'+esc(g)+'</option>'}).join("")+'</select><small class="wsub">Te lo recordaremos cuando acredites un edificio.</small></div>'
    +'<div class="wcard"><div class="wch"><b>Nivel de experiencia</b><span>'+esc((LVL_INFO[userLvl()]||{}).nm||"")+'</span></div><small class="wsub">'+(ST.lvl===undefined?'Te lo preguntamos al terminar.':'Cambia cómo te enseñan las clases.')+'</small>'+(ST.lvl===undefined?'':'<button class="pbtn" id="wlvl" style="margin-top:8px">Cambiar nivel</button>')+'</div></div>';
  var lockedSel=Object.keys(a).some(function(k){return !itemOpen(k,a[k])});
  var h='<div class="whead"><canvas id="wico" width="32" height="32"></canvas><div><small>'+(isNew?'ALGORITHM VILLA / NUEVA PARTIDA':'PLAZA / VESTIDORES')+'</small><b>'+(isNew?'Taller de personaje':'Vestidores')+'</b></div><span class="wtag">'+(isNew?'NUEVA PARTIDA':'NIVEL '+lv)+'</span></div>'
   +'<div class="wmain"><section class="wleft"><div class="wwelcome">'+(isNew?'TE DAMOS LA BIENVENIDA':'BIENVENIDO')+'</div><div class="mirror"><span class="mlab2">ESPEJO</span><canvas id="wmir" width="96" height="144"></canvas></div>'
   +'<div class="wname">'+esc(WD.name||"Programador")+'</div><div class="wsum">'+esc(AVC.hair[a.hair][0]+' · '+AVC.top[a.top][0]+' · '+AVC.topC[a.topC][0])+'</div>'
   +'<div class="wctl"><button class="pbtn'+(WD.anim==="idle"?' mint':'')+'" id="wid">Reposo</button><button class="pbtn'+(WD.anim==="walk"?' mint':'')+'" id="wwk">Caminar</button></div>'
   +'<div class="wctl"><button class="pbtn" id="wrl" aria-label="Girar a la izquierda">◀</button><button class="pbtn" id="wrr" aria-label="Girar a la derecha">▶</button><button class="pbtn" id="wpl">'+(WD.play?'❚❚ Pausa':'▶ Animar')+'</button></div></section>'
   +'<section class="wright"><div class="wtabs"><button class="wtab'+(WD.tab==="look"?' on':'')+'" data-tab="look">🪞 Aspecto</button><button class="wtab'+(WD.tab==="gear"?' on':'')+'" data-tab="gear">🎒 Equipo</button><button class="wtab'+(WD.tab==="prof"?' on':'')+'" data-tab="prof">🪪 Perfil</button></div>'
   +'<div class="wtools"><b>'+(WD.tab==="look"?'Define tu estilo':WD.tab==="gear"?'Accesorios':'Tu perfil')+'</b><span><button class="pbtn gold" id="wrnd">🎲 Combinar al azar</button><button class="pbtn" id="wundo">Deshacer todo</button></span></div>'
   +'<p class="wnote">Cada cambio se ve en el espejo al instante.</p><div class="wbody">'+body+'</div></section></div>'
   +'<div class="wfoot"><span>'+(lockedSel?'🔒 Tienes algo bloqueado puesto: súbelo de nivel o cámbialo para guardar.':'Tu apariencia no cambia las reglas del juego.')+'</span><span>'+(isNew?'':'<button class="pbtn" id="wcancel">Cancelar</button>')+'<button class="pbtn mint" id="wsave"'+(lockedSel?' disabled':'')+'>'+(isNew?'Abrir la villa ▶':'Guardar cambios')+'</button></span></div>';
  $("wd").innerHTML=h;
  var ic=$("wico").getContext("2d");ic.imageSmoothingEnabled=false;ic.drawImage(avFrames(a).downidle,0,0,32,32,0,1,32,31);
  [].forEach.call(document.querySelectorAll("#wd [data-tab]"),function(b){b.onclick=function(){WD.tab=b.dataset.tab;renderWD()}});
  [].forEach.call(document.querySelectorAll("#wd [data-st]"),function(b){b.onclick=function(){var s=b.dataset.st,n=AVC[s].length;a[s]=(a[s]+(+b.dataset.d)+n)%n;renderWD()}});
  [].forEach.call(document.querySelectorAll("#wd [data-sel]"),function(sel){sel.onchange=function(){a[sel.dataset.sel]=+sel.value;renderWD()}});
  [].forEach.call(document.querySelectorAll("#wd [data-sw]"),function(b){b.onclick=function(){var s=b.dataset.sw,k=+b.dataset.k;if(!itemOpen(s,k)){toast("🔒 "+AVC[s][k][0]+" se desbloquea en el nivel "+itemLv(s,k));return}a[s]=k;renderWD()}});
  $("wid").onclick=function(){WD.anim="idle";renderWD()};$("wwk").onclick=function(){WD.anim="walk";WD.play=true;renderWD()};
  $("wrl").onclick=function(){WD.dir=(WD.dir+3)%4;renderWD()};$("wrr").onclick=function(){WD.dir=(WD.dir+1)%4;renderWD()};
  $("wpl").onclick=function(){WD.play=!WD.play;renderWD()};
  $("wrnd").onclick=function(){for(var k in a){var ok=[];AVC[k].forEach(function(x,i){if(itemOpen(k,i))ok.push(i)});var p=ok[Math.floor(Math.random()*ok.length)];if(k==="head"||k==="face"||k==="body"||k==="beard")p=Math.random()<.5?0:p;a[k]=p}renderWD()};
  $("wundo").onclick=function(){WD.a=JSON.parse(JSON.stringify(WD.orig));renderWD()};
  if($("wname"))$("wname").oninput=function(){WD.name=this.value;var n=document.querySelector("#wd .wname");if(n)n.textContent=this.value||"Programador"};
  if($("wgoal"))$("wgoal").onchange=function(){WD.goal=this.value};
  if($("wlvl"))$("wlvl").onclick=function(){levelPicker(false)};
  if($("wpath"))$("wpath").onclick=function(){openLevelPath()};
  if($("wcancel"))$("wcancel").onclick=closeWardrobe;
  $("wsave").onclick=function(){if(isNew&&!(WD.name||"").trim()){WD.tab="prof";renderWD();toast("✍️ Escribe tu nombre para crear tu perfil");setTimeout(function(){var i=$("wname");if(i)i.focus()},50);return}wdSave()};
  drawMirror()}
function drawMirror(){var cv=$("wmir");if(!cv||!WD)return;var c=cv.getContext("2d");c.imageSmoothingEnabled=false;c.clearRect(0,0,96,144);
  var fr=avFrames(WD.a),dirs=["down","right","up","left"],dir=dirs[WD.dir],flip=WD.dir===3,key=animKey(dir,WD.anim==="walk",WD.t*1.6,WD.t,5),bob=0;
  c.fillStyle="rgba(0,0,0,.25)";c.beginPath();c.ellipse(48,140,30,5,0,0,7);c.fill();
  c.save();if(flip){c.translate(96,0);c.scale(-1,1)}c.drawImage(fr[key]||fr.downidle,0,0,32,48,0,0,96,144);c.restore()}

/* ---- teclado mientras hay overlays ---- */
document.addEventListener("keydown",function(e){
  if($("wd")){var tag=(e.target&&e.target.tagName)||"";if(e.key==="Escape"&&WD&&WD.mode!=="new"){closeWardrobe();e.preventDefault()}
    if(tag!=="INPUT"&&tag!=="SELECT"&&tag!=="TEXTAREA"&&tag!=="BUTTON")e.preventDefault();e.stopImmediatePropagation();return}
  if($("lpath")){if(e.key==="Escape")closeLevelPath();e.stopImmediatePropagation()}
},true);

/* ---- Camino de niveles ---- */
function rewardsAt(L){var out=[];for(var s in AVC)AVC[s].forEach(function(x,i){if(itemLv(s,i)===L&&L>1)out.push([s,i])});return out}
function slotKind(s){return {skin:"Tono",hairC:"Color de cabello",eyes:"Ojos",hair:"Peinado",beard:"Vello facial",top:"Ropa",topC:"Color de ropa",pants:"Pantalón",shoes:"Tenis",head:"Accesorio",face:"Accesorio",body:"Accesorio",accC:"Color de accesorio"}[s]}
function openLevelPath(tab){closeProfile();if($("lpath"))return;var L=levelInfo(),ex=examsDone();if(tab===undefined)tab=Math.min(Math.floor((L.lv-1)/LV_PER_WORLD),8);
  var d=document.createElement("div");d.id="lpath";d.className="modal lvmodal";document.body.appendChild(d);
  function render(){var lo=tab*LV_PER_WORLD+1,hi=lo+LV_PER_WORLD-1,a=avCur(),nextRw=null;
    for(var q=L.lv+1;q<=45&&!nextRw;q++)if(rewardsAt(q).length)nextRw=q;
    var h='<div class="mcard lpcard"><button class="mx" id="lpx" title="Cerrar (Esc)">✕</button><div class="lptop"><div class="lpbadge">NV<b>'+L.lv+'</b></div><div><div class="mlab">'+esc(L.title.toUpperCase())+' · '+ST.xp+' XP</div><h2 class="lvh">Camino de niveles</h2><div class="lpsub">'+(nextRw?'Siguiente premio en el nivel '+nextRw+(nextRw<=L.cap?' (faltan '+Math.max(0,xpForLevel(nextRw)-ST.xp)+' XP)':' (acredita '+esc(WORLDS[Math.min(ex,7)].nm)+' para llegar)'):'¡Tienes todos los premios!')+'</div></div></div>'
     +'<div class="lptabs">'+RANKS.map(function(r,i){if(i>8)return "";var a1=i*LV_PER_WORLD+1;return '<button class="lpt'+(i===tab?' on':'')+(i>ex?' lk':'')+'" data-t="'+i+'"><b>'+a1+'–'+(a1+LV_PER_WORLD-1)+'</b><span>'+(i<8?WORLDS[i].ico+' ':'🏁 ')+esc(r)+'</span></button>'}).join("")+'</div>'
     +'<div class="lphead"><b>'+(tab<8?esc(WORLDS[tab].nm):'Final de carrera')+' · '+esc(RANKS[tab])+'</b><span>'+(tab<=ex?(tab<8?'Niveles '+lo+'–'+hi+' disponibles mientras estés en este mundo':'Niveles finales'):'🔒 Se abren al acreditar '+esc(WORLDS[tab-1].nm))+'</span></div><div class="lplist">';
    for(var lv=lo;lv<=hi&&lv<=45;lv++){var rw=rewardsAt(lv),st=lv<L.lv?"done":lv===L.lv?"cur":lv===L.lv+1?"next":"";
      h+='<div class="lprow '+st+'"><div class="lpn">NV<b>'+lv+'</b></div><div class="lpm"><div class="lpl"><b>'+(lv===1?'Inicio: tu primer commit':rw.length?rw.length+' premio'+(rw.length>1?'s':''):'Solo XP')+'</b><span>'+xpForLevel(lv).toLocaleString("es-MX")+' XP'+(st==="cur"?' · <em>Nivel actual</em>':st==="next"?' · <em>Siguiente</em>':'')+'</span></div>'
        +(rw.length?'<div class="lprw">'+rw.map(function(r){return '<div class="rwc'+(lv<=L.lv?' got':'')+'"><canvas data-rw="'+r[0]+':'+r[1]+'" width="32" height="48"></canvas><div><small>'+esc(slotKind(r[0]))+'</small><b>'+esc(AVC[r[0]][r[1]][0])+'</b></div></div>'}).join("")+'</div>':'')+'</div></div>'}
    h+='</div><div class="lpfoot"><span>La XP sale de clases, salas, repasos y exámenes. Cada mundo tiene un tope de '+LV_PER_WORLD+' niveles: acredita su edificio para seguir subiendo. Los edificios se abren con tu avance, no con el nivel.</span><span><button class="pbtn" id="lpvest">👕 Ir a Vestidores</button><button class="pbtn mint" id="lpclose">Cerrar</button></span></div></div>';
    d.innerHTML=h;
    [].forEach.call(d.querySelectorAll("canvas[data-rw]"),function(cv){var p=cv.dataset.rw.split(":"),b=JSON.parse(JSON.stringify(a));b[p[0]]=+p[1];
      if(p[0]==="accC"&&!b.head)b.head=2;if(p[0]==="hairC"&&(b.head===2||b.head===3))b.head=0;var c=cv.getContext("2d");c.imageSmoothingEnabled=false;c.drawImage(avFrames(b).downidle,0,0)});
    [].forEach.call(d.querySelectorAll("[data-t]"),function(b){b.onclick=function(){tab=+b.dataset.t;render()}});
    $("lpx").onclick=closeLevelPath;$("lpclose").onclick=closeLevelPath;$("lpvest").onclick=function(){closeLevelPath();openWardrobe("edit")};
    d.onclick=function(e){if(e.target===d)closeLevelPath()}}
  render()}
function closeLevelPath(){var d=$("lpath");if(d)d.remove()}

/* ---- accesos: HUD, ficha ---- */
(function(){var lvEl=$("lv");var badge=lvEl&&lvEl.closest(".lvl");if(badge){badge.style.cursor="pointer";badge.title="Camino de niveles";badge.onclick=function(){openLevelPath()}}})();
var _openProfileB=openProfile;
openProfile=function(){_openProfileB();var m=document.querySelector("#modal .mexp");if(!m)return;
  var d=document.createElement("div");d.className="mbtns";d.innerHTML='<button class="pbtn mint" id="pvest">👕 Vestidores</button><button class="pbtn gold" id="ppath">🏅 Camino de niveles</button>';
  m.parentNode.insertBefore(d,m.nextSibling);$("pvest").onclick=function(){openWardrobe("edit")};$("ppath").onclick=function(){openLevelPath()}};
$("avab").onclick=openProfile;$("whob").onclick=openProfile;

/* ---- Vestidores en la plaza ---- */
var VEST={x:24,y:131,ax:25,ay:133,pend:false,sp:null};
function sprVestidores(){var a=mk(48,46),c=a[1];
  R(c,"rgba(0,0,0,.22)",2,42,46,4);R(c,OL,1,6,46,38);R(c,"#2b2f45",2,7,44,36);R(c,"#3a4060",2,7,44,3);
  for(var i=0;i<11;i++)R(c,i%2?"#f8fafc":"#9b5de5",3+i*4,11,4,6);R(c,OL,2,17,44,1);
  R(c,"#bfe6ff",5,20,16,16);R(c,"#9fd3f2",5,20,16,3);R(c,OL,13,20,1,16);
  R(c,"#2ec4b6",9,26,3,8);R(c,"#e04b4b",15,25,3,9);R(c,"#f6d55c",6,27,2,7);
  R(c,OL,26,20,14,22);R(c,"#5ed1c2",27,21,12,21);R(c,"#2a9d8f",32,21,2,21);R(c,"#f8fafc",30,30,2,2);
  R(c,"#1b2238",4,1,40,7);R(c,OL,4,1,40,1);txt(c,"VESTIDORES",7,1,"#5eead4",6);
  R(c,"#9aa3ad",0,42,48,2);return a[0]}
var _buildWorldA=buildWorld;
buildWorld=function(){_buildWorldA();
  OBJS=OBJS.filter(function(o){if(o.b!==undefined||o.gate!==undefined||o.fountain)return true;var tx=Math.floor((o.x+8)/T),ty=Math.floor((o.by-1)/T);return !(tx>=23&&tx<=27&&ty>=131&&ty<=134)});
  for(var y=131;y<=134;y++)for(var x=23;x<=27;x++)SOL[y*MW+x]=0;
  for(var y2=131;y2<=132;y2++)for(var x2=24;x2<=26;x2++){SOL[y2*MW+x2]=1;if(G(x2,y2)==="s")setG(x2,y2,"k")}
  if(G(25,133)!=="s")setG(25,133,"p");
  VEST.sp=sprVestidores();OBJS.push({s:VEST.sp,x:24*T,y:133*T-46,by:133*T-1});
};
function vestHit(x,y){return x>=24&&x<=26&&y>=130&&y<=132}
var _tapToA=tapTo;
tapTo=function(x,y){VEST.pend=false;if(vestHit(x,y)){if(P.tx===VEST.ax&&P.ty===VEST.ay&&!P.moving){P.dir="up";openWardrobe("edit");return}
    var p=bfs(P.tx,P.ty,VEST.ax,VEST.ay);if(!p){MARK={x:x,y:y,bad:true,t:0};return}if(MDLG)closeDlg();HELD=[];P.path=p;P.pend=-1;P.goal=[VEST.ax,VEST.ay];MARK={x:VEST.ax,y:VEST.ay,t:0};VEST.pend=true;return}
  _tapToA(x,y)};
var _actA=act;
act=function(){var f=facing();if(!P.moving&&vestHit(f[0],f[1])&&f[1]>=131){openWardrobe("edit");return}_actA()};
var _updateA=update;
update=function(dt){_updateA(dt);if(VEST.pend&&!P.moving&&!P.path.length){VEST.pend=false;if(P.tx===VEST.ax&&P.ty===VEST.ay){P.dir="up";openWardrobe("edit")}}};
var _facingSignA=facingSign;
facingSign=function(){var f=facing();if(vestHit(f[0],f[1]))return false;return _facingSignA()};

if(window.__AV){window.__AV.tapTo=function(x,y){tapTo(x,y)};window.__AV.act=function(){act()}}
var _hudA=hud,LASTLV=null;
hud=function(){_hudA();var lv=curLv();if(LASTLV!==null&&lv>LASTLV){var n=0;for(var q=LASTLV+1;q<=lv;q++)n+=rewardsAt(q).length;if(n)setTimeout(function(){toast("🎁 ¡Nivel "+lv+"! Desbloqueaste "+n+" premio"+(n>1?"s":"")+" en los Vestidores")},1600)}LASTLV=lv};

/* retratos vivos: HUD y portada respiran y parpadean */
setInterval(function(){if(document.hidden)return;var t=performance.now()/1000,k=animKey("down",false,0,t,3);if(k===setInterval._lk)return;setInterval._lk=k;
  var img=FR[k]||FR.downidle;if(!img)return;var a=$("ava");if(a){var c=a.getContext("2d");c.imageSmoothingEnabled=false;c.clearRect(0,0,32,32);c.drawImage(img,0,0,32,32,0,1,32,31)}
  var tv=$("tava");if(tv){var c2=tv.getContext("2d");c2.imageSmoothingEnabled=false;c2.clearRect(0,0,32,48);c2.drawImage(img,0,0)}},90);
