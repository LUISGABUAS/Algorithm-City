// Verifica que la solución de cada ejercicio pase sus pruebas y que el código inicial NO las pase.
import { readFileSync } from "node:fs";
const MiniPy = new Function(readFileSync("src/js/minipy.js", "utf8") + ";return MiniPy")();
const src = readFileSync("src/js/lessons_data.js", "utf8") + readFileSync("src/js/lessons_basic.js", "utf8");
const LESSONS = new Function(src + ";return LESSONS")();

let n = 0, bad = 0;
for (const k in LESSONS) for (const les of LESSONS[k]) {
  let prev = null;
  les.steps.forEach((s, i) => {
    if (s.k !== "build") return;
    n++;
    const r = MiniPy.runTests(s.solution, s.tests);
    if (!r.ok) { bad++; console.log("✗ la solución falla:", les.id, "paso", i, r.error?.text || JSON.stringify(r.tests.filter(t => !t.ok))); }
    const st = s.carry ? prev : s.starter;
    if (st && MiniPy.runTests(st, s.tests).ok) console.log("⚠ el código inicial ya pasa:", les.id, "paso", i);
    prev = s.solution;
  });
}
// --- conceptos y repaso de prerrequisitos ---
const { CONCEPTS, PATTERN2CONCEPT, LESSON_CONCEPTS } =
  new Function(readFileSync("src/js/concepts.js", "utf8") + ";return {CONCEPTS,PATTERN2CONCEPT,LESSON_CONCEPTS}")();
const lessonIds = new Set();
for (const k in LESSONS) for (const les of LESSONS[k]) lessonIds.add(les.id);
let cbad = 0;
for (const id in CONCEPTS) {
  const C = CONCEPTS[id];
  if (!C.nm || !C.blurb || !C.ex || typeof C.ex.code !== "string") { cbad++; console.log("✗ concepto incompleto:", id); }
  if (C.ref && !lessonIds.has(C.ref)) { cbad++; console.log("✗ ref de concepto inexistente:", id, "->", C.ref); }
}
for (const p in PATTERN2CONCEPT) for (const c of PATTERN2CONCEPT[p])
  if (!CONCEPTS[c]) { cbad++; console.log("✗ PATTERN2CONCEPT usa concepto inexistente:", p, "->", c); }
for (const lid in LESSON_CONCEPTS) {
  if (!lessonIds.has(lid)) { cbad++; console.log("✗ LESSON_CONCEPTS: clase inexistente:", lid); }
  for (const c of LESSON_CONCEPTS[lid]) if (!CONCEPTS[c]) { cbad++; console.log("✗ LESSON_CONCEPTS usa concepto inexistente:", lid, "->", c); }
}
console.log(`${Object.keys(CONCEPTS).length} conceptos revisados · ${cbad} con problemas`);

console.log(`${n} ejercicios revisados · ${bad} con problemas`);
process.exit(bad + cbad ? 1 : 0);
