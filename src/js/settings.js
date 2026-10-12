
/* ================= CONFIGURACIÓN · MÚSICA · EFECTOS · VOZ ================= */
var CFG_KEY="algorithm-villa-cfg";
var CFG_DEF={vol:70,sfx:70,mus:40,style:"chip",musicOn:true,tts:false,ttsRate:1.1,zoom:1,fx:true,labels:true,hint:true,txt:"normal",rm:false,walk:"normal",revWarn:true,size:100,plain:false,hc:false};
var CFG=(function(){var c={};try{c=JSON.parse(localStorage.getItem(CFG_KEY)||"{}")||{}}catch(e){}for(var k in CFG_DEF)if(c[k]===undefined)c[k]=CFG_DEF[k];return c})();
var CFG_SAVED=0;
function cfgSave(){try{localStorage.setItem(CFG_KEY,JSON.stringify(CFG))}catch(e){}CFG_SAVED=Date.now();applyCfg()}
function CFG_FX(){return CFG.fx&&!CFG.rm}

/* ---------- audio ---------- */
var AU={ctx:null,master:null,mus:null,sfx:null,noise:null,playing:false,song:null,queue:[],step:0,next:0,timer:0,crackle:null};
var STYLES={
 chip:{nm:"Chiptune 8 bits",songs:["Commit inicial","Bucle infinito","Índice cero","Pila de llamadas","Push a main","Hola, mundo"],bpm:[124,148]},
 lofi:{nm:"Lo-fi para estudiar",songs:["Debug a las 2 a.m.","Café y recursión","Lluvia en el servidor","Notas de la entrevista","Pausa para el café","Árbol binario al atardecer"],bpm:[70,84]},
 synth:{nm:"Synthwave",songs:["Neón O(1)","Autopista de bits","Hash nocturno","Retro compilador","Ciudad de datos","Ventana deslizante"],bpm:[96,112]},
 epic:{nm:"Épica / orquestal",songs:["La Torre","Acreditación","El jurado","Grafos del archipiélago","Ascenso a Staff","Big Tech"],bpm:[82,96]}};
var PROGS=[[0,5,3,4],[0,3,4,4],[5,3,0,4],[0,4,5,3],[0,5,1,4],[5,4,3,4]];
function rngS(seed){var s=seed>>>0||1;return function(){s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}}
function audioInit(){if(AU.ctx)return true;var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
  try{AU.ctx=new AC()}catch(e){return false}var c=AU.ctx;
  AU.master=c.createGain();AU.master.connect(c.destination);AU.mus=c.createGain();AU.mus.connect(AU.master);AU.sfx=c.createGain();AU.sfx.connect(AU.master);
  var len=c.sampleRate,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);for(var i=0;i<len;i++)d[i]=Math.random()*2-1;AU.noise=b;
  audioVol();document.addEventListener("visibilitychange",function(){if(!AU.ctx)return;if(document.hidden)AU.ctx.suspend();else AU.ctx.resume()});return true}
function audioVol(){if(!AU.ctx)return;var t=AU.ctx.currentTime;AU.master.gain.setTargetAtTime(CFG.vol/100,t,.05);AU.mus.gain.setTargetAtTime(CFG.musicOn?CFG.mus/100*.55:0,t,.1);AU.sfx.gain.setTargetAtTime(CFG.sfx/100*.8,t,.05)}
function mtof(m){return 440*Math.pow(2,(m-69)/12)}
function tone(bus,type,f,t,dur,g,o){o=o||{};var c=AU.ctx,os=c.createOscillator(),ga=c.createGain(),node=os;os.type=type;os.frequency.setValueAtTime(f,t);if(o.det)os.detune.value=o.det;
  if(o.slide)os.frequency.exponentialRampToValueAtTime(o.slide,t+dur);
  if(o.lp){var fl=c.createBiquadFilter();fl.type="lowpass";fl.frequency.value=o.lp;os.connect(fl);node=fl}
  node.connect(ga);ga.connect(bus);var a=o.a||.005,r=o.r||dur*.6;ga.gain.setValueAtTime(0,t);ga.gain.linearRampToValueAtTime(g,t+a);ga.gain.setValueAtTime(g,t+Math.max(a,dur-r));ga.gain.exponentialRampToValueAtTime(.0001,t+dur);
  os.start(t);os.stop(t+dur+.05)}
