import fs from "fs";
import path from "path";
import { io } from "next/cache";
import { CATALOGUE_VERSION, createSeedStore } from "./catalogue";
import { connectDB, mongoConfigured, StoreModel } from "./db";
import type { StoreData } from "./types";

const filePath = path.join(process.cwd(), "data", "store.json");
const publicDir = path.join(process.cwd(), "public");

function localImageMissing(imageUrl: string | undefined): boolean {
  if (!imageUrl || !imageUrl.startsWith("/images/")) return false;
  const relative = imageUrl.replace(/^\/+/, "");
  return !fs.existsSync(path.join(publicDir, relative));
}

function hasBrokenLocalImages(store: StoreData): boolean {
  for (const category of store.categories) {
    if (localImageMissing(category.image)) return true;
  }
  for (const product of store.products) {
    if (!product.images?.length) return true;
    if (product.images.some((img) => localImageMissing(img))) return true;
  }
  return false;
}

function migrateIfNeeded(store: StoreData): { store: StoreData; migrated: boolean } {
  if ((store.version ?? 1) >= CATALOGUE_VERSION && !hasBrokenLocalImages(store)) {
    return { store, migrated: false };
  }
  const seed = createSeedStore();
  return {
    migrated: true,
    store: {
      version: CATALOGUE_VERSION,
      categories: seed.categories,
      products: seed.products,
      orders: store.orders ?? [],
      enquiries: store.enquiries ?? [],
      subscribers: store.subscribers ?? [],
    },
  };
}

function normalize(parsed: Partial<StoreData>): StoreData {
  if (!Array.isArray(parsed.products) || !Array.isArray(parsed.categories)) {
    return createSeedStore();
  }
  return {
    version: parsed.version ?? 1,
    categories: parsed.categories,
    products: parsed.products,
    orders: parsed.orders ?? [],
    enquiries: parsed.enquiries ?? [],
    subscribers: parsed.subscribers ?? [],
  };
}

function readFileStore(): StoreData {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
  if (!fs.existsSync(filePath)) {
    const seed = createSeedStore();
    fs.writeFileSync(filePath, JSON.stringify(seed, null, 2));
    return seed;
  }
  try {
    const parsed = normalize(JSON.parse(fs.readFileSync(filePath, "utf8")) as StoreData);
    const { store, migrated } = migrateIfNeeded(parsed);
    if (migrated) writeFileStore(store);
    return store;
  } catch {
    return createSeedStore();
  }
}

function writeFileStore(store: StoreData) {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(store, null, 2));
}

function fromDocument(doc: {
  version?: number;
  categories?: StoreData["categories"];
  products?: StoreData["products"];
  orders?: StoreData["orders"];
  enquiries?: StoreData["enquiries"];
  subscribers?: StoreData["subscribers"];
}): StoreData {
  return normalize(doc);
}

async function readMongoStore(): Promise<StoreData> {
  await connectDB();
  const existing = await StoreModel.findOne({ key: "main" }).lean();
  if (existing) {
    const parsed = fromDocument(existing);
    const { store, migrated } = migrateIfNeeded(parsed);
    if (migrated) {
      await writeMongoStore(store);
    }
    return store;
  }
  const seed = fs.existsSync(filePath) ? readFileStore() : createSeedStore();
  await StoreModel.create({ key: "main", ...seed });
  return seed;
}

async function writeMongoStore(store: StoreData) {
  await connectDB();
  await StoreModel.updateOne({ key: "main" }, { $set: { key: "main", ...store } }, { upsert: true });
}

let lastMongoLog = 0;

function logMongoFailure(error: unknown) {
  if (Date.now() - lastMongoLog < 15000) return;
  lastMongoLog = Date.now();
  const message = error instanceof Error ? error.message : "connection failed";
  console.error(
    `MongoDB unavailable (${message.replace(/\/\/[^@\s]+@/, "//***@")}). Using data/store.json until the connection succeeds.`,
  );
}

export async function readStore(): Promise<StoreData> {
  if (!mongoConfigured()) return readFileStore();
  try {
    return await readMongoStore();
  } catch (error) {
    logMongoFailure(error);
    return readFileStore();
  }
}

export async function getStore() {
  await io();
  return readStore();
}

let queue: Promise<unknown> = Promise.resolve();

export function updateStore<T>(mutator: (store: StoreData) => T): Promise<T> {
  const run = queue.then(async () => {
    const store = await readStore();
    const result = mutator(store);
    if (mongoConfigured()) {
      try {
        await writeMongoStore(store);
        return result;
      } catch (error) {
        logMongoFailure(error);
      }
    }
    writeFileStore(store);
    return result;
  });
  queue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
