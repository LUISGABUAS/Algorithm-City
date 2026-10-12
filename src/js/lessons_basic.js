
/* ================= CLASES DESDE CERO (nivel principiante) =================
   lv:[min,max] → niveles para los que la clase está en el camino:
   0 = nunca he programado · 1 = sé lo básico · 2 = ya programo, quiero algoritmos */
var BASIC_LESSONS=[
{id:"b1",lv:[0,0],title:"¿Qué es programar?",recap:[
  "Programar es dar instrucciones a la computadora, como una receta.",
  "La computadora lee tus líneas en orden: de arriba hacia abajo, una por una.",
  "print(...) muestra en pantalla lo que pongas entre paréntesis.",
  "El texto va entre comillas: \"hola\".",
  "Un error no es un fracaso: Python te dice en qué línea revisar."],steps:[
 {k:"talk",anim:"terminal",text:"¡Hola! Soy la Profe Ada. Vamos a empezar desde cero, sin prisa. Programar es darle instrucciones a la computadora, como una receta de cocina: ella las sigue en orden y hace EXACTAMENTE lo que le dices, ni más ni menos."},
 {k:"talk",anim:"terminal",text:"Así funciona esta pantalla: abajo hay un EDITOR donde escribes. Cuando presionas ▶ EJECUTAR, la computadora lee tu código y te muestra el resultado en la TERMINAL. Y si algo sale mal, no pasa nada: te digo qué línea revisar."},
 {k:"build",anim:"terminal",text:"Tu primera instrucción: print. Significa «muestra en pantalla». Ya escribí casi todo por ti: borra los ___ y escribe tu nombre en su lugar (deja las comillas). Luego presiona ▶ EJECUTAR.",
  goal:"Cambia ___ por tu nombre y ejecuta.",starter:`print("Hola, soy ___")
`,tests:[{match:"^Hola, soy (?!.*___).*\\S",desc:"Hola, soy (tu nombre)"}],
  hints:["Haz clic justo después de los ___, bórralos con la tecla ⌫ y escribe tu nombre.","Debe quedar algo así: print(\"Hola, soy Luis\")"],
  explain:[["print( )","La instrucción «muestra en pantalla». Lo que va dentro de los paréntesis es lo que se muestra."],["\"Hola, soy …\"","Un texto. Las comillas le dicen a Python dónde empieza y dónde termina."]],
  solution:`print("Hola, soy Ada")`},
 {k:"check",anim:"terminal",q:"¿En qué orden lee la computadora tus líneas de código?",opts:["De arriba hacia abajo, una por una","Todas al mismo tiempo","De abajo hacia arriba","En el orden que ella quiera"],ok:0,why:"Siempre en orden, de arriba hacia abajo. Por eso el orden de tus líneas importa."},
 {k:"build",anim:"terminal",text:"Ahora escribe la línea completa tú solo. La receta es: print, abre paréntesis, abre comillas, tu texto, cierra comillas, cierra paréntesis. (Truco: al escribir ( o \" el editor pone el cierre por ti).",
  goal:"Imprime exactamente: Voy a trabajar en Google",starter:`# escribe tu línea debajo de este comentario
`,tests:[{out:"Voy a trabajar en Google"}],
  hints:["Empieza escribiendo print(","Dentro del paréntesis van las comillas y el texto: \"Voy a trabajar en Google\"","Completo: print(\"Voy a trabajar en Google\")"],
  explain:[["# ...","Las líneas que empiezan con # son comentarios: notas para humanos. La computadora las ignora."]],
  solution:`print("Voy a trabajar en Google")`},
 {k:"build",anim:"terminal",text:"Un programa puede tener muchas líneas. Cada print muestra su texto en una línea nueva, en el orden en que las escribiste.",
  goal:"Haz un programa de 3 líneas que imprima Uno, Dos y Tres.",starter:``,tests:[{out:"Uno\nDos\nTres"}],
  hints:["Necesitas tres print, uno en cada línea.","print(\"Uno\") en la primera línea, print(\"Dos\") en la segunda…"],
  solution:`print("Uno")
print("Dos")
print("Tres")`},
 {k:"talk",anim:"terminal",text:"Algo muy importante: los errores son normales. Hasta los programadores de Google ven errores todo el día. Si olvidas una comilla o un paréntesis, Python te avisa con un SyntaxError (error de escritura) y te marca la línea en rojo. Solo tienes que leer y corregir."},
 {k:"build",anim:"terminal",text:"Tu primer bug (así se llaman los errores). Esta línea tiene un error a propósito. Ejecútala para ver el mensaje, y luego arréglala.",
  goal:"Arregla el código para que imprima: Hola",starter:`print("Hola)
`,tests:[{out:"Hola"}],
  hints:["Ejecuta primero para ver qué dice el error.","Las comillas siempre van en pares: una abre y otra cierra. ¿Dónde falta la que cierra?","Así queda: print(\"Hola\")"],
  solution:`print("Hola")`},
 {k:"talk",anim:"terminal",text:"¡Ya escribiste tus primeros programas y arreglaste tu primer bug! Siguiente clase: números y texto."}
]},

{id:"b2",lv:[0,0],title:"Números y texto",recap:[
  "Hay dos tipos básicos de datos: números (5, 3.5) y texto (\"hola\").",
  "Los números van sin comillas; el texto, con comillas.",
  "Operaciones: + suma, - resta, * multiplica, / divide.",
  "// es división entera y % es el residuo (lo que sobra).",
  "\"5\" + \"5\" pega textos: da \"55\". 5 + 5 suma: da 10."],steps:[
 {k:"talk",anim:"terminal",text:"Python distingue dos tipos de datos básicos: NÚMEROS, como 5 o 3.5, y TEXTO, como \"hola\". Los números se escriben sin comillas y con ellos puedes hacer cuentas. El texto siempre va entre comillas."},
 {k:"build",anim:"terminal",text:"Python es una calculadora: + suma, - resta y * (asterisco) multiplica. Ya puse la primera línea. Completa las otras dos cambiando cada ___ por el signo correcto.",
  goal:"Haz que se impriman los resultados 5, 6 y 12.",starter:`print(2 + 3)
print(10 ___ 4)
print(3 ___ 4)
`,tests:[{out:"5\n6\n12"}],
  hints:["10 menos 4 es 6, así que el signo de la segunda línea es -","3 por 4 es 12. En programación «por» se escribe con asterisco: *"],
  explain:[["print(2 + 3)","Primero calcula 2 + 3 y luego muestra el resultado: 5."],["*","Multiplicar. No se usa la x."]],
  solution:`print(2 + 3)
print(10 - 4)
print(3 * 4)`},
 {k:"check",anim:"terminal",q:"¿Qué imprime print(\"5\" + \"5\")?",opts:["55","10","Da error","5 + 5"],ok:0,why:"Con comillas son textos, no números. Sumar textos los pega uno tras otro: \"5\" + \"5\" = \"55\"."},
 {k:"build",anim:"terminal",text:"Dividir tiene tres sabores. Imagina 7 rebanadas de pizza para 2 personas: / da 3.5 (decimales), // da 3 (rebanadas enteras para cada quien) y % da 1 (la rebanada que sobra). El % se llama residuo y lo usarás muchísimo.",
  goal:"Imprime 7 // 2 y en otra línea 7 % 2 (debe salir 3 y 1).",starter:`# 1. imprime 7 // 2

# 2. imprime 7 % 2
`,tests:[{out:"3\n1"}],
  hints:["Primera línea: print(7 // 2)","Segunda línea: print(7 % 2)"],
  explain:[["7 // 2","División entera: 3 (se descartan los decimales)."],["7 % 2","Residuo: lo que sobra al repartir, 1."]],
  solution:`print(7 // 2)
print(7 % 2)`},
 {k:"check",anim:"terminal",q:"Un número es PAR cuando al dividirlo entre 2 no sobra nada. ¿Cuánto vale 8 % 2?",opts:["0","4","2","1"],ok:0,why:"8 entre 2 es 4 exacto y no sobra nada: 8 % 2 = 0. Por eso «x % 2 == 0» significa «x es par»."},
 {k:"talk",anim:"terminal",text:"¡Bien! Ya sabes hacer cuentas con Python. Siguiente clase: guardar datos en variables."}
]},

{id:"b3",lv:[0,0],title:"Variables: cajas con nombre",recap:[
  "Una variable es una caja con nombre que guarda un valor.",
  "nombre = valor guarda el valor en la caja. El = significa «guarda», no «igual».",
  "Para leer la caja, escribe su nombre (sin comillas).",
  "x = x + 1 calcula primero la derecha y luego guarda. Atajo: x += 1.",
  "Puedes pegar textos con +: \"Hola, \" + nombre."],steps:[
 {k:"talk",anim:"terminal",text:"Una variable es como una caja con una etiqueta. Escribes edad = 25 y Python guarda el 25 en una caja llamada edad. Después, cada vez que escribas edad, Python abre la caja y usa lo que hay dentro. Ojo: aquí el = significa «guarda esto», no «es igual»."},
 {k:"build",anim:"terminal",text:"Cambia el ___ por 25 para guardarlo en la caja edad. La segunda línea muestra lo que hay en la caja. Fíjate: edad va SIN comillas, porque es el nombre de una caja, no un texto.",
  goal:"Guarda 25 en edad y muéstralo.",starter:`edad = ___
print(edad)
`,tests:[{out:"25"}],
  hints:["La primera línea debe quedar: edad = 25"],
  explain:[["edad = 25","Guarda el número 25 en una caja llamada edad."],["print(edad)","Abre la caja edad y muestra su contenido."]],
  solution:`edad = 25
print(edad)`},
 {k:"check",anim:"terminal",q:"¿Qué imprime este código?  nombre = \"Ana\"  y después  print(\"nombre\")",opts:["nombre","Ana","\"Ana\"","Da error"],ok:0,why:"Con comillas, \"nombre\" es un texto literal, así que imprime la palabra nombre. Para ver la caja, va sin comillas: print(nombre)."},
 {k:"build",anim:"terminal",text:"Con variables puedes hacer cuentas. Ya hay dos cajas: precio y cantidad. Crea una tercera caja llamada total con precio por cantidad, y muéstrala.",
  goal:"Calcula el total a pagar y muéstralo (debe salir 300).",starter:`precio = 100
cantidad = 3
# crea total = precio por cantidad

# muestra total
`,tests:[{out:"300"}],
  hints:["total = precio * cantidad","Luego: print(total)"],
  solution:`precio = 100
cantidad = 3
total = precio * cantidad
print(total)`},
 {k:"build",anim:"terminal",text:"Una caja puede cambiar de valor. puntos = puntos + 10 se lee así: «calcula lo que hay en puntos más 10, y guárdalo otra vez en puntos». Hay un atajo que hace lo mismo: puntos += 10.",
  goal:"Empieza con 0 puntos, súmale 10 dos veces e imprime puntos (debe salir 20).",starter:`puntos = 0
# súmale 10

# súmale 10 otra vez

print(puntos)
`,tests:[{out:"20"}],
  hints:["Escribe puntos = puntos + 10 en cada hueco.","O con el atajo: puntos += 10"],
  explain:[["puntos = puntos + 10","Lee el valor actual, le suma 10 y guarda el resultado en la misma caja."]],
  solution:`puntos = 0
puntos = puntos + 10
puntos += 10
print(puntos)`},
 {k:"build",anim:"terminal",text:"El + también pega textos. Si nombre guarda \"Ada\", entonces \"Hola, \" + nombre da \"Hola, Ada\". Fíjate en el espacio después de la coma: si no lo pones, sale pegado.",
  goal:"Imprime: Hola, Ada  usando la variable nombre.",starter:`nombre = "Ada"
print("Hola, " + ___)
`,tests:[{out:"Hola, Ada"}],
  hints:["Cambia ___ por el nombre de la caja (sin comillas): nombre"],
  solution:`nombre = "Ada"
print("Hola, " + nombre)`},
 {k:"talk",anim:"terminal",text:"¡Excelente! Las variables están en TODOS los programas. Siguiente clase: cómo hace la computadora para tomar decisiones."}
]},

{id:"b4",lv:[0,0],title:"Decisiones: if y else",recap:[
  "Python responde preguntas de sí o no con True (verdadero) o False (falso).",
  "Comparaciones: > mayor, < menor, >= mayor o igual, <= menor o igual, == igual, != distinto.",
  "= guarda un valor; == pregunta si dos cosas son iguales.",
  "if condición: ejecuta las líneas con sangría solo si la condición es True.",
  "else: ejecuta sus líneas cuando la condición es False."],steps:[
 {k:"talk",anim:"terminal",text:"Las computadoras toman decisiones haciendo preguntas de sí o no. Python contesta con True (sí, verdadero) o False (no, falso). Por ejemplo 5 > 3 pregunta «¿5 es mayor que 3?» y la respuesta es True."},
 {k:"build",anim:"terminal",text:"Para preguntar si dos cosas son IGUALES se usa == (dos signos). Uno solo (=) es para guardar en una caja. Imprime las respuestas a dos preguntas.",
  goal:"Imprime la respuesta a «¿5 es mayor que 3?» y luego a «¿2 es igual a 3?».",starter:`print(5 > 3)
print(2 ___ 3)
`,tests:[{out:"True\nFalse"}],
  hints:["Para preguntar «¿es igual?» se usan dos signos: =="],
  explain:[["5 > 3","¿5 es mayor que 3? → True"],["2 == 3","¿2 es igual a 3? → False"]],
  solution:`print(5 > 3)
print(2 == 3)`},
 {k:"check",anim:"terminal",q:"¿Cuál de estas pregunta si x es igual a 10?",opts:["x == 10","x = 10","x === 10","x es 10"],ok:0,why:"== compara. x = 10 no pregunta nada: guarda el 10 en la caja x."},
 {k:"talk",anim:"terminal",text:"Ahora la instrucción if («si»). if edad >= 18: significa «si la edad es mayor o igual a 18, haz lo siguiente». Lo que se hace va en las líneas de abajo, movidas 4 espacios a la derecha. A ese espacio se le llama SANGRÍA y le dice a Python qué líneas pertenecen al if."},
 {k:"build",anim:"terminal",text:"Completa la condición cambiando ___ por el signo «mayor o igual», que se escribe >=. Fíjate que el print tiene 4 espacios al inicio: está DENTRO del if.",
  goal:"Haz que se imprima: Puedes votar",starter:`edad = 20
if edad ___ 18:
    print("Puedes votar")
`,tests:[{out:"Puedes votar"}],
  hints:["«Mayor o igual» se escribe con dos símbolos juntos: >="],
  explain:[["if edad >= 18:","Pregunta. Si la respuesta es True, ejecuta las líneas con sangría. Los dos puntos : son obligatorios."],["    print(...)","Tiene 4 espacios: pertenece al if."]],
  solution:`edad = 20
if edad >= 18:
    print("Puedes votar")`},
 {k:"build",anim:"terminal",text:"else («si no») va al mismo nivel que el if y se ejecuta cuando la condición es False. Así eliges entre dos caminos. Escribe el else y su print. (Tip: después de escribir los : y presionar Enter, el editor pone la sangría solo.)",
  goal:"Con 35 grados imprime «Hace calor». Si fuera 30 o menos, imprimiría «Está fresco».",starter:`temperatura = 35
if temperatura > 30:
    print("Hace calor")
# escribe aquí el else y su print("Está fresco")
`,tests:[{out:"Hace calor"},{out:"Está fresco",rerun:{re:"temperatura\\s*=\\s*35",to:"temperatura = 20"},label:"y si la temperatura fuera 20…"}],
  hints:["Escribe else: pegado a la izquierda, igual que el if.","Debajo, con 4 espacios: print(\"Está fresco\")"],
  explain:[["else:","Si no se cumplió el if, se ejecuta este bloque."]],
  solution:`temperatura = 35
if temperatura > 30:
    print("Hace calor")
else:
    print("Está fresco")`},
 {k:"talk",anim:"terminal",text:"¡Ya sabes tomar decisiones con código! Siguiente clase: listas y cómo repetir cosas sin escribirlas mil veces."}
]},

{id:"b5",lv:[0,0],title:"Listas y ciclos",recap:[
  "Una lista guarda varios valores en orden: [\"manzana\", \"pera\"].",
  "Las posiciones (índices) empiezan en 0: lista[0] es el primero.",
  "len(lista) dice cuántos elementos tiene; lista.append(x) agrega al final.",
  "for x in lista: repite el bloque una vez por cada elemento.",
  "range(1, 4) genera 1, 2, 3 (el último número no se incluye)."],steps:[
 {k:"talk",anim:"scan",text:"Una LISTA guarda muchos valores en orden, como una fila de casilleros numerados. Se escribe con corchetes: frutas = [\"manzana\", \"pera\", \"uva\"]. Lo raro: los casilleros se numeran desde 0. El primero es el 0, el segundo el 1…"},
 {k:"build",anim:"scan",text:"Para sacar un elemento, escribe el nombre de la lista y la posición entre corchetes: frutas[0]. Imprime la primera fruta y luego la tercera.",
  goal:"Imprime manzana y luego uva.",starter:`frutas = ["manzana", "pera", "uva"]
print(frutas[0])
# imprime la tercera fruta (¿qué posición es?)
`,tests:[{out:"manzana\nuva"}],
  hints:["Las posiciones son 0, 1, 2. La tercera es la 2.","print(frutas[2])"],
  explain:[["frutas[0]","El casillero 0: la primera fruta."]],
  solution:`frutas = ["manzana", "pera", "uva"]
print(frutas[0])
print(frutas[2])`},
 {k:"check",anim:"scan",q:"Si frutas = [\"manzana\", \"pera\", \"uva\"], ¿qué da len(frutas)?",opts:["3","2","4","uva"],ok:0,why:"len cuenta cuántos elementos hay: 3. Ojo: la última posición es 2, porque se empieza a contar en 0."},
 {k:"build",anim:"scan",text:"lista.append(x) agrega x al final de la lista. Agrega \"kiwi\" y después imprime la lista completa y su tamaño.",
  goal:"Agrega kiwi y muestra la lista y su tamaño.",starter:`frutas = ["manzana", "pera", "uva"]
frutas.append(___)
print(frutas)
print(len(frutas))
`,tests:[{out:"['manzana', 'pera', 'uva', 'kiwi']\n4"}],
  hints:["Es texto, así que va con comillas: frutas.append(\"kiwi\")"],
  solution:`frutas = ["manzana", "pera", "uva"]
frutas.append("kiwi")
print(frutas)
print(len(frutas))`},
 {k:"talk",anim:"scan",text:"Ahora el superpoder: el ciclo for. for fruta in frutas: significa «para cada fruta de la lista, haz esto». Las líneas con sangría se repiten una vez por cada elemento, y en cada vuelta la variable fruta vale el siguiente elemento."},
 {k:"build",anim:"scan",text:"Completa el ciclo: dentro del print va la variable que cambia en cada vuelta.",
  goal:"Imprime cada fruta en su propia línea.",starter:`frutas = ["manzana", "pera", "uva"]
for fruta in frutas:
    print(___)
`,tests:[{out:"manzana\npera\nuva"}],
  hints:["La variable de cada vuelta se llama fruta: print(fruta)"],
  explain:[["for fruta in frutas:","Vuelta 1: fruta = \"manzana\". Vuelta 2: \"pera\". Vuelta 3: \"uva\"."]],
  solution:`frutas = ["manzana", "pera", "uva"]
for fruta in frutas:
    print(fruta)`},
 {k:"build",anim:"scan",text:"range(inicio, fin) genera números seguidos. range(1, 4) da 1, 2, 3: el número final NO se incluye (sí, es raro, te acostumbrarás). Escribe un for que imprima del 1 al 5.",
  goal:"Imprime los números del 1 al 5, uno por línea.",starter:`for i in range(1, ___):
    print(i)
`,tests:[{out:"1\n2\n3\n4\n5"}],
  hints:["Como el final no se incluye, para llegar al 5 necesitas range(1, 6)"],
  solution:`for i in range(1, 6):
    print(i)`},
 {k:"build",anim:"prefix",text:"Truco que usarás siempre: el ACUMULADOR. Empiezas una caja en 0 y en cada vuelta le sumas el número. Al final tienes la suma de todo.",
  goal:"Suma todos los números de la lista e imprime el total (debe salir 10).",starter:`nums = [3, 5, 2]
total = 0
for x in nums:
    # súmale x a total

print(total)
`,tests:[{out:"10"}],
  hints:["Dentro del for (con 4 espacios): total = total + x","O con el atajo: total += x"],
  explain:[["total = 0","La caja empieza vacía (en cero)."],["total += x","En cada vuelta le suma el número actual."],["print(total)","Sin sangría: se ejecuta una sola vez, al terminar el ciclo."]],
  solution:`nums = [3, 5, 2]
total = 0
for x in nums:
    total += x
print(total)`},
 {k:"talk",anim:"scan",text:"¡Increíble! Con listas y ciclos ya puedes procesar miles de datos. Última clase básica: funciones, que es como LeetCode te pide las respuestas."}
]},

{id:"b6",lv:[0,0],title:"Funciones: tu propia instrucción",recap:[
  "Una función es un bloque de código con nombre que puedes reutilizar.",
  "def nombre(parámetros): crea la función; sus líneas llevan sangría.",
  "Los parámetros son los datos que recibe la función.",
  "return entrega el resultado y termina la función.",
  "print solo muestra; return devuelve el valor para usarlo. En LeetCode siempre se usa return."],steps:[
 {k:"talk",anim:"terminal",text:"Una FUNCIÓN es como una máquina de café: le das algo (las monedas y el botón), hace su trabajo y te regresa algo (el café). En Python: le das datos llamados PARÁMETROS y te regresa un resultado con return."},
 {k:"talk",anim:"terminal",text:"Se crea con def. Por ejemplo:  def doble(x):  y en la línea de abajo, con sangría,  return x * 2. Después la usas así: doble(4) te regresa 8. print también es una función, ¡ya la has usado mil veces!"},
 {k:"build",anim:"terminal",text:"Completa la función saludar para que REGRESE el texto \"Hola, \" pegado con el nombre que recibe. Nota: aquí no hay print; las pruebas llaman tu función y revisan lo que regresa.",
  goal:"saludar(\"Ana\") debe regresar 'Hola, Ana'.",starter:`def saludar(nombre):
    return ___
`,tests:[{call:"saludar(\"Ana\")",expect:"\"Hola, Ana\""},{call:"saludar(\"Luis\")",expect:"\"Hola, Luis\""}],
  hints:["Pega dos textos con +: \"Hola, \" + nombre","Completo: return \"Hola, \" + nombre"],
  explain:[["def saludar(nombre):","Crea la función saludar. nombre es el parámetro: cambia en cada llamada."],["return ...","Entrega el resultado a quien llamó la función."]],
  solution:`def saludar(nombre):
    return "Hola, " + nombre`},
 {k:"check",anim:"terminal",q:"¿Cuál es la diferencia entre print y return?",opts:["print solo muestra en pantalla; return entrega el valor para que se pueda usar","Son lo mismo","return muestra en pantalla y print no","print es más rápido"],ok:0,why:"print muestra, pero el valor se pierde. return lo entrega a quien llamó la función. LeetCode revisa lo que regresas con return."},
 {k:"build",anim:"terminal",text:"Escribe es_par(n): debe regresar True si n es par y False si no. Pista de la clase de números: n % 2 == 0 ya es una pregunta que vale True o False.",
  goal:"es_par(4) → True y es_par(7) → False",starter:`def es_par(n):
    # regresa si n es par
    pass
`,tests:[{call:"es_par(4)",expect:"True"},{call:"es_par(7)",expect:"False"},{call:"es_par(0)",expect:"True"}],
  hints:["Cambia la línea pass por un return.","return n % 2 == 0"],
  explain:[["pass","Significa «no hagas nada». Se pone para que la función no esté vacía. Bórralo cuando escribas tu código."]],
  solution:`def es_par(n):
    return n % 2 == 0`},
 {k:"build",anim:"terminal",text:"Ahora juntemos todo: una función con if y else. mayor(a, b) debe regresar el más grande de los dos números.",
  goal:"mayor(3, 9) → 9 y mayor(10, 2) → 10",starter:`def mayor(a, b):
    if a > b:
        return ___
    else:
        return ___
`,tests:[{call:"mayor(3, 9)",expect:"9"},{call:"mayor(10, 2)",expect:"10"},{call:"mayor(5, 5)",expect:"5"}],
  hints:["Si a es mayor que b, el más grande es a.","En el else, el más grande es b."],
  solution:`def mayor(a, b):
    if a > b:
        return a
    else:
        return b`},
 {k:"talk",anim:"terminal",text:"¡Felicidades! Ya sabes lo esencial de Python: imprimir, variables, decisiones, listas, ciclos y funciones. Con eso se resuelven los problemas de entrevista. Siguiente clase: tu primer problema real, Fizz Buzz."}
]}
];
(function(){var L=LESSONS["w1:0"];
  L.forEach(function(l){if(l.id==="py0")l.lv=[1,1]});
  LESSONS["w1:0"]=BASIC_LESSONS.concat(L)})();
