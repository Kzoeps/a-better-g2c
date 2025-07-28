import { Skeleton } from "@/components/ui/skeleton";
import ServiceRendererSkeleton from "@/app/components/service-renderer-skeleton";

const ServicePageSkeleton = () => {
    return (
        <div className="flex flex-col">
            {/* Sticky Top Navbar Skeleton */}
            <nav className="bg-gray-500 sticky top-0 z-20">
                <div className="p-4">
                    <div className="flex items-center gap-2">
                        {/* Back arrow + text skeleton */}
                        <Skeleton className="h-5 w-5 rounded" />
                        <Skeleton className="h-4 w-32 rounded-md" />
                    </div>
                </div>
            </nav>

            {/* Shell Skeleton */}
            <ServiceRendererSkeleton />
        </div>
    );
};

export default ServicePageSkeleton;
