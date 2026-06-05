import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { primitiveColor, primitiveSpacing, primitiveTypography, primitiveRadius, primitiveShadow, primitiveTransition } from "../src/primitive";
import { tulparLight, tulparDark } from "../src/brand/tulpar";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist/css");

export function flattenTokens(
  obj: Record<string, unknown>,
  prefix: string,
  path: string[] = [],
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newPath = [...path, key];
    if (value !== null && typeof value === "object") {
      Object.assign(result, flattenTokens(value as Record<string, unknown>, prefix, newPath));
    } else {
      const cssVar = `--${prefix}-${newPath.join("-")}`;
      result[cssVar] = String(value);
    }
  }
  return result;
}

export function generateCSS(
  tokens: Record<string, unknown>,
  selector: string,
  prefix: string,
): string {
  const flat = flattenTokens(tokens, prefix);
  const declarations = Object.entries(flat)
    .map(([prop, value]) => `  ${prop}: ${value};`)
    .join("\n");
  return `${selector} {\n${declarations}\n}\n`;
}

async function main() {
  await mkdir(distDir, { recursive: true });

  const primitives = {
    primitive: {
      color: primitiveColor,
      spacing: primitiveSpacing,
      typography: primitiveTypography,
      radius: primitiveRadius,
      shadow: primitiveShadow,
      transition: primitiveTransition,
    },
  };
  const primitivesCSS = generateCSS(primitives.primitive, ":root", "tulpar-primitive");

  const lightCSS =
    generateCSS(tulparLight, ":root", "tulpar") +
    "\n" +
    generateCSS(tulparLight, '[data-brand="tulpar"]', "tulpar");

  const darkCSS =
    generateCSS(tulparDark, ".dark", "tulpar") +
    "\n" +
    generateCSS(tulparDark, '[data-brand="tulpar"].dark', "tulpar") +
    "\n" +
    generateCSS(tulparDark, '.dark [data-brand="tulpar"]', "tulpar");

  await writeFile(
    resolve(distDir, "tulpar-light.css"),
    `/* Tulpar UI — Tulpar brand, light mode */\n${primitivesCSS}\n${lightCSS}`,
  );
  await writeFile(
    resolve(distDir, "tulpar-dark.css"),
    `/* Tulpar UI — Tulpar brand, dark mode */\n${primitivesCSS}\n${darkCSS}`,
  );
  await writeFile(
    resolve(distDir, "tulpar.css"),
    `/* Tulpar UI — Tulpar brand, light + dark */\n${primitivesCSS}\n${lightCSS}\n${darkCSS}`,
  );

  console.log("✅ Generated CSS:");
  console.log(`  ${resolve(distDir, "tulpar-light.css")}`);
  console.log(`  ${resolve(distDir, "tulpar-dark.css")}`);
  console.log(`  ${resolve(distDir, "tulpar.css")}`);
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("generate-css.ts")) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