function noiseHit(bus,t,dur,g,hp,lp){var c=AU.ctx,s=c.createBufferSource(),ga=c.createGain(),f=c.createBiquadFilter();s.buffer=AU.noise;f.type=hp?"highpass":"lowpass";f.frequency.value=hp||lp||2000;s.connect(f);f.connect(ga);ga.connect(bus);
  ga.gain.setValueAtTime(g,t);ga.gain.exponentialRampToValueAtTime(.0001,t+dur);s.start(t,Math.random()*.5);s.stop(t+dur+.02)}
function kick(bus,t,g){tone(bus,"sine",150,t,.22,g,{slide:42,a:.002,r:.2})}
function newSong(){var st=STYLES[CFG.style];if(!AU.queue.length||AU.queue.style!==CFG.style){AU.queue=st.songs.map(function(_,i){return i});for(var i=AU.queue.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var x=AU.queue[i];AU.queue[i]=AU.queue[j];AU.queue[j]=x}AU.queue.style=CFG.style}
  var idx=AU.queue.shift(),seed=hash(idx+7,CFG.style.length*31),r=rngS(seed);
  AU.song={style:CFG.style,name:st.songs[idx],seed:seed,bpm:st.bpm[0]+Math.floor(r()*(st.bpm[1]-st.bpm[0])),root:[57,55,60,52,62,59][idx%6],minor:CFG.style==="chip"?r()<.4:r()<.7,prog:PROGS[Math.floor(r()*PROGS.length)],bars:32};
  AU.step=0;var np=$("cfgnow");if(np)np.textContent="Sonando: «"+AU.song.name+"»"}
function chordAt(bar){var S=AU.song,sc=S.minor?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11],d=S.prog[bar%4];function n(k){return S.root+sc[(d+k)%7]+12*Math.floor((d+k)/7)}return {r:n(0),t:[n(0),n(2),n(4),n(6)],sc:sc}}
function schedStep(t){var S=AU.song,st=AU.step,bar=Math.floor(st/16),s=st%16,ch=chordAt(bar),B=AU.mus,sd=60/S.bpm/4,r=rngS(S.seed+bar*97+s);
  if(bar>=S.bars){newSong();return}
  var sec=Math.floor(bar/8)%4,intro=bar<2;
  if(S.style==="chip"){
    if(s%4===0)tone(B,"triangle",mtof(ch.r-12),t,sd*3,.22);if(s===6||s===14)tone(B,"triangle",mtof(ch.r),t,sd,.16);
    if(!intro)tone(B,"square",mtof(ch.t[[0,1,2,1][s%4]]+12),t,sd*.9,.035);
    if(sec!==0&&r()<.42&&s%2===0){var note=ch.r+24+ch.sc[Math.floor(r()*7)]-ch.sc[0];tone(B,"square",mtof(note),t,sd*2,.05,{r:sd})}
    if(s===0||s===8||(s===10&&sec>1))kick(B,t,.5);if(s===4||s===12)noiseHit(B,t,.12,.22,1500);if(s%2===0)noiseHit(B,t,.03,.06,7000)}
  if(S.style==="lofi"){
    if(s===0)ch.t.forEach(function(m){tone(B,"triangle",mtof(m),t,sd*16,.045,{lp:900,a:.08,r:sd*6})});
    if(s===0||s===7||s===10)tone(B,"sine",mtof(ch.r-12),t,sd*3,.2,{a:.01});
    if(!intro&&r()<.18&&s%2===0)tone(B,"sine",mtof(ch.r+12+ch.sc[Math.floor(r()*7)]-ch.sc[0]),t,sd*3,.05,{lp:1500,a:.02});
    if(s===0||s===9)kick(B,t,.35);if(s===4||s===12)noiseHit(B,t,.18,.12,0,2200);if(s%2===0)noiseHit(B,t+(s%4===2?sd*.25:0),.025,.035,6000);
    if(r()<.08)noiseHit(B,t,.01,.05,3000)}
  if(S.style==="synth"){
    if(s===0)ch.t.slice(0,3).forEach(function(m){tone(B,"sawtooth",mtof(m),t,sd*16,.018,{lp:1300,a:.2,r:sd*6,det:7});tone(B,"sawtooth",mtof(m),t,sd*16,.018,{lp:1300,a:.2,r:sd*6,det:-7})});
    if(s%2===0)tone(B,"sawtooth",mtof(ch.r-12+(s%4===2?12:0)),t,sd*1.6,.06,{lp:600});
    if(!intro)tone(B,"sawtooth",mtof(ch.t[[0,1,2,3,2,1,2,3][s%8]]+12),t,sd*.8,.022,{lp:2600});
    if(s===0||s===8)kick(B,t,.55);if(s===4||s===12){noiseHit(B,t,.3,.2,1200);tone(B,"triangle",190,t,.12,.12)}if(s%2===1)noiseHit(B,t,.04,.05,8000)}
  if(S.style==="epic"){
    if(s===0)ch.t.slice(0,3).concat([ch.r+12]).forEach(function(m){tone(B,"sawtooth",mtof(m),t,sd*16,.016,{lp:1700,a:.35,r:sd*8,det:5});tone(B,"sawtooth",mtof(m-12),t,sd*16,.012,{lp:900,a:.4,r:sd*8,det:-5})});
    if(!intro&&(s===0||s===8||(s===12&&r()<.5))){var hn=ch.t[Math.floor(r()*3)]+12;tone(B,"square",mtof(hn),t,sd*(s===12?4:7),.03,{lp:1300,a:.05})}
    if(s===0||s===12||s===14)tone(B,"sine",mtof(ch.r-24),t,.5,.35,{slide:mtof(ch.r-24)*.8,a:.003});
    if(s===8&&sec>0)noiseHit(B,t,.6,.08,0,600)}
  AU.step++}
