import { categoryIconMap } from "@/utils/categories-constants";
import clsx from "clsx";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ListingServiceCard } from "./listing-service-card";
import { CategoryWithServices } from "@/utils/types";

export const CategoryCard = ({
    category,
    toggleCategory,
    isExpanded,
}: {
    category: CategoryWithServices;
    toggleCategory: (id: number) => void;
    isExpanded: boolean;
}) => {
    const IconComponent = categoryIconMap.get(category.id)?.icon;
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
                                categoryIconMap.get(category.id)?.bgColor
                            )}
                        >
                            {IconComponent && (
                                <IconComponent
                                    size={20}
                                    className={clsx(
                                        categoryIconMap.get(category.id)?.color
                                    )}
                                />
                            )}
                        </div>
                        <div className="min-w-0 flex-grow">
                            <h2 className="font-semibold text-gray-900 text-sm mb-1">
                                {category.categoryName}
                            </h2>
                            <p className="text-xs text-gray-600 leading-relaxed truncate">
                                {category.categoryDescription}
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
                                <ListingServiceCard
                                    key={service.id}
                                    service={service}
                                />
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
