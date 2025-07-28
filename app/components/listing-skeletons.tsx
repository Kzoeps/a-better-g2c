export const CategoryCardSkeleton = () => {
    return (
        <div className="border-b border-gray-100 animate-pulse">
            {/* Category Header Skeleton */}
            <div className="w-full p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center flex-grow min-w-0">
                        {/* Icon Placeholder */}
                        <div className="p-2 rounded-lg mr-3 bg-gray-200 w-8 h-8 flex-shrink-0" />
                        <div className="min-w-0 flex-grow space-y-1">
                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                            <div className="h-3 bg-gray-200 rounded w-2/3" />
                        </div>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                        <div className="w-5 h-5 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const ServicesHeaderSkeleton = () => {
    return (
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 animate-pulse">
            <div className="p-4">
                {/* Title Skeleton */}
                <div className="h-6 w-3/5 bg-gray-200 rounded mb-4" />

                {/* Search Bar Skeleton */}
                <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-gray-300 rounded" />
                    <div className="w-full h-11 bg-gray-200 rounded-lg" />
                </div>
            </div>
        </div>
    );
};
