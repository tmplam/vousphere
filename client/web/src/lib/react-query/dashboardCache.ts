"use client";
import { useQuery } from "@tanstack/react-query";
import { commonOptions } from "@/lib/react-query/options";
import { getStatistics } from "@/apis/admin-api";

export function getCachedAdminDataStatistic() {
    return useQuery({
        queryKey: ["admin-statistic"],
        queryFn: () => {
            return getStatistics();
        },
        throwOnError: true,
        ...commonOptions,
    });
}
