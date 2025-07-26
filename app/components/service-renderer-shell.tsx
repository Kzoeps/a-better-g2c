"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

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
            <Suspense fallback={<div>Loading...</div>}>
                <ServiceRenderer
                    serviceName={serviceName || ""}
                    htmlContent={htmlContent || ""}
                />
            </Suspense>
        </div>
    );
}
