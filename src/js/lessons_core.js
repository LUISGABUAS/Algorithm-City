var EXTRA_CASES={
"w1:0":[
 {t:"code",n:"1",nm:"Two Sum",sl:"two-sum",d:"E",q:"¿Qué va en el hueco?",code:"def two_sum(nums, target):\n    visto = {}\n    for i, x in enumerate(nums):\n        falta = target - x\n        if ____ in visto:\n            return [visto[falta], i]\n        visto[x] = i",opts:["falta","x","i","target"],ok:0,why:"Buscas el complemento que te falta para llegar al objetivo: target − x."},
 {t:"trace",n:"412",nm:"Fizz Buzz",sl:"fizz-buzz",d:"E",q:"¿Qué devuelve fizz_buzz(5)?",code:"def fizz_buzz(n):\n    res = []\n    for i in range(1, n + 1):\n        if i % 15 == 0: res.append(\"FizzBuzz\")\n        elif i % 3 == 0: res.append(\"Fizz\")\n        elif i % 5 == 0: res.append(\"Buzz\")\n        else: res.append(str(i))\n    return res",opts:["[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]","[\"1\",\"2\",\"3\",\"4\",\"5\"]","[\"Fizz\",\"Buzz\"]","[\"1\",\"2\",\"Fizz\",\"4\",\"FizzBuzz\"]"],ok:0,why:"3 es múltiplo de 3 → Fizz; 5 es múltiplo de 5 → Buzz; el resto se queda como número."}
],
"w1:1":[
 {t:"trace",n:"1480",nm:"Running Sum of 1d Array",sl:"running-sum-of-1d-array",d:"E",q:"¿Qué devuelve running_sum([1, 2, 3, 4])?",code:"def running_sum(nums):\n    total = 0\n    res = []\n    for x in nums:\n        total += x\n        res.append(total)\n    return res",opts:["[1, 3, 6, 10]","[1, 2, 3, 4]","[10]","[0, 1, 3, 6]"],ok:0,why:"Cada posición es la suma acumulada: 1, 1+2, 1+2+3, 1+2+3+4."},
 {t:"code",n:"66",nm:"Plus One",sl:"plus-one",d:"E",q:"¿Qué va en el hueco?",code:"def plus_one(digits):\n    for i in range(len(digits) - 1, -1, -1):\n        if digits[i] < 9:\n            digits[i] += 1\n            return digits\n        digits[i] = 0\n    return [1] + ____",opts:["digits","[0]","digits[1:]","[1]"],ok:0,why:"Si todos eran 9, ya quedaron en 0: agregas un 1 al frente de esa misma lista."}
],
"w1:2":[
 {t:"code",n:"217",nm:"Contains Duplicate",sl:"contains-duplicate",d:"E",q:"¿Qué método va en el hueco?",code:"def contains_duplicate(nums):\n    visto = set()\n    for x in nums:\n        if x in visto:\n            return True\n        visto.____(x)\n    return False",opts:["add","append","insert","push"],ok:0,why:"Los sets de Python usan add(). append es para listas."},
 {t:"trace",n:"242",nm:"Valid Anagram",sl:"valid-anagram",d:"E",q:"¿Qué devuelve is_anagram(\"rat\", \"car\")?",code:"def is_anagram(s, t):\n    if len(s) != len(t):\n        return False\n    conteo = {}\n    for c in s:\n        conteo[c] = conteo.get(c, 0) + 1\n    for c in t:\n        conteo[c] = conteo.get(c, 0) - 1\n        if conteo[c] < 0:\n            return False\n    return True",opts:["False","True","Error","None"],ok:0,why:"\"car\" tiene una c que \"rat\" no tiene: su conteo baja a −1 y devuelve False."}
],
"w1:3":[
 {t:"trace",n:"14",nm:"Longest Common Prefix",sl:"longest-common-prefix",d:"E",q:"¿Qué devuelve con [\"inter\", \"internet\", \"interval\"]?",code:"def longest_common_prefix(strs):\n    base = strs[0]\n    for i in range(len(base)):\n        for s in strs[1:]:\n            if i >= len(s) or s[i] != base[i]:\n                return base[:i]\n    return base",opts:["\"inter\"","\"int\"","\"in\"","\"\""],ok:0,why:"Las cinco letras de \"inter\" coinciden en las tres palabras, y la base se acaba ahí."},
 {t:"code",n:"1",nm:"Two Sum",sl:"two-sum",d:"E",q:"¿Qué va en el hueco?",code:"def two_sum(nums, target):\n    visto = {}\n    for i, x in enumerate(nums):\n        falta = target - x\n        if falta in visto:\n            return [visto[falta], i]\n        visto[____] = i",opts:["x","falta","i","target"],ok:0,why:"Guardas el número que acabas de ver (x) con su índice, para que otro lo encuentre como complemento."}
],
"w1:4":[
 {t:"trace",n:"121",nm:"Best Time to Buy and Sell Stock",sl:"best-time-to-buy-and-sell-stock",d:"E",q:"¿Qué devuelve max_profit([2, 4, 1])?",code:"def max_profit(prices):\n    minimo = float('inf')\n    mejor = 0\n    for p in prices:\n        minimo = min(minimo, p)\n        mejor = max(mejor, p - minimo)\n    return mejor",opts:["2","3","0","1"],ok:0,why:"Compras en 2 y vendes en 4. El 1 llega al final y ya no hay día para vender."},
 {t:"code",n:"344",nm:"Reverse String",sl:"reverse-string",d:"E",q:"¿Qué va en el hueco?",code:"def reverse_string(s):\n    i, j = 0, len(s) - 1\n    while i < j:\n        s[i], s[j] = ____\n        i += 1\n        j -= 1",opts:["s[j], s[i]","s[i], s[j]","s[j], s[j]","j, i"],ok:0,why:"Intercambias los extremos: s[i] toma el valor de s[j] y viceversa."}
]
};
(function(){for(var k in EXTRA_CASES){CASES[k]=(CASES[k]||[]).concat(EXTRA_CASES[k])}})();

