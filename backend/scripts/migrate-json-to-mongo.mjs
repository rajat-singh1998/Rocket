import "dotenv/config";
import { readFile } from "fs/promises";
import { MongoClient } from "mongodb";
import { adminFilePath, contentFilePath } from "../src/runtimePaths.js";

const mongoUri = String(process.env.MONGODB_URI || "").trim();
const mongoDatabaseName = String(process.env.MONGODB_DB || process.env.MONGODB_DATABASE || "rocket_rubbish").trim();

if (!mongoUri) {
  console.error("MONGODB_URI is required before running this migration.");
  process.exit(1);
}

async function readJson(path) {
  const file = await readFile(path, "utf8");
  return JSON.parse(file);
}

const client = new MongoClient(mongoUri, {
  serverSelectionTimeoutMS: 10000
});

try {
  await client.connect();
  const db = client.db(mongoDatabaseName);

  const [siteContent, admin] = await Promise.all([
    readJson(contentFilePath),
    readJson(adminFilePath)
  ]);

  await Promise.all([
    db.collection("siteContent").replaceOne(
      { _id: "siteContent" },
      {
        _id: "siteContent",
        content: siteContent,
        migratedFromJson: true,
        updatedAt: new Date()
      },
      { upsert: true }
    ),
    db.collection("admin").replaceOne(
      { _id: "admin" },
      {
        _id: "admin",
        admin,
        migratedFromJson: true,
        updatedAt: new Date()
      },
      { upsert: true }
    )
  ]);

  console.log(`Migrated JSON data to MongoDB database "${mongoDatabaseName}".`);
} finally {
  await client.close();
}
