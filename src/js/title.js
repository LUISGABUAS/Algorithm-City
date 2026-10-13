
/* ================= PANTALLA DE INICIO ================= */
var TITLE_TIPS=[
 "Lee el enunciado dos veces: las restricciones te dicen qué complejidad necesitas.",
 "Si tu solución tiene dos ciclos anidados, pregúntate si un diccionario te ahorra uno.",
 "Antes de programar, resuelve un ejemplo a mano en papel.",
 "Los casos límite ganan entrevistas: lista vacía, un elemento, números repetidos.",
 "Di en voz alta lo que piensas: en la entrevista también califican tu razonamiento.",
 "Equivocarte en el editor es gratis. Ejecuta seguido."];
function hasSave(){return !!(ST.av||ST.xp>0||Object.keys(ST.lesson||{}).length||Object.keys(ST.solved||{}).length)}
var TITLE_USER=null;
function showTitle(){if($("tscreen"))return;HELD=[];
  var d=document.createElement("div");d.id="tscreen";d.className="title";document.body.appendChild(d);document.body.classList.add("titling");
  var L=levelInfo(),sv=hasSave(),tip=0;
  var cl=(typeof cloudState==="function")?cloudState():{on:false,user:null};
  var locked=(typeof REQUIRE_LOGIN!=="undefined"&&REQUIRE_LOGIN)&&cl.on&&!cl.user;  // puerta: hay nube, se exige login y no hay sesión
  TITLE_USER=(locked?"L":"U")+":"+(cl.user?cl.user.id:"-");
  d.innerHTML='<canvas id="tbg"></canvas><div class="tshade"></div><section class="tpanel">'
   +'<div class="tlogo"><canvas id="tico" width="24" height="24"></canvas><h1><span>ALGORITHM</span><b>CITY</b></h1></div>'
   +'<div class="tterm"><span id="tty"></span><i class="tcar"></i></div>'
   +'<blockquote class="ttip" id="ttip">'+esc(TITLE_TIPS[0])+'</blockquote>'
   +'<div class="tcard"><div class="tch"><canvas id="tcico" width="16" height="16"></canvas><div><b>'+(locked?'Acceso':'Tu perfil de dev')+'</b><small>'+(locked?'Inicia sesión para abrir tu perfil de dev':(sv?'Partida guardada · sigue donde lo dejaste':'Crea tu personaje para empezar'))+'</small></div></div>'
   +'<div id="tcloud-wrap">'+(typeof cloudTitleHtml==="function"?cloudTitleHtml():"")+'</div>'
   +(locked?'':(sv?'<div class="tme"><canvas id="tava" width="32" height="48"></canvas><div><b>'+esc(ST.name||"Programador")+'</b><span>'+esc(L.title)+' · Nivel '+L.lv+'</span><span>'+examsDone()+'/8 edificios · '+ST.xp+' XP</span></div></div>'
       +'<button class="pbtn mint tbig" id="tgo">▶ Continuar</button><div class="trow"><button class="pbtn" id="tvest">👕 Vestidores</button><button class="pbtn" id="tnew">Nueva partida</button></div>'
     :'<p class="tp">Aprende Python y algoritmos escribiendo código de verdad, desde cero hasta entrevistas de Big Tech.</p><button class="pbtn mint tbig" id="tgo">▶ Crear mi personaje</button>'))
   +'<div id="tconf"></div></div></section>'
   +'<div class="tfoot">💾 Tu progreso se guarda en este navegador'+((typeof cloudEnabled==="function"&&cloudEnabled())?' · y en la nube si inicias sesión':'')+' · en celular toca el mapa para caminar</div>';
  var ic=$("tico").getContext("2d");ic.imageSmoothingEnabled=false;drawLogoIcon(ic);
  var cc=$("tcico").getContext("2d");cc.imageSmoothingEnabled=false;R(cc,OL,1,2,14,12);R(cc,"#f8fafc",2,3,12,10);R(cc,"#2ec4b6",3,4,4,4);R(cc,"#97a3c7",8,5,5,1);R(cc,"#97a3c7",8,7,4,1);R(cc,"#97a3c7",3,10,10,1);
  if(sv&&$("tava")){var ac=$("tava").getContext("2d");ac.imageSmoothingEnabled=false;ac.drawImage(FR.downidle,0,0)}
  // fondo: ciudad futurista en pixel art (dibujada por código, animada)
  (function(){var bg=$("tbg");if(!bg)return;var bgc=bg.getContext("2d");bgc.imageSmoothingEnabled=false;var bt=0;
    function sizeBg(){var sc=4;bg.width=Math.max(160,Math.ceil(window.innerWidth/sc));bg.height=Math.max(120,Math.ceil(window.innerHeight/sc));TBG=titleBgLayout(bg.width,bg.height);drawTitleBg(bgc,bt)}
    sizeBg();d._bgresize=function(){sizeBg()};window.addEventListener("resize",d._bgresize);
    d._bg=setInterval(function(){if(!$("tbg")){clearInterval(d._bg);return}bt++;drawTitleBg(bgc,bt)},70)})();
  if(typeof cloudTitleBind==="function")cloudTitleBind();
  // terminal que escribe
  var lines=[">>> two_sum([2, 7, 11, 15], 9)","[0, 1]",">>> fizz_buzz(5)","['1', '2', 'Fizz', '4', 'Buzz']",">>> \"listo\" in entrevistas","True"],li=0,ci=0;
  d._ty=setInterval(function(){var el=$("tty");if(!el){clearInterval(d._ty);return}var s=lines[li];ci++;el.textContent=s.slice(0,ci);el.className=s.indexOf(">>>")===0?"in":"outl";
    if(ci>s.length+12){ci=0;li=(li+1)%lines.length}},70);
  d._tip=setInterval(function(){var el=$("ttip");if(!el){clearInterval(d._tip);return}tip=(tip+1)%TITLE_TIPS.length;el.classList.add("fade");setTimeout(function(){el.textContent=TITLE_TIPS[tip];el.classList.remove("fade")},300)},6500);
  if($("tgo"))$("tgo").onclick=function(){if(sv){closeTitle();afterTitle()}else{closeTitle();openWardrobe("new")}};
  if($("tvest"))$("tvest").onclick=function(){closeTitle();openWardrobe("edit")};
  if($("tnew"))$("tnew").onclick=function(){$("tconf").innerHTML='<div class="tconf"><b>¿Empezar de cero?</b><span>Se borra tu progreso de este navegador: XP, clases, salas y repasos.</span><div class="trow"><button class="pbtn" id="tno">Cancelar</button><button class="pbtn red" id="tyes">Sí, borrar y empezar</button></div></div>';
    $("tno").onclick=function(){$("tconf").innerHTML=""};$("tyes").onclick=function(){resetSave();closeTitle();openWardrobe("new")}};
  setTimeout(function(){var b=$("tgo");if(b)b.focus()},50)}
