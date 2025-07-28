// context/CategoryContext.tsx
"use client";

import { CategoryWithServices } from "@/utils/types";
import React, { createContext, useContext, ReactNode } from "react";

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
