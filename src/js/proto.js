
/* ================= PROTOTIPO: sala "de verdad jugable" =================
   Muestra los 3 formatos de práctica por PRODUCCIÓN (no opción múltiple):
   PREDECIR (PRIMM) → ORDENAR PIEZAS (Parsons) → ESCRIBIR (Make).
   Se abre con la URL  .../#proto  — es una muestra, no toca el juego real. */

var PROTO_DATA={
  title:"Two Sum",
  predict:{
    code:"visto = {7: 0}\nfalta = 9 - 2\nprint(falta, falta in visto)",
    hint:"falta = 9 - 2 = 7. La pregunta «7 in visto» revisa si existe la llave 7 (sí existe).",
    note:"Así piensa Two Sum: para cada número preguntas si su complemento ya lo viste."
  },
  parsons:{
    lines:[
      "def two_sum(nums, target):",
      "    visto = {}",
      "    for i, x in enumerate(nums):",
      "        falta = target - x",
      "        if falta in visto:",
      "            return [visto[falta], i]",
      "        visto[x] = i",
      "    return []"
    ],
    tests:[{call:"two_sum([2, 7, 11, 15], 9)",expect:"[0, 1]"},{call:"two_sum([3, 2, 4], 6)",expect:"[1, 2]"},{call:"two_sum([3, 3], 6)",expect:"[0, 1]"}]
  },
  make:{
    starter:"def two_sum(nums, target):\n    # recorre con enumerate; para cada x pregunta si (target - x) ya se vio\n    pass\n",
    tests:[{call:"two_sum([2, 7, 11, 15], 9)",expect:"[0, 1]"},{call:"two_sum([3, 2, 4], 6)",expect:"[1, 2]"},{call:"two_sum([3, 3], 6)",expect:"[0, 1]"},{call:"two_sum(list(range(3000)), 5997)",expect:"[2998, 2999]",maxSteps:200000,label:"3,000 números (rendimiento)"}],
    hints:["Un diccionario antes del ciclo: visto = {}","Recorre con enumerate: for i, x in enumerate(nums):","falta = target - x; si falta in visto → return [visto[falta], i]; si no → visto[x] = i"],
    solution:"def two_sum(nums, target):\n    visto = {}\n    for i, x in enumerate(nums):\n        falta = target - x\n        if falta in visto:\n            return [visto[falta], i]\n        visto[x] = i\n    return []"
  }
};
var PROTO=null;

function protoFrame(step,inner){
  var steps=["PREDECIR","ORDENAR PIEZAS","ESCRIBIR"];
  var dots=steps.map(function(s,i){return '<i class="'+(i<step?"ok":(i===step?"cur":""))+'"></i>'}).join("");
  return '<div class="proto"><div class="ctop"><button class="pbtn" id="pbk" title="Salir">✕ SALIR DE LA MUESTRA</button>'
    +'<div class="ctitle"><small>🧪 SALA DE MUESTRA · '+esc(PROTO_DATA.title)+' · PASO '+(step+1)+' DE 3 · '+steps[step]+'</small>Así se sentiría practicar produciendo</div>'
    +'<div class="dots">'+dots+'</div></div>'
    +'<div class="dlg" style="cursor:default"><canvas id="ppor" width="32" height="32"></canvas><div style="flex:1;min-width:0"><div class="nm">Profe Ada · Mentora</div><div class="say" id="psay"></div></div></div>'
    +inner+'</div>';
}
function protoPortrait(){var cv=$("ppor");if(!cv||typeof npcSprite!=="function")return;var c=cv.getContext("2d");c.imageSmoothingEnabled=false;c.drawImage(npcSprite(424242),0,0,32,32,0,1,32,31)}

function openProto(){
  if(typeof MAPON!=="undefined"&&MAPON){MAPON=false;if(typeof RAF!=="undefined")cancelAnimationFrame(RAF)}
  if(typeof stop==="function")stop();document.body.classList.remove("mapmode","bmode","titling");
  var ts=$("tscreen");if(ts&&typeof closeTitle==="function")closeTitle();
  PROTO={phase:0};protoPredict();
}

