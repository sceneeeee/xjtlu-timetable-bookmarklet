import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const bundlePath = resolve(process.cwd(), "dist/bookmarklet.min.js");

let code;
try {
  code = readFileSync(bundlePath, "utf8").trim();
} catch {
  console.error("Missing dist/bookmarklet.min.js. Run `npm run build` first.");
  process.exit(1);
}

console.log(`javascript:(()=>{${encodeURIComponent(code)}})()`);
