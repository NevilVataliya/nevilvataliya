// MongoDB connection configuration
import { MongoClient } from "mongodb";

declare global {
  var mongoClient: MongoClient | undefined;
}

let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    cachedClient = client;
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

export async function getDatabase() {
  const client = await connectToDatabase();
  return client.db("portfolio");
}
