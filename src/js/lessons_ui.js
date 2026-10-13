
/* ================= CLASES: interfaz ================= */
var LES=null,LRAF=0;
function floorLessons(w,f){return LESSONS[key(w,f)]||[]}
function floorLessonsDone(w,f){return floorLessons(w,f).every(function(l){return ST.lesson[l.id]})}
function nextLessonIdx(w,f){var ls=floorLessons(w,f);for(var i=0;i<ls.length;i++)if(!ST.lesson[ls[i].id])return i;return -1}
function saveCode(id,code){if(!ST.code)ST.code={};ST.code[id]=code;clearTimeout(saveCode._t);saveCode._t=setTimeout(save,400)}

/* ---- animación extra: terminal ---- */
var _baseAnim=boardAnim;
boardAnim=function(c,a,X,Y,W,H,t){
  if(a==="terminal"){R(c,"#0f1a2b",X+2,Y+2,W-4,H-4);R(c,"#1f2a44",X+2,Y+2,W-4,6);R(c,"#e04b4b",X+5,Y+4,2,2);R(c,"#f4a020",X+9,Y+4,2,2);R(c,"#2a9d6f",X+13,Y+4,2,2);
    var L=["> print(\"hola\")","hola","> x = 2 + 3","> print(x)","5"],n=Math.floor((t*1.2)%7);
    for(var i=0;i<Math.min(n,L.length);i++)txt(c,L[i],X+5,Y+11+i*7,L[i][0]===">"?"#5eead4":"#e8eef8",6);
    if(Math.floor(t*2)%2)R(c,"#e8eef8",X+5,Y+11+Math.min(n,L.length)*7,4,6);return}
  _baseAnim(c,a,X,Y,W,H,t)};

/* ---- editor de código ---- */
function mountEditor(host,code,onInput,onRun){
  host.innerHTML='<div class="ed"><div class="edgut" aria-hidden="true"></div><div class="edwrap"><pre class="edhl" aria-hidden="true"></pre><textarea id="edta" spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" aria-label="Editor de código Python"></textarea></div></div>';
  var ta=host.querySelector("textarea"),pre=host.querySelector(".edhl"),gut=host.querySelector(".edgut");
  function paint(){pre.innerHTML=hl(ta.value)+"\n ";var n=ta.value.split("\n").length,g="";for(var i=1;i<=n;i++)g+='<div data-l="'+i+'">'+i+'</div>';gut.innerHTML=g;sync()}
  function sync(){pre.scrollTop=ta.scrollTop;pre.scrollLeft=ta.scrollLeft;gut.scrollTop=ta.scrollTop}
  // reemplaza [a,b) por txt conservando Ctrl+Z cuando el navegador lo permite
  function put(a,b,txt,c0,c1){ta.setSelectionRange(a,b);var ok=false;try{ok=document.execCommand(txt?"insertText":"delete",false,txt)}catch(_){}
    if(!ok){var v=ta.value;ta.value=v.slice(0,a)+txt+v.slice(b);paint();onInput(ta.value)}
    ta.selectionStart=c0;ta.selectionEnd=c1===undefined?c0:c1}
  function ins(txt,selBack){var s=ta.selectionStart,e=ta.selectionEnd;put(s,e,txt,s+txt.length-(selBack||0))}
  var OPEN={"(":")","[":"]","{":"}",'"':'"',"'":"'"},CLOSE={")":1,"]":1,"}":1};
  ta.value=code;paint();
  ta.addEventListener("input",function(){paint();onInput(ta.value)});
  ta.addEventListener("scroll",sync);
  ta.addEventListener("keydown",function(e){
    if(e.key==="Escape"){ta.blur();e.stopPropagation();return}
    e.stopPropagation();
    if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();onRun();return}
    var v=ta.value,s=ta.selectionStart,ls=v.lastIndexOf("\n",s-1)+1,line=v.slice(ls,s),indent=(line.match(/^ */)||[""])[0];
    if(e.key==="Tab"){e.preventDefault();if(e.shiftKey){var rm=Math.min(4,indent.length);if(rm){ta.value=v.slice(0,ls)+v.slice(ls+rm);ta.selectionStart=ta.selectionEnd=Math.max(ls,s-rm);paint();onInput(ta.value)}}else ins("    ");return}
    var se=ta.selectionEnd,prev=v[s-1]||"",next=v[se]||"",k=e.key;
    if(e.key==="Enter"){e.preventDefault();
      if(s===se&&OPEN[prev]&&OPEN[prev]===next&&CLOSE[next]){ins("\n"+indent+"    "+"\n"+indent,indent.length+1);return}
      var extra=/:\s*(#.*)?$/.test(line)?"    ":"";ins("\n"+indent+extra);return}
    if(!e.ctrlKey&&!e.metaKey&&!e.altKey&&!e.isComposing&&k.length===1){
      var isQ=k==='"'||k==="'";
      // saltar el cierre que ya está escrito
      if(s===se&&(CLOSE[k]||isQ)&&next===k){e.preventDefault();ta.selectionStart=ta.selectionEnd=s+1;return}
      if(OPEN[k]){
        if(s!==se){e.preventDefault();var sel=v.slice(s,se);put(s,se,k+sel+OPEN[k],s+1,se+1);return}
        var okNext=!next||/[\s)\]},:;]/.test(next);
        if(isQ){var before=line,qn=(before.split(k).length-1);okNext=okNext&&!/\w/.test(prev)&&prev!==k&&qn%2===0}
        if(okNext){e.preventDefault();ins(k+OPEN[k],1);return}
      }
    }
    if(e.key==="Backspace"&&s===se&&OPEN[prev]&&OPEN[prev]===next){e.preventDefault();put(s-1,s+1,"",s-1);return}
    if(e.key==="Backspace"&&s===ta.selectionEnd&&line.length&&/^ +$/.test(line)&&line.length%4===0){e.preventDefault();ta.value=v.slice(0,s-4)+v.slice(s);ta.selectionStart=ta.selectionEnd=s-4;paint();onInput(ta.value)}
  });
  return {get:function(){return ta.value},set:function(c){ta.value=c;paint();onInput(c)},mark:function(l){[].forEach.call(gut.children,function(d){d.classList.toggle("err",+d.dataset.l===l)})},focus:function(){ta.focus()}};
}

