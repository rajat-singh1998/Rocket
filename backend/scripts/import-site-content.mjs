import "dotenv/config";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { writeSiteContent } from "../src/contentStore.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const contentPath = path.resolve(scriptDirectory, "../data/siteContent.json");

const rawContent = await fs.readFile(contentPath, "utf8");
const siteContent = JSON.parse(rawContent);
const savedContent = await writeSiteContent(siteContent);

console.log(`Imported site content with ${savedContent.cityPages?.length || 0} city pages.`);