function closeTitle(){document.body.classList.remove("titling");var d=$("tscreen");if(!d)return;clearInterval(d._ty);clearInterval(d._tip);clearInterval(d._bg);if(d._bgresize)window.removeEventListener("resize",d._bgresize);d.remove()}
function afterTitle(){if(ST.lvl===undefined)levelPicker(true);else if(!ST.av)setTimeout(function(){toast("👕 Personaliza tu personaje en los Vestidores de la plaza")},600)}
function resetSave(){ST={xp:0,coins:0,gems:0,streak:0,solved:{},played:{},exam:{},cur:{},since:new Date().toISOString().slice(0,10),att:0,hits:0,bestStreak:0,name:"Programador",lesson:{}};
  save();buildPlayer();hud();if(typeof questUI==="function")questUI()}
function drawLogoIcon(c){
  // emblema: prompt de terminal dentro de corchetes de código  [ >_ ]
  var M="#5eead4", W="#e8eef8", A="#fbbf24";
  R(c,M,3,4,2,16);R(c,M,3,4,5,2);R(c,M,3,18,5,2);        // corchete [
  R(c,M,19,4,2,16);R(c,M,16,4,5,2);R(c,M,16,18,5,2);     // corchete ]
  R(c,W,8,8,2,2);R(c,W,9,9,2,2);R(c,W,10,10,2,2);R(c,W,11,11,2,2);R(c,W,12,12,2,2);  // chevron ❯ (arriba)
  R(c,W,8,16,2,2);R(c,W,9,15,2,2);R(c,W,10,14,2,2);R(c,W,11,13,2,2);                  // chevron ❯ (abajo)
  R(c,A,14,16,4,2);                                      // cursor _
}

