import { Skeleton } from "@/components/ui/skeleton";

export const ServiceRendererSkeleton = () => {
    return (
        <div className="max-w-md w-full mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-16 z-10">
                <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                        <Skeleton className="h-8 w-24 rounded-md" />
                    </div>
                </div>
            </div>

            {/* Access Service */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </div>

            {/* Links */}
            <div className="p-4 border-b border-gray-100 space-y-3 bg-white">
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="pl-10 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>

            {/* Contact Info */}
            <div className="p-4 border-b border-gray-100 space-y-3 bg-white">
                <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
                <div className="pl-10 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/3" />
                </div>
            </div>

            {/* Section */}
            {[...Array(2)].map((_, idx) => (
                <div
                    key={idx}
                    className="p-4 border-b border-gray-100 bg-white"
                >
                    <div className="flex items-center space-x-3 mb-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                    <div className="pl-10 space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ServiceRendererSkeleton;
