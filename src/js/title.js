
/* ================= PANTALLA DE INICIO ================= */
var TITLE_TIPS=[
 "Lee el enunciado dos veces: las restricciones te dicen qué complejidad necesitas.",
 "Si tu solución tiene dos ciclos anidados, pregúntate si un diccionario te ahorra uno.",
 "Antes de programar, resuelve un ejemplo a mano en papel.",
 "Los casos límite ganan entrevistas: lista vacía, un elemento, números repetidos.",
 "Di en voz alta lo que piensas: en la entrevista también califican tu razonamiento.",
 "Equivocarte en el editor es gratis. Ejecuta seguido."];
function hasSave(){return !!(ST.av||ST.xp>0||Object.keys(ST.lesson||{}).length||Object.keys(ST.solved||{}).length)}
function showTitle(){if($("tscreen"))return;HELD=[];
  var d=document.createElement("div");d.id="tscreen";d.className="title";document.body.appendChild(d);document.body.classList.add("titling");
  var L=levelInfo(),sv=hasSave(),tip=0;
  d.innerHTML='<canvas id="tbg"></canvas><div class="tshade"></div><section class="tpanel">'
   +'<div class="tlogo"><canvas id="tico" width="24" height="24"></canvas><h1><span>ALGORITHM</span><b>CITY</b></h1></div>'
   +'<div class="tterm"><span id="tty"></span><i class="tcar"></i></div>'
   +'<blockquote class="ttip" id="ttip">'+esc(TITLE_TIPS[0])+'</blockquote>'
   +'<div class="tcard"><div class="tch"><canvas id="tcico" width="16" height="16"></canvas><div><b>Tu perfil de dev</b><small>'+(sv?'Partida guardada · sigue donde lo dejaste':'Crea tu personaje para empezar')+'</small></div></div>'
   +'<div id="tcloud-wrap">'+(typeof cloudTitleHtml==="function"?cloudTitleHtml():"")+'</div>'
   +(sv?'<div class="tme"><canvas id="tava" width="32" height="48"></canvas><div><b>'+esc(ST.name||"Programador")+'</b><span>'+esc(L.title)+' · Nivel '+L.lv+'</span><span>'+examsDone()+'/8 edificios · '+ST.xp+' XP</span></div></div>'
       +'<button class="pbtn mint tbig" id="tgo">▶ Continuar</button><div class="trow"><button class="pbtn" id="tvest">👕 Vestidores</button><button class="pbtn" id="tnew">Nueva partida</button></div>'
     :'<p class="tp">Aprende Python y algoritmos escribiendo código de verdad, desde cero hasta entrevistas de Big Tech.</p><button class="pbtn mint tbig" id="tgo">▶ Crear mi personaje</button>')
   +'<div id="tconf"></div></div></section>'
   +'<div class="tfoot">💾 Tu progreso se guarda en este navegador'+((typeof cloudEnabled==="function"&&cloudEnabled())?' · y en la nube si inicias sesión':'')+' · en celular toca el mapa para caminar</div>';
  var ic=$("tico").getContext("2d");ic.imageSmoothingEnabled=false;drawLogoIcon(ic);
  var cc=$("tcico").getContext("2d");cc.imageSmoothingEnabled=false;R(cc,OL,1,2,14,12);R(cc,"#f8fafc",2,3,12,10);R(cc,"#2ec4b6",3,4,4,4);R(cc,"#97a3c7",8,5,5,1);R(cc,"#97a3c7",8,7,4,1);R(cc,"#97a3c7",3,10,10,1);
  if(sv){var ac=$("tava").getContext("2d");ac.imageSmoothingEnabled=false;ac.drawImage(FR.downidle,0,0)}
  // fondo: ciudad futurista en pixel art (dibujada por código, animada)
  (function(){var bg=$("tbg");if(!bg)return;var bgc=bg.getContext("2d");bgc.imageSmoothingEnabled=false;var bt=0;
    function sizeBg(){var sc=4;bg.width=Math.max(160,Math.ceil(window.innerWidth/sc));bg.height=Math.max(120,Math.ceil(window.innerHeight/sc));TBG=titleBgLayout(bg.width,bg.height);drawTitleBg(bgc,bt)}
    sizeBg();d._bgresize=function(){sizeBg()};window.addEventListener("resize",d._bgresize);
    d._bg=setInterval(function(){if(!$("tbg")){clearInterval(d._bg);return}bt++;drawTitleBg(bgc,bt)},90)})();
  if(typeof cloudTitleBind==="function")cloudTitleBind();
  // terminal que escribe
  var lines=[">>> two_sum([2, 7, 11, 15], 9)","[0, 1]",">>> fizz_buzz(5)","['1', '2', 'Fizz', '4', 'Buzz']",">>> \"listo\" in entrevistas","True"],li=0,ci=0;
  d._ty=setInterval(function(){var el=$("tty");if(!el){clearInterval(d._ty);return}var s=lines[li];ci++;el.textContent=s.slice(0,ci);el.className=s.indexOf(">>>")===0?"in":"outl";
    if(ci>s.length+12){ci=0;li=(li+1)%lines.length}},70);
  d._tip=setInterval(function(){var el=$("ttip");if(!el){clearInterval(d._tip);return}tip=(tip+1)%TITLE_TIPS.length;el.classList.add("fade");setTimeout(function(){el.textContent=TITLE_TIPS[tip];el.classList.remove("fade")},300)},6500);
  $("tgo").onclick=function(){if(sv){closeTitle();afterTitle()}else{closeTitle();openWardrobe("new")}};
  if($("tvest"))$("tvest").onclick=function(){closeTitle();openWardrobe("edit")};
  if($("tnew"))$("tnew").onclick=function(){$("tconf").innerHTML='<div class="tconf"><b>¿Empezar de cero?</b><span>Se borra tu progreso de este navegador: XP, clases, salas y repasos.</span><div class="trow"><button class="pbtn" id="tno">Cancelar</button><button class="pbtn red" id="tyes">Sí, borrar y empezar</button></div></div>';
    $("tno").onclick=function(){$("tconf").innerHTML=""};$("tyes").onclick=function(){resetSave();closeTitle();openWardrobe("new")}};
  setTimeout(function(){var b=$("tgo");if(b)b.focus()},50)}