/* ---- abrir / mostrar ---- */
function openLesson(w,f,li){if(!ST.mig2){if(ST.code)Object.keys(ST.code).forEach(function(k){if(k.indexOf("twosum:")===0)delete ST.code[k]});if(ST.srs)Object.keys(ST.srs).forEach(function(k){if(k.indexOf("L:twosum:")===0)delete ST.srs[k]});ST.mig2=1;if(ST.lesson&&ST.lesson.twosum&&typeof srsAddLesson==="function")srsAddLesson(lessonById("twosum").L);save()}var ls=floorLessons(w,f);li=li||0;if(!ls[li])return;
  if(li>0&&!ST.lesson[ls[li-1].id]){toast("📖 Primero termina la clase "+li+": "+ls[li-1].title);return}
  LES={w:w,f:f,li:li,L:ls[li],i:0,ok:{},runs:{},hints:{}};fadeTo(showLesson)}
function stepCode(i){
  var L=LES.L,s=L.steps[i],id=L.id+":"+i+(LES.testout?":t":"");
  if(ST.code&&ST.code[id]!==undefined)return ST.code[id];
  if(LES.testout)return autoStarter(s);
  if(s.carry){for(var j=i-1;j>=0;j--){var p=L.steps[j];if(p.k==="build"||p.k==="perf"){var pid=L.id+":"+j;return (ST.code&&ST.code[pid]!==undefined)?ST.code[pid]:(p.solution||stepCode(j))}}}
  return s.starter||"";
}
var EXX=null;
var PASS_EX=["pass","No hace nada: es un marcador de lugar. En Python un bloque (def, for, if) no puede quedar vacío, y los comentarios # no cuentan. Por eso dejé pass: para que el código corra aunque aún no escribas nada. Cuando escribas tus líneas, bórralo."];
function withPass(s,code){var e=(s.explain||[]).slice();if(/^\s*pass\s*$/m.test(code||"")&&!e.some(function(x){return x[0]==="pass"}))e.unshift(PASS_EX);return e}
function passFirst(s,code){var r=/^\s*pass\s*$/m.test(code||"")&&!ST.seenPass;if(r){ST.seenPass=1;save()}return r}
function showLesson(){
  stop();document.body.classList.remove("bmode");cancelAnimationFrame(LRAF);
  var L=LES.L,s=L.steps[LES.i],n=L.steps.length,last=LES.i===n-1,coding=(s.k==="build"||s.k==="perf");
  if(LES.testout)last=true;
  var dots="";if(!LES.testout)for(var k=0;k<n;k++)dots+='<i class="'+(k<LES.i?"ok":(k===LES.i?"cur":""))+'"></i>';
  var lastB=-1;L.steps.forEach(function(x,k){if(x.k==="build")lastB=k});
  var canSkip=userLvl()>=1&&!LES.testout&&lastB>=0&&!ST.lesson[L.id]&&LES.i===0;
  var nls=floorLessons(LES.w,LES.f).length;
  var h='<div class="case lesson'+(coding?' coding':'')+'"><div class="ctop"><button class="pbtn" id="bk" title="Salir (Esc)">✕ SALIR DE LA CLASE</button><div class="ctitle"><small>'+esc(WORLDS[LES.w].nm)+' · '+(LES.f===0?"PLANTA BAJA":"PISO "+LES.f)+' · CLASE '+(LES.li+1)+' DE '+nls+'</small>'+esc(L.title)+'</div><div class="dots">'+(LES.testout?'<span class="tobadge">⚡ RETO DIRECTO</span>':dots)+'</div>'+(canSkip?'<button class="pbtn gold" id="skipc" title="Resuelve el problema final de la clase sin verla">⚡ YA LO SÉ: RETO DIRECTO</button>':'')+'</div>'
    +'<div class="cgrid"><div class="cl"><div class="stage"><canvas id="stagec" width="320" height="224"></canvas></div></div><div class="cside">'
    +'<div class="dlg" id="dlg"><canvas id="por" width="32" height="32"></canvas><div style="flex:1;min-width:0"><div class="nm">Profe Ada · Mentora</div><div class="say" id="say"></div></div></div>'+glossHTML(s.k==="check"?s.q:s.text)+'<div id="lbody"></div>'
    +'<div class="nextrow"><button class="pbtn" id="lprev"'+(LES.i===0?' disabled':'')+'>◀ ANTERIOR</button><button class="pbtn mint" id="lnext">'+(last?'TERMINAR CLASE ✓':'SIGUIENTE ▶')+'</button></div></div></div></div>';
  $("main").innerHTML=h;
  var pc=$("por").getContext("2d");pc.imageSmoothingEnabled=false;pc.drawImage(npcSprite(424242),0,0,32,32,0,1,32,31);
  var body="",nx;
  if(s.k==="code")body='<pre class="code">'+hl(s.code)+'</pre>';
  if(s.k==="trace")body='<div class="trace"><table><tr>'+s.cols.map(function(c){return '<th>'+esc(c)+'</th>'}).join("")+'</tr>'+s.rows.map(function(r){return '<tr>'+r.map(function(c){return '<td>'+esc(c)+'</td>'}).join("")+'</tr>'}).join("")+'</table></div>';
  if(s.k==="check")body='<div class="ohint">🧠 Comprueba lo que aprendiste</div><div class="opts">'+s.opts.map(function(o,i){return '<button class="opt" data-i="'+i+'"><span class="k">'+"ABCD"[i]+'</span><span>'+esc(o)+'</span></button>'}).join("")+'</div><div id="lwhy"></div>';
  if(coding){
    body='<div class="goal"><span>🎯 OBJETIVO</span>'+esc(s.goal)+goalOut(s)+'</div>'
      +(EXX=withPass(s,stepCode(LES.i)),EXX.length?'<details class="expl"'+(passFirst(s,stepCode(LES.i))?' open':'')+'><summary>📖 ¿Qué hace cada parte?</summary>'+EXX.map(function(p){return '<div><code>'+esc(p[0])+'</code><span>'+esc(p[1])+'</span></div>'}).join("")+'</details>':'')
      +'<div id="edhost"></div>'
      +'<div class="edbar"><button class="pbtn mint" id="run">▶ EJECUTAR</button>'+(s.hints?'<button class="pbtn" id="hint">💡 PISTA</button>':'')+'<button class="pbtn" id="reset" title="Volver al código inicial">↺</button><button class="pbtn" id="scaf" hidden title="Te doy el esqueleto del código con huecos ___ para completar">🧩 DAME LA ESTRUCTURA</button><button class="pbtn" id="sol" hidden>👀 VER SOLUCIÓN</button><span class="edkeys">Ctrl/⌘ + Enter ejecuta · Tab = 4 espacios</span></div>'
      +'<div id="hints"></div><div id="results"></div><div id="lremind"></div>';
  }
  $("lbody").innerHTML=body;
  typeInto($("say"),LES.testout?"⚡ Reto directo (si pasa, la clase cuenta como vista). "+((L.steps.filter(function(x){return x.k==="talk"})[0]||{}).text||""):(s.k==="check"?s.q:s.text));
  $("dlg").onclick=finishType;
  nx=$("lnext");
  function lock(){nx.disabled=true}
  if((s.k==="check"||coding)&&!LES.ok[LES.i])lock();
  if(s.k==="check")[].forEach.call(document.querySelectorAll("#lbody .opt"),function(b){b.onclick=function(){
    var i=+b.dataset.i,ok=i===s.ok;finishType();
    [].forEach.call(document.querySelectorAll("#lbody .opt"),function(x){x.classList.remove("bad")});b.classList.add(ok?"ok":"bad");
    $("lwhy").innerHTML='<div class="why"><div class="t">'+(ok?'✔ ¡CORRECTO!':'✗ CASI… INTENTA OTRA VEZ')+'</div>'+(ok?esc(s.why):'Vuelve a leer la explicación y elige otra opción.')+'</div>';
    if(ok){LES.ok[LES.i]=1;nx.disabled=false;[].forEach.call(document.querySelectorAll("#lbody .opt"),function(x){x.disabled=true})}}});
  if(coding)setupCoding(s,nx);
  wireGloss(s.k==="check"?s.q:s.text);
  if(LES.testout){$("lprev").disabled=true;$("lprev").textContent="◀ VER LA CLASE";$("lprev").disabled=false;$("lprev").onclick=function(){LES.testout=false;LES.i=0;LES.ok={};showLesson()}}
  else $("lprev").onclick=function(){if(LES.i>0){LES.i--;showLesson()}};
  if($("skipc"))$("skipc").onclick=function(){LES.testout=true;LES.i=lastB;LES.ok={};LES.runs={};LES.hints={};showLesson()};
  nx.onclick=function(){if(nx.disabled)return;if(last)finishLesson();else{LES.i++;showLesson()}};
  $("bk").onclick=function(){cancelAnimationFrame(LRAF);var w=LES.w,f=LES.f;LES=null;fadeTo(function(){building(w,f)})};
  var cv=$("stagec"),cc=cv.getContext("2d"),t0=performance.now();
  (function frame(now){if(!LES||!$("stagec"))return;cc.setTransform(2,0,0,2,0,0);cc.imageSmoothingEnabled=false;drawClass(cc,LES.w,LES.f,s.anim,(now-t0)/1000,{player:true});LRAF=requestAnimationFrame(frame)})(t0);
  window.scrollTo(0,0);
}
function setupCoding(s,nx){
  var lv=userLvl(),i=LES.i,id=LES.L.id+":"+i+(LES.testout?":t":""),runs=LES.runs[i]||0,shown=LES.hints[i]||0,fails=0,hintAfter=lv===0?Math.min(s.hintAfter||0,1):(lv===2?Math.max(s.hintAfter||0,1):(s.hintAfter||0));
  var HS=s.hints||[];
  var ed=mountEditor($("edhost"),stepCode(i),function(v){saveCode(id,v)},run);
  function hintBtn(){var sb0=$("sol");if(sb0&&s.solution)sb0.hidden=!(runs>=3&&shown>=HS.length);var hb=$("hint");if(!hb)return;var left=HS.length-shown;
    if(runs<hintAfter){hb.disabled=true;hb.textContent="💡 PISTA (tras "+hintAfter+(hintAfter===1?" intento)":" intentos)")}else{hb.disabled=left<=0;hb.textContent=left>0?"💡 PISTA ("+(shown+1)+"/"+HS.length+")":"💡 SIN MÁS PISTAS"}}
  function showHints(){$("hints").innerHTML=HS.slice(0,shown).map(function(h,k){return '<div class="hintb"><b>Pista '+(k+1)+'</b> '+esc(h)+'</div>'}).join("")}
  showHints();hintBtn();
  if($("hint"))$("hint").onclick=function(){if(shown<HS.length){shown++;LES.hints[i]=shown;showHints();hintBtn()}};
  $("reset").onclick=function(){if(ST.code)delete ST.code[id];ed.set(s.carry?stepCode(i):(s.starter||""));ed.mark(0);$("results").innerHTML=""};
  $("sol").onclick=function(){$("results").innerHTML='<div class="why"><div class="t">👀 UNA SOLUCIÓN</div><pre class="code">'+hl(s.solution)+'</pre><p style="margin:8px 0 0">Léela línea por línea, cierra este panel y escríbela tú con tus palabras: así se queda en tu memoria.</p></div>'};
  $("run").onclick=run;
  var keep=s.starter||"";if(s.carry)for(var j=i-1;j>=0;j--){var pj=LES.L.steps[j];if(pj.k==="build"&&pj.solution){keep=pj.solution;break}}
  var SC=s.solution&&s.k==="build"&&s.solution.trim().split("\n").length>=2?scaffold(s.solution,keep):null;if(SC&&SC.trim()===s.solution.trim())SC=null;
  function scafBtn(){var b=$("scaf");if(!b)return;b.hidden=!(SC&&!LES.ok[i]&&fails>=(lv===0?1:2)&&ed.get().indexOf("___")<0&&lv<2)}
  $("scaf").onclick=function(){ed.set(SC);saveCode(id,SC);$("scaf").hidden=true;$("results").innerHTML="";
    typeInto($("say"),"Te dejé la estructura de la solución. Cada ___ es un hueco: cámbialo por lo que falta. Lee el OBJETIVO y las pistas si dudas.")};
  function run(){
    runs++;LES.runs[i]=runs;hintBtn();
    var code=ed.get(),r=MiniPy.runTests(code,s.tests),box=$("results");ed.mark(r.error?r.error.line:0);if(!r.ok)fails++;
    var h="";
    if(r.error){h+='<div class="res bad"><div class="t">💥 TU CÓDIGO TIENE UN ERROR</div><div class="errl">'+esc(r.error.text)+'</div>'+errTip(r.error)+'</div>'}
    else{
h+=testsHTML(r);
    }
    if(code.indexOf("___")>=0)h='<div class="res bad"><div class="t">🧩 AÚN HAY HUECOS</div>Tu código todavía tiene <span class="blank">___</span>. Cámbialos por lo que falta y vuelve a ejecutar.</div>'+h;
    if(r.out&&r.error)h+='<div class="console"><div class="t">🖥️ SALIDA DE TU PROGRAMA</div><pre>'+esc(r.out)+'</pre></div>';
    box.innerHTML=h;
    if(s.k==="perf"){
      var bigOk=r.tests.length&&r.tests[r.tests.length-1].ok;LES.ok[i]=1;nx.disabled=false;
      typeInto($("say"),bigOk?s.fast:s.slow);
    }else if(r.ok){
      LES.ok[i]=1;nx.disabled=false;typeInto($("say"),pick(["¡Excelente! Funciona. Lee tu código una vez más y piensa qué hace cada línea.","¡Eso es! Tu código pasa todas las pruebas.","¡Muy bien! Así se programa: prueba, corrige, vuelve a probar."]));
    }else if(lv===0&&fails===1){typeInto($("say"),r.error?"No pasa nada: lee el mensaje en rojo. Te dice en qué línea está el problema. Si no lo entiendes, toca 💡 PISTA.":"Casi. Compara lo que debía salir con lo que salió (abajo). Si te atoras, toca 💡 PISTA o 🧩 DAME LA ESTRUCTURA.")}
    else if(fails===2&&lv<2&&SC){typeInto($("say"),"Vamos juntos: toca 🧩 DAME LA ESTRUCTURA y te dejo el esqueleto con huecos para completar.")}
    else if(runs>=2&&s.hints&&shown===0&&runs>=hintAfter){typeInto($("say"),"Si te atoras, usa una 💡 pista. No es trampa: así aprenden los profesionales.")}
    scafBtn();
    if(!r.ok&&fails>=2&&typeof remediationFor==="function"&&$("lremind")&&!$("lremind").innerHTML){var _rm=remediationFor(lessonConcepts(LES.L));if(_rm.length){$("lremind").innerHTML=remindBar(_rm);wireRemind($("lremind"))}}
    if(r.ok&&LES.testout){LES.ok[i]=1;nx.disabled=false;typeInto($("say"),"⚡ ¡Reto superado! Presiona TERMINAR CLASE para darla por vista.")}
    setTimeout(function(){var el=nx.disabled?box:nx;if(el&&el.getBoundingClientRect().bottom>innerHeight)el.scrollIntoView({behavior:"smooth",block:"end"})},60);
  }
}
function clip(x,n){x=String(x);n=n||220;return x.length>n?x.slice(0,n)+" … ("+x.length+" caracteres)":x}
function testsHTML(r,title){
  var h='<div class="res '+(r.ok?'good':'bad')+'"><div class="t">'+(r.ok?'✔ ¡TODAS LAS PRUEBAS PASAN!':'✗ ALGUNAS PRUEBAS FALLAN')+'</div><ul class="tl">';
  r.tests.forEach(function(t){h+='<li class="'+(t.ok?'ok':'no')+'"><b>'+(t.ok?'✔':'✗')+'</b><span><code>'+esc(t.label)+'</code>'+(t.ok?(t.isOut?'':' → <code>'+esc(clip(t.got,120))+'</code>'):(t.isMatch?'<br>debía imprimir: <code>'+esc(t.expect)+'</code> · imprimió: <code>'+esc(t.got||"(nada)")+'</code>':t.isOut?outDiff(t):'<br>esperaba <code>'+esc(clip(t.expect))+'</code> · obtuve <code>'+esc(clip(t.got))+'</code>'+noneTip(t)))+'</span></li>'});
  h+='</ul></div>';
  var term="";if(r.out)term+=r.out.replace(/\n?$/,"\n");
  r.tests.forEach(function(t){if(!t.call)return;term+='>>> '+(t.big?t.label:t.call)+'\n';if(t.printed)term+=t.printed.replace(/\n?$/,"\n");term+=(t.err?t.err.text:clip(t.got))+'\n'});
  if(term)h+='<div class="console"><div class="t">🖥️ '+(title||'TERMINAL')+' · lo que imprimió y devolvió tu código</div><pre>'+esc(term.replace(/\n$/,""))+'</pre></div>';
  return h}
