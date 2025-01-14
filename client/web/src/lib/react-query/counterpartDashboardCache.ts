"use client";
import { useQuery } from "@tanstack/react-query";
import { commonOptions } from "@/lib/react-query/options";
import {
    getBrandVoucherStatistic,
    getBrandWeeklyVoucherIssues,
    getCounterpartStatistics,
    getCounterpartVoucherStatistics,
} from "@/apis/counterpart-dashboard-api";

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

export function useCachedCounterpartVoucherStatistic(time: string) {
    return useQuery({
        queryKey: ["counterpart-voucher", time],
        queryFn: () => {
            return getCounterpartVoucherStatistics(time);
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedBrandVoucherStatistic() {
    return useQuery({
        queryKey: ["brand-vouchers"],
        queryFn: () => {
            return getBrandVoucherStatistic();
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedCounterpartWeeklyVoucherIssureStatistic(time: string) {
    return useQuery({
        queryKey: ["brand-weekly-voucher-issured-statistic", time],
        queryFn: () => {
            return getBrandWeeklyVoucherIssues(time);
        },
        throwOnError: true,
        ...commonOptions,
    });
}
