export type Category = {
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
    category: string;
    image: string;
    file: string | null;
};

export type CategoryWithServices = Category & {
    services: Omit<Service, "serviceDocument">[];
};

export type SubCategory = {
    id: number;
    serviceName: string;
    serviceDescription: string;
    serviceLink: string;
    serviceDocument?: string; // HTML content as a string
    category: string; // ID as string, could also be number if needed
    image: string;
    file: string | null;
};
