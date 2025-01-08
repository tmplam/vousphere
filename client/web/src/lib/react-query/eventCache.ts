import { getAllEvents, getEventDetail } from "@/apis/event-api";
import { getAllGamesAndQuizzes, getAllQuizzes } from "@/apis/game-api";
import { commonOptions } from "@/lib/react-query/options";
import { useQuery } from "@tanstack/react-query";

export function useCachedEventListQuery(
    role: string,
    page: number = 1,
    perPage: number = 10,
    keyword: string = "",
    status: string = "",
    startTime: string = "",
    endTime: string = ""
) {
    return useQuery({
        queryKey: ["my-events", role, page, perPage, keyword, status, startTime, endTime],
        queryFn: () => {
            return getAllEvents(role, page, perPage, keyword, status, startTime, endTime);
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedMyEventDetailQuery(id: string) {
    return useQuery({
        queryKey: ["my-event-detail", id],
        queryFn: () => {
            return getEventDetail(id);
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedQuizListQuery() {
    return useQuery({
        queryKey: ["my-quizzes"],
        queryFn: () => {
            return getAllQuizzes();
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedGameAndQuizListQuery() {
    return useQuery({
        queryKey: ["my-games-quizzes"],
        queryFn: () => {
            return getAllGamesAndQuizzes();
        },
        throwOnError: true,
        ...commonOptions,
    });
}
