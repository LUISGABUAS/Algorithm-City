
/* ================= CONCEPTOS · REPASO JUST-IN-TIME =================
   "La memoria que se desvanece": si un concepto ya visto se está olvidando
   (su repaso espaciado está VENCIDO), lo refrescamos justo dentro del reto.
   Reutiliza ST.srs (Leitner) como señal de memoria; no inventa otro sistema. */

var CONCEPTS={
 print:{nm:"print()",blurb:"Muestra en pantalla lo que pongas entre paréntesis.",ex:{code:'print("hola")',out:"hola"},ref:"py0"},
 variable:{nm:"Variables",blurb:"Una caja con nombre: x = 5 guarda un valor. = asigna; == compara.",ex:{code:"x = 3\nx = x + 2\nprint(x)",out:"5"},ref:"py0"},
 ifelse:{nm:"if / else",blurb:"Ejecuta un bloque solo si la condición es verdadera; else si no. x % 2 == 0 = «par».",ex:{code:'x = 4\nif x % 2 == 0:\n    print("par")\nelse:\n    print("impar")',out:"par"},ref:"py0"},
 forloop:{nm:"Ciclo for",blurb:"Repite una vez por elemento. range(1, n + 1) recorre del 1 al n.",ex:{code:"for x in [4, 8]:\n    print(x)",out:"4\n8"},ref:"py0"},
 list:{nm:"Listas",blurb:"Varios valores en orden. nums[0] es el primero; len(nums) cuenta.",ex:{code:"nums = [4, 8, 15]\nprint(nums[0], len(nums))",out:"4 3"},ref:"py0"},
 index:{nm:"Índices",blurb:"Las posiciones empiezan en 0; nums[-1] es el último.",ex:{code:"nums = [4, 8, 15]\nprint(nums[-1])",out:"15"},ref:"py0"},
 func_return:{nm:"Funciones y return",blurb:"def crea una función; return entrega el resultado (print solo muestra).",ex:{code:"def doble(x):\n    return x * 2\nprint(doble(3))",out:"6"},ref:"py0"},
 accumulator:{nm:"Acumulador",blurb:"Una variable que empieza en 0 y suma dentro del ciclo.",ex:{code:"total = 0\nfor x in [1, 2, 3]:\n    total += x\nprint(total)",out:"6"},ref:"runsum"},
 enumerate:{nm:"enumerate()",blurb:"Da índice y valor a la vez: for i, x in enumerate(nums).",ex:{code:"for i, x in enumerate([9, 8]):\n    print(i, x)",out:"0 9\n1 8"},ref:"twosum"},
 dict:{nm:"Diccionarios",blurb:"Guardan llave → valor y responden «llave in d» al instante, O(1).",ex:{code:'d = {"ana": 20}\nprint(d["ana"], "ana" in d)',out:"20 True"},ref:"twosum"},
 dict_get:{nm:"d.get(llave, 0)",blurb:"Devuelve el valor, o un default si la llave no existe. Ideal para contar.",ex:{code:'d = {}\nd["a"] = d.get("a", 0) + 1\nprint(d)',out:"{'a': 1}"},ref:"count"},
 set:{nm:"Sets",blurb:"Como un diccionario de solo llaves: x in set es O(1).",ex:{code:"v = set()\nv.add(3)\nprint(3 in v)",out:"True"},ref:"sets"},
 string:{nm:"Strings",blurb:"Se indexan como listas: s[0], len(s), s[:3] (slice).",ex:{code:'s = "flotar"\nprint(s[0], s[:3])',out:"f flo"},ref:"lcp"},
 twoptr:{nm:"Dos punteros",blurb:"i al inicio y j al final (o leer/escribir): avanzan según la condición.",ex:{code:"i, j = 0, 4\nwhile i < j:\n    i += 1\n    j -= 1\nprint(i, j)",out:"2 2"},ref:"palin"},
 prefix:{nm:"Sumas de prefijo",blurb:"El acumulado hasta cada posición; cada paso guarda el total.",ex:{code:"total = 0\nfor x in [1, 2, 3]:\n    total += x\n    print(total)",out:"1\n3\n6"},ref:"runsum"},
 bigo:{nm:"Complejidad (Big-O)",blurb:"O(n) recorre una vez; O(n²) por cada uno recorres todos (lento); O(1) instantáneo.",ex:{code:"# 'x in lista'  -> O(n)\n# 'x in set'    -> O(1)",out:""},ref:"twosum"},
 window:{nm:"Ventana deslizante",blurb:"Una ventana [i..j] que crece y encoge: sumas al entrar, restas al salir.",ex:{code:"# ventana [i..j] sobre la lista\n# suma al avanzar j; resta al avanzar i",out:""}},
 bsearch:{nm:"Búsqueda binaria",blurb:"En datos ordenados, parte a la mitad cada vez: O(log n).",ex:{code:"# lo, hi = 0, len(a) - 1\n# mid = (lo + hi) // 2",out:""}}
};

