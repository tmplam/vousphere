import { BASE_API } from "@/apis/constants";
import { ROLE_COUNTERPART } from "@/components/shared/authenticatedRoutes";
import { EventGameListType, EventGameType, SubscriptionRequestDTO } from "@/schema/event.schema";
import { SuccessResponse } from "@/schema/http.schema";
import axios, { AxiosResponse } from "axios";

export async function getAllEvents(
    role: string,
    page: number = 1,
    perPage: number = 10,
    keyword?: string,
    status?: string,
    startTime?: string,
    endTime?: string
): Promise<EventGameListType | null> {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("perPage", perPage.toString());
        if (keyword) params.append("keyword", keyword);
        if (status) params.append("status", status);
        if (startTime) params.append("startTime", startTime);
        if (endTime) params.append("endTime", endTime);
        let baseUrl = `${BASE_API}/event-service/api/admin/events`;
        if (role === ROLE_COUNTERPART) {
            baseUrl = `${BASE_API}/event-service/api/events/registered`;
        }
        const result = (
            await axios.get(`${baseUrl}?${params.toString()}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<EventGameListType>;
        return result.data;
    } catch (error: any) {
        return null;
    }
}

export async function callCreateEventRequest(values: any): Promise<AxiosResponse<any>> {
    try {
        const result = await axios.post(`${BASE_API}/event-service/api/events`, values, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error;
    }
}

export async function callUpdateEventRequest(id: string, values: any): Promise<AxiosResponse<any>> {
    try {
        console.log(values);
        const result = await axios.put(`${BASE_API}/event-service/api/events/${id}`, values, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error;
    }
}

export async function getEventDetail(id: string): Promise<EventGameType | null> {
    try {
        const result = (
            await axios.get(`${BASE_API}/event-service/api/events/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<EventGameType>;
        return result.data;
    } catch (error: any) {
        return null;
    }
}

export async function callApproveEventRequest(id: string): Promise<AxiosResponse<any>> {
    try {
        const result = await axios.patch(
            `${BASE_API}/event-service/api/events/${id}/approve`,
            { comment: "" },
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            }
        );
        return result;
    } catch (error: any) {
        return error;
    }
}

export async function callRejectEventRequest(id: string, payload: { comment: string }): Promise<AxiosResponse<any>> {
    try {
        const result = await axios.patch(`${BASE_API}/event-service/api/events/${id}/reject`, payload, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error;
    }
}

export async function callCreateSubscriptionRequest(data: SubscriptionRequestDTO): Promise<AxiosResponse<any, any>> {
    try {
        const { location, ...payload } = data;
        const body = {
            ...payload,
            latitude: location[0],
            longitude: location[1],
        };
        const result = await axios.put(`${BASE_API}/user-service/api/brands/brand-info`, body, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error.response.data;
    }
}

export async function callUpdateSubscriptionRequest(data: SubscriptionRequestDTO): Promise<AxiosResponse<any, any>> {
    try {
        const { location, ...payload } = data;
        const body = {
            ...payload,
            latitude: location[0],
            longitude: location[1],
        };
        const result = await axios.put(`${BASE_API}/user-service/api/brands/brand-info`, body, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error.response.data;
    }
}
