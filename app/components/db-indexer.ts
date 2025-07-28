"use client";

import { saveServicesToCache } from "@/utils/service-cache";
import { Service } from "@/utils/types";
import { fetcher } from "@/utils/utils";
import { useEffect } from "react";
import useSWR from "swr";

export const DBIndexer = () => {
    const { data, error } = useSWR(
        "http://localhost:3000/api/services",
        fetcher
    );

    useEffect(() => {
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                saveServicesToCache(key, value as Service);
            });
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            console.error("error while fetching categories", error);
        }
    }, [error]);

    return null;
};

export default DBIndexer;
