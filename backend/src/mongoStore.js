import { MongoClient } from "mongodb";

const mongoUri = String(process.env.MONGODB_URI || "").trim();
const mongoDatabaseName = String(process.env.MONGODB_DB || process.env.MONGODB_DATABASE || "rocket_rubbish").trim();

let clientPromise = null;

async function getMongoClient() {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is required.");
  }

  if (!clientPromise) {
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000
    });

    clientPromise = client.connect();
  }

  return clientPromise;
}

async function getMongoCollection(collectionName) {
  const client = await getMongoClient();

  return client.db(mongoDatabaseName).collection(collectionName);
}

export { getMongoCollection };
