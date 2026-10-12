# Algorithm City

RPG en pixel art para aprender Python, algoritmos y LeetCode escribiendo código de verdad, desde cero hasta entrevistas de Big Tech.

Todo está hecho con **HTML, CSS y JavaScript puro**, sin frameworks ni dependencias. El resultado es un solo archivo `dist/index.html` que se puede abrir directo en el navegador o publicar en cualquier hosting estático.

## Requisitos

- [Node.js](https://nodejs.org) 18 o más reciente. No hace falta `npm install`.

## Comandos

```bash
npm run dev     # servidor local en http://localhost:5173; reconstruye al guardar
npm run build   # genera dist/index.html
npm run check   # revisa que todas las soluciones de las clases pasen sus pruebas
```

## Estructura

```
src/
  index.html          Plantilla: estilos (CSS), HUD, lógica base del juego, salas y exámenes
  js/
    map.js            Motor del mapa: cámara, movimiento, caminos, gente que camina
    city.js           La ciudad: calles, carros, oficinas por distrito, rejas
    srs.js            Repaso espaciado (1, 3, 7, 14, 30 y 60 días)
    minipy.js         Intérprete de Python escrito en JavaScript (corre el código del jugador)
    cases.js          Banco de preguntas de las salas (227 casos, 8 mundos)
    lessons_data.js   Clases del Mundo 1 (Fizz Buzz, Two Sum, etc.)
    lessons_basic.js  Clases desde cero para quien nunca ha programado
    lessons_core.js   Resaltado de código y animaciones del pizarrón
    lessons_ui.js     Editor de código, pruebas, pistas y pantallas de clase
    adapt.js          Niveles de experiencia, glosario, reto directo
    avatar.js         Vestidores, catálogo de ropa y Camino de niveles
    chibi.js          Dibujo de los personajes (32×48) y sus animaciones
    title.js          Pantalla de inicio
    settings.js       Configuración, música, efectos de sonido y lectura en voz alta
build.mjs             Junta todo en dist/index.html
dev.mjs               Servidor local con recarga
scripts/check-lessons.mjs
```

El orden de los archivos importa: los de abajo reemplazan funciones de los de arriba (por ejemplo, `chibi.js` cambia cómo se dibujan los personajes). Ese orden está en `build.mjs`.

## Agregar una clase

Las clases son objetos en `src/js/lessons_data.js` dentro de `LESSONS["w1:0"]` (mundo 1, planta baja). Cada clase tiene pasos:

- `talk`: la Profe Ada explica.
- `check`: pregunta de opción múltiple.
- `build`: el jugador escribe código. Lleva `goal`, `starter`, `tests`, `hints` y `solution`.
- `perf`: prueba de velocidad para que el jugador descubra que su solución es lenta.

Después de editar, corre `npm run check` para confirmar que las soluciones pasan.

## Publicar

Cualquier hosting estático gratis sirve. Sube el proyecto a GitHub y conéctalo:

| Hosting | Comando de build | Carpeta de salida |
|---|---|---|
| Cloudflare Pages | `npm run build` | `dist` |
| Vercel | `npm run build` | `dist` |
| Netlify | `npm run build` | `dist` |

Cada `git push` publica la nueva versión.

## Guardado

Hoy el progreso se guarda en el navegador (`localStorage`, clave `algorithm-city-v2`; las partidas guardadas con el nombre anterior `algorithm-villa-v2` se migran solas). En Configuración → Partida hay un código de respaldo para pasarlo a otro dispositivo.

Siguiente paso: inicio de sesión y guardado en la nube con Supabase (Auth + tabla `saves` con el progreso en JSON).