/* ---------- fondo: ciudad futurista en pixel art ---------- */
var TBG=null;
function titleBgLayout(W,H){
  function rng(seed){var s=seed>>>0||1;return function(){s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
  var r=rng(424242), i;
  var C={k:"#c792ea",f:"#82aaff",s:"#c3e88d",n:"#f78c6c",c:"#546e7a",t:"#89ddff",v:"#d7deea"};
  function codeLines(){return [
    [0,[[1,C.c],[1,0],[10,C.c]]],
    [0,[[3,C.k],[1,0],[7,C.f],[1,0],[4,C.v],[1,0],[4,C.v]]],
    [1,[[4,C.v],[1,0],[1,C.t],[1,0],[2,C.n]]],
    [1,[[3,C.k],[1,0],[1,C.v],[1,0],[1,C.v],[1,0],[2,C.k],[1,0],[9,C.f]]],
    [2,[[4,C.v],[1,0],[1,C.t],[1,0],[6,C.v],[1,0],[1,C.t],[1,0],[1,C.v]]],
    [2,[[2,C.k],[1,0],[4,C.v],[1,0],[2,C.t],[1,0],[4,C.v]]],
    [3,[[6,C.k],[1,0],[1,C.t],[2,C.v],[1,C.t],[1,C.v],[1,C.t]]],
    [2,[[4,C.v],[1,C.t],[1,C.v],[1,C.t],[1,0],[1,C.t],[1,0],[1,C.v]]],
    [0,[]],
    [0,[[1,C.c],[1,0],[8,C.c]]],
    [0,[[6,C.f],[1,0],[2,C.n],[1,0],[2,C.n],[1,0],[1,C.n]]],
    [0,[[1,C.t],[2,C.n],[1,C.t],[1,0],[1,C.t],[2,C.n],[1,C.t]]]];}
  function editor(){return {code:codeLines(),type:{li:0,ci:0,t:0}};}
  // Escena 1: cafetería
  var win={x:Math.round(W*0.55),y:Math.round(H*0.08),w:Math.round(W*0.40),h:Math.round(H*0.40)};
  var peds=[];for(i=0;i<5;i++)peds.push({x:r()*win.w,spd:0.25+r()*0.5,dir:r()<.5?1:-1,h:5+Math.floor(r()*5),col:["#334155","#3b3350","#2f3a4a","#45364a"][Math.floor(r()*4)]});
  var rain=[];for(i=0;i<36;i++)rain.push({x:r()*win.w,y:r()*win.h,len:3+Math.floor(r()*4),spd:1.6+r()*1.8});
  var cafe={W:W,H:H,win:win,deskY:Math.round(H*0.62),peds:peds,rain:rain,
    pend:[{x:Math.round(W*0.5),ph:0},{x:Math.round(W*0.72),ph:2.1},{x:Math.round(W*0.88),ph:4.2}],editor:editor()};
  // Escena 2: barra (pedir café)
  var counter={W:W,H:H,pend:[{x:Math.round(W*0.3),ph:1},{x:Math.round(W*0.55),ph:3},{x:Math.round(W*0.8),ph:5}]};
  // Escena 3: oficina
  var office={W:W,H:H,editor:editor()};
  return {W:W,H:H,cafe:cafe,counter:counter,office:office};
}
function cafeSteamCurl(c,x,baseY,t,amp,colbase){
  for(var i=0;i<6;i++){var yy=baseY-2-i*2,sway=Math.sin(t*0.12-i*0.6)*amp*(i*0.4+1),a=0.22*(1-i/6);
    c.fillStyle=colbase+a+")";c.fillRect(Math.round(x+sway),yy,1,1);}
}
function cafeWindow(c,L,t){
  var w=L.win,gY=w.y+Math.round(w.h*0.62),k;
  c.fillStyle="#0e1420";c.fillRect(w.x-3,w.y-3,w.w+6,w.h+6);   // marco
  c.save();c.beginPath();c.rect(w.x,w.y,w.w,w.h);c.clip();
  var sky=c.createLinearGradient(0,w.y,0,w.y+w.h);sky.addColorStop(0,"#1b2a4a");sky.addColorStop(.6,"#2a2f5a");sky.addColorStop(1,"#3a2b52");
  c.fillStyle=sky;c.fillRect(w.x,w.y,w.w,w.h);
  c.fillStyle="rgba(230,220,255,.45)";c.beginPath();c.arc(w.x+w.w*0.74,w.y+w.h*0.26,Math.max(3,w.h*0.09),0,7);c.fill();
  var bx=w.x;for(k=0;bx<w.x+w.w;k++){var bw=Math.max(4,Math.round(w.w*0.08)),bh=Math.round(w.h*(0.18+((k*37)%6)/12));
    c.fillStyle=k%2?"#18203a":"#141a30";c.fillRect(bx,gY-bh,bw,bh+(w.y+w.h-gY));
    c.fillStyle="rgba(255,205,120,.5)";for(var wy=gY-bh+2;wy<gY-1;wy+=3)for(var wx=bx+1;wx<bx+bw-1;wx+=2)if(((wx*7+wy*5)%4)===0)c.fillRect(wx,wy,1,1);
    bx+=bw+1;}
  c.fillStyle="#0f1424";c.fillRect(w.x,gY,w.w,w.y+w.h-gY);     // calle
  for(k=0;k<L.peds.length;k++){var p=L.peds[k];p.x+=p.spd*p.dir;if(p.x>w.w+6)p.x=-6;if(p.x<-6)p.x=w.w+6;
    var px=w.x+Math.round(p.x),py=gY+3;c.fillStyle=p.col;c.fillRect(px,py-p.h,2,p.h);
    c.fillStyle="#d9c2a8";c.fillRect(px,py-p.h-1,2,1);
    c.fillStyle=p.col;if(((t+k*3)%6)<3)c.fillRect(px,py,1,2);else c.fillRect(px+1,py,1,2);}
  for(k=0;k<L.rain.length;k++){var d=L.rain[k];d.y+=d.spd;d.x-=d.spd*0.3;if(d.y>w.h){d.y=-d.len;d.x=Math.random()*w.w;}if(d.x<0)d.x=w.w;
    c.fillStyle="rgba(150,180,220,.22)";c.fillRect(w.x+Math.round(d.x),w.y+Math.round(d.y),1,d.len);}
  c.restore();
  c.fillStyle="rgba(180,210,255,.04)";c.fillRect(w.x,w.y,Math.round(w.w*0.45),w.h);  // reflejo vidrio
  c.fillStyle="#0e1420";c.fillRect(w.x+Math.round(w.w/2)-1,w.y,2,w.h);c.fillRect(w.x,w.y+Math.round(w.h/2)-1,w.w,2); // crucetas
}
function cafePendant(c,p,H,t){
  var lampY=Math.round(H*0.14),pulse=.75+.25*Math.sin(t*0.08+p.ph);
  c.fillStyle="#2a2630";c.fillRect(p.x,0,1,lampY);
  c.fillStyle="#3a3340";c.fillRect(p.x-3,lampY,7,2);c.fillStyle="#1a1620";c.fillRect(p.x-3,lampY+2,7,1);
  var g=c.createRadialGradient(p.x,lampY+4,0,p.x,lampY+4,14);g.addColorStop(0,"rgba(255,200,120,"+(0.32*pulse)+")");g.addColorStop(1,"rgba(255,200,120,0)");
  c.fillStyle=g;c.fillRect(p.x-14,lampY-10,28,28);
  c.fillStyle="rgba(255,225,160,"+pulse+")";c.fillRect(p.x-1,lampY+2,2,2);
}
function cafeBarista(c,W,H,t){
  var cx=Math.round(W*0.4),cy=Math.round(H*0.44),bob=Math.round(Math.sin(t*0.12));
  c.fillStyle="#2b2029";c.fillRect(Math.round(W*0.3),cy+8,Math.round(W*0.2),Math.round(H*0.1));
  c.fillStyle="#1d1620";c.fillRect(Math.round(W*0.3),cy+8,Math.round(W*0.2),1);
  c.fillStyle="#3a3038";c.fillRect(cx+10,cy+2,8,8);c.fillStyle="#6b7280";c.fillRect(cx+11,cy+4,6,1);
  cafeSteamCurl(c,cx+14,cy+2,t,0.8,"rgba(220,220,230,");
  c.fillStyle="#d9a066";c.fillRect(cx-2,cy-6+bob,4,3);c.fillStyle="#3b2f2a";c.fillRect(cx-2,cy-7+bob,4,1);
  c.fillStyle="#2e7d6b";c.fillRect(cx-3,cy-3+bob,6,6);c.fillStyle="#d9a066";c.fillRect(cx+2,cy-2+bob,1,3);
}
function drawCodeScreen(c,co,t,x,y,w,h){
  var tp=co.type;tp.t++;
  var lineH=4,maxLines=Math.floor(h/lineH);
  // la línea "activa" se escribe; las demás ya están llenas → la pantalla siempre se ve con código
  if(tp.t%2===0){var cur=co.code[tp.li],tot=0;if(cur){var ss=cur[1];for(var s=0;s<ss.length;s++)tot+=ss[s][0];}tp.ci++;if(tp.ci>tot+3){tp.ci=0;tp.li=(tp.li+1)%co.code.length;}}
  var start=Math.max(0,Math.min(tp.li-Math.floor(maxLines*0.6),co.code.length-maxLines));if(start<0)start=0;
  var yy=y;
  for(var li=start;li<start+maxLines&&li<co.code.length;li++){var ln=co.code[li];if(!ln){yy+=lineH;continue;}
    var cx=x+ln[0]*3,segs=ln[1],reveal=(li===tp.li)?tp.ci:99999,used=0;
    for(var si=0;si<segs.length;si++){var sw=segs[si][0],col=segs[si][1],show=Math.max(0,Math.min(sw,reveal-used));
      if(show>0&&col){c.fillStyle=col;c.fillRect(cx,yy,show,1);}cx+=sw+1;used+=sw;if(used>=reveal&&li===tp.li)break;}
    if(li===tp.li&&(tp.t%16<8)){c.fillStyle="#9feaf9";c.fillRect(cx,yy-1,1,3);}
    yy+=lineH;}
}
function cafeLaptop(c,L,t){
  var W=L.W,H=L.H,deskY=L.deskY,lw=Math.round(W*0.22),lh=Math.round(H*0.2),lx=Math.round(W*0.46)-Math.round(lw/2),ly=deskY-lh-2;
  c.fillStyle="#0c0f14";c.fillRect(lx-2,ly-2,lw+4,lh+4);
  c.fillStyle="#0e1420";c.fillRect(lx,ly,lw,lh);
  c.fillStyle="#141b28";c.fillRect(lx,ly,lw,3);
  c.fillStyle="#ff5f56";c.fillRect(lx+1,ly+1,1,1);c.fillStyle="#ffbd2e";c.fillRect(lx+3,ly+1,1,1);c.fillStyle="#27c93f";c.fillRect(lx+5,ly+1,1,1);
  drawCodeScreen(c,L.editor,t,lx+2,ly+5,lw-4,lh-7);
  c.fillStyle="#c7ccd6";c.fillRect(lx-4,deskY-2,lw+8,3);c.fillStyle="#9aa1ad";c.fillRect(lx-4,deskY+1,lw+8,1);
  c.fillStyle="#aeb4be";for(var kx=lx-2;kx<lx+lw+2;kx+=3)c.fillRect(kx,deskY-1,2,1);
  c.fillStyle="rgba(120,180,255,.05)";c.fillRect(lx-4,deskY-2,lw+8,4);
}
function cafeCoffee(c,L,t){
  var W=L.W,deskY=L.deskY,cx=Math.round(W*0.66),cy=deskY-6;
  c.fillStyle="#d8d0c2";c.fillRect(cx-1,cy+7,10,1);
  c.fillStyle="#e8e2d6";c.fillRect(cx,cy,8,7);c.fillStyle="#cfc7b8";c.fillRect(cx,cy+6,8,1);
  c.fillStyle="#5a3a22";c.fillRect(cx+1,cy+1,6,2);
  c.fillStyle="#e8e2d6";c.fillRect(cx+8,cy+2,2,1);c.fillRect(cx+9,cy+2,1,3);c.fillRect(cx+8,cy+4,2,1);
  cafeSteamCurl(c,cx+2,cy,t,1,"rgba(230,225,215,");cafeSteamCurl(c,cx+5,cy,t+7,1,"rgba(230,225,215,");
}
function cafePlant(c,L){
  var W=L.W,deskY=L.deskY,x=Math.round(W*0.33),y=deskY-5;
  c.fillStyle="#b4612f";c.fillRect(x,y+2,5,4);c.fillStyle="#8a4a24";c.fillRect(x,y+2,5,1);
  c.fillStyle="#3f9d5a";c.fillRect(x+1,y-1,1,4);c.fillRect(x+2,y-2,1,5);c.fillRect(x+3,y,1,3);
}
/* ===== Escena 1: cafetería codeando ===== */
function drawCafeScene(c,L,t){
  var W=L.W,H=L.H,deskY=L.deskY,i;
  var wall=c.createLinearGradient(0,0,0,deskY);wall.addColorStop(0,"#241a22");wall.addColorStop(1,"#191320");
  c.fillStyle=wall;c.fillRect(0,0,W,deskY);
  c.fillStyle="rgba(255,255,255,0.015)";for(var yy=6;yy<deskY;yy+=10)c.fillRect(0,yy,W,1);
  cafeWindow(c,L,t);
  c.fillStyle="#2a2029";c.fillRect(Math.round(W*0.06),Math.round(H*0.2),Math.round(W*0.22),2);
  c.fillStyle="#12181a";c.fillRect(Math.round(W*0.1),Math.round(H*0.07),Math.round(W*0.14),Math.round(H*0.12));
  c.fillStyle="rgba(200,230,180,.5)";for(i=0;i<4;i++)c.fillRect(Math.round(W*0.12),Math.round(H*0.09)+i*3,Math.round(W*0.10*(i%2?0.65:1)),1);
  for(i=0;i<L.pend.length;i++)cafePendant(c,L.pend[i],H,t);
  cafeBarista(c,W,H,t);
  var desk=c.createLinearGradient(0,deskY,0,H);desk.addColorStop(0,"#4a3426");desk.addColorStop(1,"#2e2018");
  c.fillStyle=desk;c.fillRect(0,deskY,W,H-deskY);c.fillStyle="rgba(255,220,180,.06)";c.fillRect(0,deskY,W,2);
  cafePlant(c,L);cafeLaptop(c,L,t);cafeCoffee(c,L,t);
}
/* ===== Escena 2: pedir café en la barra (POV frente al mostrador) ===== */
function drawCounterScene(c,o,t){
  var W=o.W,H=o.H,i;
  var wall=c.createLinearGradient(0,0,0,H);wall.addColorStop(0,"#2a1f26");wall.addColorStop(1,"#1a1420");c.fillStyle=wall;c.fillRect(0,0,W,H);
  // pizarra de menú
  var mbw=Math.round(W*0.4),mbx=Math.round(W*0.5)-Math.round(mbw/2),mby=Math.round(H*0.08),mbh=Math.round(H*0.22);
  c.fillStyle="#0e1412";c.fillRect(mbx,mby,mbw,mbh);c.fillStyle="#1d2a24";c.fillRect(mbx,mby,mbw,2);
  c.fillStyle="rgba(230,220,180,.75)";c.fillRect(mbx+6,mby+5,Math.round(mbw*0.5),2);
  for(i=0;i<5;i++){var ly=mby+12+i*4;c.fillStyle="rgba(200,230,190,.5)";c.fillRect(mbx+6,ly,Math.round(mbw*(0.3+0.1*((i*7)%4))),1);c.fillStyle="rgba(255,205,120,.6)";c.fillRect(mbx+mbw-14,ly,6,1);}
  // estante con tazas
  c.fillStyle="#2a2029";c.fillRect(Math.round(W*0.1),Math.round(H*0.12),Math.round(W*0.16),2);
  for(i=0;i<5;i++){c.fillStyle=["#dfe6ee","#e9c7a1","#cfd8e0"][i%3];c.fillRect(Math.round(W*0.1)+4+i*6,Math.round(H*0.12)-3,4,3);}
  for(i=0;i<o.pend.length;i++)cafePendant(c,o.pend[i],H,t);
  // máquina de espresso grande
  var emx=Math.round(W*0.38),emy=Math.round(H*0.42),emw=Math.round(W*0.14),emh=Math.round(H*0.14);
  c.fillStyle="#3a3038";c.fillRect(emx,emy,emw,emh);c.fillStyle="#555b63";c.fillRect(emx+2,emy+3,emw-4,2);
  c.fillStyle="#1a1620";c.fillRect(emx+4,emy+emh-4,4,4);c.fillRect(emx+emw-8,emy+emh-4,4,4);
  cafeSteamCurl(c,emx+6,emy+emh-4,t,0.8,"rgba(220,220,230,");
  // barista grande de frente
  var bx=Math.round(W*0.58),by=Math.round(H*0.5),bob=Math.round(Math.sin(t*0.1)),arm=Math.round(Math.sin(t*0.2)*2);
  c.fillStyle="#d9a066";c.fillRect(bx-4,by-12+bob,8,6);c.fillStyle="#3b2f2a";c.fillRect(bx-4,by-14+bob,8,2);
  c.fillStyle="#1a1420";c.fillRect(bx-2,by-10+bob,1,1);c.fillRect(bx+2,by-10+bob,1,1);
  c.fillStyle="#2e7d6b";c.fillRect(bx-6,by-6+bob,12,12);
  c.fillStyle="#d9a066";c.fillRect(bx-8,by-4+bob+arm,2,6);c.fillRect(bx+6,by-4+bob-arm,2,6);
  // mostrador (primer plano)
  var cy=Math.round(H*0.72);c.fillStyle="#3a2a1e";c.fillRect(0,cy,W,H-cy);c.fillStyle="#54402c";c.fillRect(0,cy,W,3);c.fillStyle="rgba(255,220,180,.06)";c.fillRect(0,cy,W,1);
  // café servido con vapor
  var ccx=Math.round(W*0.62),ccy=cy-7;
  c.fillStyle="#d8d0c2";c.fillRect(ccx-1,ccy+7,10,1);c.fillStyle="#e8e2d6";c.fillRect(ccx,ccy,8,7);c.fillStyle="#5a3a22";c.fillRect(ccx+1,ccy+1,6,2);
  c.fillStyle="#e8e2d6";c.fillRect(ccx+8,ccy+2,2,1);c.fillRect(ccx+9,ccy+2,1,3);c.fillRect(ccx+8,ccy+4,2,1);
  cafeSteamCurl(c,ccx+2,ccy,t,1,"rgba(230,225,215,");cafeSteamCurl(c,ccx+5,ccy,t+6,1,"rgba(230,225,215,");
  // terminal de pago (luz parpadea) + tarro de propinas
  var tx=Math.round(W*0.8),ty=cy-6;c.fillStyle="#22262e";c.fillRect(tx,ty,8,6);c.fillStyle="#0e1420";c.fillRect(tx+1,ty+1,6,3);
  if((t%10)<5){c.fillStyle="#34d399";c.fillRect(tx+6,ty+4,1,1);}
  c.fillStyle="rgba(180,210,230,.5)";c.fillRect(Math.round(W*0.5),cy-5,5,5);c.fillStyle="#caa96b";c.fillRect(Math.round(W*0.5),cy-2,5,2);
}
/* ===== Escena 3: la oficina (monitores + compañeros) ===== */
function drawOfficeScene(c,o,t){
  var W=o.W,H=o.H,deskY=Math.round(H*0.6),i;
  var wall=c.createLinearGradient(0,0,0,deskY);wall.addColorStop(0,"#16202e");wall.addColorStop(1,"#101824");c.fillStyle=wall;c.fillRect(0,0,W,deskY);
  // ventanas de oficina (día)
  var wy=Math.round(H*0.06),wh=Math.round(H*0.22);
  for(i=0;i<4;i++){var wx=Math.round(W*(0.5+i*0.13)),ww=Math.round(W*0.11);
    c.fillStyle="#2b3a52";c.fillRect(wx,wy,ww,wh);
    var sky=c.createLinearGradient(0,wy,0,wy+wh);sky.addColorStop(0,"#6ea0c8");sky.addColorStop(1,"#9fb8cf");c.fillStyle=sky;c.fillRect(wx+1,wy+1,ww-2,wh-2);
    c.fillStyle="#3a4a63";for(var b2=0;b2<ww-2;b2+=3){var bh2=6+((b2*5)%8);c.fillRect(wx+1+b2,wy+wh-bh2,2,bh2);}}
  // pizarra blanca
  c.fillStyle="#e8edf2";c.fillRect(Math.round(W*0.08),Math.round(H*0.12),Math.round(W*0.2),Math.round(H*0.16));
  c.fillStyle="#2b6cb0";for(i=0;i<3;i++)c.fillRect(Math.round(W*0.1),Math.round(H*0.15)+i*4,Math.round(W*0.14*(i%2?0.6:1)),1);
  c.fillStyle="#e05252";c.fillRect(Math.round(W*0.1),Math.round(H*0.24),Math.round(W*0.08),1);
  // compañeros al fondo
  for(i=0;i<3;i++){var dx=Math.round(W*(0.4+i*0.16)),dy=Math.round(H*0.44),bob=Math.round(Math.sin(t*0.15+i));
    c.fillStyle="#1b2636";c.fillRect(dx,dy,Math.round(W*0.1),Math.round(H*0.05));
    c.fillStyle="#0e1726";c.fillRect(dx+Math.round(W*0.02),dy-Math.round(H*0.05),Math.round(W*0.05),Math.round(H*0.05));
    c.fillStyle=(((t/8|0)+i)%2===0)?"#2a6cf0":"#1f4fb0";c.fillRect(dx+Math.round(W*0.025),dy-Math.round(H*0.05)+1,Math.round(W*0.04),Math.round(H*0.04)-1);
    c.fillStyle=["#d9a066","#caa07a","#e0b48a"][i%3];c.fillRect(dx+Math.round(W*0.07),dy-4+bob,3,3);
    c.fillStyle=["#3b5bdb","#2f9e44","#e8590c"][i%3];c.fillRect(dx+Math.round(W*0.065),dy-1+bob,4,4);}
  // escritorio POV
  var desk=c.createLinearGradient(0,deskY,0,H);desk.addColorStop(0,"#2a2f3a");desk.addColorStop(1,"#1b1f28");c.fillStyle=desk;c.fillRect(0,deskY,W,H-deskY);
  c.fillStyle="rgba(180,200,255,.05)";c.fillRect(0,deskY,W,2);
  var mw=Math.round(W*0.2),mh=Math.round(H*0.22),my=deskY-mh-4,m1x=Math.round(W*0.42),m2x=Math.round(W*0.66);
  // monitor 1: código
  c.fillStyle="#0c0f14";c.fillRect(m1x-2,my-2,mw+4,mh+4);c.fillStyle="#0e1420";c.fillRect(m1x,my,mw,mh);c.fillStyle="#141b28";c.fillRect(m1x,my,mw,3);
  drawCodeScreen(c,o.editor,t,m1x+2,my+5,mw-4,mh-7);
  c.fillStyle="#2a2f3a";c.fillRect(m1x+Math.round(mw/2)-2,deskY-4,4,4);
  // monitor 2: dashboard (barras que laten)
  c.fillStyle="#0c0f14";c.fillRect(m2x-2,my-2,mw+4,mh+4);c.fillStyle="#0e1726";c.fillRect(m2x,my,mw,mh);c.fillStyle="#141b28";c.fillRect(m2x,my,mw,3);
  c.fillStyle="#1f2a44";c.fillRect(m2x+2,my+5,mw-4,1);
  for(i=0;i<7;i++){var bw3=Math.round((mw-6)/7),bh3=Math.round((mh-10)*(0.3+0.6*Math.abs(Math.sin(t*0.1+i*0.7))));
    c.fillStyle=["#34d399","#60a5fa","#f472b6"][i%3];c.fillRect(m2x+3+i*bw3,my+mh-3-bh3,bw3-1,bh3);}
  c.fillStyle="#2a2f3a";c.fillRect(m2x+Math.round(mw/2)-2,deskY-4,4,4);
  // teclado, mouse, notas, café
  c.fillStyle="#c7ccd6";c.fillRect(Math.round(W*0.45),deskY+Math.round(H*0.06),Math.round(W*0.2),3);
  c.fillStyle="#9aa1ad";c.fillRect(Math.round(W*0.68),deskY+Math.round(H*0.06),4,5);
  c.fillStyle="#fde68a";c.fillRect(Math.round(W*0.38),deskY+Math.round(H*0.03),5,5);c.fillStyle="#fca5a5";c.fillRect(Math.round(W*0.36),deskY+Math.round(H*0.055),5,5);
  var cfx=Math.round(W*0.8),cfy=deskY+Math.round(H*0.04);c.fillStyle="#e8e2d6";c.fillRect(cfx,cfy,7,6);c.fillStyle="#5a3a22";c.fillRect(cfx+1,cfy+1,5,2);cafeSteamCurl(c,cfx+2,cfy,t,1,"rgba(230,225,215,");
}
/* ===== Director: alterna escenas con fundido a negro ===== */
function drawTitleBg(c,t){
  var L=TBG;if(!L)return;var W=L.W,H=L.H;
  var FADE=16,HOLD=135,period=HOLD+FADE,idx=Math.floor(t/period)%3,local=t%period;
  if(idx===0)drawCafeScene(c,L.cafe,t);else if(idx===1)drawCounterScene(c,L.counter,t);else drawOfficeScene(c,L.office,t);
  c.fillStyle="rgba(0,0,0,.18)";c.fillRect(0,0,W,Math.round(H*0.05));c.fillRect(0,H-Math.round(H*0.05),W,Math.round(H*0.05));
  var black=0;if(local<FADE)black=1-local/FADE;else if(local>=HOLD)black=(local-HOLD)/FADE;
  if(black>0){c.fillStyle="rgba(0,0,0,"+black+")";c.fillRect(0,0,W,H);}
}
function titleRefreshCloud(){
  if(!$("tscreen"))return;
  var cl=(typeof cloudState==="function")?cloudState():{on:false,user:null};
  var locked=(typeof REQUIRE_LOGIN!=="undefined"&&REQUIRE_LOGIN)&&cl.on&&!cl.user;
  var sig=(locked?"L":"U")+":"+(cl.user?cl.user.id:"-");
  if(sig!==TITLE_USER){closeTitle();showTitle();return;}   // cambió sesión/nube: re-render completo (abre/cierra la puerta)
  var el=$("tcloud-wrap");if(el){el.innerHTML=(typeof cloudTitleHtml==="function"?cloudTitleHtml():"");if(typeof cloudTitleBind==="function")cloudTitleBind();}
}
document.addEventListener("keydown",function(e){if($("tscreen")&&!$("cfgm")&&!$("wd")){if(e.key==="Enter"&&document.activeElement===document.body){var b=$("tgo");if(b)b.click()}e.stopImmediatePropagation()}},true);
if(location.hash==="#jugar"){setTimeout(function(){if(ST.lvl===undefined&&!$("modal"))levelPicker(true)},700)}else setTimeout(showTitle,0);
