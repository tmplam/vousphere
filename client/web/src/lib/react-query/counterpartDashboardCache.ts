"use client";
import { useQuery } from "@tanstack/react-query";
import { commonOptions } from "@/lib/react-query/options";
import { getCounterpartStatistics } from "@/apis/counterpart-dashboard-api";

export function useCachedCounterpartDataStatistic() {
    return useQuery({
        queryKey: ["counterpart-statistic"],
        queryFn: () => {
            return getCounterpartStatistics();
        },
        throwOnError: true,
        ...commonOptions,
    });
}
