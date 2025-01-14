import { BASE_API } from "@/apis/constants";
import axios, { AxiosResponse } from "axios";

export async function demoCallARequest(id: string): Promise<AxiosResponse<any>> {
    try {
        const result = await axios.patch(`${BASE_API}/abc-service/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error;
    }
}

export const getStatistics = async (): Promise<any> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return null;
        const [totalBrands, totalPlayers, totalEvents] = await Promise.all([
            axios.get(`${BASE_API}/user-service/api/brands/total-brands`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
            axios.get(`${BASE_API}/user-service/api/players/total-players`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
            axios.get(`${BASE_API}/event-service/api/events/total-events`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            }),
        ]);
        console.log(totalBrands, totalPlayers, totalEvents);
        return {
            data: [
                {
                    data: totalBrands.data.data.totalBrands,
                },
                {
                    data: totalPlayers.data.data.totalPlayers,
                },
                {
                    data: totalEvents.data.data.totalEvents,
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
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return [];
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
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return null;
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
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return [];
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
