
/* ================= REPASO ESPACIADO ================= */
var SRS_DAYS=[1,3,7,14,30,60];
function srsToday(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function srsAddDays(n){var d=new Date();d.setDate(d.getDate()+n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")}
function srsDB(){if(!ST.srs)ST.srs={};return ST.srs}
function srsAdd(id,kind,ref){var db=srsDB();if(!db[id])db[id]={box:0,due:srsAddDays(1),kind:kind,ref:ref,n:0}}
function srsGrade(id,ok){var it=srsDB()[id];if(!it)return;it.n=(it.n||0)+1;if(ok){it.box=Math.min(SRS_DAYS.length-1,it.box+1)}else it.box=0;it.due=srsAddDays(SRS_DAYS[it.box]);it.last=srsToday()}
function srsAddLesson(L){L.steps.forEach(function(s,i){if(s.k==="check"||s.k==="build")srsAdd("L:"+L.id+":"+i,s.k,{lid:L.id,i:i})})}
function srsCase(c,ok){var id="C:"+c._id,db=srsDB();if(!db[id]){db[id]={box:ok?1:0,due:srsAddDays(ok?3:1),kind:"case",ref:{cid:c._id},n:1};return}if(RUN&&RUN.mode!=="review")srsGrade(id,ok)}
function srsDueList(){var db=srsDB(),t=srsToday(),out=[];for(var id in db)if(db[id].due<=t)out.push(id);return out}
function srsNextDue(){var db=srsDB(),best=null;for(var id in db){if(!best||db[id].due<best)best=db[id].due}return best}
function lessonById(id){for(var k in LESSONS){var ls=LESSONS[k];for(var i=0;i<ls.length;i++)if(ls[i].id===id){var p=k.slice(1).split(":");return {L:ls[i],w:+p[0]-1,f:+p[1]}}}return null}
var CASE_IDX=null;
function caseById(id){if(!CASE_IDX){CASE_IDX={};WORLDS.forEach(function(W,w){rooms(w).forEach(function(f){floorData(w,f).rooms.forEach(function(r){r.cases.forEach(function(c){CASE_IDX[c._id]={c:c,r:r}})})})})}return CASE_IDX[id]}
function srsItem(id){var it=srsDB()[id];if(!it)return null;
  if(it.kind==="case"){var x=caseById(it.ref.cid);if(!x)return null;return {id:id,kind:"case",c:x.c,w:x.r.w,f:x.r.f,anim:x.r.diag,title:x.r.con?x.r.nm:("#"+x.r.n+" · "+x.r.nm)}}
  var l=lessonById(it.ref.lid);if(!l)return null;var s=l.L.steps[it.ref.i];if(!s||s.k!==it.kind)return null;
  return {id:id,kind:it.kind,s:s,w:l.w,f:l.f,anim:s.anim,title:l.L.title}}

/* ---------- sesión de repaso ---------- */
var REV=null;
var REVFROM="m";
function openReview(practice){
  if(!REV)REVFROM=document.body.classList.contains("bmode")?"b":"m";
  if(MAPON){MAPON=false;cancelAnimationFrame(RAF)}stop();
  var ids=srsDueList();if(practice){var all=Object.keys(srsDB());ids=shuffle(all).slice(0,8)}
  ids=shuffle(ids).slice(0,12);var items=ids.map(srsItem).filter(Boolean);
  REV={items:items,i:0,good:0,practice:!!practice,from:REVFROM};
  fadeTo(items.length?showReview:reviewEmpty);
}
function reviewEmpty(){
  document.body.classList.remove("mapmode","bmode");var nx=srsNextDue(),total=Object.keys(srsDB()).length;
  $("main").innerHTML='<div class="case result"><div class="cgrid"><div class="cl"><div class="stage"><canvas id="stagec" width="320" height="224"></canvas></div></div><div class="cside">'
   +'<div class="dlg" style="cursor:default"><canvas id="por" width="32" height="32"></canvas><div style="flex:1"><div class="nm">Profe Ada · Centro de Repaso</div><div class="say" id="say"></div></div></div>'
   +'<div class="why" style="text-align:left"><div class="t">📚 CÓMO FUNCIONA</div>Cada clase y cada caso que haces entra aquí. Vuelve mañana, en 3 días, en una semana, en dos y en un mes. Si fallas, vuelve a empezar desde mañana. Así lo aprendido se queda.</div>'
   +'<div class="nextrow" style="justify-content:center"><button class="pbtn" id="b1">◀ Volver</button>'+(total?'<button class="pbtn mint" id="b2">Practicar algo al azar</button>':'')+'</div></div></div></div>';
  var c=$("stagec").getContext("2d");c.setTransform(2,0,0,2,0,0);c.imageSmoothingEnabled=false;drawClass(c,0,0,"bigo",2,{player:true});
  var pc=$("por").getContext("2d");pc.imageSmoothingEnabled=false;pc.drawImage(npcSprite(424242),0,0,32,32,0,1,32,31);
  typeInto($("say"),total?"¡Nada pendiente hoy! Tu próximo repaso es el "+fmtDate(nx)+". Si quieres, practica algo al azar (no cambia tu calendario).":"Todavía no hay nada que repasar. Toma tu primera clase en Villa Fundamentos y aquí aparecerá.");
  $("b1").onclick=reviewExit;if($("b2"))$("b2").onclick=function(){openReview(true)};
}
function fmtDate(s){if(!s)return "—";var p=s.split("-"),m=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];return (+p[2])+" de "+m[+p[1]-1]}
function reviewExit(){REV=null;var w=LASTW;fadeTo(function(){if(REVFROM==="b"&&w>=0)building(w);else campus()})}
function showReview(){
  stop();document.body.classList.remove("mapmode","bmode");cancelAnimationFrame(LRAF);
  var it=REV.items[REV.i],n=REV.items.length;REV.answered=false;REV.runs=0;REV.shown=0;
  var dots="";for(var k=0;k<n;k++)dots+='<i class="'+(REV.items[k].res===true?"ok":REV.items[k].res===false?"bad":(k===REV.i?"cur":""))+'"></i>';
  var coding=it.kind==="build";
  var h='<div class="case lesson'+(coding?' coding':'')+'"><div class="ctop"><button class="pbtn" id="bk">✕ SALIR DEL REPASO</button><div class="ctitle"><small>📚 CENTRO DE REPASO'+(REV.practice?' · PRÁCTICA LIBRE':'')+' · '+(REV.i+1)+' DE '+n+'</small>'+esc(it.title)+'</div><div class="dots">'+dots+'</div></div>'
   +'<div class="cgrid"><div class="cl"><div class="stage"><canvas id="stagec" width="320" height="224"></canvas></div></div><div class="cside">'
   +'<div class="dlg" id="dlg"><canvas id="por" width="32" height="32"></canvas><div style="flex:1;min-width:0"><div class="nm">Profe Ada · Repaso</div><div class="say" id="say"></div></div></div><div id="rbody"></div>'
   +'<div class="nextrow"><button class="pbtn mint" id="rnext" disabled>'+(REV.i===n-1?'VER RESULTADO ▶':'SIGUIENTE ▶')+'</button></div></div></div></div>';
  $("main").innerHTML=h;
  var pc=$("por").getContext("2d");pc.imageSmoothingEnabled=false;pc.drawImage(npcSprite(424242),0,0,32,32,0,1,32,31);
  var c=$("stagec").getContext("2d"),t0=performance.now(),anim=["hash","twoptr","window","bsearch","stack","graph","tree","grid","list","heap","intervals","code","git","interview"].indexOf(it.anim)>=0?null:it.anim;
  (function frame(now){if(!REV||!$("stagec"))return;c.setTransform(2,0,0,2,0,0);c.imageSmoothingEnabled=false;
    if(anim)drawClass(c,it.w,it.f,anim,(now-t0)/1000,{player:true});else{var r={w:it.w,f:it.f,diag:it.anim||"code",npc:{seed:424242},cases:[],id:"rev"};drawRoom(c,r,{big:true,player:true,mood:REV.answered?(it.res?"ok":"bad"):"new"})}
    LRAF=requestAnimationFrame(frame)})(t0);
  var nx=$("rnext"),body=$("rbody");
  nx.onclick=function(){if(nx.disabled)return;if(REV.i<n-1){REV.i++;showReview()}else reviewResult()};
  $("bk").onclick=function(){cancelAnimationFrame(LRAF);save();reviewExit()};
  function grade(ok){if(REV.answered)return;REV.answered=true;it.res=ok;if(ok)REV.good++;if(!REV.practice)srsGrade(it.id,ok);save();hud();nx.disabled=false;
    var b=srsDB()[it.id];typeInto($("say"),(ok?"¡Bien! ":"No pasa nada, para eso repasamos. ")+(REV.practice?"":"Volverá el "+fmtDate(b.due)+"."))}
  if(it.kind==="case"||it.kind==="check"){
    var q=it.kind==="case"?it.c:{q:it.s.q,opts:it.s.opts,ok:it.s.ok,why:it.s.why};
    var line=it.kind==="case"?(q.t==="pat"?"¿Qué patrón resuelve esto? «"+q.q+"»":q.t==="cx"?"«"+(q.nm||"")+"»: "+q.q:q.q):q.q;
    body.innerHTML=(q.code?'<pre class="code">'+hl(q.code)+'</pre>':'')+'<div class="opts" id="ropts">'+q.opts.map(function(o,i){return '<button class="opt" data-i="'+i+'"><span class="k">'+"ABCD"[i]+'</span><span>'+esc(o)+'</span></button>'}).join("")+'</div><div id="rwhy"></div>';
    typeInto($("say"),line);
    [].forEach.call(body.querySelectorAll(".opt"),function(bt){bt.onclick=function(){if(REV.answered)return;var i=+bt.dataset.i,ok=i===q.ok;finishType();
      [].forEach.call(body.querySelectorAll(".opt"),function(x){var j=+x.dataset.i;x.disabled=true;if(j===q.ok)x.classList.add("ok");else if(j===i)x.classList.add("bad")});
      $("rwhy").innerHTML='<div class="why"><div class="t">📘 EXPLICACIÓN</div>'+esc(q.why)+'</div>';grade(ok)}});
  }else{
    var s=it.s;
    body.innerHTML='<div class="goal"><span>🎯 ESCRÍBELO DE MEMORIA</span>'+esc(s.goal)+'</div><div id="edhost"></div><div class="edbar"><button class="pbtn mint" id="run">▶ EJECUTAR</button><button class="pbtn" id="hint" disabled>💡 PISTA (tras 2 intentos)</button><button class="pbtn" id="giveup" hidden>Me rindo: ver solución</button></div><div id="hints"></div><div id="results"></div>';
    typeInto($("say"),"Repaso de código: "+s.text.split(".")[0]+". Escríbelo sin mirar; si te atoras, después de 2 intentos puedes pedir pista.");
    var start=s.starter&&!s.carry?s.starter:(s.solution.split("\n")[0]+"\n    pass\n");
    var ed=mountEditor($("edhost"),start,function(){},run),HS=s.hints||[];
    function hb(){var b=$("hint");b.disabled=REV.runs<2||REV.shown>=HS.length;b.textContent=REV.runs<2?"💡 PISTA (tras 2 intentos)":(REV.shown<HS.length?"💡 PISTA ("+(REV.shown+1)+"/"+HS.length+")":"💡 SIN MÁS PISTAS");$("giveup").hidden=REV.runs<3}
    $("hint").onclick=function(){REV.shown++;$("hints").innerHTML=HS.slice(0,REV.shown).map(function(h,k){return '<div class="hintb"><b>Pista '+(k+1)+'</b> '+esc(h)+'</div>'}).join("");hb()};
    $("giveup").onclick=function(){$("results").innerHTML='<div class="why"><div class="t">👀 SOLUCIÓN</div><pre class="code">'+hl(s.solution)+'</pre></div>';grade(false)};
    $("run").onclick=run;
    function run(){REV.runs++;hb();var r=MiniPy.runTests(ed.get(),s.tests),h2="";ed.mark(r.error?r.error.line:0);
      if(r.error)h2='<div class="res bad"><div class="t">💥 ERROR</div><div class="errl">'+esc(r.error.text)+'</div>'+errTip(r.error)+'</div>';
      else h2=testsHTML(r);
      if(r.out&&r.error)h2+='<div class="console"><div class="t">🖥️ SALIDA</div><pre>'+esc(r.out)+'</pre></div>';
      $("results").innerHTML=h2;if(r.ok&&!REV.answered)grade(REV.shown===0)}
    hb();
  }
  window.scrollTo(0,0);
}
function reviewResult(){
  cancelAnimationFrame(LRAF);var n=REV.items.length,g=REV.good,xp=REV.practice?0:g*8;ST.xp+=xp;if(!REV.practice){ST.revDays=ST.revDays||{};ST.revDays[srsToday()]=1}save();hud();
  var left=srsDueList().length;
  $("main").innerHTML='<div class="case result"><div class="cgrid"><div class="cl"><div class="stage"><canvas id="stagec" width="320" height="224"></canvas></div></div><div class="cside">'
   +'<div class="dlg" style="cursor:default"><canvas id="por" width="32" height="32"></canvas><div style="flex:1"><div class="nm">Profe Ada · Repaso</div><div class="say" id="say"></div></div></div>'
   +'<div class="big">'+g+'/'+n+'</div><div class="rw">'+(xp?'<span class="stat">+<b>'+xp+'</b> XP</span>':'')+'<span class="stat">Pendientes: <b>'+left+'</b></span><span class="stat">Próximo: <b>'+fmtDate(srsNextDue())+'</b></span></div>'
   +'<div class="nextrow" style="justify-content:center"><button class="pbtn" id="b1">◀ Volver</button>'+(left?'<button class="pbtn mint" id="b2">Seguir repasando ▶</button>':'')+'</div></div></div></div>';
  var c=$("stagec").getContext("2d");c.setTransform(2,0,0,2,0,0);c.imageSmoothingEnabled=false;drawClass(c,0,0,"bigo",2,{player:true});
  var pc=$("por").getContext("2d");pc.imageSmoothingEnabled=false;pc.drawImage(npcSprite(424242),0,0,32,32,0,1,32,31);
  typeInto($("say"),g===n?"¡Perfecto! Todo sigue fresco en tu memoria.":g>=n/2?"¡Bien! Lo que fallaste vuelve mañana.":"Hoy costó, y eso es normal: repasar justo cuando empiezas a olvidar es lo que fija el aprendizaje.");
  $("b1").onclick=reviewExit;if($("b2"))$("b2").onclick=function(){openReview(false)};
}
function srsHud(){var el=$("revn");if(!el)return;var n=srsDueList().length;el.textContent=n;var ch=$("revchip");if(ch)ch.classList.toggle("due",n>0)}

var _qiSRS=questInfo;questInfo=function(){var q=_qiSRS(),n=srsDueList().length;if(n)q.say+=" Además tienes "+n+" repaso"+(n>1?"s":"")+" pendiente"+(n>1?"s":"")+": toca 📚 REPASO arriba.";return q};
window.__SRS={db:srsDB,due:srsDueList};
