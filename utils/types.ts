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

export type ServiceWithoutDocument = Omit<Service, "serviceDocument"> & {
    serviceDocument?: string; // Optional, since it may not be needed in some contexts
};

export type CategoryWithServices = Category & {
    services: ServiceWithoutDocument[];
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
