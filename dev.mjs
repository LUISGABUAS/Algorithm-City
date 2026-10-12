// Servidor local: reconstruye al guardar cualquier archivo de src/ y sirve dist/ en http://localhost:5173
import { createServer } from "node:http";
import { readFileSync, watch } from "node:fs";
import { execSync } from "node:child_process";

const build = () => { try { execSync("node build.mjs", { stdio: "inherit" }); } catch {} };
build();
let t; watch("src", { recursive: true }, () => { clearTimeout(t); t = setTimeout(build, 150); });

createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" });
  res.end(readFileSync("dist/index.html"));
}).listen(5173, () => console.log("Algorithm Villa en http://localhost:5173 (recarga la página tras guardar)"));
