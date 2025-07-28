"use client";
import { getServiceFromCache } from "@/utils/service-cache";
import { CategoryWithServices, Service } from "@/utils/types";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import ServiceRendererSkeleton from "./service-renderer-skeleton";
import useSWR from "swr";
import { fetcher } from "@/utils/utils";

const ServiceRenderer = dynamic(
    () => import("../components/service-renderer"),
    {
        ssr: false,
    }
);
export default function ServiceRendererShell({ id }: { id: string }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [serviceData, setServiceData] = useState<Service | undefined>(
        undefined
    );
    const { data: dataFromApi, isLoading: fetchingFromAPI } =
        useSWR<Service | null>(
            `http://localhost:3000/api/services/${id}`,
            fetcher
        );

    useEffect(() => {
        if (!serviceData && dataFromApi) {
            setServiceData(dataFromApi);
        }
    }, [serviceData, dataFromApi, fetchingFromAPI]);

    useEffect(() => {
        const getDocumentData = async () => {
            setLoading(true);
            const data = await getServiceFromCache(id);
            if (!data) {
                console.error("Service data not found in cache");
                setLoading(false);
                return;
            }
            setServiceData(data);
            setLoading(false);
        };
        getDocumentData();
    }, [id]);

    if (!serviceData && (loading || fetchingFromAPI)) {
        return <ServiceRendererSkeleton />;
    }

    if (!serviceData) {
        return <p> not found yo</p>;
    }

    if (serviceData) {
        return (
            <div className="flex flex-col">
                <Suspense fallback={<ServiceRendererSkeleton />}>
                    <ServiceRenderer
                        serviceName={serviceData?.serviceName || ""}
                        serviceLink={serviceData?.serviceLink || ""}
                        htmlContent={serviceData?.serviceDocument || ""}
                    />
                </Suspense>
            </div>
        );
    }
}