function musicTick(){if(!AU.ctx||!AU.playing||!AU.song)return;var c=AU.ctx;while(AU.next<c.currentTime+.15){var sd=60/AU.song.bpm/4;schedStep(AU.next);AU.next+=sd}}
function musicStart(){if(!audioInit())return;AU.ctx.resume();if(AU.playing)return;AU.playing=true;if(!AU.song||AU.song.style!==CFG.style)newSong();AU.next=AU.ctx.currentTime+.1;clearInterval(AU.timer);AU.timer=setInterval(musicTick,30)}
function musicStop(){AU.playing=false;clearInterval(AU.timer)}
function musicNext(){if(!AU.ctx)return;newSong();AU.next=AU.ctx.currentTime+.15}
function sfx(k){if(!AU.ctx||!CFG.sfx||!CFG.vol)return;var c=AU.ctx,t=c.currentTime+.01,B=AU.sfx;
  if(k==="click")tone(B,"square",880,t,.04,.05);
  if(k==="ok"){tone(B,"square",mtof(76),t,.09,.08);tone(B,"square",mtof(83),t+.08,.16,.08)}
  if(k==="bad"){tone(B,"sawtooth",220,t,.18,.07,{slide:140,lp:1200})}
  if(k==="level"){[72,76,79,84].forEach(function(m,i){tone(B,"square",mtof(m),t+i*.09,.14,.07)});tone(B,"triangle",mtof(60),t,.5,.12)}
  if(k==="pop")tone(B,"sine",660,t,.08,.08,{slide:990});
  if(k==="door")noiseHit(B,t,.25,.12,0,900);
  if(k==="coin"){tone(B,"square",mtof(83),t,.06,.06);tone(B,"square",mtof(88),t+.06,.14,.06)}}
/* primer gesto del usuario: arranca el audio */
function firstGesture(){document.removeEventListener("pointerdown",firstGesture,true);document.removeEventListener("keydown",firstGesture,true);if(audioInit()){if(CFG.musicOn&&CFG.mus>0)musicStart()}}
document.addEventListener("pointerdown",firstGesture,true);document.addEventListener("keydown",firstGesture,true);
/* efectos de sonido automáticos */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("button");if(b&&!b.classList.contains("opt"))sfx("click")},true);
new MutationObserver(function(ms){ms.forEach(function(m){
  if(m.type==="attributes"){var el=m.target;if(el.classList&&el.classList.contains("opt")){var was=(m.oldValue||"");if(el.classList.contains("ok")&&was.indexOf("ok")<0)sfx("ok");else if(el.classList.contains("bad")&&was.indexOf("bad")<0)sfx("bad")}return}
  m.addedNodes.forEach(function(n){if(n.nodeType!==1)return;var q=function(s){return n.matches&&n.matches(s)||n.querySelector&&n.querySelector(s)};
    if(q(".res.good"))sfx("ok");else if(q(".res.bad"))sfx("bad");else if(q(".big"))sfx("level")})})}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:["class"],attributeOldValue:true});
