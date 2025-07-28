import {
    CategoryCardSkeleton,
    ServicesHeaderSkeleton,
} from "./components/listing-skeletons";

export default function ListingLoading() {
    return (
        <div className="max-w-md mx-auto bg-gray-50 min-h-screen">
            <ServicesHeaderSkeleton />

            <div className="divide-y divide-gray-200 bg-white">
                {Array.from({ length: 5 }).map((_, index) => (
                    <CategoryCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}
