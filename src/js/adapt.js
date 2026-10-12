
/* ================= NIVEL ADAPTATIVO ================= */
var LVL_INFO=[
 {ic:"🌱",nm:"Nunca he programado",d:"Empiezas desde cero: qué es programar, números, variables, decisiones, listas y funciones. Ejercicios de rellenar espacios, palabras explicadas y ayuda en cuanto te atores."},
 {ic:"🌿",nm:"Sé un poco de programación",d:"Un repaso rápido de Python y luego a los problemas de entrevista, paso a paso, descubriendo cada idea."},
 {ic:"🌳",nm:"Ya programo, quiero algoritmos",d:"Te saltas lo básico. Cada clase trae un ⚡ reto directo: si lo resuelves, la clase cuenta como vista. Pistas solo si las pides."}];
function userLvl(){return ST.lvl===undefined?1:ST.lvl}
function lessonOn(l){var v=l.lv;if(!v)return true;var u=userLvl();return u>=v[0]&&u<=v[1]}
floorLessons=function(w,f){return (LESSONS[key(w,f)]||[]).filter(lessonOn)};

/* ---- glosario: palabras explicadas para quien empieza ---- */
var GLOSS=[
 ["programa","Una lista de instrucciones que la computadora sigue en orden, de arriba hacia abajo."],
 ["print","Instrucción que muestra en pantalla lo que pongas entre paréntesis."],
 ["texto","Datos de letras. En Python va entre comillas: \"hola\". También se le dice string o str."],
 ["variable","Una caja con nombre donde guardas un valor: edad = 25."],
 ["lista","Varios valores en orden, entre corchetes: [4, 8, 15]. Las posiciones empiezan en 0."],
 ["índice","La posición de un elemento en una lista. El primero es el 0."],
 ["ciclo","Código que se repite. for x in lista: repite una vez por elemento."],
 ["for","Ciclo que recorre una lista o un range, elemento por elemento."],
 ["range","Genera números seguidos: range(1, 4) → 1, 2, 3 (el final no se incluye)."],
 ["sangría","Los 4 espacios al inicio de una línea. Indican qué líneas están dentro de un if, for o def."],
 ["condición","Una pregunta de sí o no que Python responde con True o False, como x > 3."],
 ["True","«Verdadero» o «sí». La respuesta a una pregunta que se cumple."],
 ["False","«Falso» o «no». La respuesta a una pregunta que no se cumple."],
 ["función","Código con nombre que recibe datos (parámetros) y regresa un resultado con return."],
 ["parámetro","Un dato que recibe una función, entre los paréntesis: en doble(x), x es el parámetro."],
 ["return","Entrega el resultado de una función a quien la llamó, y la termina."],
 ["diccionario","Guarda pares llave → valor, como una agenda: nombre → teléfono. Buscar una llave es instantáneo."],
 ["llave","El «nombre» con el que buscas en un diccionario."],
 ["residuo","Lo que sobra al dividir. Se escribe con %: 7 % 2 = 1."],
 ["acumulador","Una variable que empieza en 0 y a la que le vas sumando dentro de un ciclo."],
 ["bug","Un error en el código. «Debuggear» es encontrarlo y arreglarlo."],
 ["O(n)","El tiempo crece igual que los datos: el doble de datos, el doble de tiempo. Típico de recorrer una lista una vez."],
 ["O(n²)","Por cada elemento recorres todos otra vez. Con 10× más datos tarda 100× más. Suele ser demasiado lento."],
 ["O(1)","Tiempo constante: igual de rápido con 10 datos que con un millón."],
 ["fuerza bruta","Probar todas las posibilidades. Funciona, pero suele ser lenta."]];
function glossFor(text){if(userLvl()>1||!text)return [];var t=" "+text.toLowerCase()+" ";
  return GLOSS.filter(function(g){var w=g[0].toLowerCase();var i=t.indexOf(w);if(i<0)return false;var a=t[i-1],b=t[i+w.length];return !/[a-záéíóúñ0-9_]/i.test(a||" ")&&!/[a-záéíóúñ0-9_]/i.test(b||" ")}).slice(0,5)}