var _toastS=toast;toast=function(t){_toastS(t);sfx("pop")};
var _enterSoonS=enterSoon;enterSoon=function(w){sfx("door");_enterSoonS(w)};
var _hudS=hud,LVS=null;hud=function(){_hudS();var lv=levelInfo().lv;if(LVS!==null&&lv>LVS)sfx("level");LVS=lv};

/* ---------- voz ---------- */
var TTS=("speechSynthesis" in window)?window.speechSynthesis:null,VOICE=null;
function pickVoice(){if(!TTS)return;var v=TTS.getVoices();VOICE=v.filter(function(x){return /es[-_]MX/i.test(x.lang)})[0]||v.filter(function(x){return /^es/i.test(x.lang)})[0]||null}
if(TTS){pickVoice();TTS.onvoiceschanged=pickVoice}
function speak(text){if(!TTS)return;try{TTS.cancel();var u=new SpeechSynthesisUtterance(String(text).replace(/[«»]/g,""));u.lang="es-MX";if(VOICE)u.voice=VOICE;u.rate=CFG.ttsRate;TTS.speak(u)}catch(e){}}
var _typeIntoS=typeInto;
typeInto=function(el,text,done){
  if(el&&el.id==="say"){var host=el.parentNode;if(host&&TTS&&!host.querySelector(".spk")){var b=document.createElement("button");b.className="spk";b.title="Escuchar";b.setAttribute("aria-label","Escuchar");b.textContent="🔊";b.onclick=function(ev){ev.stopPropagation();speak(el._full||el.textContent)};host.insertBefore(b,host.firstChild.nextSibling)}
    if(CFG.tts)speak(text)}
  if(CFG.txt==="inst"||CFG.rm){if(TW)clearInterval(TW);TW=null;el._full=text;el.textContent=text;if(done)done();return}
  var sp={slow:1,normal:2,fast:4}[CFG.txt]||2;if(TW)clearInterval(TW);el.textContent="";var i=0;el._full=text;TW=setInterval(function(){i+=sp;el.textContent=text.slice(0,i);if(i>=text.length){clearInterval(TW);TW=null;if(done)done()}},18)};

/* ---------- aplicar ---------- */
function applyCfg(){var b=document.body.classList;b.toggle("nolabels",!CFG.labels);b.toggle("nohint",!CFG.hint);b.toggle("rm",CFG.rm);b.toggle("plain",CFG.plain);b.toggle("hc",CFG.hc);
  ["ts115","ts130"].forEach(function(k){b.remove(k)});if(CFG.size===115)b.add("ts115");if(CFG.size===130)b.add("ts130");
  SPEED=CFG.walk==="fast"?7.2:5.2;audioVol();if(AU.ctx){if(CFG.musicOn&&CFG.mus>0)musicStart();else musicStop()}
  if(typeof sizeView==="function")sizeView()}
var _sizeViewS=sizeView;
sizeView=function(){_sizeViewS();if(!CV||CFG.zoom===1)return;var mw=$("mw");if(!mw)return;var cw=Math.max(200,mw.clientWidth),ch=Math.max(200,mw.clientHeight);
  var sc=cw>=1400?3.2:cw>=900?2.8:cw>=600?2.4:2;sc=Math.max(sc*CFG.zoom,cw/WPX,ch/WPY);CV.width=Math.round(cw/sc)*2;CV.height=Math.round(ch/sc)*2;VW=CV.width/2/T;VH=CV.height/2/T;CX=CV.getContext("2d");CX.setTransform(2,0,0,2,0,0);CX.imageSmoothingEnabled=false};

/* ---------- ventana de configuración ---------- */
var CFGTAB="sound";
function openSettings(tab){if(tab)CFGTAB=tab;closeProfile();closeSettings();HELD=[];var d=document.createElement("div");d.id="cfgm";d.className="modal lvmodal";document.body.appendChild(d);renderSettings();
  d.onclick=function(e){if(e.target===d)closeSettings()}}
