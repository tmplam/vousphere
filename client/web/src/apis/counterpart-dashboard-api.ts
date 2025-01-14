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
        // console.log(totalEvents, totalUsedVouchers);
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

export const getBrandVoucherStatistic = async (): Promise<any> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return [];
        try {
            const result = await axios.get(`${BASE_API}/voucher-service/api/vouchers/brand/game-statistics`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            const resultList = result.data;
            let vourcherList: { gameName: string; releasedVouchers: number; fill: string }[] = [];
            for (let i = 0; i < resultList.data.length; i++) {
                const fill = `hsl(var(--chart-${i + 1}))`;
                const game = await axios.get(`${BASE_API}/game-service/api/games/${resultList.data[i].gameId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const gameName = game.data.data.name;
                vourcherList.push({ gameName, releasedVouchers: resultList.data[i].totalReleasedVouchers, fill });
            }
            return vourcherList;
        } catch (error: any) {
            return error;
        }
    } catch (error: any) {
        // throw error;
        return [];
    }
};

export const getBrandWeeklyVoucherIssues = async (time: string): Promise<any> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return [];
        try {
            const result = await axios.get(
                `${BASE_API}/voucher-service/api/vouchers/brand/week-vouchers-issued?currentDate=${time}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                }
            );
            console.log(result.data);
            return result.data.data;
        } catch (error: any) {
            return error;
        }
    } catch (error: any) {
        // throw error;
        return [];
    }
};
