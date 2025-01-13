import { getNotificationList } from "@/apis/notification-api";
import { ROLE_ADMIN } from "@/components/shared/authenticatedRoutes";
import { commonOptions } from "@/lib/react-query/options";
import { useQuery } from "@tanstack/react-query";

export function useCachedNotificationListQuery(role: string, page: number, perPage: number) {
    return useQuery({
        queryKey: [`${role}-notifications`, page, perPage],
        queryFn: () => {
            return getNotificationList(page, perPage);
        },
        throwOnError: true,
        ...commonOptions,
    });
}