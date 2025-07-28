"use client";

import { saveServicesToCache } from "@/utils/service-cache";
import { Service } from "@/utils/types";
import { fetcher } from "@/utils/utils";
import { useEffect } from "react";
import useSWR from "swr";

export const DBIndexer = () => {
    const { data, error } = useSWR(`/api/services`, fetcher);

    useEffect(() => {
        if (data) {
            Object.values(data).forEach((value) => {
                saveServicesToCache(
                    (value as Service).id.toString(),
                    value as Service
                ).then(() => {
                    console.log(
                        `saved service with id: ${(value as Service).id} to db`
                    );
                });
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
