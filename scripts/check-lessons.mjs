// Verifica que la solución de cada ejercicio pase sus pruebas y que el código inicial NO las pase.
import { readFileSync } from "node:fs";
const MiniPy = new Function(readFileSync("src/js/minipy.js", "utf8") + ";return MiniPy")();
const src = readFileSync("src/js/lessons_data.js", "utf8") + readFileSync("src/js/lessons_basic.js", "utf8") + readFileSync("src/js/lessons_w2.js", "utf8");
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

// --- retos de producción (Mundos 1 y 2) ---
const chSrc = readFileSync("src/js/challenges_w1.js", "utf8") + readFileSync("src/js/challenges_w2.js", "utf8");
const { CHALLENGES_W1, CHALLENGES_W2 } = new Function(chSrc + ";return {CHALLENGES_W1, CHALLENGES_W2}")();
const ALLCH = { ...CHALLENGES_W1, ...CHALLENGES_W2 };
let wn = 0, wbad = 0;
const out1 = (code) => { const r = MiniPy.runTests(code, []); return { out: r.out || "", err: !!r.error }; };
const broken = (flawed, ref, cand) => {
  const a = out1(flawed + "\nprint(" + cand + ")"), b = out1(ref + "\nprint(" + cand + ")");
  return a.err || a.out !== b.out;
};
for (const wk in ALLCH) for (const c of ALLCH[wk]) {
  wn++;
  const fail = (m) => { wbad++; console.log("✗", wk, c.t, (c.nm||""), "·", m); };
  if (c.t === "predict" || c.t === "trace") { if (MiniPy.runTests(c.code, []).error) fail("el código no corre"); }
  else if (c.t === "parsons") { const r = MiniPy.runTests(c.lines.join("\n"), c.tests); if (!r.ok) fail("el orden correcto no pasa"); }
  else if (c.t === "write" || c.t === "blanks") { if (!MiniPy.runTests(c.solution, c.tests).ok) fail("la solución falla"); if (c.starter && MiniPy.runTests(c.starter, c.tests).ok) fail("el starter ya pasa"); }
  else if (c.t === "debug") { if (MiniPy.runTests(c.buggy, c.tests).ok) fail("el buggy NO falla"); if (!MiniPy.runTests(c.solution, c.tests).ok) fail("la solución falla"); }
  else if (c.t === "edge") { const nb = c.candidates.filter((q) => broken(c.flawed, c.ref, q)).length; if (nb !== 1) fail(`debe romperse exactamente 1 candidato, se rompen ${nb}`); }
  else if (c.t === "pat" || c.t === "cx") { if (!c.opts || c.ok == null || c.ok < 0 || c.ok >= c.opts.length || !c.why) fail("opción múltiple mal formada"); }
}
console.log(`${wn} retos de producción revisados · ${wbad} con problemas`);

console.log(`${n} ejercicios revisados · ${bad} con problemas`);
process.exit(bad + cbad + wbad ? 1 : 0);
