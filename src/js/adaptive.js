
/* ================= DIFICULTAD ADAPTATIVA (regla del 85%) =================
   Mide el desempeño reciente y ajusta cuánto andamiaje recibe el jugador:
   - Al que batalla → la rampa completa (predecir→ordenar→completar→escribir).
   - Al que domina → directo a escribir / debuggear / caso borde.
   Objetivo: mantener a cada quien cerca de ~85% de aciertos, su zona óptima.
   Usa ST.perf (últimos resultados) y el nivel elegido (userLvl). */

var CH_ORD={predict:0,parsons:1,blanks:2,trace:3,debug:4,write:5,code:5,edge:6,pat:7,cx:8,con:9};
var ADAPT_WIN=12;

function adaptRecord(ok){if(!ST.perf)ST.perf=[];ST.perf.push(ok?1:0);if(ST.perf.length>ADAPT_WIN)ST.perf=ST.perf.slice(-ADAPT_WIN)}
function adaptAcc(){
  var p=ST.perf||[];
  if(p.length<4){var lv=(typeof userLvl==="function")?userLvl():1;return lv===0?0.7:(lv===2?0.95:0.82)}
  var s=0;for(var i=0;i<p.length;i++)s+=p[i];return s/p.length;
}
/* 0 = máximo andamiaje · 1 = normal · 2 = mínimo andamiaje */
function adaptTier(){
  var acc=adaptAcc(),lv=(typeof userLvl==="function")?userLvl():1;
  if(acc<0.6||(lv===0&&acc<0.8))return 0;
  if(acc>0.9||lv===2)return 2;
  return 1;
}
function adaptHintGiveUp(){var t=adaptTier();return t<=0?2:(t>=2?4:3)}

/* Elige, para una sala, qué retos jugar según el desempeño (targeting 85%). */
function adaptRoomList(r){
  if(!r||!r.cases)return [];
  var cs=r.cases.slice().sort(function(a,b){return (CH_ORD[a.t]==null?99:CH_ORD[a.t])-(CH_ORD[b.t]==null?99:CH_ORD[b.t])});
  var prod=cs.filter(function(c){return typeof isProdChallenge==="function"&&isProdChallenge(c.t)});
  var mcq=cs.filter(function(c){return c.t==="pat"||c.t==="cx"});
  if(!prod.length)return cs.slice();                 // mundos aún sin producción: todo igual
  var of=function(t){return prod.filter(function(c){return c.t===t})};
  var pick=[],seen=[];
  function add(a){a.forEach(function(c){if(seen.indexOf(c)<0){seen.push(c);pick.push(c)}})}
  var tier=adaptTier();
  if(tier<=0){ add(of("predict"));add(of("trace"));add(of("parsons"));add(of("blanks"));add(of("write"));add(of("debug"));add(of("edge")); }
  else if(tier===1){ add(of("predict").slice(0,1));add(of("parsons").slice(0,1));add(of("blanks").slice(0,1));add(of("write"));add(of("debug"));add(of("edge")); }
  else { var hard=of("write").concat(of("debug")).concat(of("edge"));add(hard.length?hard:prod.slice(-1)); }
  if(!pick.length)add(prod);
  var closer=mcq.filter(function(c){return c.t==="pat"})[0]||mcq[0];if(closer)pick.push(closer);
  pick.sort(function(a,b){return (CH_ORD[a.t]==null?99:CH_ORD[a.t])-(CH_ORD[b.t]==null?99:CH_ORD[b.t])});
  return pick;
}

/* Al resolver un reto, acredita los más fáciles del mismo problema:
   si puedes ESCRIBIR Two Sum, ya dominas predecirlo y ordenarlo. */
function creditEasier(c){
  if(!RUN||RUN.mode!=="room"||typeof curRoom!=="function")return;
  var r=curRoom();if(!r||!r.cases)return;var lim=CH_ORD[c.t];if(lim==null)return;
  r.cases.forEach(function(k){if(k===c)return;var o=CH_ORD[k.t];
    if(o!=null&&o<lim&&typeof isProdChallenge==="function"&&isProdChallenge(k.t)&&!ST.solved[k._id])ST.solved[k._id]=1});
}
if(typeof window!=="undefined")window.__ADAPT={acc:adaptAcc,tier:adaptTier,list:adaptRoomList};