function glossHTML(text){var g=glossFor(text);if(!g.length)return "";
  return '<div class="gloss"><span>📘 Palabras nuevas:</span>'+g.map(function(x,i){return '<button class="gw" data-g="'+i+'">'+esc(x[0])+'</button>'}).join("")+'<div class="gdef" id="gdef" hidden></div></div>'}
function wireGloss(text){var g=glossFor(text),box=$("gdef");if(!box)return;
  [].forEach.call(document.querySelectorAll(".gloss .gw"),function(b){b.onclick=function(){var x=g[+b.dataset.g],same=!box.hidden&&box.dataset.k===b.dataset.g;
    [].forEach.call(document.querySelectorAll(".gloss .gw"),function(o){o.classList.remove("on")});
    if(same){box.hidden=true;return}b.classList.add("on");box.dataset.k=b.dataset.g;box.innerHTML='<b>'+esc(x[0])+'</b> '+esc(x[1]);box.hidden=false}})}

/* ---- estructura con huecos, generada desde la solución ---- */
function scaffold(sol,keep){var K={};(keep||"").split("\n").forEach(function(x){x=x.replace(/\s+#.*$/,"").trim();if(x)K[x]=1});
  return sol.split("\n").map(function(l){var ind=(l.match(/^ */)||[""])[0],t=l.slice(ind.length),m;
    if(!t||K[t.replace(/\s+#.*$/,"")]||/^#/.test(t)||/^def /.test(t)||/^(else|try|finally):/.test(t)||t==="pass"||t==="break"||t==="continue")return l;
    if((m=t.match(/^for (.+?) in (.+):$/)))return ind+"for "+m[1]+" in ___:";
    if((m=t.match(/^(if|elif|while) (.+):$/)))return ind+m[1]+" ___:";
    if(/^return\b/.test(t))return ind+(t==="return"?"return":"return ___");
    if((m=t.match(/^([\w\[\]\."', ]+?)\s*(=|\+=|-=|\*=)\s*(.+)$/))&&!/==/.test(t.slice(0,t.indexOf(m[2])+2)))return ind+m[1]+" "+m[2]+" ___";
    if((m=t.match(/^([\w\.]+)\((.*)\)$/)))return ind+m[1]+"(___)";
    return l}).join("\n")+"\n"}
function autoStarter(s){if(!s.carry&&s.starter!==undefined)return s.starter;var sol=s.solution||"";
  var lines=sol.split("\n");if(/^def /.test(lines[0]))return lines[0]+"\n    # tu código aquí\n    pass\n";return "# escribe tu solución aquí\n"}

/* ---- hl: resalta los huecos ___ ---- */
var _hlA=hl;hl=function(c){return _hlA(c).replace(/___/g,'<span class="blank">___</span>')};

/* ---- selector de nivel ---- */
function levelPicker(first){closeProfile();
  var h='<div class="modal lvmodal" id="modal"><div class="mcard"><button class="mx" id="mx" title="Cerrar (Esc)">✕</button>'
   +'<div class="mlab">'+(first?'¡BIENVENIDO A ALGORITHM VILLA!':'NIVEL DE EXPERIENCIA')+'</div><h2 class="lvh">¿Cuánta experiencia tienes programando?</h2>'
   +'<p class="lvp">Así adapto las clases a ti. Puedes cambiarlo cuando quieras desde tu ficha (toca tu foto arriba a la izquierda).</p><div class="lvopts" id="lvbody">'
   +LVL_INFO.map(function(x,i){return '<button class="lvopt'+(ST.lvl===i?' cur':'')+'" data-l="'+i+'"><span class="lvic">'+x.ic+'</span><span><b>'+esc(x.nm)+'</b><small>'+esc(x.d)+'</small></span></button>'}).join("")
   +'<button class="lvopt quiz" id="lvquiz"><span class="lvic">🤔</span><span><b>No estoy seguro</b><small>Respóndeme 4 preguntas rápidas y te recomiendo un nivel.</small></span></button></div></div></div>';
  var d=document.createElement("div");d.innerHTML=h;document.body.appendChild(d.firstChild);
  $("mx").onclick=function(){if(ST.lvl===undefined)setLvl(first?0:1);else closeProfile()};
  wireLvOpts();$("lvquiz").onclick=placement;HELD=[]}
function wireLvOpts(){[].forEach.call(document.querySelectorAll(".lvopt[data-l]"),function(b){b.onclick=function(){setLvl(+b.dataset.l)}})}
function setLvl(i){ST.lvl=i;save();closeProfile();
  toast(LVL_INFO[i].ic+" Nivel: "+LVL_INFO[i].nm);
  if(document.body.classList.contains("bmode")&&typeof LASTW==="number"&&!LES&&!RUN)building(LASTW);
  else if(typeof questUI==="function"&&MAPON)questUI()}
var PLACE=[
 {q:"¿Qué hace esta línea?",code:'print("hola")',o:["Muestra hola en la pantalla","Manda a imprimir hola en papel","Guarda la palabra hola","No lo sé"],ok:0},
 {q:"Después de este código, ¿cuánto vale x?",code:"x = 3\nx = x + 2",o:["5","3","32","No lo sé"],ok:0},
 {q:"¿Qué imprime este código?",code:"nums = [4, 1, 3]\ntotal = 0\nfor n in nums:\n    if n > 2:\n        total += n\nprint(total)",o:["7","8","3","No lo sé"],ok:0},
 {q:"Necesitas saber al instante si un número ya apareció antes. ¿Qué estructura usas?",code:"",o:["Un diccionario o un set (búsqueda O(1))","Una lista, recorriéndola cada vez","Ordenar la lista cada vez","No lo sé"],ok:0}];
function placement(){var i=0,score=0,body=$("lvbody");
  function q(){var P=PLACE[i];
    body.innerHTML='<div class="plq"><div class="mlab">PREGUNTA '+(i+1)+' DE '+PLACE.length+'</div><b>'+esc(P.q)+'</b>'+(P.code?'<pre class="code">'+hl(P.code)+'</pre>':'')
     +'<div class="plo">'+P.o.map(function(o,k){return '<button class="opt" data-k="'+k+'"><span class="k">'+"ABCD"[k]+'</span><span>'+esc(o)+'</span></button>'}).join("")+'</div></div>';
    [].forEach.call(body.querySelectorAll(".opt"),function(b){b.onclick=function(){if(+b.dataset.k===P.ok)score++;i++;if(i<PLACE.length)q();else done()}})}
  function done(){var lv=score<=1?0:(score<=3?1:2),x=LVL_INFO[lv];
    body.innerHTML='<div class="plq"><div class="mlab">RESULTADO · '+score+' DE '+PLACE.length+'</div><p>Te recomiendo empezar en:</p>'
     +'<button class="lvopt cur" data-l="'+lv+'"><span class="lvic">'+x.ic+'</span><span><b>'+esc(x.nm)+'</b><small>'+esc(x.d)+'</small></span></button>'
     +'<p class="lvp">¿Prefieres otro? Elige:</p><div class="lvmini">'+LVL_INFO.map(function(y,k){return k===lv?'':'<button class="pbtn" data-l="'+k+'">'+y.ic+' '+esc(y.nm)+'</button>'}).join("")+'</div></div>';
    [].forEach.call(body.querySelectorAll("[data-l]"),function(b){b.onclick=function(){setLvl(+b.dataset.l)}})}
  q()}

/* ---- ficha: mostrar y cambiar el nivel ---- */
var _openProfileA=openProfile;
openProfile=function(){_openProfileA();var m=document.querySelector("#modal .mlvl");if(!m)return;var x=LVL_INFO[userLvl()];
  var d=document.createElement("div");d.className="mexp";d.innerHTML='<span class="lvic">'+x.ic+'</span><div style="flex:1;min-width:0"><div class="mlab">NIVEL DE EXPERIENCIA</div><b>'+esc(x.nm)+'</b></div><button class="pbtn" id="chlvl">Cambiar</button>';
  m.parentNode.insertBefore(d,m.nextSibling);$("chlvl").onclick=function(){levelPicker(false)}};
$("avab").onclick=openProfile;$("whob").onclick=openProfile;

/* ---- primera vez: preguntar el nivel ---- */

window.__LESF=function(){return floorLessons(0,0)};
