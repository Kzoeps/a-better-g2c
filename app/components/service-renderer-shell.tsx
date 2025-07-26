"use client";

import { ArrowLeft } from "lucide-react";
import dynamic from "next/dynamic";

const ServiceRenderer = dynamic(
    () => import("@/utils/service-parser").then((mod) => mod.ServiceRenderer),
    {
        ssr: false,
    }
);
export default function ServiceRendererShell({
    serviceName,
    htmlContent,
}: {
    serviceName: string;
    htmlContent: string;
}) {
    return (
        <div className="flex flex-col">
            <div className="bg-gray-500 text-white sticky top-0 z-20">
                <div className="p-4">
                    <div className="flex items-center">
                        <button
                            className="inline-flex items-center text-white hover:text-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-md p-1 mr-3"
                        >
                            <ArrowLeft className="h-5 w-5 mr-1" />
                            <span className="text-sm font-medium">Back to categories</span>
                        </button>
                    </div>
                </div>
            </div>
            <ServiceRenderer
                serviceName={serviceName || ""}
                htmlContent={htmlContent || ""}
            />
        </div>
    );
}
