/* ================= CUENTA EN LA NUBE · SUPABASE =================
   Login con Google/GitHub y sincronización del progreso (ST) con la tabla
   public.saves. El juego funciona igual sin cuenta: esto es opcional y
   nunca bloquea nada. SUPABASE_URL y SUPABASE_ANON_KEY se definen en
   index.html (son públicas; la seguridad la da la RLS). */

var SB=null, SB_USER=null, SB_STATUS="off", SB_LAST=0;   // status: off | sync | ok | err
var SB_T=null, SB_PENDING=false, SB_SYNCED_FOR=null;

function cloudEnabled(){
  return !!(typeof SUPABASE_URL!=="undefined" && SUPABASE_URL &&
            window.supabase && window.supabase.createClient);
}
function cloudClient(){
  if(SB)return SB;
  if(!cloudEnabled())return null;
  try{SB=window.supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY,
      {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})}catch(e){SB=null}
  return SB;
}

/* Puntúa qué tan avanzada está una partida, para no pisar progreso al sincronizar. */
function cloudScore(s){
  if(!s||typeof s!=="object")return -1;
  var ex=0,k;for(k in (s.exam||{}))if(s.exam[k])ex++;
  var solved=s.solved?Object.keys(s.solved).length:0;
  return ex*1e6 + solved*1e3 + (s.xp||0);
}

function cloudState(){
  return {on:cloudEnabled(), user:SB_USER, email:SB_USER?(SB_USER.email||""):"",
          status:SB_STATUS, last:SB_LAST};
}
/* Vuelve a dibujar la Configuración si está abierta (para reflejar el estado de sesión). */
function cloudRefreshUI(){
  if(typeof renderSettings==="function" && $("cfgm")) renderSettings();
  if(typeof titleRefreshCloud==="function" && $("tcloud-wrap")) titleRefreshCloud();
}

function cloudSignIn(provider){
  var c=cloudClient();
  if(!c){toast("No se pudo conectar con la nube. Revisa tu internet e inténtalo de nuevo.");return}
  c.auth.signInWithOAuth({provider:provider,options:{redirectTo:location.origin+location.pathname}})
   .then(function(res){ if(res&&res.error)toast("No se pudo iniciar el acceso: "+res.error.message); },
         function(){ toast("No se pudo iniciar el acceso. Inténtalo de nuevo."); });
}
function cloudSignOut(){
  var c=cloudClient(); if(!c)return;
  c.auth.signOut().then(function(){
    SB_USER=null; SB_SYNCED_FOR=null; SB_STATUS="off";
    cloudRefreshUI(); if(typeof hud==="function")hud();
    toast("Cerraste sesión. Tu avance sigue guardado en este dispositivo.");
  });
}

/* Sube ST a la nube (upsert). announce=true muestra un aviso al terminar. */
function cloudPush(announce){
  var c=cloudClient(); if(!c||!SB_USER)return;
  SB_STATUS="sync"; cloudRefreshUI();
  c.from("saves").upsert({user_id:SB_USER.id, data:ST, updated_at:new Date().toISOString()},
                         {onConflict:"user_id"})
   .then(function(res){
      if(res&&res.error){ SB_STATUS="err"; if(announce)toast("No se pudo guardar en la nube; lo reintentaré."); }
      else{ SB_STATUS="ok"; SB_LAST=Date.now(); if(announce)toast("☁️ Tu avance se guardó en la nube."); }
      cloudRefreshUI();
   }, function(){ SB_STATUS="err"; cloudRefreshUI(); if(announce)toast("No se pudo guardar en la nube; lo reintentaré."); });
}

/* Al iniciar/restaurar sesión: decide entre el avance local y el de la nube. */
function cloudMergeOnLogin(){
  var c=cloudClient(); if(!c||!SB_USER)return;
  SB_STATUS="sync"; cloudRefreshUI();
  c.from("saves").select("data").eq("user_id",SB_USER.id).maybeSingle()
   .then(function(res){
      if(res&&res.error){ SB_STATUS="err"; cloudRefreshUI(); return; }
      var cloud=res&&res.data?res.data.data:null;
      var ls=cloudScore(ST), cs=cloudScore(cloud);
      if(cloud && cs>ls){
        try{localStorage.setItem("algorithm-city-cloudbak",JSON.stringify(ST))}catch(e){}  // respaldo del local por si acaso
        ST=cloud; save();
        if(typeof buildPlayer==="function")buildPlayer();
        if(typeof hud==="function")hud();
        if(typeof questUI==="function")questUI();
        SB_STATUS="ok"; SB_LAST=Date.now(); cloudRefreshUI();
        toast("☁️ Recuperamos tu avance guardado en la nube.");
      } else {
        cloudPush(false);   // local gana, empata o no había nada: subimos el local
      }
   }, function(){ SB_STATUS="err"; cloudRefreshUI(); });
}

/* Guardado en la nube con retraso, para no mandar en cada tecla. */
function cloudQueue(){
  if(!SB_USER)return;
  SB_PENDING=true; clearTimeout(SB_T);
  SB_T=setTimeout(function(){ SB_PENDING=false; cloudPush(false); }, 2500);
}
function cloudFlush(){ if(SB_PENDING){ clearTimeout(SB_T); SB_PENDING=false; cloudPush(false); } }

function cloudSyncNow(){
  var c=cloudClient();
  if(!c||!SB_USER){ toast("Primero entra con Google o GitHub."); return; }
  clearTimeout(SB_T); SB_PENDING=false; cloudPush(true);
}

