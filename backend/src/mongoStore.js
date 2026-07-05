import { MongoClient } from "mongodb";

const mongoUri = String(process.env.MONGODB_URI || "").trim();
const mongoDatabaseName = String(process.env.MONGODB_DB || process.env.MONGODB_DATABASE || "rocket_rubbish").trim();

let clientPromise = null;

function isMongoEnabled() {
  return Boolean(mongoUri);
}

async function getMongoClient() {
  if (!isMongoEnabled()) {
    return null;
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

  if (!client) {
    return null;
  }

  return client.db(mongoDatabaseName).collection(collectionName);
}

export { getMongoCollection, isMongoEnabled };
