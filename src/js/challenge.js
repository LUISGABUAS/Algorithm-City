
/* ================= MOTOR DE RETOS (producción) =================
   playChallenge(c, host, onGraded, say) monta un reto en 'host' y llama
   onGraded(ok) UNA vez cuando concluye. 'say(text)' (opcional) escribe en el
   diálogo de la Profe Ada. Reutiliza mountEditor, MiniPy, testsHTML, errTip,
   scaffold, shuffle, hl, typeInto. Tipos: predict · parsons · blanks · write
   · debug · trace · edge  (+ pat/cx de reconocimiento, que maneja la sala). */

var CH_PROD={predict:1,parsons:1,blanks:1,write:1,debug:1,trace:1,edge:1};
var CH_ITER={parsons:1,blanks:1,write:1,debug:1};
function isProdChallenge(t){return !!CH_PROD[t]}
function chSay(say,t){if(typeof say==="function")say(t)}
function chTests(code,tests){return MiniPy.runTests(code,tests||[])}
function chResultHTML(r){
  if(r.error)return '<div class="res bad"><div class="t">💥 ERROR</div><div class="errl">'+esc(r.error.text)+'</div>'+(typeof errTip==="function"?errTip(r.error):"")+'</div>';
  return testsHTML(r);
}

function playChallenge(c,host,onGraded,say){
  var done=false;function grade(ok){if(done)return;done=true;onGraded(!!ok)}
  var t=c.t;
  if(t==="predict")return chPredict(c,host,grade,say);
  if(t==="parsons")return chParsons(c,host,grade,say);
  if(t==="trace")return chTrace(c,host,grade,say);
  if(t==="edge")return chEdge(c,host,grade,say);
  // write / blanks / debug: editor + pruebas
  var starter,hints=c.hints||[],sol=c.solution||"";
  if(t==="blanks")starter=(typeof scaffold==="function")?scaffold(sol,c.keep):(c.scaffold||sol);
  else if(t==="debug")starter=c.buggy||sol;
  else starter=c.starter||"";
  var goal={write:["⌨️ ESCRIBE",c.goal||"Escribe la solución y pasa todas las pruebas."],
            blanks:["🧩 COMPLETA",c.goal||"Rellena los huecos ___ y ejecuta."],
            debug:["🐞 ARREGLA EL BUG",c.goal||"Hay un error. Encuéntralo y corrígelo hasta que pasen las pruebas."]}[t];
  return chCode(c,host,grade,say,{starter:starter,tests:c.tests,hints:hints,solution:sol,goalLabel:goal[0],goalText:goal[1],giveUpAfter:t==="write"?3:2});
}

/* ---------- editor + pruebas (write / blanks / debug) ---------- */
function chCode(c,host,grade,say,o){
  var shown=0,runs=0,ended=false;
  host.innerHTML='<div class="goal"><span>'+o.goalLabel+'</span>'+esc(o.goalText)+(o.tests?goalOutFor(o.tests):"")+'</div>'
    +'<div id="ched"></div>'
    +'<div class="edbar"><button class="pbtn mint" id="chrun">▶ EJECUTAR</button>'+(o.hints&&o.hints.length?'<button class="pbtn" id="chhint">💡 PISTA</button>':'')+'<button class="pbtn" id="chreset" title="Reiniciar">↺</button><button class="pbtn" id="chgive" hidden>Ver solución</button><span class="edkeys">Ctrl/⌘ + Enter ejecuta · Tab = 4 espacios</span></div>'
    +'<div id="chhints"></div><div id="chres"></div>';
  var ed=mountEditor($("ched"),o.starter,function(){},run),HS=o.hints||[];
  function hb(){var b=$("chhint");if(b){b.disabled=shown>=HS.length;b.textContent=shown<HS.length?"💡 PISTA ("+(shown+1)+"/"+HS.length+")":"💡 SIN MÁS PISTAS"}var g=$("chgive");if(g)g.hidden=!(o.solution&&runs>=o.giveUpAfter)}
  if($("chhint"))$("chhint").onclick=function(){if(shown<HS.length){shown++;$("chhints").innerHTML=HS.slice(0,shown).map(function(h,k){return '<div class="hintb"><b>Pista '+(k+1)+'</b> '+esc(h)+'</div>'}).join("");hb()}};
  $("chreset").onclick=function(){ed.set(o.starter);ed.mark(0);$("chres").innerHTML=""};
  $("chgive").onclick=function(){if(ended)return;$("chres").innerHTML='<div class="why"><div class="t">👀 UNA SOLUCIÓN</div><pre class="code">'+hl(o.solution)+'</pre><p style="margin:8px 0 0">Léela, ciérrala y escríbela tú: así se queda.</p></div>';ended=true;chSay(say,"Revisa la solución con calma. La verás de nuevo en el repaso.");grade(false)};
  $("chrun").onclick=run;hb();
  function run(){if(ended)return;runs++;hb();var code=ed.get(),r=chTests(code,o.tests);ed.mark(r.error?r.error.line:0);
    var h="";if(code.indexOf("___")>=0)h='<div class="res bad"><div class="t">🧩 AÚN HAY HUECOS</div>Cambia los <span class="blank">___</span> por lo que falta y vuelve a ejecutar.</div>';
    $("chres").innerHTML=h+chResultHTML(r);
    if(r.ok){ended=true;chSay(say,pick(["¡Eso es! Pasa todas las pruebas.","¡Muy bien! Así se programa: prueba, corrige, repite.","¡Excelente! Lee tu código una vez más y sigue."]));grade(true)}
    else chSay(say,r.error?"Lee el mensaje en rojo: te dice en qué línea está el problema.":"Casi. Mira abajo qué prueba falla.");}
  setTimeout(function(){ed.focus&&ed.focus()},40);
}
function goalOutFor(tests){var t=(tests||[]).filter(function(x){return x.out!==undefined})[0];return t?'<div class="gout"><small>Debe imprimir exactamente:</small><pre>'+esc(t.out)+'</pre></div>':""}

