"use client";
import { useCategoryContext } from "@/providers/CategoryContext";
import { categoryIconMap } from "@/utils/categories-constants";
import clsx from "clsx";
import {
    ChevronDown,
    ChevronRight,
    Search
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";



const AccordionNavigation = () => {
    const categoryMap = useCategoryContext();
    const [expandedCategory, setExpandedCategory] = useState<number | null>(
        null
    );
    const [searchQuery, setSearchQuery] = useState("");

    const categories = Object.values(categoryMap);

    const filteredServices = React.useMemo(() => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return [];

        return categories.flatMap((category) =>
            category.services.filter((service) =>
                service.serviceName.toLowerCase().includes(query)
            )
        );
    }, [categories, searchQuery]);

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
                {searchQuery ? (
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
                        filteredServices.map((service) => (
                            <Link
                                href={`/service/${service.id}`}
                                key={service.id}
                                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 group"
                            >
                                <div className="flex items-center">
                                    <div className="w-8 mr-3 flex justify-center">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="font-medium text-gray-900 text-sm">
                                            {service.serviceName}
                                        </div>
                                    </div>
                                    <ChevronRight
                                        size={16}
                                        className="text-gray-300 group-hover:text-gray-400 transition-colors"
                                    />
                                </div>
                            </Link>
                        ))
                    )
                ) : (
                    categories.map((category) => {
                        const IconComponent = categoryIconMap.get(
                            category.id
                        )?.icon;
                        const isExpanded = expandedCategory === category.id;
                        const services = category.services || [];

                        return (
                            <div
                                key={category.id}
                                className="border-b border-gray-100 last:border-b-0"
                            >
                                {/* Category Header */}
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 focus:bg-gray-50 focus:outline-none"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center flex-grow min-w-0">
                                            <div
                                                className={clsx(
                                                    `p-2 rounded-lg mr-3 flex-shrink-0`,
                                                    categoryIconMap.get(
                                                        category.id
                                                    )?.bgColor
                                                )}
                                            >
                                                {IconComponent && (
                                                    <IconComponent
                                                        size={20}
                                                        className={clsx(
                                                            categoryIconMap.get(
                                                                category.id
                                                            )?.color
                                                        )}
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-grow">
                                                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                                    {category.categoryName}
                                                </h3>
                                                <p className="text-xs text-gray-600 leading-relaxed truncate">
                                                    {
                                                        category.categoryDescription
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div className="ml-2 flex-shrink-0">
                                            {isExpanded ? (
                                                <ChevronDown
                                                    size={20}
                                                    className="text-gray-400 transition-transform duration-200"
                                                />
                                            ) : (
                                                <ChevronRight
                                                    size={20}
                                                    className="text-gray-400 transition-transform duration-200"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </button>
                                {/* Services */}
                                {isExpanded && (
                                    <div className="bg-gray-50 border-t border-gray-100">
                                        <div className="px-4">
                                            {services.length === 0 ? (
                                                <div className="px-4 py-6 text-center">
                                                    <p className="text-sm text-gray-500">
                                                        No services available
                                                    </p>
                                                </div>
                                            ) : (
                                                services.map((service) => (
                                                    <Link
                                                        href={`/service/${service.id}`}
                                                        key={service.id}
                                                        className="w-full px-4 py-3 text-left hover:bg-white transition-colors duration-200 group"
                                                    >
                                                        <div className="flex items-center">
                                                            <div className="w-8 mr-3 flex justify-center">
                                                                <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                                                            </div>
                                                            <div className="flex-grow">
                                                                <div className="font-medium text-gray-900 text-sm">
                                                                    {
                                                                        service.serviceName
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-500 mt-0.5">
                                                                    Tap to
                                                                    access
                                                                    service
                                                                </div>
                                                            </div>
                                                            <ChevronRight
                                                                size={16}
                                                                className="text-gray-300 group-hover:text-gray-400 transition-colors"
                                                            />
                                                        </div>
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AccordionNavigation;