/* HTML de la sección "CUENTA EN LA NUBE" para Configuración → Partida. */
function cloudSectionHtml(){
  var h='<div class="csec">CUENTA EN LA NUBE</div>';
  if(!cloudEnabled())
    return h+'<p class="cnote">No se pudo conectar con la nube (¿sin internet?). Puedes seguir jugando: tu avance se guarda en este dispositivo.</p>';
  var st=cloudState();
  if(!st.user){
    var provs=(typeof CLOUD_PROVIDERS!=="undefined")?CLOUD_PROVIDERS:["google","github"];
    var btns="";
    if(provs.indexOf("google")>=0)btns+='<button class="pbtn" id="cfggoog">🔵 Entrar con Google</button>';
    if(provs.indexOf("github")>=0)btns+='<button class="pbtn" id="cfggh">⚫ Entrar con GitHub</button>';
    return h+'<p class="cnote">Entra con un clic y tu avance se guardará en la nube, para no perderlo si cambias de dispositivo o de navegador. Es opcional.</p>'
      +'<div class="trow">'+btns+'</div>';
  }
  var msg=st.status==="sync"?"Sincronizando…":st.status==="err"?"No se pudo sincronizar; lo reintentaré.":"Tu avance se guarda en la nube ✓";
  return h+'<p class="cnote">Sesión iniciada como <b>'+esc(st.email||"tu cuenta")+'</b>. '+msg+'</p>'
    +'<div class="trow"><button class="pbtn mint" id="cfgsync">☁️ Sincronizar ahora</button><button class="pbtn" id="cfgout">Cerrar sesión</button></div>';
}

/* Conecta los botones de la sección (se llama desde settings.js al dibujar la pestaña). */
function cloudBindSettings(){
  if($("cfggoog"))$("cfggoog").onclick=function(){cloudSignIn("google")};
  if($("cfggh"))$("cfggh").onclick=function(){cloudSignIn("github")};
  if($("cfgsync"))$("cfgsync").onclick=function(){cloudSyncNow()};
  if($("cfgout"))$("cfgout").onclick=function(){cloudSignOut()};
}

/* --- Bloque de acceso para la pantalla de inicio (estilo "Admisión") --- */
function cloudTitleHtml(){
  if(!cloudEnabled())return "";   // sin nube (offline): no mostramos el bloque en el inicio
  var st=cloudState();
  if(st.user)
    return '<div class="tcloud ok"><span>☁️ Sesión iniciada como <b>'+esc(st.email||"tu cuenta")+'</b> · tu avance se guarda en la nube</span>'
      +'<div class="trow"><button class="pbtn" id="tsync">☁️ Sincronizar ahora</button><button class="pbtn" id="tout">Cerrar sesión</button></div></div>';
  var provs=(typeof CLOUD_PROVIDERS!=="undefined")?CLOUD_PROVIDERS:["github"];
  var btns="";
  if(provs.indexOf("google")>=0)btns+='<button class="pbtn tsocial" id="tgoog">🔵 Continuar con <b>Google</b></button>';
  if(provs.indexOf("github")>=0)btns+='<button class="pbtn tsocial" id="tgh">⚫ Continuar con <b>GitHub</b></button>';
  return '<div class="tcloud"><div class="tcldh">Guarda tu avance en la nube</div>'
    +'<div class="trow">'+btns+'</div>'
    +'<small>Opcional: entra desde cualquier dispositivo y sigue donde lo dejaste. También puedes jugar sin cuenta.</small></div>';
}
function cloudTitleBind(){
  if($("tgoog"))$("tgoog").onclick=function(){cloudSignIn("google")};
  if($("tgh"))$("tgh").onclick=function(){cloudSignIn("github")};
  if($("tsync"))$("tsync").onclick=function(){cloudSyncNow()};
  if($("tout"))$("tout").onclick=function(){cloudSignOut()};
}

/* Envolver save() para sincronizar también en la nube. */
if(typeof save==="function"){ var _cloudSave=save; save=function(){ _cloudSave.apply(this,arguments); cloudQueue(); }; }

/* Arranque: escucha cambios de sesión (restaura al recargar y capta el regreso del OAuth). */
function cloudInit(){
  var c=cloudClient(); if(!c)return;
  // Si el proveedor devolvió un error en la URL (p.ej. provider deshabilitado), avisar.
  try{var hp=(location.hash||"")+(location.search||"");
      if(/[#&?]error=/.test(hp)){var m=/error_description=([^&]*)/.exec(hp);
        toast("No se pudo entrar"+(m?": "+decodeURIComponent(m[1].replace(/\+/g," ")):"."));}}catch(e){}
  c.auth.onAuthStateChange(function(event,session){
    var u=session&&session.user?session.user:null;
    if(u){
      SB_USER=u;
      if(SB_SYNCED_FOR!==u.id){ SB_SYNCED_FOR=u.id; cloudMergeOnLogin(); }
      else { SB_STATUS="ok"; }
    } else { SB_USER=null; SB_SYNCED_FOR=null; SB_STATUS="off"; }
    cloudRefreshUI(); if(typeof hud==="function")hud();
  });
}
(function(){ var n=0; (function go(){ if(cloudEnabled()){cloudInit();} else if(n++<40){setTimeout(go,150);} })(); })();

if(typeof window!=="undefined"){
  document.addEventListener("visibilitychange",function(){ if(document.visibilityState==="hidden")cloudFlush(); });
  window.addEventListener("beforeunload",function(){ cloudFlush(); });
}
