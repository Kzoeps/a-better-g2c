"use client";
import { useCategoryContext } from "@/providers/CategoryContext";
import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";
import { CategoryCard } from "./category-card";
import { ListingServiceCard } from "./listing-service-card";

const AccordionNavigation = () => {
    const categoryMap = useCategoryContext();
    const [expandedCategory, setExpandedCategory] = useState<number | null>(
        null
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const categories = Object.values(categoryMap);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 250); 

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filteredServices = React.useMemo(() => {
        const query = debouncedSearchQuery.toLowerCase().trim();
        if (!query) return [];

        return categories.flatMap((category) =>
            category.services.filter((service) =>
                service.serviceName.toLowerCase().includes(query)
            )
        );
    }, [categories, debouncedSearchQuery]);

    const toggleCategory = (categoryId: number) => {
        setExpandedCategory(
            expandedCategory === categoryId ? null : categoryId
        );
    };

    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="p-4">
                    <h1 className="text-xl font-bold text-gray-900 mb-4">
                        Government Services
                    </h1>
                    {/* Search Bar */}
                    <div className="relative">
                        <Search
                            size={20}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="divide-y divide-gray-200 bg-white">
                {debouncedSearchQuery ? (
                    filteredServices.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 mb-2">
                                <Search size={48} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                No services found
                            </h3>
                            <p className="text-sm text-gray-600">
                                Try searching with different keywords
                            </p>
                        </div>
                    ) : (
                        <div className="px-4">
                            {filteredServices.map((service) => (
                                <ListingServiceCard
                                    key={service.id}
                                    service={service}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    categories.map((category) => {
                        return (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                toggleCategory={toggleCategory}
                                isExpanded={expandedCategory === category.id}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AccordionNavigation;
