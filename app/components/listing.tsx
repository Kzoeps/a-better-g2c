"use client";
import React, { useState } from "react";
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
import clsx from "clsx";
import { useCategoryContext } from "@/providers/CategoryContext";

const categoryIconMap = new Map<
    number,
    {
        icon: React.ElementType;
        color: string;
        bgColor: string;
    }
>([
    [479, { icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" }],
    [
        480,
        {
            icon: GraduationCap,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
    ],
    [483, { icon: Heart, color: "text-red-600", bgColor: "bg-red-50" }],
    [
        484,
        { icon: DollarSign, color: "text-yellow-600", bgColor: "bg-yellow-50" },
    ],
    [485, { icon: Home, color: "text-orange-600", bgColor: "bg-orange-50" }],
    [486, { icon: Shield, color: "text-gray-600", bgColor: "bg-gray-50" }],
    [487, { icon: Wheat, color: "text-emerald-600", bgColor: "bg-emerald-50" }],
    [
        488,
        { icon: Building2, color: "text-purple-600", bgColor: "bg-purple-50" },
    ],
    [489, { icon: MapPin, color: "text-teal-600", bgColor: "bg-teal-50" }],
    [490, { icon: Plane, color: "text-sky-600", bgColor: "bg-sky-50" }],
    [491, { icon: Scale, color: "text-indigo-600", bgColor: "bg-indigo-50" }],
    [492, { icon: Banknote, color: "text-rose-600", bgColor: "bg-rose-50" }],
    [493, { icon: Car, color: "text-cyan-600", bgColor: "bg-cyan-50" }],
    [494, { icon: Calendar, color: "text-pink-600", bgColor: "bg-pink-50" }],
    [
        548,
        { icon: CreditCard, color: "text-violet-600", bgColor: "bg-violet-50" },
    ],
    [622, { icon: TreePine, color: "text-lime-600", bgColor: "bg-lime-50" }],
    [627, { icon: Palette, color: "text-amber-600", bgColor: "bg-amber-50" }],
]);

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
                            <button
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
                            </button>
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
                                        <div className="py-2">
                                            {services.length === 0 ? (
                                                <div className="px-4 py-6 text-center">
                                                    <p className="text-sm text-gray-500">
                                                        No services available
                                                    </p>
                                                </div>
                                            ) : (
                                                services.map((service) => (
                                                    <button
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
                                                    </button>
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

// "use client";
// import React, { useState } from "react";
// import {
//     Search,
//     ChevronDown,
//     ChevronRight,
//     Users,
//     GraduationCap,
//     Heart,
//     DollarSign,
//     Home,
//     Shield,
//     Wheat,
//     Building2,
//     MapPin,
//     Plane,
//     Scale,
//     Banknote,
//     Car,
//     Calendar,
//     CreditCard,
//     TreePine,
//     Palette,
// } from "lucide-react";
// import clsx from "clsx";
// import { useCategoryContext } from "@/providers/CategoryContext";

// const categoryIconMap = new Map<
//     number,
//     {
//         icon: React.ElementType;
//         color: string;
//         bgColor: string;
//     }
// >([
//     [479, { icon: Users, color: "text-blue-600", bgColor: "bg-blue-50" }],
//     [
//         480,
//         {
//             icon: GraduationCap,
//             color: "text-green-600",
//             bgColor: "bg-green-50",
//         },
//     ],
//     [483, { icon: Heart, color: "text-red-600", bgColor: "bg-red-50" }],
//     [
//         484,
//         { icon: DollarSign, color: "text-yellow-600", bgColor: "bg-yellow-50" },
//     ],
//     [485, { icon: Home, color: "text-orange-600", bgColor: "bg-orange-50" }],
//     [486, { icon: Shield, color: "text-gray-600", bgColor: "bg-gray-50" }],
//     [487, { icon: Wheat, color: "text-emerald-600", bgColor: "bg-emerald-50" }],
//     [
//         488,
//         { icon: Building2, color: "text-purple-600", bgColor: "bg-purple-50" },
//     ],
//     [489, { icon: MapPin, color: "text-teal-600", bgColor: "bg-teal-50" }],
//     [490, { icon: Plane, color: "text-sky-600", bgColor: "bg-sky-50" }],
//     [491, { icon: Scale, color: "text-indigo-600", bgColor: "bg-indigo-50" }],
//     [492, { icon: Banknote, color: "text-rose-600", bgColor: "bg-rose-50" }],
//     [493, { icon: Car, color: "text-cyan-600", bgColor: "bg-cyan-50" }],
//     [494, { icon: Calendar, color: "text-pink-600", bgColor: "bg-pink-50" }],
//     [
//         548,
//         { icon: CreditCard, color: "text-violet-600", bgColor: "bg-violet-50" },
//     ],
//     [622, { icon: TreePine, color: "text-lime-600", bgColor: "bg-lime-50" }],
//     [627, { icon: Palette, color: "text-amber-600", bgColor: "bg-amber-50" }],
// ]);

// const AccordionNavigation = () => {
//     const categoryMap = useCategoryContext();
//     const [expandedCategory, setExpandedCategory] = useState<number | null>(
//         null
//     );
//     const [searchQuery, setSearchQuery] = useState("");

//     // Convert CategoryMap to array for easier iteration
//     const categories = Object.values(categoryMap);

//     // Filter categories and services based on search query
//     const filteredCategories = React.useMemo(() => {
//         if (!searchQuery.trim()) {
//             return categories;
//         }

//         const query = searchQuery.toLowerCase().trim();

//         return categories
//             .filter((category) => {
//                 // Check if category name matches
//                 const categoryMatches =
//                     category.categoryName.toLowerCase().includes(query) ||
//                     category.categoryDescription.toLowerCase().includes(query);

//                 // Check if any service in this category matches
//                 const hasMatchingServices = category.services.some(
//                     (service) =>
//                         service.serviceName.toLowerCase().includes(query) ||
//                         service.serviceDescription.toLowerCase().includes(query)
//                 );

//                 return categoryMatches || hasMatchingServices;
//             })
//             .map((category) => {
//                 // If searching, filter services within each category
//                 const filteredServices = category.services.filter(
//                     (service) =>
//                         service.serviceName.toLowerCase().includes(query) ||
//                         service.serviceDescription.toLowerCase().includes(query)
//                 );

//                 return {
//                     ...category,
//                     services: filteredServices,
//                     // Keep track of whether the category itself matched (for potential highlighting)
//                     categoryMatched:
//                         category.categoryName.toLowerCase().includes(query) ||
//                         category.categoryDescription
//                             .toLowerCase()
//                             .includes(query),
//                 };
//             });
//     }, [categories, searchQuery]);

//     const toggleCategory = (categoryId: number) => {
//         setExpandedCategory(
//             expandedCategory === categoryId ? null : categoryId
//         );
//     };

//     return (
//         <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
//             {/* Header */}
//             <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
//                 <div className="p-4">
//                     <h1 className="text-xl font-bold text-gray-900 mb-4">
//                         Government Services
//                     </h1>
//                     {/* Search Bar */}
//                     <div className="relative">
//                         <Search
//                             size={20}
//                             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//                         />
//                         <input
//                             type="text"
//                             placeholder="Search services..."
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
//                         />
//                     </div>
//                 </div>
//             </div>
//             {/* Accordion List */}
//             <div className="divide-y divide-gray-200 bg-white">
//                 {filteredCategories.map((category) => {
//                     const IconComponent = categoryIconMap.get(
//                         category.id
//                     )?.icon;
//                     const isExpanded = expandedCategory === category.id;
//                     const services = category.services || [];

//                     return (
//                         <div
//                             key={category.id}
//                             className="border-b border-gray-100 last:border-b-0"
//                         >
//                             {/* Category Header */}
//                             <button
//                                 onClick={() => toggleCategory(category.id)}
//                                 className="w-full p-4 text-left hover:bg-gray-50 transition-colors duration-200 focus:bg-gray-50 focus:outline-none"
//                             >
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center flex-grow min-w-0">
//                                         <div
//                                             className={clsx(
//                                                 `p-2 rounded-lg mr-3 flex-shrink-0`,
//                                                 categoryIconMap.get(category.id)
//                                                     ?.bgColor
//                                             )}
//                                         >
//                                             {IconComponent && (
//                                                 <IconComponent
//                                                     size={20}
//                                                     className={clsx(
//                                                         categoryIconMap.get(
//                                                             category.id
//                                                         )?.color
//                                                     )}
//                                                 />
//                                             )}
//                                         </div>
//                                         <div className="min-w-0 flex-grow">
//                                             <h3 className="font-semibold text-gray-900 text-sm mb-1">
//                                                 {category.categoryName}
//                                             </h3>
//                                             <p className="text-xs text-gray-600 leading-relaxed truncate">
//                                                 {category.categoryDescription}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="ml-2 flex-shrink-0">
//                                         {isExpanded ? (
//                                             <ChevronDown
//                                                 size={20}
//                                                 className="text-gray-400 transition-transform duration-200"
//                                             />
//                                         ) : (
//                                             <ChevronRight
//                                                 size={20}
//                                                 className="text-gray-400 transition-transform duration-200"
//                                             />
//                                         )}
//                                     </div>
//                                 </div>
//                             </button>
//                             {/* Services (Previously Subcategories) */}
//                             {isExpanded && (
//                                 <div className="bg-gray-50 border-t border-gray-100">
//                                     <div className="py-2">
//                                         {services.length === 0 ? (
//                                             <div className="px-4 py-6 text-center">
//                                                 <p className="text-sm text-gray-500">
//                                                     {searchQuery
//                                                         ? "No matching services found"
//                                                         : "No services available"}
//                                                 </p>
//                                             </div>
//                                         ) : (
//                                             services.map((service) => (
//                                                 <button
//                                                     key={service.id}
//                                                     className="w-full px-4 py-3 text-left hover:bg-white transition-colors duration-200 group"
//                                                 >
//                                                     <div className="flex items-center">
//                                                         <div className="w-8 mr-3 flex justify-center">
//                                                             <div className="w-2 h-2 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
//                                                         </div>
//                                                         <div className="flex-grow">
//                                                             <div className="font-medium text-gray-900 text-sm">
//                                                                 {
//                                                                     service.serviceName
//                                                                 }
//                                                             </div>
//                                                             <div className="text-xs text-gray-500 mt-0.5">
//                                                                 Tap to access
//                                                                 service
//                                                             </div>
//                                                         </div>
//                                                         <ChevronRight
//                                                             size={16}
//                                                             className="text-gray-300 group-hover:text-gray-400 transition-colors"
//                                                         />
//                                                     </div>
//                                                 </button>
//                                             ))
//                                         )}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Results count for search */}
//             {searchQuery && (
//                 <div className="p-4 bg-gray-50">
//                     <p className="text-sm text-gray-500 text-center">
//                         {filteredCategories.length}{" "}
//                         {filteredCategories.length === 1
//                             ? "category"
//                             : "categories"}{" "}
//                         found
//                     </p>
//                 </div>
//             )}

//             {/* Empty state */}
//             {searchQuery && filteredCategories.length === 0 && (
//                 <div className="p-8 text-center">
//                     <div className="text-gray-400 mb-2">
//                         <Search size={48} className="mx-auto" />
//                     </div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-1">
//                         No services found
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                         Try searching with different keywords
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AccordionNavigation;
