import { Service, ServiceWithoutDocument } from "@/utils/types";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const ListingServiceCard = ({
    service,
}: {
    service: ServiceWithoutDocument;
}) => {
    return (
        <Link
            href={`/service/${service.id}`}
            key={service.id}
            className="w-full px-4 py-3 text-left transition-colors duration-200 group"
        >
            <div className="flex items-center">
                <div className="w-8 mr-3 flex flex-shrink-0 justify-center">
                    <div className="w-2 h-2 flex-shrink-0 bg-gray-300 rounded-full group-hover:bg-blue-400 transition-colors"></div>
                </div>
                <div className="flex-grow">
                    <div className="font-medium text-gray-900 text-sm">
                        {service.serviceName}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                        Tap to access service
                    </div>
                </div>
                <ChevronRight
                    size={16}
                    className="text-gray-300 flex-shrink-0 group-hover:text-gray-400 transition-colors"
                />
            </div>
        </Link>
    );
};

export const FilteredServiceCard = ({ service }: { service: Service }) => {
    return (
        <Link
            href={`/service/${service.id}`}
            key={service.id}
            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 group"
        >
            <div className="flex items-center">
                <div className="w-8 mr-3 flex justify-center flex-shrink-0">
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
    );
};
