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
/* Logo oficial del proveedor (SVG inline). */
function cloudIcon(p){
  if(p==="github")return '<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>';
  if(p==="google")return '<svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>';
  return "";
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
    if(provs.indexOf("google")>=0)btns+='<button class="pbtn tsocial" id="cfggoog">'+cloudIcon("google")+'<span>Entrar con Google</span></button>';
    if(provs.indexOf("github")>=0)btns+='<button class="pbtn tsocial" id="cfggh">'+cloudIcon("github")+'<span>Entrar con GitHub</span></button>';
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
  var req=(typeof REQUIRE_LOGIN!=="undefined"&&REQUIRE_LOGIN);
  var btns="";
  if(provs.indexOf("google")>=0)btns+='<button class="pbtn tsocial" id="tgoog">'+cloudIcon("google")+'<span>Continuar con <b>Google</b></span></button>';
  if(provs.indexOf("github")>=0)btns+='<button class="pbtn tsocial" id="tgh">'+cloudIcon("github")+'<span>Continuar con <b>GitHub</b></span></button>';
  return '<div class="tcloud">'
    +(req?'':'<div class="tcldh">Guarda tu avance en la nube</div>')
    +'<div class="trow">'+btns+'</div>'
    +'<small>'+(req?'Entra para empezar. Tu avance se guarda en la nube y puedes seguir desde cualquier dispositivo.':'Opcional: entra desde cualquier dispositivo y sigue donde lo dejaste. También puedes jugar sin cuenta.')+'</small></div>';
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
