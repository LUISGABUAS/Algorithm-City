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
console.log(`${n} ejercicios revisados · ${bad} con problemas`);
process.exit(bad ? 1 : 0);
