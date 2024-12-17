"use client";
import { useQuery } from "@tanstack/react-query";
import { commonOptions } from "@/lib/react-query/options";
import { getCounterpartStatistics } from "@/apis/counterpart-api";

export function getCachedCounterpartDataStatistic() {
    return useQuery({
        queryKey: ["counterpart-statistic"],
        queryFn: () => {
            return getCounterpartStatistics();
        },
        throwOnError: true,
        ...commonOptions,
    });
}