/* ---------- PASO 1: PREDECIR ---------- */
function protoPredict(){
  var P=PROTO_DATA.predict;
  var inner='<div class="goal"><span>🔮 PREDICE</span>¿Qué imprime este código? Escríbelo tal cual saldría.</div>'
    +'<pre class="code">'+hl(P.code)+'</pre>'
    +'<div class="edbar"><input id="pdin" class="pdin" placeholder="escribe la salida esperada…" autocomplete="off"><button class="pbtn mint" id="pdck">Comprobar</button><button class="pbtn" id="pdhint">💡 Pista</button></div>'
    +'<div id="pdres"></div><div class="nextrow"><button class="pbtn mint" id="pdnext" hidden>SIGUIENTE ▶</button></div>';
  $("main").innerHTML=protoFrame(0,inner);protoPortrait();
  typeInto($("psay"),"Antes de ejecutar, predice. Pensar la salida ANTES fija mucho más que solo leerla.");
  $("pbk").onclick=protoExit;
  $("pdhint").onclick=function(){$("pdres").innerHTML='<div class="why"><div class="t">💡 PISTA</div>'+esc(P.hint)+'</div>'};
  function check(){
    var r=MiniPy.runTests(P.code,[]),real=(r.out||"").replace(/\s+$/,""),guess=($("pdin").value||"").replace(/\s+$/,"");
    var ok=guess.replace(/\s+/g," ").trim()===real.replace(/\s+/g," ").trim();
    $("pdres").innerHTML='<div class="res '+(ok?"good":"bad")+'"><div class="t">'+(ok?"✔ ¡LE ATINASTE!":"✗ CASI")+'</div>'
      +'Tu predicción: <code>'+esc(guess||"(vacío)")+'</code><br>El programa imprime: <code>'+esc(real)+'</code></div>';
    typeInto($("psay"),(ok?"¡Bien! ":"No pasa nada —justo por eso predecimos. ")+P.note);
    $("pdnext").hidden=false;
  }
  $("pdck").onclick=check;
  $("pdin").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();check()}e.stopPropagation()});
  $("pdnext").onclick=function(){PROTO.phase=1;protoParsons()};
  setTimeout(function(){var i=$("pdin");if(i)i.focus()},40);
}

/* ---------- PASO 2: ORDENAR PIEZAS (Parsons) ---------- */
function protoParsons(){
  var P=PROTO_DATA.parsons;
  if(!PROTO.pool){var idx=P.lines.map(function(_,i){return i});PROTO.pool=(typeof shuffle==="function"?shuffle(idx):idx.slice().reverse());PROTO.sol=[]}
  var inner='<div class="goal"><span>🧩 ORDENA</span>Toca las piezas en el orden correcto para armar Two Sum. Toca una pieza puesta para quitarla. La sangría ya viene lista.</div>'
    +'<div class="pzcols"><div class="pzcol"><div class="pzlab">PIEZAS</div><div id="pzpool" class="pzbox"></div></div>'
    +'<div class="pzcol"><div class="pzlab">TU SOLUCIÓN</div><div id="pzsol" class="pzbox sol"></div></div></div>'
    +'<div class="edbar"><button class="pbtn mint" id="pzrun">▶ EJECUTAR</button><button class="pbtn" id="pzclr">↺ Vaciar</button></div>'
    +'<div id="pzres"></div><div class="nextrow"><button class="pbtn mint" id="pznext" hidden>SIGUIENTE ▶</button></div>';
  $("main").innerHTML=protoFrame(1,inner);protoPortrait();
  typeInto($("psay"),"Tienes todas las piezas: solo falta el orden. Esto entrena la lógica sin pelear con la sintaxis.");
  $("pbk").onclick=protoExit;
  function lineHTML(i,where){return '<button class="pz" data-i="'+i+'" data-w="'+where+'"><span class="pzt">'+esc(P.lines[i])+'</span></button>'}
  function renderPz(){
    $("pzpool").innerHTML=PROTO.pool.map(function(i){return lineHTML(i,"pool")}).join("")||'<div class="pzempty">—</div>';
    $("pzsol").innerHTML=PROTO.sol.map(function(i){return lineHTML(i,"sol")}).join("")||'<div class="pzempty">toca piezas de la izquierda…</div>';
    [].forEach.call(document.querySelectorAll(".pz"),function(b){b.onclick=function(){var i=+b.dataset.i;
      if(b.dataset.w==="pool"){PROTO.pool=PROTO.pool.filter(function(x){return x!==i});PROTO.sol.push(i)}
      else{PROTO.sol=PROTO.sol.filter(function(x){return x!==i});PROTO.pool.push(i)}renderPz()}});
  }
  renderPz();
  $("pzclr").onclick=function(){PROTO.pool=PROTO.pool.concat(PROTO.sol);PROTO.sol=[];renderPz();$("pzres").innerHTML=""};
  $("pzrun").onclick=function(){
    if(!PROTO.sol.length){$("pzres").innerHTML='<div class="res bad"><div class="t">Arma tu solución primero</div></div>';return}
    var code=PROTO.sol.map(function(i){return P.lines[i]}).join("\n"),r=MiniPy.runTests(code,P.tests);
    var h=r.error?'<div class="res bad"><div class="t">💥 ERROR</div><div class="errl">'+esc(r.error.text)+'</div>'+(typeof errTip==="function"?errTip(r.error):"")+'</div>':testsHTML(r);
    $("pzres").innerHTML=h;
    if(r.ok){typeInto($("psay"),"¡Ese es el orden! Fíjate: primero preguntas, luego guardas. Ahora el reto final: escríbelo tú.");$("pznext").hidden=false}
    else typeInto($("psay"),"Casi. Mira abajo qué prueba falla y vuelve a acomodar. Pista: se pregunta ANTES de guardar.");
  };
  $("pznext").onclick=function(){PROTO.phase=2;protoMake()};
}

