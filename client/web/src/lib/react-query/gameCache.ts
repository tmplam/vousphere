import { getGameById, getAllGames, getQuizById } from "@/apis/game-api";
import { commonOptions } from "@/lib/react-query/options";
import { useQuery } from "@tanstack/react-query";

export function useCachedGameQuery(id: string) {
    return useQuery({
        queryKey: ["game", id],
        queryFn: () => {
            return getGameById(id);
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedGameListQuery() {
    return useQuery({
        queryKey: ["gameList"],
        queryFn: () => {
            return getAllGames();
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedQuizQuery(id: string) {
    return useQuery({
        queryKey: ["quiz", id],
        queryFn: () => {
            return getQuizById(id);
        },
        throwOnError: true,
        ...commonOptions,
    });
}
