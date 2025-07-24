// context/CategoryContext.tsx
"use client";

import React, { createContext, useContext, ReactNode } from "react";

// === Types ===

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
    services: Service[];
};

// === Context ===

type CategoryMap = Record<number, CategoryWithServices>;

const CategoryContext = createContext<CategoryMap | undefined>(undefined);

type ProviderProps = {
    value: CategoryMap;
    children: ReactNode;
};

export function CategoryProvider({ value, children }: ProviderProps) {
    return (
        <CategoryContext.Provider value={value}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategoryContext(): CategoryMap {
    const context = useContext(CategoryContext);
    if (!context) {
        throw new Error(
            "useCategoryMap must be used within a CategoryProvider"
        );
    }
    return context;
}