function goalOut(s){var t=(s.tests||[]).filter(function(x){return x.out!==undefined||x.match!==undefined})[0];if(!t)return "";if(t.match!==undefined)return '<div class="gout"><small>Tu programa debe imprimir:</small><pre>'+esc(t.desc)+'</pre></div>';
  return '<div class="gout"><small>Tu programa debe imprimir exactamente:</small><pre>'+esc(t.out)+'</pre></div>'}
function outDiff(t){var a=String(t.expect).split("\n"),g=t.got===""?[]:String(t.got).split("\n"),n=Math.max(a.length,g.length),h='<table class="odiff"><tr><th>línea</th><th>debía imprimir</th><th>tu programa imprimió</th></tr>',first=-1;
  for(var i=0;i<n;i++){var ok=(a[i]||"").trim()===(g[i]||"").trim()&&i<a.length&&i<g.length;if(!ok&&first<0)first=i;
    h+='<tr class="'+(ok?'ok':'no')+'"><td>'+(i+1)+'</td><td>'+(i<a.length?'<code>'+esc(a[i])+'</code>':'<i>(nada)</i>')+'</td><td>'+(i<g.length?'<code>'+esc(g[i])+'</code>':'<i>(nada)</i>')+'</td></tr>'}
  h+='</table>';var tip;
  if(g.length<a.length&&first>=g.length)tip='A tu programa le faltan líneas: imprime '+g.length+' y debe imprimir '+a.length+'. Revisa que cada paso tenga su propio print(...) y que hayas presionado ▶ Ejecutar después de escribirlo.';
  else if(g.length>a.length&&first>=a.length)tip='Tu programa imprime de más: sobran '+(g.length-a.length)+' línea(s). Quita los print que no se piden.';
  else tip='La línea '+(first+1)+' no coincide: debía ser <code>'+esc(a[first]||"")+'</code>. Las mayúsculas, espacios y comillas cuentan.';
  return h+'<em>💡 '+tip+'</em>'}