/* ---------- PASO 3: ESCRIBIR (Make) ---------- */
function protoMake(){
  var P=PROTO_DATA.make,shown=0,runs=0;
  var inner='<div class="goal"><span>⌨️ ESCRIBE</span>Ahora de memoria: escribe Two Sum en O(n). Incluye la prueba grande de 3,000 números.</div>'
    +'<div id="pedhost"></div>'
    +'<div class="edbar"><button class="pbtn mint" id="perun">▶ EJECUTAR</button><button class="pbtn" id="pehint">💡 PISTA</button><button class="pbtn" id="pesol" hidden>👀 Ver solución</button><span class="edkeys">Ctrl/⌘ + Enter ejecuta</span></div>'
    +'<div id="pehints"></div><div id="peres"></div><div class="nextrow"><button class="pbtn mint" id="penext" hidden>TERMINAR ▶</button></div>';
  $("main").innerHTML=protoFrame(2,inner);protoPortrait();
  typeInto($("psay"),"Escribir de memoria es lo que de verdad fija el aprendizaje. Si te atoras, pide pista.");
  $("pbk").onclick=protoExit;
  var ed=mountEditor($("pedhost"),P.starter,function(){},run);
  function hb(){var b=$("pehint");b.disabled=shown>=P.hints.length;b.textContent=shown<P.hints.length?"💡 PISTA ("+(shown+1)+"/"+P.hints.length+")":"💡 SIN MÁS PISTAS";$("pesol").hidden=!(runs>=2&&shown>=P.hints.length)}
  $("pehint").onclick=function(){if(shown<P.hints.length){shown++;$("pehints").innerHTML=P.hints.slice(0,shown).map(function(h,k){return '<div class="hintb"><b>Pista '+(k+1)+'</b> '+esc(h)+'</div>'}).join("");hb()}};
  $("pesol").onclick=function(){$("peres").innerHTML='<div class="why"><div class="t">👀 UNA SOLUCIÓN</div><pre class="code">'+hl(P.solution)+'</pre><p style="margin:8px 0 0">Léela, ciérrala y escríbela tú: así se queda.</p></div>'};
  $("perun").onclick=run;hb();
  function run(){runs++;hb();var r=MiniPy.runTests(ed.get(),P.tests);ed.mark(r.error?r.error.line:0);
    var h=r.error?'<div class="res bad"><div class="t">💥 ERROR</div><div class="errl">'+esc(r.error.text)+'</div>'+(typeof errTip==="function"?errTip(r.error):"")+'</div>':testsHTML(r);
    $("peres").innerHTML=h;
    if(r.ok){typeInto($("psay"),"¡Lo lograste! Predijiste, ordenaste y lo escribiste. ESO es aprender programando.");$("penext").hidden=false}
    else typeInto($("psay"),"Revisa la prueba que falla abajo. Si la grande es lenta, ¿estás usando el diccionario?");}
  $("penext").onclick=protoDone;
}

/* ---------- FIN ---------- */
function protoDone(){
  var inner='<div class="big" style="font-size:26px">FIN DE LA MUESTRA</div>'
    +'<div class="why" style="text-align:left"><div class="t">🎮 LO QUE ACABAS DE SENTIR</div><ul class="recap">'
    +'<li><b>Predecir</b> antes de ejecutar (PRIMM): piensas, no solo lees.</li>'
    +'<li><b>Ordenar piezas</b> (Parsons): aprendes la lógica sin pelear con la sintaxis — rampa ideal para empezar.</li>'
    +'<li><b>Escribir de memoria</b>: el techo alto, con pistas solo si las pides.</li>'
    +'<li>Todo es <b>producir</b>, no adivinar entre 4 opciones.</li></ul></div>'
    +'<div class="why" style="text-align:left"><div class="t">💬 ¿Y bien?</div>Esta es la muestra. Si te gustó el <i>feel</i>, el siguiente paso es llevar este motor a todas las salas y al Mundo 2.</div>'
    +'<div class="nextrow" style="justify-content:center"><button class="pbtn" id="prep">↺ Repetir muestra</button><button class="pbtn mint" id="pexit">Volver al juego ▶</button></div>';
  $("main").innerHTML=protoFrame(2,inner).replace('class="dots">','class="dots" style="opacity:.4">');protoPortrait();
  typeInto($("psay"),"¡Eso es una sala de verdad! Dime qué te pareció y la pulimos.");
  $("pbk").onclick=protoExit;$("prep").onclick=function(){PROTO=null;openProto()};$("pexit").onclick=protoExit;
}
function protoExit(){PROTO=null;try{history.replaceState(null,"",location.pathname)}catch(e){}location.reload()}

if(typeof window!=="undefined"&&location.hash==="#proto")setTimeout(openProto,30);