/* ---------- predecir la salida ---------- */
function chPredict(c,host,grade,say){
  host.innerHTML='<div class="goal"><span>🔮 PREDICE</span>¿Qué imprime este código? Escríbelo tal cual saldría.</div>'
    +'<pre class="code">'+hl(c.code)+'</pre>'
    +'<div class="edbar"><input id="chpin" class="pdin" placeholder="escribe la salida esperada…" autocomplete="off">'+(c.hint?'<button class="pbtn" id="chphint">💡 Pista</button>':'')+'<button class="pbtn mint" id="chpck">Comprobar</button></div><div id="chpres"></div>';
  chSay(say,"Antes de ejecutar, predice. Pensar la salida ANTES fija mucho más que solo leerla.");
  if($("chphint"))$("chphint").onclick=function(){$("chpres").innerHTML='<div class="why"><div class="t">💡 PISTA</div>'+esc(c.hint)+'</div>'};
  function norm(s){return String(s==null?"":s).replace(/\s+/g," ").trim()}
  function check(){var r=chTests(c.code,[]),real=(r.out||"").replace(/\s+$/,""),guess=($("chpin").value||"").replace(/\s+$/,""),ok=norm(guess)===norm(real);
    $("chpres").innerHTML='<div class="res '+(ok?"good":"bad")+'"><div class="t">'+(ok?"✔ ¡LE ATINASTE!":"✗ CASI")+'</div>Tu predicción: <code>'+esc(guess||"(vacío)")+'</code><br>Imprime: <code>'+esc(real)+'</code></div>';
    var inp=$("chpin");if(inp)inp.disabled=true;var ck=$("chpck");if(ck)ck.disabled=true;
    chSay(say,ok?"¡Bien! "+(c.note||""):"No pasa nada —justo por eso predecimos. "+(c.note||""));grade(ok)}
  $("chpck").onclick=check;
  $("chpin").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();check()}e.stopPropagation()});
  setTimeout(function(){var i=$("chpin");if(i)i.focus()},40);
}

/* ---------- ordenar piezas (Parsons) ---------- */
function chParsons(c,host,grade,say){
  var lines=c.lines.slice(),extra=(c.distractors||[]);
  var all=lines.map(function(l,i){return {txt:l,ans:i}}).concat(extra.map(function(l){return {txt:l,ans:-1}}));
  var order=(typeof shuffle==="function")?shuffle(all):all.slice().reverse();
  var pool=order.map(function(_,i){return i}),sol=[],runs=0,ended=false;
  host.innerHTML='<div class="goal"><span>🧩 ORDENA</span>Toca las piezas en el orden correcto. Toca una puesta para quitarla. La sangría ya viene lista.</div>'
    +'<div class="pzcols"><div class="pzcol"><div class="pzlab">PIEZAS</div><div id="pzpool" class="pzbox"></div></div>'
    +'<div class="pzcol"><div class="pzlab">TU SOLUCIÓN</div><div id="pzsol" class="pzbox sol"></div></div></div>'
    +'<div class="edbar"><button class="pbtn mint" id="pzrun">▶ EJECUTAR</button><button class="pbtn" id="pzclr">↺ Vaciar</button><button class="pbtn" id="pzgive" hidden>Ver solución</button></div><div id="pzres"></div>';
  chSay(say,"Tienes todas las piezas: solo falta el orden. Esto entrena la lógica sin pelear con la sintaxis.");
  function pieceHTML(i,where){return '<button class="pz" data-i="'+i+'" data-w="'+where+'"><span class="pzt">'+esc(order[i].txt)+'</span></button>'}
  function render(){
    $("pzpool").innerHTML=pool.map(function(i){return pieceHTML(i,"pool")}).join("")||'<div class="pzempty">—</div>';
    $("pzsol").innerHTML=sol.map(function(i){return pieceHTML(i,"sol")}).join("")||'<div class="pzempty">toca piezas de la izquierda…</div>';
    [].forEach.call(host.querySelectorAll(".pz"),function(b){b.onclick=function(){if(ended)return;var i=+b.dataset.i;
      if(b.dataset.w==="pool"){pool=pool.filter(function(x){return x!==i});sol.push(i)}else{sol=sol.filter(function(x){return x!==i});pool.push(i)}render()}});
  }
  render();
  $("pzclr").onclick=function(){if(ended)return;pool=pool.concat(sol);sol=[];render();$("pzres").innerHTML=""};
  $("pzgive").onclick=function(){if(ended)return;ended=true;$("pzres").innerHTML='<div class="why"><div class="t">👀 ORDEN CORRECTO</div><pre class="code">'+hl(c.lines.join("\n"))+'</pre></div>';chSay(say,"Fíjate en el orden y vuelve a intentarlo en el repaso.");grade(false)};
  $("pzrun").onclick=function(){if(ended)return;runs++;if($("pzgive")&&runs>=2)$("pzgive").hidden=false;
    if(!sol.length){$("pzres").innerHTML='<div class="res bad"><div class="t">Arma tu solución primero</div></div>';return}
    var code=sol.map(function(i){return order[i].txt}).join("\n"),r=chTests(code,c.tests);
    $("pzres").innerHTML=chResultHTML(r);
    if(r.ok){ended=true;chSay(say,"¡Ese es el orden! Fíjate en la lógica: qué va antes y qué después.");grade(true)}
    else chSay(say,"Casi. Mira abajo qué prueba falla y reacomoda.");};
}

