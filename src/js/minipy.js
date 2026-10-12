
/* ================= MiniPy: subconjunto de Python sin eval ================= */
var MiniPy=(function(){
function PyErr(type,msg,line){this.type=type;this.msg=msg;this.line=line}
function err(type,msg,line){throw new PyErr(type,msg,line)}
var KW={"def":1,"return":1,"if":1,"elif":1,"else":1,"for":1,"while":1,"in":1,"not":1,"and":1,"or":1,"is":1,"True":1,"False":1,"None":1,"break":1,"continue":1,"pass":1,"lambda":1};
var OPS=["**=","//=","**","//","==","!=","<=",">=","+=","-=","*=","/=","%=","->","(",")","[","]","{","}",",",":",".","+","-","*","/","%","<",">","="];

/* ---------- lexer ---------- */
function lex(src){
  src=src.replace(/\r\n?/g,"\n").replace(/\t/g,"    ");
  var lines=src.split("\n"),toks=[],ind=[0],depth=0;
  for(var ln=0;ln<lines.length;ln++){
    var line=lines[ln],L=ln+1,i=0;
    if(depth===0){
      var sp=0;while(sp<line.length&&line[sp]===" ")sp++;
      var rest=line.slice(sp);
      if(rest===""||rest[0]==="#")continue;
      if(sp>ind[ind.length-1]){ind.push(sp);toks.push({t:"INDENT",line:L})}
      else{while(sp<ind[ind.length-1]){ind.pop();toks.push({t:"DEDENT",line:L})}
        if(sp!==ind[ind.length-1])err("IndentationError","la sangría no coincide con ningún bloque anterior. Usa múltiplos de 4 espacios.",L)}
      i=sp;
    }
    while(i<line.length){
      var c=line[i];
      if(c===" "){i++;continue}
      if(c==="#")break;
      if(/[0-9]/.test(c)||(c==="."&&/[0-9]/.test(line[i+1]||""))){var m=line.slice(i).match(/^(\d+\.?\d*(e[+-]?\d+)?|\.\d+)/i);toks.push({t:"NUM",v:parseFloat(m[0]),line:L});i+=m[0].length;continue}
      var fs=false;
      if((c==="f"||c==="F")&&(line[i+1]==='"'||line[i+1]==="'")){fs=true;i++;c=line[i]}
      if(c==='"'||c==="'"){var q=c,j=i+1,s="";
        while(j<line.length&&line[j]!==q){if(line[j]==="\\"){var e=line[j+1];s+=e==="n"?"\n":e==="t"?"\t":e;j+=2}else{s+=line[j];j++}}
        if(j>=line.length)err("SyntaxError","falta cerrar las comillas "+q+" del texto.",L);
        toks.push({t:"STR",v:s,f:fs,line:L});i=j+1;continue}
      if(/[A-Za-z_áéíóúñÁÉÍÓÚÑ]/.test(c)){var m2=line.slice(i).match(/^[A-Za-z_0-9áéíóúñÁÉÍÓÚÑ]+/);toks.push({t:"NAME",v:m2[0],line:L});i+=m2[0].length;continue}
      var op=null;for(var k=0;k<OPS.length;k++){if(line.substr(i,OPS[k].length)===OPS[k]){op=OPS[k];break}}
      if(!op)err("SyntaxError","no entiendo el símbolo '"+c+"'.",L);
      if(op==="("||op==="["||op==="{")depth++;if(op===")"||op==="]"||op==="}")depth=Math.max(0,depth-1);
      toks.push({t:"OP",v:op,line:L});i+=op.length;
    }
    if(depth===0&&toks.length&&toks[toks.length-1].t!=="NEWLINE"&&toks[toks.length-1].t!=="INDENT"&&toks[toks.length-1].t!=="DEDENT")toks.push({t:"NEWLINE",line:L});
  }
  if(depth>0)err("SyntaxError","hay un paréntesis, corchete o llave sin cerrar.",lines.length);
  if(toks.length&&toks[toks.length-1].t!=="NEWLINE")toks.push({t:"NEWLINE",line:lines.length});
  while(ind.length>1){ind.pop();toks.push({t:"DEDENT",line:lines.length})}
  toks.push({t:"EOF",line:lines.length});
  return toks;
}

/* ---------- parser ---------- */
function Parser(toks){this.t=toks;this.p=0}
var PP=Parser.prototype;
PP.peek=function(o){return this.t[this.p+(o||0)]};
PP.next=function(){return this.t[this.p++]};
PP.isOp=function(v){var k=this.peek();return k.t==="OP"&&k.v===v};
PP.isKw=function(v){var k=this.peek();return k.t==="NAME"&&k.v===v};
PP.expectOp=function(v,msg){var k=this.next();if(k.t!=="OP"||k.v!==v)err("SyntaxError",msg||("se esperaba '"+v+"'"+(k.t==="EOF"?" al final":" cerca de '"+(k.v||k.t)+"'")+"."),k.line);return k};
PP.expectKw=function(v){var k=this.next();if(k.t!=="NAME"||k.v!==v)err("SyntaxError","se esperaba '"+v+"'.",k.line);return k};
PP.program=function(){var b=[];while(this.peek().t!=="EOF"){if(this.peek().t==="NEWLINE"){this.next();continue}if(this.peek().t==="INDENT")err("IndentationError","esta línea tiene sangría pero no está dentro de ningún bloque (def, for, if…).",this.peek().line);b.push(this.stmt())}return b};
PP.block=function(){
  var k=this.peek();
  if(k.t!=="NEWLINE"){var s=this.simple();return [s]}
  this.next();var ind=this.next();
  if(ind.t!=="INDENT")err("IndentationError","después de ':' la siguiente línea debe llevar sangría (4 espacios más).",ind.line);
  var b=[];while(this.peek().t!=="DEDENT"&&this.peek().t!=="EOF"){if(this.peek().t==="NEWLINE"){this.next();continue}b.push(this.stmt())}
  if(this.peek().t==="DEDENT")this.next();return b;
};
PP.stmt=function(){
  var k=this.peek(),L=k.line;
  if(k.t==="NAME"){
    if(k.v==="def"){this.next();var nm=this.next();if(nm.t!=="NAME")err("SyntaxError","después de def va el nombre de la función.",L);this.expectOp("(");var ps=[];
      while(!this.isOp(")")){var pn=this.next();if(pn.t!=="NAME")err("SyntaxError","los parámetros deben ser nombres.",L);var dflt=null;if(this.isOp("=")){this.next();dflt=this.expr()}ps.push({n:pn.v,d:dflt});if(this.isOp(","))this.next();else break}
      this.expectOp(")");if(this.isOp("->")){this.next();this.expr()}this.expectOp(":","falta ':' al final de la línea del def.");return {k:"def",name:nm.v,params:ps,body:this.block(),line:L}}
    if(k.v==="if"){this.next();var c=this.expr();this.expectOp(":","falta ':' al final del if.");var body=this.block(),els=null;
      if(this.isKw("elif")){els=[this.stmt_elif()]}else if(this.isKw("else")){this.next();this.expectOp(":","falta ':' después de else.");els=this.block()}
      return {k:"if",c:c,body:body,els:els,line:L}}
    if(k.v==="for"){this.next();var tg=this.target();this.expectKw("in");var it=this.exprlist();this.expectOp(":","falta ':' al final del for.");return {k:"for",tg:tg,it:it,body:this.block(),line:L}}
    if(k.v==="while"){this.next();var c2=this.expr();this.expectOp(":","falta ':' al final del while.");return {k:"while",c:c2,body:this.block(),line:L}}
    if(k.v==="elif"||k.v==="else")err("SyntaxError","'"+k.v+"' sin un if antes (¿revisaste la sangría?).",L);
  }
  var s=this.simple();return s;
};
PP.stmt_elif=function(){var L=this.next().line;var c=this.expr();this.expectOp(":","falta ':' al final del elif.");var body=this.block(),els=null;
  if(this.isKw("elif"))els=[this.stmt_elif()];else if(this.isKw("else")){this.next();this.expectOp(":","falta ':' después de else.");els=this.block()}
  return {k:"if",c:c,body:body,els:els,line:L}};
PP.simple=function(){
  var k=this.peek(),L=k.line,s;
  if(k.t==="NAME"&&k.v==="return"){this.next();var v=(this.peek().t==="NEWLINE")?null:this.exprlist();s={k:"return",v:v,line:L}}
  else if(k.t==="NAME"&&k.v==="break"){this.next();s={k:"break",line:L}}
  else if(k.t==="NAME"&&k.v==="continue"){this.next();s={k:"continue",line:L}}
  else if(k.t==="NAME"&&k.v==="pass"){this.next();s={k:"pass",line:L}}
  else{
    var e=this.exprlist();
    if(this.isOp("=")){var targets=[e];while(this.isOp("=")){this.next();targets.push(this.exprlist())}var val=targets.pop();targets.forEach(function(t){checkTarget(t,L)});s={k:"assign",tg:targets,v:val,line:L}}
    else if(this.peek().t==="OP"&&/^(\+|-|\*|\/|\/\/|%|\*\*)=$/.test(this.peek().v)){var op=this.next().v.slice(0,-1);checkTarget(e,L);s={k:"aug",tg:e,op:op,v:this.exprlist(),line:L}}
    else s={k:"expr",e:e,line:L};
  }
  var n=this.peek();
  if(n.t==="NEWLINE")this.next();
  else if(n.t!=="EOF"&&n.t!=="DEDENT")err("SyntaxError","no esperaba '"+(n.v||n.t)+"' aquí. ¿Te falta un operador, una coma o un salto de línea?",n.line);
  return s;
};
function checkTarget(t,L){if(t.k==="name"||t.k==="sub"||t.k==="attr")return;if(t.k==="tuple"||t.k==="list"){t.items.forEach(function(x){checkTarget(x,L)});return}err("SyntaxError","no se puede asignar a esa expresión. A la izquierda del = va un nombre de variable.",L)}
PP.target=function(){var L=this.peek().line,items=[];var paren=false;if(this.isOp("(")){this.next();paren=true}
  do{var k=this.next();if(k.t!=="NAME")err("SyntaxError","después de for va un nombre de variable.",L);items.push({k:"name",n:k.v,line:L});if(this.isOp(","))this.next();else break}while(true);
  if(paren)this.expectOp(")");return items.length===1?items[0]:{k:"tuple",items:items,line:L}};
PP.exprlist=function(){var L=this.peek().line,e=this.expr();if(!this.isOp(","))return e;var items=[e];while(this.isOp(",")){this.next();if(this.peek().t==="NEWLINE"||this.isOp("=")||this.isOp(")")||this.isOp(":"))break;items.push(this.expr())}return {k:"tuple",items:items,line:L}};
PP.expr=function(){var L=this.peek().line;if(this.isKw("lambda")){this.next();var ps=[];while(!this.isOp(":")){var n=this.next();ps.push({n:n.v,d:null});if(this.isOp(","))this.next()}this.next();var b=this.expr();return {k:"lambda",params:ps,body:b,line:L}}
  var e=this.or_();if(this.isKw("if")){this.next();var c=this.or_();this.expectKw("else");var f=this.expr();return {k:"tern",c:c,a:e,b:f,line:L}}return e};
PP.or_=function(){var e=this.and_();while(this.isKw("or")){var L=this.next().line;e={k:"or",a:e,b:this.and_(),line:L}}return e};
PP.and_=function(){var e=this.not_();while(this.isKw("and")){var L=this.next().line;e={k:"and",a:e,b:this.not_(),line:L}}return e};
PP.not_=function(){if(this.isKw("not")){var L=this.next().line;return {k:"not",a:this.not_(),line:L}}return this.cmp()};
PP.cmp=function(){var L=this.peek().line,first=this.arith(),ops=[],rest=[];
  while(true){var k=this.peek(),op=null;
    if(k.t==="OP"&&["<",">","==","!=","<=",">="].indexOf(k.v)>=0){op=k.v;this.next()}
    else if(k.t==="NAME"&&k.v==="in"){op="in";this.next()}
    else if(k.t==="NAME"&&k.v==="not"&&this.peek(1).t==="NAME"&&this.peek(1).v==="in"){op="not in";this.next();this.next()}
    else if(k.t==="NAME"&&k.v==="is"){this.next();if(this.isKw("not")){this.next();op="is not"}else op="is"}
    if(!op)break;ops.push(op);rest.push(this.arith())}
  return ops.length?{k:"cmp",first:first,ops:ops,rest:rest,line:L}:first};
PP.arith=function(){var e=this.term();while(this.isOp("+")||this.isOp("-")){var o=this.next();e={k:"bin",op:o.v,a:e,b:this.term(),line:o.line}}return e};
PP.term=function(){var e=this.factor();while(this.isOp("*")||this.isOp("/")||this.isOp("//")||this.isOp("%")){var o=this.next();e={k:"bin",op:o.v,a:e,b:this.factor(),line:o.line}}return e};
PP.factor=function(){if(this.isOp("-")||this.isOp("+")){var o=this.next();return {k:"un",op:o.v,a:this.factor(),line:o.line}}return this.power()};
PP.power=function(){var e=this.postfix();if(this.isOp("**")){var o=this.next();return {k:"bin",op:"**",a:e,b:this.factor(),line:o.line}}return e};
PP.postfix=function(){var e=this.atom();
  while(true){
    if(this.isOp("(")){var L=this.next().line,args=[],kw={};
      while(!this.isOp(")")){if(this.peek().t==="NAME"&&this.peek(1).t==="OP"&&this.peek(1).v==="="){var kn=this.next().v;this.next();kw[kn]=this.expr()}else args.push(this.expr());if(this.isOp(","))this.next();else break}
      this.expectOp(")","falta cerrar el paréntesis ')' de la llamada.");e={k:"call",f:e,args:args,kw:kw,line:L}}
    else if(this.isOp("[")){var L2=this.next().line,a=null,b=null,st=null,sl=false;
      if(!this.isOp(":"))a=this.expr();
      if(this.isOp(":")){sl=true;this.next();if(!this.isOp("]")&&!this.isOp(":"))b=this.expr();if(this.isOp(":")){this.next();if(!this.isOp("]"))st=this.expr()}}
      this.expectOp("]","falta cerrar el corchete ']'.");e=sl?{k:"slice",o:e,a:a,b:b,s:st,line:L2}:{k:"sub",o:e,i:a,line:L2}}
    else if(this.isOp(".")){var L3=this.next().line,n=this.next();if(n.t!=="NAME")err("SyntaxError","después del punto va el nombre de un método.",L3);e={k:"attr",o:e,n:n.v,line:L3}}
    else break}
  return e};
PP.atom=function(){var k=this.next(),L=k.line;
  if(k.t==="NUM")return {k:"num",v:k.v,line:L};
  if(k.t==="STR"){var s=k.v,fs=k.f;while(this.peek().t==="STR"&&!this.peek().f&&!fs){s+=this.next().v}return fs?{k:"fstr",parts:parseF(s,L),line:L}:{k:"str",v:s,line:L}}
  if(k.t==="NAME"){if(k.v==="True")return {k:"const",v:true,line:L};if(k.v==="False")return {k:"const",v:false,line:L};if(k.v==="None")return {k:"const",v:null,line:L};
    if(KW[k.v]&&["not","lambda"].indexOf(k.v)<0)err("SyntaxError","'"+k.v+"' es una palabra reservada; no puede ir aquí.",L);return {k:"name",n:k.v,line:L}}
  if(k.t==="OP"){
    if(k.v==="("){if(this.isOp(")")){this.next();return {k:"tuple",items:[],line:L}}var e=this.exprlist();if(e.k!=="tuple"&&this.isKw("for"))e=this.comp(e,"gen",L);this.expectOp(")","falta cerrar el paréntesis ')'.");return e}
    if(k.v==="["){if(this.isOp("]")){this.next();return {k:"list",items:[],line:L}}var f=this.expr();if(this.isKw("for")){var c=this.comp(f,"list",L);this.expectOp("]");return c}
      var items=[f];while(this.isOp(",")){this.next();if(this.isOp("]"))break;items.push(this.expr())}this.expectOp("]","falta cerrar el corchete ']' de la lista.");return {k:"list",items:items,line:L}}
    if(k.v==="{"){if(this.isOp("}")){this.next();return {k:"dict",keys:[],vals:[],line:L}}var a=this.expr();
      if(this.isOp(":")){this.next();var ks=[a],vs=[this.expr()];while(this.isOp(",")){this.next();if(this.isOp("}"))break;ks.push(this.expr());this.expectOp(":");vs.push(this.expr())}this.expectOp("}","falta cerrar la llave '}' del diccionario.");return {k:"dict",keys:ks,vals:vs,line:L}}
      var its=[a];while(this.isOp(",")){this.next();if(this.isOp("}"))break;its.push(this.expr())}this.expectOp("}");return {k:"setlit",items:its,line:L}}
  }
  if(k.t==="NEWLINE"||k.t==="EOF")err("SyntaxError","la línea quedó incompleta.",L);
  if(k.t==="INDENT")err("IndentationError","sangría inesperada en esta línea.",L);
  err("SyntaxError","no esperaba '"+(k.v||k.t)+"' aquí.",L)};
PP.comp=function(e,kind,L){this.expectKw("for");var tg=this.target();this.expectKw("in");var it=this.or_(),cond=null;if(this.isKw("if")){this.next();cond=this.or_()}return {k:"comp",kind:kind,e:e,tg:tg,it:it,cond:cond,line:L}};
function parseF(s,L){var parts=[],i=0,buf="";while(i<s.length){if(s[i]==="{"&&s[i+1]==="{"){buf+="{";i+=2;continue}if(s[i]==="}"&&s[i+1]==="}"){buf+="}";i+=2;continue}
  if(s[i]==="{"){var j=s.indexOf("}",i);if(j<0)err("SyntaxError","falta cerrar '}' en el f-string.",L);if(buf){parts.push(buf);buf=""}var src=s.slice(i+1,j),spec="";var ci=src.indexOf(":");if(ci>=0&&src.indexOf("[")<0){spec=src.slice(ci+1);src=src.slice(0,ci)}
    var p=new Parser(lex(src));var ex=p.expr();parts.push({e:ex,spec:spec});i=j+1;continue}buf+=s[i];i++}if(buf)parts.push(buf);return parts}

/* ---------- valores ---------- */
function Tup(items){this.items=items}
function PDict(){this.m=new Map()}
function PSet(){this.m=new Map()}
function hk(v,L){if(v===null)return "N";if(typeof v==="number")return "n:"+v;if(typeof v==="boolean")return "n:"+(+v);if(typeof v==="string")return "s:"+v;if(v instanceof Tup)return "t:("+v.items.map(function(x){return hk(x,L)}).join(",")+")";
  err("TypeError","no puedes usar "+tname(v)+" como llave de diccionario o elemento de set (no es inmutable).",L)}
PDict.prototype.get=function(k,L){var e=this.m.get(hk(k,L));return e?e[1]:undefined};
PDict.prototype.set=function(k,v,L){this.m.set(hk(k,L),[k,v])};
PDict.prototype.has=function(k,L){return this.m.has(hk(k,L))};
PDict.prototype.keys=function(){var a=[];this.m.forEach(function(e){a.push(e[0])});return a};
PSet.prototype.add=function(k,L){this.m.set(hk(k,L),k)};
PSet.prototype.has=function(k,L){return this.m.has(hk(k,L))};
PSet.prototype.vals=function(){return Array.from(this.m.values())};
function PFunc(name,params,body,scope,isLambda){this.name=name;this.params=params;this.body=body;this.scope=scope;this.lam=isLambda}
function Builtin(name,fn){this.name=name;this.fn=fn}
function BoundM(obj,name,fn){this.obj=obj;this.name=name;this.fn=fn}
function tname(v){if(v===null)return "None";if(typeof v==="boolean")return "bool";if(typeof v==="number")return Number.isInteger(v)?"int":"float";if(typeof v==="string")return "str";if(Array.isArray(v))return "list";if(v instanceof Tup)return "tuple";if(v instanceof PDict)return "dict";if(v instanceof PSet)return "set";if(v instanceof PFunc||v instanceof Builtin||v instanceof BoundM)return "function";return "object"}
function repr(v,top){
  if(v===null)return "None";if(v===true)return "True";if(v===false)return "False";
  if(typeof v==="number"){if(v===Infinity)return "inf";if(v===-Infinity)return "-inf";if(isNaN(v))return "nan";if(Number.isInteger(v)||Math.abs(v)>=1e16)return String(v);var s=String(+v.toPrecision(15));return s}
  if(typeof v==="string")return top?v:"'"+v.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\n/g,"\\n")+"'";
  if(Array.isArray(v))return "["+v.map(function(x){return repr(x)}).join(", ")+"]";
  if(v instanceof Tup)return v.items.length===1?"("+repr(v.items[0])+",)":"("+v.items.map(function(x){return repr(x)}).join(", ")+")";
  if(v instanceof PDict){var p=[];v.m.forEach(function(e){p.push(repr(e[0])+": "+repr(e[1]))});return "{"+p.join(", ")+"}"}
  if(v instanceof PSet){var a=v.vals();return a.length?"{"+a.map(function(x){return repr(x)}).join(", ")+"}":"set()"}
  if(v instanceof PFunc)return "<función "+v.name+">";if(v instanceof Builtin||v instanceof BoundM)return "<función "+v.name+">";
  return String(v)}
function truthy(v){if(v===null||v===false||v===0||v==="")return false;if(Array.isArray(v))return v.length>0;if(v instanceof Tup)return v.items.length>0;if(v instanceof PDict||v instanceof PSet)return v.m.size>0;return true}
function eq(a,b){if(a===b)return true;if(typeof a==="number"&&typeof b==="boolean")return a===+b;if(typeof b==="number"&&typeof a==="boolean")return +a===b;
  if(Array.isArray(a)&&Array.isArray(b)){if(a.length!==b.length)return false;for(var i=0;i<a.length;i++)if(!eq(a[i],b[i]))return false;return true}
  if(a instanceof Tup&&b instanceof Tup)return eq(a.items,b.items);
  if(a instanceof PDict&&b instanceof PDict){if(a.m.size!==b.m.size)return false;var ok=true;a.m.forEach(function(e,k){var o=b.m.get(k);if(!o||!eq(e[1],o[1]))ok=false});return ok}
  if(a instanceof PSet&&b instanceof PSet){if(a.m.size!==b.m.size)return false;var ok2=true;a.m.forEach(function(e,k){if(!b.m.has(k))ok2=false});return ok2}
  return false}
function cmp(a,b,L){
  if((typeof a==="number"||typeof a==="boolean")&&(typeof b==="number"||typeof b==="boolean"))return a<b?-1:a>b?1:0;
  if(typeof a==="string"&&typeof b==="string")return a<b?-1:a>b?1:0;
  if((Array.isArray(a)&&Array.isArray(b))||(a instanceof Tup&&b instanceof Tup)){var x=Array.isArray(a)?a:a.items,y=Array.isArray(b)?b:b.items;for(var i=0;i<Math.min(x.length,y.length);i++){var c=cmp(x[i],y[i],L);if(c)return c}return x.length-y.length}
  err("TypeError","no puedes comparar "+tname(a)+" con "+tname(b)+" usando <, >, <= o >=.",L)}
function iter(v,L){if(Array.isArray(v))return v.slice();if(typeof v==="string")return v.split("");if(v instanceof Tup)return v.items.slice();if(v instanceof PDict)return v.keys();if(v instanceof PSet)return v.vals();
  err("TypeError","no puedes recorrer con for un valor de tipo "+tname(v)+(typeof v==="number"?". ¿Querías usar range("+repr(v)+")?":"."),L)}
function idx(len,i,L,what){if(typeof i!=="number"||!Number.isInteger(i))err("TypeError","los índices deben ser números enteros, no "+tname(i)+".",L);var j=i<0?len+i:i;if(j<0||j>=len)err("IndexError","índice "+i+" fuera de rango: "+what+" tiene "+len+" elemento"+(len===1?"":"s")+" (índices válidos: 0 a "+(len-1)+").",L);return j}

/* ---------- intérprete ---------- */
function Interp(opts){this.out=[];this.steps=0;this.max=(opts&&opts.maxSteps)||3000000;this.g=new Map();this.depth=0}
var IP=Interp.prototype;
IP.tick=function(L){if(++this.steps>this.max)err("TimeoutError","tu código tardó demasiado (más de "+this.max.toLocaleString("es-MX")+" pasos). ¿Hay un ciclo infinito o una solución muy lenta?",L)};
IP.lookup=function(n,sc,L){if(sc&&sc.has(n))return sc.get(n);if(this.g.has(n))return this.g.get(n);var b=BUILTINS[n];if(b)return b;
  err("NameError","'"+n+"' no está definida. ¿La escribiste bien? ¿La creaste antes de usarla?",L)};
IP.run=function(src){var prog=new Parser(lex(src)).program();this.execBlock(prog,null);return this};
IP.execBlock=function(b,sc){for(var i=0;i<b.length;i++){var r=this.exec(b[i],sc);if(r)return r}return null};
IP.assign=function(t,v,sc,L){
  if(t.k==="name"){(sc||this.g).set(t.n,v);return}
  if(t.k==="tuple"||t.k==="list"){var a=iter(v,L);if(a.length!==t.items.length)err("ValueError","intentas repartir "+a.length+" valores en "+t.items.length+" variables.",L);for(var i=0;i<a.length;i++)this.assign(t.items[i],a[i],sc,L);return}
  if(t.k==="sub"){var o=this.ev(t.o,sc),k=this.ev(t.i,sc);if(Array.isArray(o)){o[idx(o.length,k,L,"la lista")]=v;return}if(o instanceof PDict){o.set(k,v,L);return}
    if(typeof o==="string")err("TypeError","los textos (str) no se pueden modificar por posición. Crea un texto nuevo.",L);if(o instanceof Tup)err("TypeError","las tuplas no se pueden modificar.",L);err("TypeError","no puedes asignar con [] a un "+tname(o)+".",L)}
  err("SyntaxError","no se puede asignar a esa expresión.",L)};
IP.exec=function(s,sc){
  this.tick(s.line);var L=s.line;
  switch(s.k){
    case "expr":this.ev(s.e,sc);return null;
    case "assign":var v=this.ev(s.v,sc);for(var i=0;i<s.tg.length;i++)this.assign(s.tg[i],v,sc,L);return null;
    case "aug":var cur=this.ev(s.tg,sc),rv=this.ev(s.v,sc),nv;
      if(s.op==="+"&&Array.isArray(cur)){var add=iter(rv,L);for(var q=0;q<add.length;q++)cur.push(add[q]);nv=cur}else nv=this.bin(s.op,cur,rv,L);
      this.assign(s.tg,nv,sc,L);return null;
    case "def":(sc||this.g).set(s.name,new PFunc(s.name,s.params,s.body,sc,false));return null;
    case "return":if(!sc&&this.depth===0)err("SyntaxError","'return' solo puede ir dentro de una función (def).",L);return {r:"ret",v:s.v?this.ev(s.v,sc):null};
    case "if":if(truthy(this.ev(s.c,sc)))return this.execBlock(s.body,sc);if(s.els)return this.execBlock(s.els,sc);return null;
    case "for":var it=iter(this.ev(s.it,sc),L);for(var j=0;j<it.length;j++){this.tick(L);this.assign(s.tg,it[j],sc,L);var r=this.execBlock(s.body,sc);if(r){if(r.r==="brk")break;if(r.r==="cont")continue;return r}}return null;
    case "while":while(truthy(this.ev(s.c,sc))){this.tick(L);var r2=this.execBlock(s.body,sc);if(r2){if(r2.r==="brk")break;if(r2.r==="cont")continue;return r2}}return null;
    case "break":return {r:"brk"};case "continue":return {r:"cont"};case "pass":return null;
  }
  err("SyntaxError","instrucción desconocida.",L)};
IP.bin=function(op,a,b,L){
  var na=typeof a==="number"||typeof a==="boolean",nb=typeof b==="number"||typeof b==="boolean";
  if(op==="+"){if(na&&nb)return a+b;if(typeof a==="string"&&typeof b==="string")return a+b;if(Array.isArray(a)&&Array.isArray(b))return a.concat(b);if(a instanceof Tup&&b instanceof Tup)return new Tup(a.items.concat(b.items));
    if(typeof a==="string"||typeof b==="string")err("TypeError","no puedes sumar texto (str) con "+tname(typeof a==="string"?b:a)+". Convierte con str(...) primero.",L);err("TypeError","no puedes sumar "+tname(a)+" con "+tname(b)+".",L)}
  if(op==="*"){if(na&&nb)return a*b;if(typeof a==="string"&&typeof b==="number")return b>0?a.repeat(b):"";if(Array.isArray(a)&&typeof b==="number"){var r=[];for(var i=0;i<b;i++)r=r.concat(a);return r}if(typeof b==="string"&&typeof a==="number")return a>0?b.repeat(a):"";
    err("TypeError","no puedes multiplicar "+tname(a)+" por "+tname(b)+".",L)}
  if(!na||!nb)err("TypeError","la operación "+op+" necesita números, pero recibió "+tname(a)+" y "+tname(b)+".",L);
  if(op==="-")return a-b;
  if(op==="/"){if(b==0)err("ZeroDivisionError","no se puede dividir entre cero.",L);return a/b}
  if(op==="//"){if(b==0)err("ZeroDivisionError","no se puede dividir entre cero.",L);return Math.floor(a/b)}
  if(op==="%"){if(b==0)err("ZeroDivisionError","módulo entre cero.",L);return ((a%b)+b)%b}
  if(op==="**")return Math.pow(a,b);
  err("SyntaxError","operador desconocido "+op,L)};
IP.contains=function(c,x,L){if(Array.isArray(c)){this.steps+=c.length>>2;for(var i=0;i<c.length;i++)if(eq(c[i],x))return true;return false}
  if(c instanceof Tup)return this.contains(c.items,x,L);if(typeof c==="string"){if(typeof x!=="string")err("TypeError","para buscar dentro de un texto necesitas otro texto.",L);return c.indexOf(x)>=0}
  if(c instanceof PDict||c instanceof PSet)return c.has(x,L);err("TypeError","no puedes usar 'in' con "+tname(c)+".",L)};
IP.ev=function(e,sc){
  var L=e.line,self=this;
  switch(e.k){
    case "num":return e.v;case "str":return e.v;case "const":return e.v;
    case "fstr":return e.parts.map(function(p){if(typeof p==="string")return p;var v=self.ev(p.e,sc);if(p.spec&&typeof v==="number"){var m=p.spec.match(/\.(\d+)f/);if(m)return v.toFixed(+m[1])}return repr(v,true)}).join("");
    case "name":return this.lookup(e.n,sc,L);
    case "tuple":return new Tup(e.items.map(function(x){return self.ev(x,sc)}));
    case "list":return e.items.map(function(x){return self.ev(x,sc)});
    case "dict":var d=new PDict();for(var i=0;i<e.keys.length;i++)d.set(this.ev(e.keys[i],sc),this.ev(e.vals[i],sc),L);return d;
    case "setlit":var st=new PSet();e.items.forEach(function(x){st.add(self.ev(x,sc),L)});return st;
    case "comp":var src=iter(this.ev(e.it,sc),L),res=[],inner=new Map(sc?sc:[]);
      if(!sc){/* comprensión global: usa globals + variable propia */inner=null}
      var scope=sc||null;
      for(var j=0;j<src.length;j++){this.tick(L);if(scope)this.assign(e.tg,src[j],scope,L);else this.assign(e.tg,src[j],null,L);if(e.cond&&!truthy(this.ev(e.cond,scope)))continue;res.push(this.ev(e.e,scope))}
      return e.kind==="gen"?res:res;
    case "tern":return truthy(this.ev(e.c,sc))?this.ev(e.a,sc):this.ev(e.b,sc);
    case "or":var a=this.ev(e.a,sc);return truthy(a)?a:this.ev(e.b,sc);
    case "and":var a2=this.ev(e.a,sc);return truthy(a2)?this.ev(e.b,sc):a2;
    case "not":return !truthy(this.ev(e.a,sc));
    case "un":var v=this.ev(e.a,sc);if(typeof v!=="number"&&typeof v!=="boolean")err("TypeError","el signo "+e.op+" solo funciona con números.",L);return e.op==="-"?-v:+v;
    case "bin":return this.bin(e.op,this.ev(e.a,sc),this.ev(e.b,sc),L);
    case "cmp":var left=this.ev(e.first,sc);
      for(var k=0;k<e.ops.length;k++){var right=this.ev(e.rest[k],sc),op=e.ops[k],ok;
        if(op==="==")ok=eq(left,right);else if(op==="!=")ok=!eq(left,right);else if(op==="in")ok=this.contains(right,left,L);else if(op==="not in")ok=!this.contains(right,left,L);
        else if(op==="is")ok=left===right||(left instanceof Tup&&right instanceof Tup&&left===right);else if(op==="is not")ok=left!==right;
        else{var c=cmp(left,right,L);ok=op==="<"?c<0:op===">"?c>0:op==="<="?c<=0:c>=0}
        if(!ok)return false;left=right}
      return true;
    case "sub":var o=this.ev(e.o,sc),ix=this.ev(e.i,sc);
      if(Array.isArray(o))return o[idx(o.length,ix,L,"la lista")];if(typeof o==="string")return o[idx(o.length,ix,L,"el texto")];if(o instanceof Tup)return o.items[idx(o.items.length,ix,L,"la tupla")];
      if(o instanceof PDict){var g=o.get(ix,L);if(g===undefined)err("KeyError","la llave "+repr(ix)+" no existe en el diccionario. Usa 'in' para revisar antes o .get().",L);return g}
      err("TypeError","no puedes usar [] con un valor de tipo "+tname(o)+".",L);
    case "slice":var ob=this.ev(e.o,sc),seq=typeof ob==="string"?ob:(ob instanceof Tup?ob.items:ob);if(!Array.isArray(seq)&&typeof seq!=="string")err("TypeError","no puedes rebanar ([a:b]) un "+tname(ob)+".",L);
      var n=seq.length,stp=e.s?this.ev(e.s,sc):1;if(stp===0)err("ValueError","el paso del slice no puede ser 0.",L);
      var sa=e.a?this.ev(e.a,sc):(stp>0?0:n-1),sb=e.b?this.ev(e.b,sc):(stp>0?n:-n-1);
      function norm(x,dflt){if(x<0)x+=n;return x}
      sa=e.a?norm(sa):sa;sb=e.b?norm(sb):sb;
      var out=[];if(stp>0){sa=Math.max(0,Math.min(n,sa));sb=Math.max(0,Math.min(n,sb));for(var p=sa;p<sb;p+=stp)out.push(seq[p])}else{sa=Math.min(n-1,sa);sb=Math.max(-1,sb);for(var p2=sa;p2>sb;p2+=stp)out.push(seq[p2])}
      return typeof ob==="string"?out.join(""):(ob instanceof Tup?new Tup(out):out);
    case "attr":return this.getattr(this.ev(e.o,sc),e.n,L);
    case "call":var f=this.ev(e.f,sc),args=e.args.map(function(x){return self.ev(x,sc)}),kw={};for(var kk in e.kw)kw[kk]=this.ev(e.kw[kk],sc);return this.call(f,args,kw,L);
    case "lambda":return new PFunc("lambda",e.params,e.body,sc,true);
  }
  err("SyntaxError","expresión desconocida.",L)};
IP.call=function(f,args,kw,L){
  this.tick(L);
  if(f instanceof Builtin)return f.fn.call(this,args,kw,L);
  if(f instanceof BoundM)return f.fn.call(this,f.obj,args,kw,L);
  if(f instanceof PFunc){
    if(this.depth>900)err("RecursionError","demasiadas llamadas anidadas (recursión infinita).",L);
    var sc=new Map(),ps=f.params;
    if(args.length>ps.length)err("TypeError",f.name+"() recibe "+ps.length+" argumento"+(ps.length===1?"":"s")+" pero le diste "+args.length+".",L);
    for(var i=0;i<ps.length;i++){var v=i<args.length?args[i]:(ps[i].n in kw?kw[ps[i].n]:(ps[i].d?this.ev(ps[i].d,f.scope):undefined));if(v===undefined)err("TypeError",f.name+"() necesita el argumento '"+ps[i].n+"'.",L);sc.set(ps[i].n,v)}
    if(f.scope)f.scope.forEach(function(v,k){if(!sc.has(k))sc.set(k,v)});
    this.depth++;try{if(f.lam)return this.ev(f.body,sc);var r=this.execBlock(f.body,sc);return r&&r.r==="ret"?r.v:null}finally{this.depth--}
  }
  err("TypeError","'"+repr(f)+"' no es una función; no puedes llamarlo con ().",L)};
function M(name,fn){return {name:name,fn:fn}}
IP.getattr=function(o,n,L){
  var tbl=Array.isArray(o)?LIST_M:typeof o==="string"?STR_M:o instanceof PDict?DICT_M:o instanceof PSet?SET_M:null;
  if(tbl&&tbl[n])return new BoundM(o,n,tbl[n]);
  err("AttributeError",tname(o)+" no tiene el método '"+n+"'."+(n==="push"?" En Python se usa .append().":n==="length"?" En Python se usa len(...).":""),L)};
var LIST_M={
  append:function(o,a,kw,L){if(a.length!==1)err("TypeError","append() recibe exactamente 1 valor.",L);o.push(a[0]);return null},
  pop:function(o,a,kw,L){if(!o.length)err("IndexError","pop() de una lista vacía.",L);if(a.length){var i=idx(o.length,a[0],L,"la lista");return o.splice(i,1)[0]}return o.pop()},
  insert:function(o,a,kw,L){var i=a[0];if(i<0)i=Math.max(0,o.length+i);o.splice(Math.min(i,o.length),0,a[1]);return null},
  remove:function(o,a,kw,L){for(var i=0;i<o.length;i++)if(eq(o[i],a[0])){o.splice(i,1);return null}err("ValueError",repr(a[0])+" no está en la lista.",L)},
  index:function(o,a,kw,L){for(var i=0;i<o.length;i++)if(eq(o[i],a[0]))return i;err("ValueError",repr(a[0])+" no está en la lista.",L)},
  count:function(o,a){var c=0;for(var i=0;i<o.length;i++)if(eq(o[i],a[0]))c++;return c},
  sort:function(o,a,kw,L){var self=this,key=kw.key||null;o.sort(function(x,y){var kx=key?self.call(key,[x],{},L):x,ky=key?self.call(key,[y],{},L):y;return cmp(kx,ky,L)});if(kw.reverse&&truthy(kw.reverse))o.reverse();this.steps+=o.length*4;return null},
  reverse:function(o){o.reverse();return null},extend:function(o,a,kw,L){iter(a[0],L).forEach(function(x){o.push(x)});return null},
  copy:function(o){return o.slice()},clear:function(o){o.length=0;return null}};
var STR_M={
  lower:function(s){return s.toLowerCase()},upper:function(s){return s.toUpperCase()},strip:function(s){return s.trim()},
  isalnum:function(s){return s.length>0&&/^[A-Za-z0-9áéíóúñÁÉÍÓÚÑ]+$/.test(s)},isalpha:function(s){return s.length>0&&/^[A-Za-záéíóúñÁÉÍÓÚÑ]+$/.test(s)},isdigit:function(s){return s.length>0&&/^[0-9]+$/.test(s)},isspace:function(s){return s.length>0&&/^\s+$/.test(s)},
  split:function(s,a){return a.length&&a[0]!==null?s.split(a[0]):s.trim().split(/\s+/).filter(function(x){return x})},
  join:function(s,a,kw,L){var it=iter(a[0],L);it.forEach(function(x){if(typeof x!=="string")err("TypeError","join() solo une textos; encontré "+tname(x)+".",L)});return it.join(s)},
  replace:function(s,a){return s.split(a[0]).join(a[1])},startswith:function(s,a){return s.indexOf(a[0])===0},endswith:function(s,a){return s.length>=a[0].length&&s.slice(s.length-a[0].length)===a[0]},
  find:function(s,a){return s.indexOf(a[0])},count:function(s,a){return a[0]===""?s.length+1:s.split(a[0]).length-1}};
var DICT_M={
  get:function(d,a,kw,L){var v=d.get(a[0],L);return v===undefined?(a.length>1?a[1]:null):v},
  keys:function(d){return d.keys()},values:function(d){var r=[];d.m.forEach(function(e){r.push(e[1])});return r},
  items:function(d){var r=[];d.m.forEach(function(e){r.push(new Tup([e[0],e[1]]))});return r},
  pop:function(d,a,kw,L){var k=hk(a[0],L);if(d.m.has(k)){var v=d.m.get(k)[1];d.m.delete(k);return v}if(a.length>1)return a[1];err("KeyError","la llave "+repr(a[0])+" no existe.",L)},
  setdefault:function(d,a,kw,L){if(!d.has(a[0],L))d.set(a[0],a.length>1?a[1]:null,L);return d.get(a[0],L)},
  copy:function(d){var n=new PDict();d.m.forEach(function(e,k){n.m.set(k,[e[0],e[1]])});return n}};
var SET_M={
  add:function(s,a,kw,L){s.add(a[0],L);return null},remove:function(s,a,kw,L){var k=hk(a[0],L);if(!s.m.has(k))err("KeyError",repr(a[0])+" no está en el set.",L);s.m.delete(k);return null},
  discard:function(s,a,kw,L){s.m.delete(hk(a[0],L));return null},copy:function(s){var n=new PSet();s.m.forEach(function(v,k){n.m.set(k,v)});return n},
  pop:function(s,a,kw,L){var it=s.m.keys().next();if(it.done)err("KeyError","pop() de un set vacío.",L);var v=s.m.get(it.value);s.m.delete(it.value);return v}};
function B(n,fn){return new Builtin(n,fn)}
function toNum(v,L,who){if(typeof v==="number")return v;if(typeof v==="boolean")return +v;err("TypeError",who+" necesita un número, no "+tname(v)+".",L)}
var BUILTINS={
  print:B("print",function(a,kw){var sep=kw.sep!==undefined?kw.sep:" ",end=kw.end!==undefined?kw.end:"\n";this.out.push(a.map(function(x){return repr(x,true)}).join(sep)+end);if(this.out.length>2000)err("OutputError","demasiadas líneas impresas.",0);return null}),
  len:B("len",function(a,kw,L){var v=a[0];if(typeof v==="string"||Array.isArray(v))return v.length;if(v instanceof Tup)return v.items.length;if(v instanceof PDict||v instanceof PSet)return v.m.size;err("TypeError","len() no funciona con "+tname(v)+".",L)}),
  range:B("range",function(a,kw,L){a=a.map(function(x){return toNum(x,L,"range()")});var s=0,e,st=1;if(a.length===1)e=a[0];else{s=a[0];e=a[1];if(a.length>2)st=a[2]}if(st===0)err("ValueError","range() no acepta paso 0.",L);var r=[];if(Math.abs((e-s)/st)>2e6)err("ValueError","range demasiado grande para este intérprete.",L);if(st>0)for(var i=s;i<e;i+=st)r.push(i);else for(var j=s;j>e;j+=st)r.push(j);return r}),
  enumerate:B("enumerate",function(a,kw,L){var s=a.length>1?a[1]:(kw.start||0);return iter(a[0],L).map(function(x,i){return new Tup([i+s,x])})}),
  zip:B("zip",function(a,kw,L){var its=a.map(function(x){return iter(x,L)}),n=Math.min.apply(null,its.map(function(x){return x.length})),r=[];for(var i=0;i<n;i++)r.push(new Tup(its.map(function(x){return x[i]})));return r}),
  min:B("min",function(a,kw,L){var it=a.length===1?iter(a[0],L):a;if(!it.length)err("ValueError","min() de una secuencia vacía.",L);var self=this,best=it[0];for(var i=1;i<it.length;i++){var x=kw.key?self.call(kw.key,[it[i]],{},L):it[i],y=kw.key?self.call(kw.key,[best],{},L):best;if(cmp(x,y,L)<0)best=it[i]}return best}),
  max:B("max",function(a,kw,L){var it=a.length===1?iter(a[0],L):a;if(!it.length)err("ValueError","max() de una secuencia vacía.",L);var self=this,best=it[0];for(var i=1;i<it.length;i++){var x=kw.key?self.call(kw.key,[it[i]],{},L):it[i],y=kw.key?self.call(kw.key,[best],{},L):best;if(cmp(x,y,L)>0)best=it[i]}return best}),
  sum:B("sum",function(a,kw,L){var s=a.length>1?a[1]:0;iter(a[0],L).forEach(function(x){s=s+toNum(x,L,"sum()")});return s}),
  abs:B("abs",function(a,kw,L){return Math.abs(toNum(a[0],L,"abs()"))}),
  round:B("round",function(a,kw,L){var d=a.length>1?a[1]:0,f=Math.pow(10,d);return Math.round(toNum(a[0],L,"round()")*f)/f}),
  sorted:B("sorted",function(a,kw,L){var c=iter(a[0],L);LIST_M.sort.call(this,c,[],kw,L);return c}),
  reversed:B("reversed",function(a,kw,L){return iter(a[0],L).reverse()}),
  str:B("str",function(a){return a.length?repr(a[0],true):""}),
  int:B("int",function(a,kw,L){var v=a[0];if(typeof v==="string"){if(!/^\s*[-+]?\d+\s*$/.test(v))err("ValueError","int() no puede convertir "+repr(v)+" a número entero.",L);return parseInt(v,10)}return Math.trunc(toNum(v,L,"int()"))}),
  float:B("float",function(a,kw,L){var v=a[0];if(typeof v==="string"){var t=v.trim().toLowerCase();if(t==="inf"||t==="infinity")return Infinity;if(t==="-inf")return -Infinity;var n=parseFloat(t);if(isNaN(n))err("ValueError","float() no puede convertir "+repr(v)+".",L);return n}return toNum(v,L,"float()")}),
  bool:B("bool",function(a){return truthy(a[0])}),
  list:B("list",function(a,kw,L){return a.length?iter(a[0],L):[]}),
  tuple:B("tuple",function(a,kw,L){return new Tup(a.length?iter(a[0],L):[])}),
  set:B("set",function(a,kw,L){var s=new PSet();if(a.length)iter(a[0],L).forEach(function(x){s.add(x,L)});return s}),
  dict:B("dict",function(a,kw,L){var d=new PDict();if(a.length){if(a[0] instanceof PDict)return DICT_M.copy(a[0]);iter(a[0],L).forEach(function(p){var it=iter(p,L);d.set(it[0],it[1],L)})}for(var k in kw)d.set(k,kw[k],L);return d}),
  any:B("any",function(a,kw,L){return iter(a[0],L).some(truthy)}),all:B("all",function(a,kw,L){return iter(a[0],L).every(truthy)}),
  ord:B("ord",function(a){return a[0].charCodeAt(0)}),chr:B("chr",function(a){return String.fromCharCode(a[0])}),
  isinstance:B("isinstance",function(a){return true}),
  input:B("input",function(a,kw,L){err("InputError","input() no está disponible aquí: usa valores fijos en tus variables.",L)})
};

/* ---------- API ---------- */
function fmtErr(e){if(e instanceof PyErr)return {type:e.type,msg:e.msg,line:e.line,text:(e.line?"Línea "+e.line+" · ":"")+e.type+": "+e.msg};return {type:"Error",msg:String(e&&e.message||e),line:0,text:"Error interno: "+String(e&&e.message||e)}}
function evalExpr(ip,src){var p=new Parser(lex(src));var e=p.exprlist();return ip.ev(e,null)}
function runTests(code,tests,opts){
  var res={ok:true,out:"",error:null,tests:[]},ip=new Interp({maxSteps:(opts&&opts.maxSteps)||3000000});
  try{ip.run(code)}catch(e){res.ok=false;res.error=fmtErr(e);res.out=ip.out.join("");return res}
  var baseOut=ip.out.join("");res.out=baseOut;
  (tests||[]).forEach(function(t){
    var r={label:t.label||t.call||"salida",ok:false,got:"",expect:""};
    try{
      if(t.rerun){var re=new RegExp(t.rerun.re);r.isOut=true;r.label=t.label||"otra prueba";r.expect=t.out;
        if(!re.test(code)){r.got="(no encontré la línea original; no la cambies)";r.ok=false}
        else{var ip2=new Interp({maxSteps:3000000});try{ip2.run(code.replace(re,t.rerun.to))}catch(e2){r.err=fmtErr(e2)}r.got=ip2.out.join("").replace(/\n$/,"");r.ok=!r.err&&r.got.replace(/\s+$/gm,"")===t.out.replace(/\s+$/gm,"")}}
      else if(t.match!==undefined){r.isOut=true;r.isMatch=true;r.got=baseOut.replace(/\n$/,"");r.expect=t.desc||t.match;r.ok=new RegExp(t.match).test(r.got);r.label=t.label||"lo que imprime tu programa"}
      else if(t.out!==undefined){r.expect=t.out;r.got=baseOut.replace(/\n$/,"");r.isOut=true;r.ok=r.got.replace(/\s+$/gm,"")===t.out.replace(/\s+$/gm,"");r.label=t.label||"lo que imprime tu programa"}
      else{
        ip.steps=0;ip.max=t.maxSteps||(opts&&opts.maxSteps)||3000000;ip.out=[];
        if(t.setup){var p=new Parser(lex(t.setup)).program();ip.execBlock(p,null)}
        var exp=evalExpr(new Interp(),t.expect);r.expect=repr(exp);
        r.call=t.call;r.big=!!t.big;var got=evalExpr(ip,t.call);r.got=repr(got);r.printed=ip.out.join("");
        if(t.anyOrder&&Array.isArray(got)&&Array.isArray(exp))r.ok=eq(got.slice().sort(function(a,b){return cmp(a,b)}),exp.slice().sort(function(a,b){return cmp(a,b)}));else r.ok=eq(got,exp);
        if(t.big)r.label=t.label||"prueba grande";
      }
    }catch(e){r.ok=false;r.err=fmtErr(e);r.got="💥 "+r.err.text;if(t.call){r.call=t.call;r.printed=ip.out.join("")}}
    if(!r.ok)res.ok=false;res.tests.push(r);
  });
  return res;
}
return {run:function(code,opts){var ip=new Interp(opts);try{ip.run(code);return {out:ip.out.join(""),error:null}}catch(e){return {out:ip.out.join(""),error:fmtErr(e)}}},runTests:runTests,repr:repr};
})();
if(typeof module!=="undefined")module.exports=MiniPy;
