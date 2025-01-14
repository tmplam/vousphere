import { BASE_API } from "@/apis/constants";
import axios from "axios";

export const getCounterpartStatistics = async (): Promise<any> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return null;
        const [totalEvents, totalUsedVouchers] = await Promise.all([
            axios.get(`${BASE_API}/event-service/api/events/brand/total-events`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
            axios.get(`${BASE_API}/voucher-service/api/vouchers/brand/total-redeemed`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        ]);
        console.log(totalEvents, totalUsedVouchers);
        return {
            data: [
                {
                    data: totalEvents.data.data.totalEvents,
                },
                {
                    data: totalUsedVouchers.data.data.totalRedeemedVouchers,
                },
                {
                    data: totalEvents.data.data.totalReleasedVouchers,
                },
            ],
        };
    } catch (error: any) {
        // throw error;
        return null;
    }
};

export const getCounterpartVoucherStatistics = async (time: string): Promise<any> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return [];
        try {
            const result = await axios.get(
                `${BASE_API}/event-service/api/events/brand/week-status?currentDate=${time}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                }
            );
            return result.data.data;
        } catch (error: any) {
            return error;
        }
    } catch (error: any) {
        // throw error;
        return [];
    }
};
