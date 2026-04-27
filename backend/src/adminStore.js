import { promises as fs } from "fs";
import path from "path";

const adminFilePath = path.resolve(process.cwd(), "data", "admin.json");

async function ensureAdminFile() {
  try {
    await fs.access(adminFilePath);
  } catch {
    const defaultAdmin = {
      name: "Admin User",
      email: "admin@rocket.com",
      phone: "+44 800 123 4567",
      password: process.env.ADMIN_DEFAULT_PASSWORD || "admin"
    };

    await fs.writeFile(adminFilePath, JSON.stringify(defaultAdmin, null, 2));
  }
}

export async function readAdmin() {
  await ensureAdminFile();
  const file = await fs.readFile(adminFilePath, "utf8");
  return JSON.parse(file);
}

export async function writeAdmin(admin) {
  await fs.writeFile(adminFilePath, JSON.stringify(admin, null, 2));
}
