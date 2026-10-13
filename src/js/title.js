
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
  var r=rng(70707), hz=Math.round(H*0.60), i;
  var neon=["#22d3ee","#e879f9","#5eead4","#60a5fa","#f472b6","#38bdf8","#a78bfa"];
  var stars=[],ns=Math.round(W*H/650);
  for(i=0;i<ns;i++)stars.push([Math.floor(r()*W),Math.floor(r()*hz),r()<.15?2:1,.4+r()*.6]);
  function row(baseY,minH,maxH,wmin,wmax,pal,lit,o){
    o=o||{};var arr=[],x=-Math.floor(r()*10);
    while(x<W+6){
      var w=wmin+Math.floor(r()*Math.max(1,wmax-wmin)),h=minH+Math.floor(r()*Math.max(1,maxH-minH));
      var b={x:x,w:w,h:h,top:baseY-h,c:pal[Math.floor(r()*pal.length)],wc:lit[Math.floor(r()*lit.length)],
             step:(o.step&&r()<.45),ant:(o.ant&&r()<.5),bill:(o.bill&&r()<.22),bc:neon[Math.floor(r()*neon.length)],
             search:(o.search&&r()<.14),ph:r()*6.28,blink:r()*6.28,seed:Math.floor(r()*9999)};
      b.beacon=b.ant&&r()<.75;
      arr.push(b); x+=w+1+Math.floor(r()*4);
    }
    return arr;
  }
  var back =row(hz+6 ,Math.round(H*0.10),Math.round(H*0.30),Math.max(8,Math.round(W*0.024)),Math.round(W*0.055),["#0a1026","#0c1430","#091022"],["#1b2a4a","#24324f"],{});
  var mid  =row(hz+12,Math.round(H*0.22),Math.round(H*0.52),Math.max(11,Math.round(W*0.03)),Math.round(W*0.07),["#0e1a34","#0c1730","#111d3c","#131a38"],neon,{step:1,ant:1,bill:1,search:1});
  var front=row(H+2  ,Math.round(H*0.10),Math.round(H*0.26),Math.round(W*0.07),Math.round(W*0.14),["#0b1226","#091020","#0c1430"],["#fbbf24","#fcd34d","#22d3ee","#fb923c"],{step:1});
  var ships=[];for(i=0;i<6;i++)ships.push({lane:Math.round(H*(0.10+0.055*i)),spd:0.25+r()*0.55,dir:r()<.5?1:-1,off:r()*W,col:neon[Math.floor(r()*neon.length)],len:2+Math.floor(r()*3)});
  return {W:W,H:H,hz:hz,neon:neon,stars:stars,back:back,mid:mid,front:front,ships:ships,
          shoot:{life:999,next:60+Math.floor(r()*120),x:0,y:0,vx:0,vy:0},
          blimp:{x:-60,y:Math.round(H*0.13),spd:0.14}};
}
function tbgWindows(c,b,t){
  for(var yy=b.top+2;yy<b.top+b.h-2;yy+=4){
    for(var xx=b.x+2;xx<b.x+b.w-1;xx+=3){
      var base=((xx*19+yy*13+b.seed)>>1)%5;
      var change=(((xx*7+yy*5+((t/18)|0))*131)&0x7fffffff)%23;
      if(base!==0&&change>3){c.globalAlpha=.85;c.fillStyle=b.wc;c.fillRect(xx,yy,1,2);}
    }
  }
  c.globalAlpha=1;
}
function tbgBuilding(c,b,t){
  c.fillStyle=b.c;c.fillRect(b.x,b.top,b.w,b.h);
  var tx=b.x,tw=b.w,ty=b.top;
  if(b.step){tw=Math.max(3,Math.round(b.w*0.55));tx=b.x+Math.round((b.w-tw)/2);ty=b.top-Math.round(b.h*0.16);c.fillStyle=b.c;c.fillRect(tx,ty,tw,b.top-ty+2);}
  c.globalAlpha=.4;c.fillStyle=b.wc;c.fillRect(tx,ty,tw,1);c.globalAlpha=1;
  tbgWindows(c,b,t);
  if(b.ant){var ax=b.x+Math.floor(b.w/2),ah=Math.round(b.h*0.16)+2;c.fillStyle="#2a3a5a";c.fillRect(ax,ty-ah,1,ah);
    if(b.beacon&&Math.sin(t*0.2+b.blink)>0.25){c.fillStyle="#ff5b5b";c.fillRect(ax,ty-ah-1,1,2);}}
  if(b.bill){var bw=Math.min(b.w-2,7),bx=b.x+2,by=b.top+3,pulse=.45+.55*Math.sin(t*0.12+b.ph);
    c.globalAlpha=pulse;c.fillStyle=b.bc;c.fillRect(bx,by,bw,4);c.globalAlpha=1;
    c.fillStyle="#0b1020";for(var sx=bx+1;sx<bx+bw-1;sx+=2)c.fillRect(sx,by+1,1,2);}
}
function tbgSearch(c,b,t){
  if(!b.search)return;
  var ox=b.x+Math.floor(b.w/2),oy=b.top,ang=-1.35+0.55*Math.sin(t*0.045+b.ph),len=Math.round(oy*1.05),w2=7;
  var ex=ox+Math.cos(ang)*len,ey=oy+Math.sin(ang)*len;
  c.fillStyle="rgba(190,225,255,.10)";
  c.beginPath();c.moveTo(ox,oy);c.lineTo(ex-Math.sin(ang)*w2,ey+Math.cos(ang)*w2);c.lineTo(ex+Math.sin(ang)*w2,ey-Math.cos(ang)*w2);c.closePath();c.fill();
  c.fillStyle="#dbeafe";c.fillRect(ox-1,oy-1,2,2);
}
function drawTitleBg(c,t){
  var L=TBG;if(!L)return;var W=L.W,H=L.H,hz=L.hz,i;
  var g=c.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"#05081a");g.addColorStop(.4,"#140f38");g.addColorStop(.6,"#301a4e");g.addColorStop(.62,"#47205e");g.addColorStop(.8,"#1b1030");g.addColorStop(1,"#0a0820");
  c.fillStyle=g;c.fillRect(0,0,W,H);
  for(i=0;i<L.stars.length;i++){var s=L.stars[i];c.globalAlpha=s[3]*(.35+.65*Math.abs(Math.sin(t*.05+s[0])));c.fillStyle="#cfe8ff";c.fillRect(s[0],s[1],s[2],s[2]);}
  c.globalAlpha=1;
  var sh=L.shoot;sh.life++;
  if(sh.life>sh.next){sh.life=0;sh.next=90+Math.floor(Math.random()*170);sh.x=Math.round(W*(0.25+Math.random()*0.55));sh.y=Math.round(H*0.06+Math.random()*hz*0.35);sh.vx=-(2+Math.random()*2);sh.vy=(0.7+Math.random());}
  if(sh.life<18){var px=sh.x+sh.vx*sh.life,py=sh.y+sh.vy*sh.life,a=1-sh.life/18;c.globalAlpha=a;c.fillStyle="#fff";c.fillRect(px,py,2,2);c.globalAlpha=a*.5;c.fillRect(px-sh.vx,py-sh.vy,2,1);c.fillRect(Math.round(px-sh.vx*2),Math.round(py-sh.vy*2),1,1);c.globalAlpha=1;}
  var mx=Math.round(W*0.82),my=Math.round(H*0.2),mr=Math.max(6,Math.round(Math.min(W,H)*0.07));
  var mg=c.createRadialGradient(mx,my,0,mx,my,mr*3.2);mg.addColorStop(0,"rgba(190,225,255,.4)");mg.addColorStop(1,"rgba(190,225,255,0)");
  c.fillStyle=mg;c.fillRect(mx-mr*4,my-mr*4,mr*8,mr*8);
  c.fillStyle="#e2edff";c.beginPath();c.arc(mx,my,mr,0,7);c.fill();
  c.fillStyle="#cdd9ee";c.beginPath();c.arc(mx+mr*0.35,my-mr*0.25,mr*0.18,0,7);c.fill();c.beginPath();c.arc(mx-mr*0.3,my+mr*0.3,mr*0.12,0,7);c.fill();
  var bl=L.blimp;bl.x+=bl.spd;if(bl.x>W+50)bl.x=-50;var bx=Math.round(bl.x),by=bl.y;
  c.fillStyle="#1a2440";c.fillRect(bx,by,24,6);c.fillRect(bx+3,by-1,18,1);c.fillRect(bx+3,by+6,18,1);
  c.fillStyle="#0e1630";c.fillRect(bx+9,by+7,6,2);
  c.globalAlpha=.5+.5*Math.sin(t*0.15);c.fillStyle="#22d3ee";c.fillRect(bx+5,by+2,14,2);c.globalAlpha=1;
  if((t%8)<4){c.fillStyle="#ff5b5b";c.fillRect(bx,by+2,1,1);}
  var hgl=c.createLinearGradient(0,hz-28,0,hz+12);hgl.addColorStop(0,"rgba(150,70,200,0)");hgl.addColorStop(1,"rgba(190,90,215,.28)");c.fillStyle=hgl;c.fillRect(0,hz-28,W,40);
  for(i=0;i<L.back.length;i++)tbgBuilding(c,L.back[i],t);
  for(i=0;i<L.mid.length;i++)tbgBuilding(c,L.mid[i],t);
  for(i=0;i<L.mid.length;i++)tbgSearch(c,L.mid[i],t);
  for(i=0;i<L.ships.length;i++){var v=L.ships[i],span=W+40,p=(t*v.spd+v.off)%span,px=v.dir>0?p-20:W+20-p,py=v.lane;
    c.fillStyle=v.col;c.fillRect(px,py,v.len,1);
    c.globalAlpha=.4;c.fillRect(px-v.dir*v.len,py,v.len,1);c.globalAlpha=.18;c.fillRect(px-v.dir*v.len*2,py,v.len,1);c.globalAlpha=1;
    if(((t+i*5)%6)<3){c.fillStyle="#fff";c.fillRect(v.dir>0?px+v.len-1:px,py,1,1);}}
  var fg=c.createLinearGradient(0,H-Math.round(H*0.2),0,H);fg.addColorStop(0,"rgba(120,40,140,0)");fg.addColorStop(1,"rgba(95,32,122,.55)");c.fillStyle=fg;c.fillRect(0,H-Math.round(H*0.2),W,Math.round(H*0.2));
  for(i=0;i<L.front.length;i++)tbgBuilding(c,L.front[i],t);
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
