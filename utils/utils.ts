/**
 * A generic fetcher function that wraps the Fetch API
 * @param args Arguments to be passed to fetch
 * @returns Promise resolving to the response body as JSON
 */
export const fetcher = async (
    ...args: Parameters<typeof fetch>
): Promise<any> => {
    const response = await fetch(...args);
    return response.json();
};

type Category = {
    id: number;
    categoryName: string;
    categoryDescription: string;
    image: string;
    file: string | null;
};

export type Service = {
    id: number;
    serviceName: string;
    serviceDescription: string;
    serviceLink: string;
    serviceDocument: string;
    category: string; // assuming this is a string like "479"
    image: string;
    file: string | null;
};

type CategoryWithServices = Category & {
    services: Service[];
};

export function mapCategoriesWithServices(
    categories: Category[],
    services: Service[]
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
        if (categoryMap[categoryId]) {
            categoryMap[categoryId].services.push(service);
        }
    }

    return categoryMap;
}
