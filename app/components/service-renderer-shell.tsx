"use client";

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
        <ServiceRenderer
            serviceName={serviceName || ""}
            htmlContent={htmlContent || ""}
        />
    );
}
