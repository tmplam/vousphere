import { getMySubscription } from "@/apis/event-api";
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
