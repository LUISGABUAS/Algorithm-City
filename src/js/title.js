
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
  d.innerHTML='<div class="tshade"></div><section class="tpanel">'
   +'<div class="tlogo"><canvas id="tico" width="24" height="24"></canvas><h1><span>ALGORITHM</span><b>VILLA</b></h1></div>'
   +'<div class="tterm"><span id="tty"></span><i class="tcar"></i></div>'
   +'<blockquote class="ttip" id="ttip">'+esc(TITLE_TIPS[0])+'</blockquote>'
   +'<div class="tcard"><div class="tch"><canvas id="tcico" width="16" height="16"></canvas><div><b>Tu perfil de dev</b><small>'+(sv?'Partida guardada · sigue donde lo dejaste':'Crea tu personaje para empezar')+'</small></div></div>'
   +(sv?'<div class="tme"><canvas id="tava" width="32" height="48"></canvas><div><b>'+esc(ST.name||"Programador")+'</b><span>'+esc(L.title)+' · Nivel '+L.lv+'</span><span>'+examsDone()+'/8 edificios · '+ST.xp+' XP</span></div></div>'
       +'<button class="pbtn mint tbig" id="tgo">▶ Continuar</button><div class="trow"><button class="pbtn" id="tvest">👕 Vestidores</button><button class="pbtn" id="tnew">Nueva partida</button></div>'
     :'<p class="tp">Aprende Python y algoritmos escribiendo código de verdad, desde cero hasta entrevistas de Big Tech.</p><button class="pbtn mint tbig" id="tgo">▶ Crear mi personaje</button>')
   +'<div id="tconf"></div></div></section>'
   +'<div class="tfoot">💾 Tu progreso se guarda en este navegador · en celular toca el mapa para caminar</div>';
  var ic=$("tico").getContext("2d");ic.imageSmoothingEnabled=false;drawLogoIcon(ic);
  var cc=$("tcico").getContext("2d");cc.imageSmoothingEnabled=false;R(cc,OL,1,2,14,12);R(cc,"#f8fafc",2,3,12,10);R(cc,"#2ec4b6",3,4,4,4);R(cc,"#97a3c7",8,5,5,1);R(cc,"#97a3c7",8,7,4,1);R(cc,"#97a3c7",3,10,10,1);
  if(sv){var ac=$("tava").getContext("2d");ac.imageSmoothingEnabled=false;ac.drawImage(FR.downidle,0,0)}
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
function closeTitle(){document.body.classList.remove("titling");var d=$("tscreen");if(!d)return;clearInterval(d._ty);clearInterval(d._tip);d.remove()}
function afterTitle(){if(ST.lvl===undefined)levelPicker(true);else if(!ST.av)setTimeout(function(){toast("👕 Personaliza tu personaje en los Vestidores de la plaza")},600)}
function resetSave(){ST={xp:0,coins:0,gems:0,streak:0,solved:{},played:{},exam:{},cur:{},since:new Date().toISOString().slice(0,10),att:0,hits:0,bestStreak:0,name:"Programador",lesson:{}};
  save();buildPlayer();hud();if(typeof questUI==="function")questUI()}
function drawLogoIcon(c){R(c,OL,2,3,20,14);R(c,"#0f1a2b",3,4,18,12);R(c,"#5eead4",5,6,2,2);R(c,"#5eead4",7,8,2,2);R(c,"#5eead4",5,10,2,2);R(c,"#fbbf24",11,10,6,2);
  R(c,OL,0,17,24,4);R(c,"#9aa3ad",1,18,22,2);R(c,"#c9ced6",9,18,6,1)}
document.addEventListener("keydown",function(e){if($("tscreen")&&!$("cfgm")&&!$("wd")){if(e.key==="Enter"&&document.activeElement===document.body){var b=$("tgo");if(b)b.click()}e.stopImmediatePropagation()}},true);
if(location.hash==="#jugar"){setTimeout(function(){if(ST.lvl===undefined&&!$("modal"))levelPicker(true)},700)}else setTimeout(showTitle,0);
