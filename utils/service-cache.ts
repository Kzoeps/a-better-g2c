// utils/serviceCache.ts
import { openDB } from "idb";
import { CategoryWithServices, Service } from "./types";

const DB_NAME = "services-cache";
const STORE_NAME = "categories-services";

const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
        }
    },
});

export async function saveServicesToCache(
    serviceId: string,
    services: Service[]
) {
    const db = await dbPromise;
    await db.put(STORE_NAME, services, serviceId);
}

export async function getServiceFromCache(
    serviceId: string
): Promise<Service | null> {
    const db = await dbPromise;
    return await db.get(STORE_NAME, serviceId);
}