function closeTitle(){document.body.classList.remove("titling");var d=$("tscreen");if(!d)return;clearInterval(d._ty);clearInterval(d._tip);clearInterval(d._bg);if(d._bgresize)window.removeEventListener("resize",d._bgresize);d.remove()}
function afterTitle(){if(ST.lvl===undefined)levelPicker(true);else if(!ST.av)setTimeout(function(){toast("👕 Personaliza tu personaje en los Vestidores de la plaza")},600)}
function resetSave(){ST={xp:0,coins:0,gems:0,streak:0,solved:{},played:{},exam:{},cur:{},since:new Date().toISOString().slice(0,10),att:0,hits:0,bestStreak:0,name:"Programador",lesson:{}};
  save();buildPlayer();hud();if(typeof questUI==="function")questUI()}
function drawLogoIcon(c){
  // emblema: skyline neón dentro de corchetes de código  [  city  ]
  R(c,OL,2,2,20,20);R(c,"#0b1226",3,3,18,18);R(c,"#17254f",3,3,18,9);R(c,"#dbeafe",17,5,2,2);
  R(c,"#22d3ee",6,11,3,8);R(c,"#5eead4",10,7,4,12);R(c,"#c084fc",15,10,3,9);
  R(c,"#fbbf24",11,5,1,2);R(c,"#ff5b5b",11,4,1,1);
  R(c,OL,6,13,1,1);R(c,OL,7,16,1,1);R(c,OL,11,9,1,1);R(c,OL,12,12,1,1);R(c,OL,11,15,1,1);R(c,OL,16,12,1,1);R(c,OL,16,15,1,1);
  R(c,"#1e2a4a",3,19,18,1);
  R(c,"#5eead4",3,7,1,10);R(c,"#5eead4",3,7,2,1);R(c,"#5eead4",3,16,2,1);
  R(c,"#5eead4",20,7,1,10);R(c,"#5eead4",19,7,2,1);R(c,"#5eead4",19,16,2,1);
}

