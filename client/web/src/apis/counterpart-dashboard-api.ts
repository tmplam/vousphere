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
