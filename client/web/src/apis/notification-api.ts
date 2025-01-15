import axios, { AxiosResponse } from "axios";
import { BASE_API } from "./constants";
import { SuccessResponse } from "@/schema/http.schema";
import { Notification, NotificationListType } from "@/schema/notification.shema";
import { PaginationType } from "@/schema/types/common";
/* Khiem workspace - Call notification apis */

export async function getNotificationList(
    currentPage: number = 1,
    perPage: number = 10
): Promise<NotificationListType> {
    if (!localStorage.getItem("accessToken")) return {} as NotificationListType;
    try {
        const params = new URLSearchParams({
            page: currentPage.toString(),
            perPage: perPage.toString(),
        });
        const result = (
            await axios.get(`${BASE_API}/notification-service/api/notifications?${params.toString()}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<NotificationListType>;
        return result.data;
    } catch (error: any) {
        return {} as NotificationListType;
    }
}
