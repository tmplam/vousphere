"use client";
import { useQuery } from "@tanstack/react-query";
import { commonOptions } from "@/lib/react-query/options";

export function useCachedMovieDetail(id: number) {
    return useQuery({
        queryKey: ["movie", id],
        queryFn: () => {
            return getMovieById(id);
        },
        throwOnError: true,
        ...commonOptions,
    });
}
function getMovieById(id: number): any {
    return null;
}
