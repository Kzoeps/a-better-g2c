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
    services: Omit<Service, "serviceDocument">[];
};

export function mapCategoriesWithServices(
    categories: Category[],
    services: (Omit<Service, "serviceDocument"> & {
        serviceDocument?: string;
    })[]
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
        delete filteredService["serviceDocument"];
        if (categoryMap[categoryId]) {
            categoryMap[categoryId].services.push(filteredService);
        }
    }

    return categoryMap;
}