/* ---------- rastrear la ejecución ---------- */
function chTrace(c,host,grade,say){
  var rows=c.rows||[];
  host.innerHTML='<div class="goal"><span>🔍 RASTREA</span>'+esc(c.ask||"Predice el valor en cada paso.")+'</div>'
    +'<pre class="code">'+hl(c.code)+'</pre>'
    +'<table class="trace"><tr><th>'+esc(c.colLabel||"Paso")+'</th><th>'+esc(c.valLabel||"Valor")+'</th></tr>'
    +rows.map(function(r,i){return '<tr><td>'+esc(r.label)+'</td><td><input class="tcell pdin" data-i="'+i+'" autocomplete="off"></td></tr>'}).join("")
    +'</table><div class="edbar"><button class="pbtn mint" id="chtck">Comprobar</button></div><div id="chtres"></div>';
  chSay(say,"Sé la computadora: anota qué valor toma la variable en cada vuelta.");
  $("chtck").onclick=function(){var ok=true;
    [].forEach.call(host.querySelectorAll(".tcell"),function(inp){var i=+inp.dataset.i,good=String(inp.value).replace(/\s+/g,"")===String(rows[i].val).replace(/\s+/g,"");inp.classList.toggle("tbad",!good);inp.disabled=true;if(!good)ok=false});
    $("chtck").disabled=true;
    $("chtres").innerHTML='<div class="res '+(ok?"good":"bad")+'"><div class="t">'+(ok?"✔ ¡RASTREO PERFECTO!":"✗ Algunos valores no cuadran")+'</div>'+(ok?"":'Correctos: '+rows.map(function(r){return '<code>'+esc(r.val)+'</code>'}).join(" · "))+'</div>';
    chSay(say,ok?"¡Así se sigue el hilo de la ejecución!":"Revisa el orden de las operaciones y repásalo.");grade(ok)};
}

/* ---------- caza el caso borde ---------- */
function chEdge(c,host,grade,say){
  host.innerHTML='<div class="goal"><span>🎯 CAZA EL CASO BORDE</span>Esta solución casi funciona. ¿Con cuál de estas llamadas da un resultado incorrecto?</div>'
    +'<pre class="code">'+hl(c.flawed)+'</pre>'
    +'<div class="opts" id="chopts">'+c.candidates.map(function(q,i){return '<button class="opt" data-i="'+i+'"><span class="k">'+"ABCD"[i]+'</span><span><code>'+esc(q)+'</code></span></button>'}).join("")+'</div><div id="cheres"></div>';
  chSay(say,"Una buena prueba rompe el código. ¿Qué entrada expone el error?");
  function broken(q){var a=chTests(c.flawed+"\nprint("+q+")",[]),b=chTests(c.ref+"\nprint("+q+")",[]);return (a.out||"")!==(b.out||"")||!!a.error}
  [].forEach.call(host.querySelectorAll("#chopts .opt"),function(bt){bt.onclick=function(){
    var i=+bt.dataset.i,ok=broken(c.candidates[i]);
    [].forEach.call(host.querySelectorAll("#chopts .opt"),function(x){var j=+x.dataset.i;x.disabled=true;if(broken(c.candidates[j]))x.classList.add("ok");else if(j===i)x.classList.add("bad")});
    $("cheres").innerHTML='<div class="why"><div class="t">'+(ok?"✔ ¡La cazaste!":"✗ Esa sí funciona")+'</div>'+esc(c.why||"")+'</div>';
    chSay(say,ok?"¡Exacto! Pensar en casos borde gana entrevistas.":"Esa entrada da el resultado correcto. La falla está en otra.");grade(ok)}});
}

if(typeof window!=="undefined")window.__CH={play:playChallenge,prod:isProdChallenge};
