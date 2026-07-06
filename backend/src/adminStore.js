import crypto from "crypto";
import { getMongoCollection } from "./mongoStore.js";
const allAdminPermissions = ["dashboard", "seo", "city-pages", "blogs", "contacts", "profile", "users"];

function isAllowedPermission(permission) {
  return allAdminPermissions.includes(permission) || String(permission || "").startsWith("city:");
}

function getDefaultAdmin() {
  return {
    name: "Admin User",
    email: "admin@rocket.com",
    phone: "+44 800 123 4567",
    avatar: "/images/rocket/form2.png",
    password: process.env.ADMIN_DEFAULT_PASSWORD || "admin"
  };
}

async function ensureMongoAdmin() {
  const collection = await getMongoCollection("admin");
  const existing = await collection.findOne({ _id: "admin" });

  if (existing?.admin) {
    const admin = normalizeAdmin(existing.admin);

    if (JSON.stringify(existing.admin) !== JSON.stringify(admin)) {
      await collection.replaceOne(
        { _id: "admin" },
        {
          _id: "admin",
          admin,
          updatedAt: new Date()
        },
        { upsert: true }
      );
    }

    return admin;
  }

  const admin = normalizeAdmin(getDefaultAdmin());

  await collection.replaceOne(
    { _id: "admin" },
    {
      _id: "admin",
      admin,
      updatedAt: new Date()
    },
    { upsert: true }
  );

  return admin;
}

function normalizeAdmin(admin = {}) {
  const ownerUser = {
    id: "owner",
    name: admin.name || "Admin User",
    email: admin.email || "admin@rocket.com",
    phone: admin.phone || "+44 800 123 4567",
    avatar: admin.avatar || "/images/rocket/form2.png",
    passwordHash: admin.passwordHash || "",
    password: admin.passwordHash ? "" : (admin.password || process.env.ADMIN_DEFAULT_PASSWORD || "admin"),
    role: "owner",
    status: "Active",
    permissions: allAdminPermissions,
    createdAt: admin.createdAt || new Date().toISOString(),
    updatedAt: admin.updatedAt || new Date().toISOString()
  };

  const users = Array.isArray(admin.users)
    ? admin.users.map((user) => ({
        id: user.id || crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        name: String(user.name || "").trim() || "Admin User",
        email: String(user.email || "").trim(),
        phone: String(user.phone || "").trim(),
        avatar: user.avatar || "/images/rocket/form2.png",
        passwordHash: String(user.passwordHash || "").trim(),
        password: user.passwordHash ? "" : String(user.password || "").trim(),
        role: user.role === "owner" ? "owner" : "editor",
        status: user.status === "Inactive" ? "Inactive" : "Active",
        permissions: Array.isArray(user.permissions)
          ? user.permissions.filter(isAllowedPermission)
          : [],
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt || new Date().toISOString()
      })).filter((user) => user.email && (user.passwordHash || user.password))
    : [];

  const hasOwner = users.some((user) => user.role === "owner");
  const nextUsers = hasOwner
    ? users.map((user) => (user.role === "owner" ? { ...ownerUser, ...user, permissions: allAdminPermissions } : user))
    : [ownerUser, ...users];
  const currentOwner = nextUsers.find((user) => user.role === "owner") || ownerUser;

  return {
    ...admin,
    name: currentOwner.name,
    email: currentOwner.email,
    phone: currentOwner.phone,
    avatar: currentOwner.avatar,
    passwordHash: currentOwner.passwordHash,
    password: currentOwner.password,
    users: nextUsers
  };
}

export async function readAdmin() {
  return ensureMongoAdmin();
}

export async function writeAdmin(admin) {
  const normalised = normalizeAdmin(admin);
  const collection = await getMongoCollection("admin");
  await collection.replaceOne(
    { _id: "admin" },
    {
      _id: "admin",
      admin: normalised,
      updatedAt: new Date()
    },
    { upsert: true }
  );
}

export { allAdminPermissions };
