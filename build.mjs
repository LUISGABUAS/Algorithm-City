// Junta los archivos de src/ en un solo dist/index.html (el juego no necesita servidor).
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const js = (f) => readFileSync(`src/js/${f}.js`, "utf8");

// El orden importa: los módulos de abajo reemplazan funciones de los de arriba.
const MAP = ["map", "city", "srs"];                 // mapa, ciudad, repaso espaciado
const LESSONS = [
  "lessons_data",   // contenido de las clases (Mundo 1)
  "lessons_basic",  // clases desde cero para principiantes
  "lessons_core",   // resaltado de código y pizarrón animado
  "lessons_ui",     // editor, pruebas y pantallas de clase
  "concepts",       // conceptos y repaso just-in-time de prerrequisitos
  "challenge",      // motor de retos por producción (predecir, parsons, escribir…)
  "challenges_w1",  // contenido de retos del Mundo 1 (reemplaza sus MCQ)
  "adaptive",       // dificultad adaptativa (regla del 85%)
  "adapt",          // niveles de experiencia, glosario, reto directo
  "avatar",         // Vestidores y Camino de niveles
  "chibi",          // dibujo de personajes 32x48 y animaciones
  "title",          // pantalla de inicio
  "settings",       // configuración, música, efectos y voz
  "cloud",          // cuenta y guardado en la nube (Supabase)
  "proto",          // PROTOTIPO: sala de muestra jugable (#proto)
];

const template = readFileSync("src/index.html", "utf8");
const minipy = js("minipy").replace('if(typeof module!=="undefined")module.exports=MiniPy;', "");

const out = template
  .replace("/*__MAP__*/", MAP.map(js).join("\n"))
  .replace("/*__MINIPY__*/", minipy)
  .replace("/*__LESSONS__*/", LESSONS.map(js).join("\n"))
  .replace("/*__CASES__*/", js("cases"));

mkdirSync("dist", { recursive: true });
writeFileSync("dist/index.html", out);
console.log(`dist/index.html listo (${(out.length / 1024).toFixed(0)} KB)`);
