"use client";
import { useQuery } from "@tanstack/react-query";
import { commonOptions } from "@/lib/react-query/options";
import {
    getStatistics,
    getEventParticipantStatus,
    getNewRegisteredUsers,
    getPlayTurnStatistics,
} from "@/apis/admin-api";

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

export function getCachedNewUsersStatistic(time: string) {
    return useQuery({
        queryKey: ["new-users-statistic", time],
        queryFn: () => {
            return getNewRegisteredUsers(time);
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function getCachedEventStatusStatistic(time: string) {
    return useQuery({
        queryKey: ["event-status-statistic", time],
        queryFn: () => {
            return getEventParticipantStatus(time);
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function getCachedPlayTurnStatistic(time: string) {
    return useQuery({
        queryKey: ["play-turn-statistic", time],
        queryFn: () => {
            return getPlayTurnStatistics(time);
        },
        throwOnError: true,
        ...commonOptions,
    });
}
