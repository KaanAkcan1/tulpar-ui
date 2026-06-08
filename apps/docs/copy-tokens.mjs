import { mkdir, copyFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, "../../packages/tokens/dist/css/tulpar.css");
const dest = resolve(__dirname, "public/tokens/tulpar.css");

await mkdir(dirname(dest), { recursive: true });
await copyFile(src, dest);
console.log(`Copied tokens: ${src} → ${dest}`);