function errTip(e){if(e.type==="NameError"&&/___/.test(e.msg))return '<div class="tip">🧩 Cambia cada ___ por lo que falta.</div>';var m={NameError:"Revisa que el nombre esté bien escrito y que la variable exista antes de usarla.",IndentationError:"Las líneas dentro de un def, for, if o while llevan 4 espacios más que la línea con «:».",SyntaxError:"Revisa los dos puntos al final de def/for/if, que los paréntesis y comillas cierren, y que no falte nada.",TypeError:"Estás combinando tipos que no se pueden mezclar (por ejemplo texto + número).",TimeoutError:"Tu código hace demasiado trabajo. Si es un ciclo infinito, revisa que la condición del while llegue a ser falsa.",IndexError:"Usas una posición que no existe. Recuerda que los índices van de 0 a len − 1.",KeyError:"Lees una llave que no está en el diccionario. Usa «in» para revisar antes, o .get()."}[e.type];return m?'<div class="tip">💡 '+m+'</div>':''}
function listItems(r){r=String(r);if(r[0]!=="["||r[r.length-1]!=="]")return null;var b=r.slice(1,-1).trim();if(!b)return [];if(/[\[\]{}()]/.test(b))return null;return b.split(", ")}
function diffTip(t){var a=listItems(t.expect),g=listItems(t.got);if(!a||!g)return "";var k=0;while(k<a.length&&k<g.length&&a[k]===g[k])k++;
  var m='<br><em>🔎 Compara posición por posición: ';
  if(k<a.length&&k<g.length)m+='la primera diferencia está en la posición '+k+': debía ser <code>'+esc(a[k])+'</code> y tu lista tiene <code>'+esc(g[k])+'</code>.';
  else if(g.length>a.length)m+='todo coincide hasta la posición '+(k-1)+', pero luego sobra <code>'+esc(g[k])+'</code>.';
  else m+='te faltan elementos a partir de la posición '+k+'.';
  if(g.length!==a.length)m+=' Tu lista tiene '+g.length+' elementos y debería tener '+a.length+'.'+(g.length>a.length?' En cada vuelta del for debe agregarse <b>una sola</b> cosa: si agregas en el if y también fuera de él, se agregan dos. Usa <code>else:</code> para que sea una u otra.':'');
  return m+'</em>'}
