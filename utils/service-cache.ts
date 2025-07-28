// utils/serviceCache.ts
import { openDB } from "idb";
import { CategoryWithServices } from "./types";

const DB_NAME = "services-cache";
const STORE_NAME = "categories-services";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME);
    }
  },
});

export async function saveDocumentToCache(serviceId: string, categoryWithService: CategoryWithServices) {
  const db = await dbPromise;
  await db.put(STORE_NAME, categoryWithService, serviceId);
}

export async function getDocumentFromCache(serviceId: string): Promise<string | null> {
  const db = await dbPromise;
  return await db.get(STORE_NAME, serviceId);
}
