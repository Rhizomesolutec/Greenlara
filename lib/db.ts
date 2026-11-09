import mongoose from "mongoose";

const cache = globalThis as unknown as {
  mongooseConn?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

export function mongoUri() {
  return process.env.CONNECTION_STRING || process.env.MONGODB_URI || "";
}

export function mongoConfigured() {
  return Boolean(mongoUri());
}

export async function connectDB() {
  const uri = mongoUri();
  if (!uri) throw new Error("CONNECTION_STRING is not set");
  if (!cache.mongooseConn) cache.mongooseConn = { conn: null, promise: null };
  if (cache.mongooseConn.conn) return cache.mongooseConn.conn;
  if (!cache.mongooseConn.promise) {
    cache.mongooseConn.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 12000,
    });
  }
  try {
    cache.mongooseConn.conn = await cache.mongooseConn.promise;
  } catch (error) {
    cache.mongooseConn.promise = null;
    throw error;
  }
  return cache.mongooseConn.conn;
}

const StoreSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    version: { type: Number, default: 1 },
    categories: { type: [mongoose.Schema.Types.Mixed], default: [] },
    products: { type: [mongoose.Schema.Types.Mixed], default: [] },
    orders: { type: [mongoose.Schema.Types.Mixed], default: [] },
    enquiries: { type: [mongoose.Schema.Types.Mixed], default: [] },
    subscribers: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { collection: "store", minimize: false },
);

export const StoreModel = mongoose.models.Store || mongoose.model("Store", StoreSchema);