/* ---------- resaltado de código ---------- */
function hl(code){
  var KW=/\b(def|for|in|if|elif|else|return|while|not|and|or|True|False|None|range|len|set|enumerate|min|max|float|str)\b/g;
  return code.split("\n").map(function(line){
    var cmt="",ci=line.indexOf("#");if(ci>=0){cmt=line.slice(ci);line=line.slice(0,ci)}
    var parts=line.split(/("[^"]*"|'[^']*')/);
    var out=parts.map(function(p,i){if(i%2)return '<span class="hs">'+esc(p)+'</span>';
      return esc(p).replace(KW,'<span class="hk">$1</span>').replace(/\b(\d+)\b/g,'<span class="hn">$1</span>').replace(/____/g,'<span class="hb">____</span>')}).join("");
    return out+(cmt?'<span class="hc">'+esc(cmt)+'</span>':"");
  }).join("\n");
}

/* ---------- pizarrón animado ---------- */
function txt(c,s,x,y,col,size){c.fillStyle=col||"#2b3a67";c.font="bold "+(size||7)+"px ui-monospace,Menlo,Consolas,monospace";c.textBaseline="top";c.fillText(s,x,y)}
function cellBox(c,x,y,w,h,fill,label,lc){R(c,"#2b3a67",x,y,w,h);R(c,fill||"#fff",x+1,y+1,w-2,h-2);if(label!==undefined)txt(c,String(label),x+2,y+2,lc||"#2b3a67",7)}
function arrowUp(c,x,y,col){R(c,col,x,y,1,5);R(c,col,x-1,y+1,3,1);R(c,col,x-2,y+2,5,1)}
function boardAnim(c,a,X,Y,W,H,t){
  var ink="#2b3a67",org="#f4a020",grn="#2a9d6f",red="#e04b4b",blu="#3f74c4",i,step;
  if(a==="bigo"){R(c,ink,X+6,Y+H-6,W-12,1);R(c,ink,X+6,Y+3,1,H-9);var p=Math.min(1,(t%5)/3);var n=Math.floor(p*(W-16));
    for(i=0;i<n;i++){var xx=X+7+i,u=i/(W-16);R(c,grn,xx,Y+H-8,1,1);R(c,blu,xx,Y+H-8-Math.round(Math.log(1+u*20)*3),1,1);R(c,org,xx,Y+H-8-Math.round(u*(H-14)),1,1);var q=Math.round(u*u*(H-14)*2.2);if(q<H-10)R(c,red,xx,Y+H-8-q,1,1)}
    txt(c,"n²",X+28,Y+4,red);txt(c,"n",X+W-16,Y+10,org);txt(c,"log n",X+W-28,Y+H-20,blu);txt(c,"1",X+W-12,Y+H-14,grn)}
  else if(a==="scan"){var vals=[3,8,1,9,4,7,2];i=Math.floor(t*1.3)%7;for(var k=0;k<7;k++)cellBox(c,X+6+k*12,Y+12,11,11,k===i?"#ffe1a8":(k<i?"#dff5e8":"#fff"),vals[k]);arrowUp(c,X+11+i*12,Y+25,org);txt(c,"i",X+10+i*12,Y+31,org)}
  else if(a==="hash"){var nums=[2,7,11,15];step=Math.floor(t*0.9)%5;for(var k2=0;k2<4;k2++)cellBox(c,X+4+k2*13,Y+6,12,11,k2===step?"#ffe1a8":"#fff",nums[k2]);if(step<4)arrowUp(c,X+9+step*13,Y+19,org);
    R(c,ink,X+58,Y+4,32,40);R(c,"#f2f6ff",X+59,Y+5,30,38);txt(c,"visto",X+61,Y+6,blu,6);for(var k3=0;k3<Math.min(step,2);k3++)txt(c,nums[k3]+": "+k3,X+62,Y+15+k3*9,ink);
    if(step===1||step===2){txt(c,"9-7=2 ✓",X+4,Y+28,grn,7);txt(c,"[0, 1]",X+4,Y+37,grn,7)}else if(step===0)txt(c,"9-2=7 ✗",X+4,Y+28,red,7)}
  else if(a==="fastslow"){var states=[[0,1,0,3,12],[0,1,0,3,12],[1,0,0,3,12],[1,0,0,3,12],[1,3,0,0,12],[1,3,12,0,0]],ws=[0,0,1,1,2,3];step=Math.floor(t*0.8)%6;var st=states[step];
    for(var k4=0;k4<5;k4++)cellBox(c,X+8+k4*15,Y+10,14,12,st[k4]===0?"#eef1f5":"#dff5e8",st[k4]);var rd=Math.min(step,4);arrowUp(c,X+14+rd*15,Y+24,org);txt(c,"leer",X+6+rd*15,Y+31,org,6);R(c,blu,X+10+ws[step]*15,Y+5,10,2);txt(c,"escribir",X+2+ws[step]*15,Y+39,blu,6)}
  else if(a==="prefix"){var a1=[1,2,3,4],pr=[1,3,6,10];step=Math.floor(t*0.9)%6;for(var k5=0;k5<4;k5++){cellBox(c,X+10+k5*18,Y+6,16,11,k5===step?"#ffe1a8":"#fff",a1[k5]);if(k5<step)cellBox(c,X+10+k5*18,Y+24,16,11,"#dff5e8",pr[k5])}txt(c,"nums",X+1,Y+8,ink,6);txt(c,"suma",X+1,Y+26,grn,6)}
  else if(a==="carry"){var sts=[[1,2,9,9],[1,2,9,0],[1,2,0,0],[1,3,0,0],[1,3,0,0]];step=Math.floor(t*0.8)%5;var d=sts[step];for(var k6=0;k6<4;k6++)cellBox(c,X+14+k6*16,Y+10,15,13,(3-k6)===step-1||(step===3&&k6===1)?"#ffe1a8":"#fff",d[k6]);txt(c,"+1",X+80,Y+2,red,8);if(step>0&&step<3)txt(c,"lleva 1",X+30,Y+30,red,7);if(step>=3)txt(c,"= 1300",X+30,Y+30,grn,8)}
  else if(a==="set"){var seq=[4,1,7,1];step=Math.floor(t*0.8)%5;R(c,ink,X+50,Y+8,38,30);R(c,"#f2f6ff",X+51,Y+9,36,28);txt(c,"set",X+54,Y+10,blu,6);for(var k7=0;k7<Math.min(step,3);k7++)txt(c,String(seq[k7]),X+56+k7*10,Y+22,ink,8);
    for(var k8=0;k8<4;k8++)cellBox(c,X+4+k8*11,Y+14,10,11,k8===step?(step===3?"#ffd0d0":"#ffe1a8"):"#fff",seq[k8]);if(step===3)txt(c,"¡repetido!",X+2,Y+32,red,7)}
  else if(a==="count"){var letters="anagrama",cnt={};step=Math.floor(t*2)%(letters.length+3);for(var k9=0;k9<letters.length;k9++){cellBox(c,X+2+k9*11,Y+3,10,10,k9===step?"#ffe1a8":"#fff",letters[k9]);if(k9<step)cnt[letters[k9]]=(cnt[letters[k9]]||0)+1}
    var keys=["a","n","g","r","m"];keys.forEach(function(L,j){var v=cnt[L]||0;txt(c,L,X+10+j*16,Y+H-9,ink,7);R(c,[org,blu,grn,red,"#9b5de5"][j],X+8+j*16,Y+H-11-v*6,8,v*6)})}
  else if(a==="strings"){var ws2=["flor","flota","flecha"];step=Math.floor(t*0.8)%4;for(var r=0;r<3;r++)for(var k10=0;k10<ws2[r].length;k10++){var colx=k10===step?(step===2?"#ffd0d0":"#ffe1a8"):(k10<step?"#dff5e8":"#fff");cellBox(c,X+8+k10*11,Y+3+r*13,10,12,colx,ws2[r][k10])}if(step===2)txt(c,"→ \"fl\"",X+70,Y+16,grn,7)}
  else if(a==="minprice"){var pr2=[7,1,5,3,6,4];step=Math.floor(t*1.1)%7;var mn=99,best=0;for(var k11=0;k11<6;k11++){if(k11<step){mn=Math.min(mn,pr2[k11]);best=Math.max(best,pr2[k11]-mn)}var hh=pr2[k11]*4;R(c,k11===step?org:(pr2[k11]===1&&step>1?grn:blu),X+8+k11*13,Y+H-6-hh,9,hh)}
    R(c,ink,X+4,Y+H-6,W-8,1);if(step>1){R(c,grn,X+4,Y+H-6-4,W-8,1);txt(c,"mín",X+80,Y+H-14,grn,6)}txt(c,"mejor: "+best,X+4,Y+2,red,7)}
  else if(a==="palin"){var s="RADAR";step=Math.floor(t*0.8)%4;var ii=Math.min(step,2),jj=4-Math.min(step,2);for(var k12=0;k12<5;k12++)cellBox(c,X+14+k12*14,Y+10,13,13,(k12===ii||k12===jj)?"#ffe1a8":(k12<ii||k12>jj?"#dff5e8":"#fff"),s[k12]);arrowUp(c,X+20+ii*14,Y+25,org);arrowUp(c,X+20+jj*14,Y+25,blu);txt(c,"i",X+19+ii*14,Y+31,org);txt(c,"j",X+19+jj*14,Y+31,blu);if(step>=2)txt(c,"✓ palíndromo",X+20,Y+2,grn,7)}
}
function drawClass(c,w,f,anim,t,o){
  o=o||{};drawBase(c,w,f);
  R(c,OL,40,4,98,56);R(c,"#aeb6c1",41,5,96,54);R(c,"#f7f9fb",43,7,92,50);
  boardAnim(c,anim,43,7,92,50,t);
  R(c,"#7c8592",46,58,86,3);
  var mx=126,my=40;disc(c,mx+16,my+33+16,9,"rgba(0,0,0,.25)",.3);c.drawImage(npcSprite(424242),0,0,32,48,mx,my,32,48);
  if(o.player){R(c,OL,20,92,44,6);R(c,THEME[w].desk,21,93,42,4);c.drawImage(FR.upidle,0,0,32,48,26,70,32,48)}
  else{R(c,OL,20,96,40,5);R(c,THEME[w].desk,21,97,38,3);R(c,OL,70,96,40,5);R(c,THEME[w].desk,71,97,38,3)}
}

/* ---------- pantalla de clase ---------- */
