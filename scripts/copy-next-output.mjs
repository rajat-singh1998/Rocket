import { cp, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "out");
const distDir = path.join(root, "dist");

if (!existsSync(outputDir)) {
  throw new Error("Next output folder was not found. Run next build first.");
}

await rm(distDir, { recursive: true, force: true });
await cp(outputDir, distDir, { recursive: true });
