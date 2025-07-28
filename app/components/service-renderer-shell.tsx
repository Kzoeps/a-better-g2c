"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import ServiceRendererSkeleton from "./service-renderer-skeleton";

const ServiceRenderer = dynamic(
    () => import("../components/service-renderer"),
    {
        ssr: false,
    }
);
export default function ServiceRendererShell({
    serviceName,
    htmlContent,
    serviceLink,
}: {
    serviceName: string;
    htmlContent: string;
    serviceLink: string;
}) {
    return (
        <div className="flex flex-col">
            <Suspense fallback={<ServiceRendererSkeleton />}>
                <ServiceRenderer
                    serviceName={serviceName || ""}
                    serviceLink={serviceLink || ""}
                    htmlContent={htmlContent || ""}
                />
            </Suspense>
        </div>
    );
}
