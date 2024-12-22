import { ErrorResponse, SuccessResponse } from "@/schema/http.schema";
import { LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO, RegisterResponseDTO } from "@/schema/auth.schema";
import { UserType } from "@/schema/user.schema";
import axios from "axios";
const BASE_API = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const getStatistics = async (): Promise<any> => {
    try {
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!accessToken || !refreshToken || !userId) return null;
        // const [totalUser, totalOrder, totalProduct] = await Promise.all([
        //     axios.get(`${BASE_API}/admin/get-total-user`, {
        //         headers: { Authorization: `Bearer ${accessToken}` },
        //     }),
        //     axios.get(`${BASE_API}/admin/get-total-order`, {
        //         headers: { Authorization: `Bearer ${accessToken}` },
        //     }),
        //     axios.get(`${BASE_API}/admin/get-total-product`, {
        //         headers: { Authorization: `Bearer ${accessToken}` },
        //     }),
        // ]);
        // const successResponse = result.data as SuccessResponse<any>[];
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
            data: [
                {
                    data: "12100",
                    trending: "1230",
                },
                {
                    data: "12100",
                    trending: "1230",
                },
                {
                    data: "12100",
                    trending: "1230",
                },
            ],
        };
    } catch (error: any) {
        // throw error;
        return null;
    }
};

export const getNewRegisteredUsers = async (
    time: string
): Promise<{ date: string; counterpart: number; customer: number }[]> => {
    try {
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!accessToken || !refreshToken || !userId) return [];
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const chartData = [
            { date: "2024-06-24", counterpart: 13, customer: 18 },
            { date: "2024-06-25", counterpart: 1, customer: 10 },
            { date: "2024-06-26", counterpart: 4, customer: 21 },
            { date: "2024-06-27", counterpart: 2, customer: 1 },
            { date: "2024-06-28", counterpart: 9, customer: 10 },
            { date: "2024-06-29", counterpart: 13, customer: 12 },
            { date: "2024-06-30", counterpart: 6, customer: 32 },
        ];
        return time == "week" ? chartData : [];
    } catch (error: any) {
        // throw error;
        return [];
    }
};

export const getEventParticipantStatus = async (time: string): Promise<any> => {
    try {
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!accessToken || !refreshToken || !userId) return null;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const chartData = [
            { date: "2024-06-24", happening: 2, ended: 2 },
            { date: "2024-06-25", happening: 10, ended: 1 },
            { date: "2024-06-26", happening: 4, ended: 1 },
            { date: "2024-06-27", happening: 8, ended: 0 },
            { date: "2024-06-28", happening: 1, ended: 2 },
            { date: "2024-06-29", happening: 0, ended: 0 },
            { date: "2024-06-30", happening: 4, ended: 10 },
        ];
        const chartTodayData = [
            { date: "2024-06-24", happening: 2, ended: 2 },
            { date: "2024-06-25", happening: 10, ended: 1 },
            { date: "2024-06-26", happening: 4, ended: 1 },
        ];
        return time == "last3days" ? chartTodayData : chartData;
    } catch (error: any) {
        // throw error;
        return null;
    }
};

export const getPlayTurnStatistics = async (time: string): Promise<{ game: string; plays: number; fill: string }[]> => {
    try {
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!accessToken || !refreshToken || !userId) return [];
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const playTurnTodayData = [
            { game: "quiz", plays: 4, fill: "hsl(var(--chart-1))" },
            { game: "shake", plays: 32, fill: "hsl(var(--chart-4))" },
        ];

        const playTurnThisWeekData = [
            { game: "quiz", plays: 75, fill: "hsl(var(--chart-1))" },
            { game: "shake", plays: 100, fill: "hsl(var(--chart-4))" },
        ];

        const playTurnThisMonthData = [
            { game: "quiz", plays: 275, fill: "hsl(var(--chart-1))" },
            { game: "shake", plays: 500, fill: "hsl(var(--chart-4))" },
        ];
        if (time == "today") return playTurnTodayData;
        return time == "week" ? playTurnThisWeekData : playTurnThisMonthData;
    } catch (error: any) {
        // throw error;
        return [];
    }
};