function closeSettings(){var d=$("cfgm");if(d)d.remove();clearInterval(closeSettings._t)}
function seg(key,opts){return '<div class="seg">'+opts.map(function(o){return '<button class="'+(CFG[key]===o[0]?'on':'')+'" data-seg="'+key+'" data-v="'+o[0]+'">'+esc(o[1])+'</button>'}).join("")+'</div>'}
function tog(key){return '<button class="tog'+(CFG[key]?' on':'')+'" data-tog="'+key+'" role="switch" aria-checked="'+!!CFG[key]+'"><i></i><span>'+(CFG[key]?'Sí':'No')+'</span></button>'}
function sld(key,min,max,stp,fmt){return '<div class="sld"><input type="range" min="'+min+'" max="'+max+'" step="'+(stp||1)+'" value="'+CFG[key]+'" data-sld="'+key+'" aria-label="'+key+'"><b id="sv-'+key+'">'+(fmt?fmt(CFG[key]):CFG[key]+' %')+'</b></div>'}
function row(t,sub,ctl){return '<div class="crow"><div><b>'+t+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</div><div class="cctl">'+ctl+'</div></div>'}
function renderSettings(){var d=$("cfgm");if(!d)return;var T=CFGTAB,h="";
  var tabs=[["sound","🔊","Sonido"],["gfx","🖥️","Gráficos"],["anim","✨","Animación"],["game","🎮","Juego"],["acc","♿","Acceso"],["acct","👤","Partida"]];
  if(T==="sound"){h='<h3>Sonido</h3><div class="csec">VOLUMEN</div>'+row("General","",sld("vol",0,100))+row("Efectos","Botones, aciertos, errores y niveles.",sld("sfx",0,100))+row("Música","Las canciones del estilo que elijas abajo.",sld("mus",0,100))
    +'<div class="csec">MÚSICA</div>'+row("Música encendida","",tog("musicOn"))+'<div class="cbox"><b>Estilo</b><small>Cada estilo trae sus propias canciones, compuestas para el juego. Suenan al azar y no se repite ninguna hasta que suenan todas.</small>'+seg("style",Object.keys(STYLES).map(function(k){return [k,STYLES[k].nm]}))+'</div>'
    +'<div class="cnow"><span id="cfgnow">'+(AU.song?'Sonando: «'+esc(AU.song.name)+'»':(AU.ctx?'Música en pausa':'La música empieza con tu primer clic'))+'</span><button class="pbtn mint" id="cfgnext">⏭ Siguiente canción</button></div>'
    +'<div class="csec">LECTURA EN VOZ ALTA</div>'+(TTS?'<p class="cnote">La Profe Ada lee sus explicaciones con la voz en español de tu dispositivo. También puedes tocar 🔊 junto a cualquier diálogo.</p>'+row("Leer cada explicación al aparecer","",tog("tts"))+row("Velocidad","1.1× suena natural.",sld("ttsRate",.7,1.6,.1,function(v){return (+v).toFixed(1)+"×"}))+'<button class="pbtn" id="cfgtest">▶ Probar voz</button>':'<p class="cnote">Tu navegador no tiene voz disponible.</p>')}
  if(T==="gfx")h='<h3>Gráficos</h3>'+row("Zoom del mapa","Qué tan cerca ves la ciudad.",seg("zoom",[[.8,"Lejos"],[1,"Normal"],[1.25,"Cerca"]]))+row("Efectos del ambiente","Mariposas, humo y brillos del agua.",tog("fx"))+row("Nombres de los edificios","Etiquetas sobre cada edificio del mapa.",tog("labels"));
  if(T==="anim")h='<h3>Animación</h3>'+row("Velocidad del texto","Cómo aparecen los diálogos.",seg("txt",[["slow","Lenta"],["normal","Normal"],["fast","Rápida"],["inst","Al instante"]]))+row("Velocidad al caminar","",seg("walk",[["normal","Normal"],["fast","Rápida"]]))+row("Reducir movimiento","Quita transiciones, texto animado y efectos.",tog("rm"));
  if(T==="game")h='<h3>Juego</h3>'+row("Nivel de experiencia",esc((LVL_INFO[userLvl()]||{}).nm||""),'<button class="pbtn" id="cfglvl">Cambiar</button>')+row("Aviso de repasos pendientes","Te avisa al entrar si tienes repasos hoy.",tog("revWarn"))+row("Ayuda de controles en el mapa","El letrero de abajo con las teclas.",tog("hint"))+row("Camino de niveles","Premios y XP de cada nivel.",'<button class="pbtn" id="cfgpath">Abrir</button>')+row("Vestidores","Cambia el look de tu personaje.",'<button class="pbtn" id="cfgvest">Abrir</button>');
  if(T==="acc")h='<h3>Acceso</h3>'+row("Tamaño del texto","En clases, salas y edificios.",seg("size",[[100,"100 %"],[115,"115 %"],[130,"130 %"]]))+row("Letra fácil de leer","Cambia las letras pixeladas por letras normales.",tog("plain"))+row("Alto contraste","Textos y bordes más claros.",tog("hc"))+row("Reducir movimiento","",tog("rm"));
  if(T==="acct")h='<h3>Partida</h3>'+row("Tu nombre","",'<input id="cfgname" maxlength="22" value="'+esc(ST.name||"")+'">')
    +'<div class="csec">RESPALDO</div><p class="cnote">Tu progreso vive en este navegador. Copia tu código de respaldo para pasarlo a otro dispositivo o guardarlo.</p><div class="trow"><button class="pbtn" id="cfgexp">📋 Copiar código de respaldo</button><button class="pbtn" id="cfgimpb">📥 Cargar un código</button></div><div id="cfgio"></div>'
    +'<div class="csec">PELIGRO</div><div class="trow"><button class="pbtn red" id="cfgreset">Empezar una nueva partida</button></div><div id="cfgconf"></div>';
  var ago=CFG_SAVED?Math.round((Date.now()-CFG_SAVED)/1000):-1;
  d.innerHTML='<div class="mcard cfgcard"><div class="cfghead"><span class="cfgic">⚙</span><div><b>Configuración</b><small id="cfgsaved">'+(ago<0?'Se guarda solo':ago<10?'Guardado hace un momento':'Guardado')+'</small></div><button class="mx" id="cfgx" title="Cerrar (Esc)">✕</button></div>'
   +'<div class="cfgbody"><nav class="cfgnav">'+tabs.map(function(t){return '<button class="'+(t[0]===T?'on':'')+'" data-ct="'+t[0]+'"><span>'+t[1]+'</span>'+t[2]+'</button>'}).join("")+'</nav><section class="cfgsec">'+h+'</section></div>'
   +'<div class="cfgfoot"><button class="pbtn" id="cfgtour">🗺️ Volver a la plaza</button><button class="pbtn" id="cfgmenu">⏏ Salir al menú principal</button></div></div>';
  $("cfgx").onclick=closeSettings;
  [].forEach.call(d.querySelectorAll("[data-ct]"),function(b){b.onclick=function(){CFGTAB=b.dataset.ct;renderSettings()}});
  [].forEach.call(d.querySelectorAll("[data-seg]"),function(b){b.onclick=function(){var k=b.dataset.seg,v=b.dataset.v;CFG[k]=isNaN(+v)?v:+v;if(k==="style"){if(AU.ctx){newSong();AU.next=AU.ctx.currentTime+.15}}cfgSave();renderSettings()}});
  [].forEach.call(d.querySelectorAll("[data-tog]"),function(b){b.onclick=function(){var k=b.dataset.tog;CFG[k]=!CFG[k];if(k==="musicOn"&&CFG[k])audioInit();cfgSave();renderSettings()}});
  [].forEach.call(d.querySelectorAll("[data-sld]"),function(inp){inp.oninput=function(){var k=inp.dataset.sld;CFG[k]=+inp.value;var o=$("sv-"+k);if(o)o.textContent=k==="ttsRate"?(+inp.value).toFixed(1)+"×":inp.value+" %";audioVol();if(k==="mus"&&CFG.mus>0&&CFG.musicOn)musicStart()};inp.onchange=function(){cfgSave();if(inp.dataset.sld==="sfx")sfx("ok")}});
  if($("cfgnext"))$("cfgnext").onclick=function(){if(!AU.ctx){audioInit()}if(!AU.playing){CFG.musicOn=true;cfgSave();musicStart()}else musicNext();setTimeout(renderSettings,50)};
  if($("cfgtest"))$("cfgtest").onclick=function(){speak("Hola, soy la Profe Ada. Vamos a resolver Two Sum paso a paso.")};
  if($("cfglvl"))$("cfglvl").onclick=function(){closeSettings();levelPicker(false)};
  if($("cfgpath"))$("cfgpath").onclick=function(){closeSettings();openLevelPath()};
  if($("cfgvest"))$("cfgvest").onclick=function(){closeSettings();openWardrobe("edit")};
  if($("cfgname"))$("cfgname").oninput=function(){ST.name=this.value.trim()||"Programador";save();hud()};
  if($("cfgexp"))$("cfgexp").onclick=function(){var code="AV1."+btoa(unescape(encodeURIComponent(JSON.stringify(ST))));$("cfgio").innerHTML='<textarea class="cfgta" readonly>'+esc(code)+'</textarea><small class="cnote" id="cfgcp"></small>';var ta=document.querySelector(".cfgta");
    try{navigator.clipboard.writeText(code).then(function(){$("cfgcp").textContent="✔ Copiado. Guárdalo en tus notas."},function(){ta.select();$("cfgcp").textContent="Selecciónalo y cópialo (Ctrl/⌘ + C)."})}catch(e){ta.select()}};
  if($("cfgimpb"))$("cfgimpb").onclick=function(){$("cfgio").innerHTML='<textarea class="cfgta" id="cfgin" placeholder="Pega aquí tu código AV1…"></textarea><div class="trow"><button class="pbtn mint" id="cfgimp">Cargar partida</button></div><small class="cnote" id="cfgimm"></small>';
    $("cfgimp").onclick=function(){var v=($("cfgin").value||"").trim();try{if(v.indexOf("AV1.")!==0)throw 0;var o=JSON.parse(decodeURIComponent(escape(atob(v.slice(4)))));if(!o||typeof o!=="object"||!o.solved)throw 0;ST=o;save();buildPlayer();hud();if(typeof questUI==="function")questUI();$("cfgimm").textContent="✔ Partida cargada.";toast("✔ Partida de "+(ST.name||"Programador")+" cargada")}catch(e){$("cfgimm").textContent="Ese código no es válido. Revisa que lo copiaste completo."}}};
  if($("cfgreset"))$("cfgreset").onclick=function(){$("cfgconf").innerHTML='<div class="tconf"><b>¿Empezar de cero?</b><span>Se borra tu progreso de este navegador. Si quieres conservarlo, copia antes tu código de respaldo.</span><div class="trow"><button class="pbtn" id="cfgno">Cancelar</button><button class="pbtn red" id="cfgyes">Sí, borrar y empezar</button></div></div>';
    $("cfgno").onclick=function(){$("cfgconf").innerHTML=""};$("cfgyes").onclick=function(){closeSettings();resetSave();if(typeof LES!=="undefined")LES=null;campus();openWardrobe("new")}};
  $("cfgtour").onclick=function(){closeSettings();closeWardrobe();closeLevelPath();LES=null;campus()};
  $("cfgmenu").onclick=function(){closeSettings();closeWardrobe();closeLevelPath();LES=null;campus();showTitle()};
  clearInterval(closeSettings._t);closeSettings._t=setInterval(function(){var el=$("cfgsaved");if(!el){clearInterval(closeSettings._t);return}var a=CFG_SAVED?Math.round((Date.now()-CFG_SAVED)/1000):-1;el.textContent=a<0?"Se guarda solo":a<10?"Guardado hace un momento":"Guardado"},2000)}
document.addEventListener("keydown",function(e){if($("cfgm")){var tag=(e.target&&e.target.tagName)||"";if(e.key==="Escape"){closeSettings();e.preventDefault()}e.stopImmediatePropagation()}},true);

/* botón ⚙ siempre visible */
(function(){var b=document.createElement("button");b.id="gear";b.className="gear";b.title="Configuración";b.setAttribute("aria-label","Configuración");b.textContent="⚙";b.onclick=function(){openSettings()};document.body.appendChild(b)})();
applyCfg();
