import { getMySubscription, getAllMyEvents, getEventDetail } from "@/apis/event-api";
import { commonOptions } from "@/lib/react-query/options";
import { useQuery } from "@tanstack/react-query";

export function useCachedSubscriptionQuery() {
    return useQuery({
        queryKey: ["subscription"],
        queryFn: () => {
            return getMySubscription();
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedMyEventQuery(page: number = 1, perPage: number = 10) {
    return useQuery({
        queryKey: ["my-events", page, perPage],
        queryFn: () => {
            return getAllMyEvents(page, perPage);
        },
        throwOnError: true,
        ...commonOptions,
    });
}

export function useCachedMyEventDetailQuery(id: number) {
    return useQuery({
        queryKey: ["my-event-detail", id],
        queryFn: () => {
            return getEventDetail(id);
        },
        throwOnError: true,
        ...commonOptions,
    });
}