function noneTip(t){if(t.got!=="None"&&!(t.err&&t.err.type==="TimeoutError")){var d=diffTip(t);if(d)return d}return t.got==="None"?'<br><em>Tu función devolvió None: ¿olvidaste el return? (print solo muestra, no devuelve).</em>':(t.err&&t.err.type==="TimeoutError"?'<br><em>Demasiado lento: busca una forma de no repetir trabajo.</em>':'')}
function finishLesson(){
  cancelAnimationFrame(LRAF);var L=LES.L,first=!ST.lesson[L.id],w=LES.w,f=LES.f,ls=floorLessons(w,f),nextI=LES.li+1<ls.length?LES.li+1:-1;
  ST.lesson[L.id]=1;if(first){ST.xp+=30;ST.coins=(ST.coins||0)+10}if(typeof srsAddLesson==="function")srsAddLesson(L);save();hud();
  var h='<div class="case result"><div class="cgrid"><div class="cl"><div class="stage"><canvas id="stagec" width="320" height="224"></canvas></div></div><div class="cside">'
    +'<div class="dlg" style="cursor:default"><canvas id="por" width="32" height="32"></canvas><div style="flex:1"><div class="nm">Profe Ada · Mentora</div><div class="say" id="say"></div></div></div>'
    +'<div class="big" style="font-size:26px">CLASE COMPLETADA</div>'+(first?'<div class="rw"><span class="stat">+<b>30</b> XP</span><span class="stat">+<b>10</b> 🪙</span></div>':'')
    +'<div class="why" style="text-align:left"><div class="t">📝 LO QUE APRENDISTE (ENTRA EN EL EXAMEN)</div><ul class="recap">'+L.recap.map(function(r){return '<li>'+esc(r)+'</li>'}).join("")+'</ul></div>'
    +'<div class="why" style="text-align:left"><div class="t">📚 REPASO</div>Esta clase volverá en tu Centro de Repaso mañana, en 3 días y en una semana para que no se te olvide.</div>'
    +'<div class="nextrow" style="justify-content:center"><button class="pbtn" id="b1">Repetir clase</button><button class="pbtn mint" id="b2">'+(nextI>=0?'Siguiente clase ▶':'Ir a las salas ▶')+'</button></div></div></div></div>';
  $("main").innerHTML=h;
  var c=$("stagec").getContext("2d");c.setTransform(2,0,0,2,0,0);c.imageSmoothingEnabled=false;drawClass(c,w,f,L.steps[L.steps.length-1].anim,2,{player:true});
  var pc=$("por").getContext("2d");pc.imageSmoothingEnabled=false;pc.drawImage(npcSprite(424242),0,0,32,32,0,1,32,31);
  typeInto($("say"),nextI>=0?"¡Muy bien! Sigue con la siguiente clase de este piso.":"¡Terminaste las clases de este piso! Las salas ya están abiertas: ahí te esperan problemas para practicar.");
  var li=LES.li;$("b1").onclick=function(){openLesson(w,f,li)};$("b2").onclick=function(){LES=null;if(nextI>=0)openLesson(w,f,nextI);else fadeTo(function(){building(w,f)})};
}
function buildingQuest(w){
  var fs=rooms(w);
  for(var i=0;i<fs.length;i++){var f=fs[i];if(!floorUnlocked(w,f))break;
    var nl=nextLessonIdx(w,f);if(nl>=0)return {f:f,text:"Toma la <b>clase "+(nl+1)+" de"+(f===0?" la Planta Baja":"l Piso "+f)+"</b>: "+esc(floorLessons(w,f)[nl].title)};
    var s=floorStats(w,f);if(s.dom<.5)return {f:f,text:"Resuelve las salas de"+(f===0?" la <b>Planta Baja":"l <b>Piso "+f)+"</b> ("+s.solved+"/"+s.total+") · necesitas 50% para subir"};
  }
  if(!ST.exam[w]&&examUnlocked(w))return {f:"am",text:"¡Listo para el examen! Sube al <b>Aula Magna</b>"};
  if(ST.exam[w])return {f:null,text:"🏆 Edificio acreditado. Sal al mapa y sigue al siguiente mundo"};
  for(var j=0;j<fs.length;j++){var s2=floorStats(w,fs[j]);if(s2.dom<1)return {f:fs[j],text:"Sigue resolviendo salas para abrir el siguiente piso"}}
  return {f:null,text:"Sigue practicando"};
}
window.__LES=function(){return LESSONS};
