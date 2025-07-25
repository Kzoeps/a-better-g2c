"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useState } from "react";

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
    const [showOriginal, setShowOriginal] = useState(false);
    const toggleOriginal = () => {
        setShowOriginal(!showOriginal);
    };
    return (
        <div className="flex flex-col">
            <Button onClick={toggleOriginal} className="mx-6 mt-6">
                {!showOriginal ? "View Original" : "Beautify"}{" "}
            </Button>
            {!showOriginal && (
                <ServiceRenderer
                    serviceName={serviceName || ""}
                    htmlContent={htmlContent || ""}
                />
            )}
            <div className="p-6">
                {showOriginal && (
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                )}
            </div>
        </div>
    );
}
