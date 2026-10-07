#!/usr/bin/env node
/**
 * Serves `out/` so URLs match GitHub project Pages (/talking-portfolio/*).
 */
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import handler from "serve-handler";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..", "out");
const base = "/talking-portfolio";

const server = http.createServer((req, res) => {
  const url = req.url ?? "/";
  if (url === base) {
    req.url = "/";
  } else if (url.startsWith(`${base}/`)) {
    req.url = url.slice(base.length) || "/";
  }
  return handler(req, res, { public: root });
});

const port = Number(process.env.PORT ?? 4173);
server.listen(port, () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}${base}/`);
});