/* patrón de la sala (r.pattern) -> conceptos prerrequisito */
var PATTERN2CONCEPT={
 "Hash map":["dict"],"Hash set":["set"],"Conteo de frecuencias":["dict_get"],"Conteo":["dict_get"],"Bucket sort":["dict","list"],
 "Two pointers":["twoptr"],"Fast y slow pointers":["twoptr"],"Sliding window":["window"],"Prefix sum":["prefix"],
 "Una pasada":["forloop","accumulator"],"Kadane":["accumulator"],"Arrays":["list","index"],"Acarreo":["list","index"],
 "Simulación":["forloop","ifelse"],"Strings":["string"],"Matemática":["variable"],"Binary search":["bsearch"],
 "Stack":["list"],"Stack monótono":["list"]
};

var LESSON_CONCEPTS={
 py0:["print","variable","list","index","forloop","ifelse","func_return","accumulator"],
 fizz:["forloop","ifelse","list","string"],
 twosum:["dict","enumerate","bigo","forloop"],
 runsum:["accumulator","forloop","list","prefix"],
 plusone:["list","index","forloop","ifelse"],
 movez:["twoptr","list","forloop"],
 sets:["set","bigo","forloop"],
 count:["dict_get","dict","string","forloop"],
 rev2sum:["dict","enumerate","bigo"],
 lcp:["string","index","forloop"],
 profit:["accumulator","bigo","forloop"],
 palin:["twoptr","string"]
};
function lessonConcepts(L){return (L&&(L.concepts||LESSON_CONCEPTS[L.id]))||[]}

/* ---- estado de memoria por concepto (a partir del repaso espaciado) ---- */
function itemConcepts(id,it){
  if(it.kind==="case"){var x=(typeof caseById==="function")&&caseById(it.ref.cid);if(!x)return [];var p=x.r&&x.r.pattern;return (p&&PATTERN2CONCEPT[p])||[]}
  var l=(typeof lessonById==="function")&&lessonById(it.ref.lid);return l?lessonConcepts(l.L):[]
}
/* "stale" = tiene repaso VENCIDO (se está olvidando). "new" = nunca practicado. "fresh" = al día. */
function conceptState(cid){
  var db=(typeof srsDB==="function")?srsDB():{},t=(typeof srsToday==="function")?srsToday():"9999",seen=false,overdue=false;
  for(var id in db){var it=db[id];if(itemConcepts(id,it).indexOf(cid)<0)continue;seen=true;if(it.due<=t)overdue=true}
  return !seen?"new":(overdue?"stale":"fresh");
}
function remediationFor(cids){var out=[],seen={};(cids||[]).forEach(function(c){if(CONCEPTS[c]&&!seen[c]&&conceptState(c)==="stale"){seen[c]=1;out.push(c)}});return out}
function roomConcepts(r,c){var cs=((r&&r.pattern&&PATTERN2CONCEPT[r.pattern])||[]).slice();if(c&&c.t==="cx"&&cs.indexOf("bigo")<0)cs.push("bigo");return cs}

/* ---- UI: tarjeta de refresco ("memoria que se desvanece") ---- */
function conceptCardHTML(cid){var C=CONCEPTS[cid];if(!C)return "";
  var ex=C.ex&&C.ex.code?'<pre class="code">'+hl(C.ex.code)+'</pre>'+(C.ex.out?'<div class="rmout">→ '+esc(C.ex.out)+'</div>':''):'';
  return '<div class="rmcard"><b>'+esc(C.nm)+'</b><span>'+esc(C.blurb)+'</span>'+ex+(C.ref&&lessonById(C.ref)?'<button class="pbtn rmgo" data-lid="'+esc(C.ref)+'">📖 Ver la clase ▶</button>':'')+'</div>'}
function remindBar(cids){if(!cids||!cids.length)return "";
  var names=cids.map(function(c){return CONCEPTS[c]?CONCEPTS[c].nm:c}).join(" · ");
  return '<details class="remind"><summary>🔁 Tu memoria de <b>'+esc(names)+'</b> se está desvaneciendo — tócalo para refrescar</summary>'+cids.map(conceptCardHTML).join("")+'</details>'}
function wireRemind(host){host=host||document;[].forEach.call(host.querySelectorAll(".rmgo"),function(b){b.onclick=function(){
  var lid=b.dataset.lid,l=(typeof lessonById==="function")&&lessonById(lid);if(!l)return;
  var ls=floorLessons(l.w,l.f),li=0;for(var i=0;i<ls.length;i++)if(ls[i].id===lid){li=i;break}
  LES=null;RUN=null;REV=null;if(tick){clearInterval(tick);tick=null}
  fadeTo(function(){openLesson(l.w,l.f,li)})}})}
if(typeof window!=="undefined")window.__CONC={state:conceptState,CONCEPTS:CONCEPTS,remediationFor:remediationFor};
