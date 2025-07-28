import ServiceRendererShell from "@/app/components/service-renderer-shell";
import { Service } from "@/utils/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function ServicePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const servicesResponse = await fetch(
        "https://www.citizenservices.gov.bt/g2cPortalApi/getService"
    );
    const servicesData = await servicesResponse.json();
    const service: Service | undefined = servicesData.find(
        (service: Service) => Number(service.id) === Number(id)
    );
    console.log(service);
    return (
        <div className="flex flex-col">
            <nav className="bg-gray-500 text-white sticky top-0 z-20">
                <div className="p-4">
                    <div className="flex items-center">
                        <Link
                            href={"/"}
                            className="inline-flex items-center text-white hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-md p-1 mr-3"
                        >
                            <ArrowLeft className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">
                                Back to categories
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>

            <ServiceRendererShell
                serviceLink={service?.serviceLink || ""}
                serviceName={service?.serviceName || ""}
                htmlContent={service?.serviceDocument || ""}
            />
        </div>
    );
}
