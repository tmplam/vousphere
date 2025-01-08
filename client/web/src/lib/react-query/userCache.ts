"use client";
import { useQuery } from "@tanstack/react-query";
import { commonOptions } from "@/lib/react-query/options";
import { UserType } from "@/schema/auth.schema";
import { UserInfoRequestDTO } from "@/schema/user.schema";
import { getUserById, getUserInfo, getUserList } from "@/apis/user-api";

export function useCachedUserQuery(id: string) {
    return useQuery({
        queryKey: ["user-info", id],
        queryFn: () => {
            return getUserById(id);
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedUserInfo() {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: () => {
            return getUserInfo();
        },
        throwOnError: true,
        gcTime: 0,
        ...commonOptions,
    });
}

export function useCachedUserList(currentPage: number, perPage: number = 5, keyword: string = "", role: string = "") {
    return useQuery({
        queryKey: ["user-list", currentPage, perPage, keyword, role],
        queryFn: () => {
            return getUserList(currentPage, perPage, keyword, role);
        },
        throwOnError: true,
        ...commonOptions,
    });
}
