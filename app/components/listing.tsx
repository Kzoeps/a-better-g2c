"use client";
import React, { useState } from "react";
import useSWR from "swr";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Users,
  GraduationCap,
  Heart,
  DollarSign,
  Home,
  Shield,
  Wheat,
  Building2,
  MapPin,
  Plane,
  Scale,
  Banknote,
  Car,
  Calendar,
  CreditCard,
  TreePine,
  Palette,
} from "lucide-react";
import { Category, SubCategory } from "@/utils/types";
import { fetcher } from "@/utils/utils";

export interface ListingProps {
  categories: Category[];
}

const categoryIconMap = new Map<number, React.ElementType>([
  [479, Users],
  [480, GraduationCap],
  [483, Heart],
  [484, DollarSign],
  [485, Home],
  [486, Shield],
  [487, Wheat],
  [488, Building2],
  [489, MapPin],
  [490, Plane],
  [491, Scale],
  [492, Banknote],
  [493, Car],
  [494, Calendar],
  [548, CreditCard],
  [622, TreePine],
  [627, Palette],
]);

const AccordionNavigation = ({ categories }: ListingProps) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    data: subcategories,
    isLoading,
    error,
  } = useSWR(
    expandedCategory ? `/api/categories/${expandedCategory}` : null,
    fetcher
  );

  console.log(subcategories);

  const toggleCategory = (categoryId: any) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
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

      {/* Accordion List */}
      <div className="divide-y divide-gray-200 bg-white">
        {categories.map((category) => {
          const IconComponent = categoryIconMap.get(category.id);
          const isExpanded = expandedCategory === category.id;

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
                    <div className={`p-2 rounded-lg mr-3 flex-shrink-0`}>
                      {IconComponent && <IconComponent size={20} />}
                    </div>
                    <div className="min-w-0 flex-grow">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {category.categoryName}
                      </h3>
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

              {/* Subcategories */}
              {/* Subcategories */}
              {isExpanded && (
                <div className="bg-gray-50 border-t border-gray-100">
                  <div className="py-2">
                    {isLoading
                      ? // Skeleton loader when subcategories are loading
                        Array.from({ length: 3 }).map((_, index) => (
                          <div
                            key={index}
                            className="animate-pulse flex items-center px-4 py-3 space-x-3"
                          >
                            <div className="w-8 flex justify-center">
                              <div className="w-2 h-2 bg-gray-300 rounded-full" />
                            </div>
                            <div className="flex-grow">
                              <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            </div>
                            <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          </div>
                        ))
                      : (subcategories as SubCategory[])?.map(
                          (subcategory, index) => (
                            <button
                              key={index}
                              className="w-full px-4 py-3 text-left hover:bg-white transition-colors duration-200 group"
                            >
                              <div className="flex items-center">
                                <div className="w-8 mr-3 flex justify-center">
                                  <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                                </div>
                                <div className="flex-grow">
                                  <div className="font-medium text-gray-900 text-sm">
                                    {subcategory.serviceName}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    Tap to access service
                                  </div>
                                </div>
                                <ChevronRight
                                  size={16}
                                  className="text-gray-300 group-hover:text-gray-400 transition-colors"
                                />
                              </div>
                            </button>
                          )
                        )}
                  </div>
                </div>
              )}

              {/* {isExpanded && (
                <div className="bg-gray-50 border-t border-gray-100">
                  <div className="py-2">
                    {(subcategories as SubCategory[])?.map(
                      (subcategory, index) => (
                        <button
                          key={index}
                          className="w-full px-4 py-3 text-left hover:bg-white transition-colors duration-200 group"
                        >
                          <div className="flex items-center">
                            <div className="w-8 mr-3 flex justify-center">
                              <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                            </div>
                            <div className="flex-grow">
                              <div className="font-medium text-gray-900 text-sm">
                                {subcategory.serviceName}
                              </div>
                              <div className="text-xs text-gray-500 mt-0.5">
                                Tap to access service
                              </div>
                            </div>
                            <ChevronRight
                              size={16}
                              className="text-gray-300 group-hover:text-gray-400 transition-colors"
                            />
                          </div>
                        </button>
                      )
                    )}
                  </div>
                </div>
              )} */}
            </div>
          );
        })}
      </div>

      {/* Results count for search */}
      {/* {searchQuery && (
        <div className="p-4 bg-gray-50">
          <p className="text-sm text-gray-500 text-center">
            {filteredCategories.length}{" "}
            {filteredCategories.length === 1 ? "category" : "categories"} found
          </p>
        </div>
      )} */}

      {/* Empty state */}
      {/* {searchQuery && filteredCategories.length === 0 && (
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
      )} */}
    </div>
  );
};

export default AccordionNavigation;
