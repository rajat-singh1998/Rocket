import path from "path";
import { fileURLToPath } from "url";

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectRoot = path.resolve(backendRoot, "..");

function resolveRuntimePath(value, fallbackPath) {
  const nextValue = String(value || "").trim();

  if (!nextValue) {
    return fallbackPath;
  }

  return path.isAbsolute(nextValue) ? nextValue : path.resolve(projectRoot, nextValue);
}

const runtimeStorageRoot = resolveRuntimePath(process.env.ROCKET_STORAGE_ROOT, backendRoot);
const dataDirectory = resolveRuntimePath(process.env.ROCKET_DATA_DIR, path.join(runtimeStorageRoot, "data"));
const uploadsDirectory = resolveRuntimePath(process.env.ROCKET_UPLOADS_DIR, path.join(runtimeStorageRoot, "uploads"));
const publicWriteDirectory = resolveRuntimePath(
  process.env.ROCKET_PUBLIC_WRITE_DIR,
  path.resolve(projectRoot, "public")
);

const adminFilePath = resolveRuntimePath(process.env.ROCKET_ADMIN_FILE, path.join(dataDirectory, "admin.json"));
const contentFilePath = resolveRuntimePath(process.env.ROCKET_CONTENT_FILE, path.join(dataDirectory, "siteContent.json"));
const sitemapFilePath = path.join(publicWriteDirectory, "sitemap.xml");
const robotsFilePath = path.join(publicWriteDirectory, "robots.txt");

export {
  adminFilePath,
  backendRoot,
  contentFilePath,
  dataDirectory,
  projectRoot,
  publicWriteDirectory,
  robotsFilePath,
  sitemapFilePath,
  uploadsDirectory
};
