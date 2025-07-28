import { Category, CategoryWithServices, Service } from "./types";

export const fetcher = (...args: [input: RequestInfo, init?: RequestInit]) =>
    fetch(...args).then((res) => res.json());

export async function getCategoriesWithServices(removeDocument: boolean= true) {
    const categoriesRequest = fetch(
        "https://www.citizenservices.gov.bt/g2cPortalApi/getCategory",
        {
            cache: "force-cache",
            next: {
                revalidate: 86400,
                tags: ["categories"],
            },
        }
    );
    const servicesRequest = fetch(
        "https://www.citizenservices.gov.bt/g2cPortalApi/getService"
    );

    const allPromises = await Promise.all([categoriesRequest, servicesRequest]);
    const categoriesResponse = await allPromises[0].json();
    const servicesResponse = await allPromises[1].json();
    const mappedData = mapCategoriesWithServices(
        categoriesResponse,
        servicesResponse,
        removeDocument
    );
    return mappedData;
}

// removeDocument param: used when fetching for the listing page itself. since this doesnt need to be passed to client
// however shouldnt be removed when saving to indexedDB since we use this service document to display the page.
export function mapCategoriesWithServices(
    categories: Category[],
    services: (Omit<Service, "serviceDocument"> & {
        serviceDocument?: string;
    })[],
    removeDocument: boolean = true
): Record<number, CategoryWithServices> {
    const categoryMap: Record<number, CategoryWithServices> = {};

    for (const category of categories) {
        categoryMap[category.id] = {
            ...category,
            services: [],
        };
    }

    for (const service of services) {
        const categoryId = parseInt(service.category);
        const filteredService = { ...service };
        if (removeDocument) {
            delete filteredService["serviceDocument"];
        }
        if (categoryMap[categoryId]) {
            categoryMap[categoryId].services.push(filteredService);
        }
    }

    return categoryMap;
}
