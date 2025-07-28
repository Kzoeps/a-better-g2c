"use client";

import {
    saveDocumentToCache,
} from "@/utils/service-cache";
import { CategoryWithServices } from "@/utils/types";
import { fetcher } from "@/utils/utils";
import { useEffect } from "react";
import useSWR from "swr";

export const DBIndexer = () => {
    const { data, error } = useSWR(
        "http://localhost:3000/api/categories",
        fetcher
    );

    useEffect(() => {
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                saveDocumentToCache(key, value as CategoryWithServices);
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