/* ---------- fondo: ciudad futurista en pixel art ---------- */
var TBG=null;
function titleBgLayout(W,H){
  function rng(seed){var s=seed>>>0||1;return function(){s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
  var r=rng(20261012), hz=Math.round(H*0.62);
  var stars=[],ns=Math.round(W*H/900);
  for(var i=0;i<ns;i++)stars.push([Math.floor(r()*W),Math.floor(r()*hz),r()<.18?2:1,.4+r()*.6]);
  function row(baseY,minH,maxH,wmin,wmax,pal,lit,density){
    var arr=[],x=-Math.floor(r()*8);
    while(x<W+4){var w=wmin+Math.floor(r()*Math.max(1,wmax-wmin)),h=minH+Math.floor(r()*Math.max(1,maxH-minH));
      arr.push({x:x,w:w,h:h,top:baseY-h,c:pal[Math.floor(r()*pal.length)],wc:lit[Math.floor(r()*lit.length)],
                spire:r()<.28,sign:r()<density,ph:r()*6});
      x+=w+1+Math.floor(r()*3);}
    return arr;
  }
  var back =row(hz+6 ,Math.round(H*0.12),Math.round(H*0.34),Math.max(9,Math.round(W*0.028)),Math.round(W*0.06),["#0a1124","#0c1430","#091022"],["#20304f"],0);
  var mid  =row(hz+12,Math.round(H*0.20),Math.round(H*0.50),Math.max(11,Math.round(W*0.034)),Math.round(W*0.075),["#101a33","#0d1730","#121d3c"],["#22d3ee","#e879f9","#5eead4","#60a5fa"],.3);
  var front=row(H+2  ,Math.round(H*0.10),Math.round(H*0.24),Math.round(W*0.08),Math.round(W*0.15),["#0c1328","#0a1020"],["#fbbf24","#fcd34d","#22d3ee"],.18);
  return {W:W,H:H,hz:hz,stars:stars,back:back,mid:mid,front:front};
}
function tbgRow(c,arr,t){
  for(var i=0;i<arr.length;i++){var b=arr[i];
    c.fillStyle=b.c;c.fillRect(b.x,b.top,b.w,b.h);
    for(var yy=b.top+2;yy<b.top+b.h-2;yy+=4){
      for(var xx=b.x+2;xx<b.x+b.w-1;xx+=3){
        var on=((xx*31+yy*17+b.x*7)>>2)%5!==0;
        var flick=(((xx+yy+(t>>2))*13)%41)===0;
        if(on&&!flick){c.globalAlpha=.85;c.fillStyle=b.wc;c.fillRect(xx,yy,1,2);}
      }
    }
    c.globalAlpha=1;
    if(b.spire){var sx=b.x+Math.floor(b.w/2),sh=Math.round(b.h*0.14);c.fillStyle=b.wc;c.fillRect(sx,b.top-sh,1,sh);
      if(Math.sin(t*.14+b.ph)>.4){c.fillStyle="#ff5b5b";c.fillRect(sx,b.top-sh-1,1,1);}}
    if(b.sign){c.globalAlpha=.55+.45*Math.sin(t*.1+b.ph);c.fillStyle=b.wc;c.fillRect(b.x+2,b.top+3,Math.min(b.w-4,10),3);c.globalAlpha=1;}
  }
}
function drawTitleBg(c,t){
  var L=TBG;if(!L)return;var W=L.W,H=L.H,hz=L.hz,i;
  var g=c.createLinearGradient(0,0,0,H);
  g.addColorStop(0,"#070b1e");g.addColorStop(.45,"#1a1140");g.addColorStop(.68,"#3a1a55");g.addColorStop(.705,"#5a2566");g.addColorStop(1,"#120a22");
  c.fillStyle=g;c.fillRect(0,0,W,H);
  for(i=0;i<L.stars.length;i++){var s=L.stars[i];c.globalAlpha=s[3]*(.4+.6*Math.abs(Math.sin(t*.05+s[0])));c.fillStyle="#cfe8ff";c.fillRect(s[0],s[1],s[2],s[2]);}
  c.globalAlpha=1;
  var mx=Math.round(W*0.8),my=Math.round(H*0.2),mr=Math.max(5,Math.round(Math.min(W,H)*0.06));
  var mg=c.createRadialGradient(mx,my,0,mx,my,mr*3);mg.addColorStop(0,"rgba(190,225,255,.45)");mg.addColorStop(1,"rgba(190,225,255,0)");
  c.fillStyle=mg;c.fillRect(mx-mr*3,my-mr*3,mr*6,mr*6);
  c.fillStyle="#e2edff";c.beginPath();c.arc(mx,my,mr,0,7);c.fill();
  var hgl=c.createLinearGradient(0,hz-24,0,hz+16);hgl.addColorStop(0,"rgba(34,211,238,0)");hgl.addColorStop(1,"rgba(34,211,238,.22)");
  c.fillStyle=hgl;c.fillRect(0,hz-24,W,40);
  tbgRow(c,L.back,t); tbgRow(c,L.mid,t);
  c.fillStyle="#080c1a";c.fillRect(0,H-Math.max(2,Math.round(H*0.015)),W,Math.round(H*0.015)+2);
  tbgRow(c,L.front,t);
  for(var k=0;k<3;k++){var sp=(k+1)*0.3,cx=((t*sp+k*W/3)%(W+40))-20,cy=Math.round(H*0.16+k*H*0.07);
    c.fillStyle=k%2?"#fca5a5":"#fde68a";c.fillRect(cx,cy,3,1);c.globalAlpha=.4;c.fillRect(cx-3,cy,2,1);c.globalAlpha=1;}
}
function titleRefreshCloud(){var el=$("tcloud-wrap");if(!el)return;el.innerHTML=(typeof cloudTitleHtml==="function"?cloudTitleHtml():"");if(typeof cloudTitleBind==="function")cloudTitleBind();}
document.addEventListener("keydown",function(e){if($("tscreen")&&!$("cfgm")&&!$("wd")){if(e.key==="Enter"&&document.activeElement===document.body){var b=$("tgo");if(b)b.click()}e.stopImmediatePropagation()}},true);
if(location.hash==="#jugar"){setTimeout(function(){if(ST.lvl===undefined&&!$("modal"))levelPicker(true)},700)}else setTimeout(showTitle,0);
