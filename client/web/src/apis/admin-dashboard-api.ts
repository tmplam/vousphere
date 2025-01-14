import { BASE_API } from "@/apis/constants";
import { addTime, formatDate } from "@/lib/utils";
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
        // console.log(totalBrands, totalPlayers, totalEvents);
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
): Promise<{ date: string; counterpart: number; player: number }[]> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return [];
        const now = new Date();
        if (time == "thisweek") {
        } else if (time == "lastweek") {
            now.setDate(new Date().getDate() - 7);
        } else if (time == "last2weeks") {
            now.setDate(new Date().getDate() - 14);
        }
        try {
            const result = await axios.get(
                `${BASE_API}/user-service/api/users/week-register-statistics?currentDate=${now.toJSON()}`,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
                }
            );
            console.log(result.data);
            const data = result.data.data.map((item: any) => ({
                date: formatDate(new Date(item.date)),
                counterpart: item.numberOfBrands,
                player: item.numberOfPlayers,
            }));
            console.log(data);
            return data;
        } catch (error: any) {
            return [];
        }
    } catch (error: any) {
        // throw error;
        return [];
    }
};

export const getEventParticipantStatus = async (time: string): Promise<any> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return [];
        try {
            const result = await axios.get(`${BASE_API}/event-service/api/events/week-status?currentDate=${time}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            });
            return result.data.data;
        } catch (error: any) {
            return error;
        }
    } catch (error: any) {
        // throw error;
        return [];
    }
};

export const getPlayTurnStatistics = async (
    time: string
): Promise<{ gameName: string; releasedVouchers: number; fill: string }[]> => {
    try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) return [];
        try {
            const result = await axios.get(`${BASE_API}/voucher-service/api/vouchers/game-statistics`, {
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
        // const playTurnTodayData = [
        //     { game: "quiz", plays: 4, fill: "hsl(var(--chart-1))" },
        //     { game: "shake", plays: 32, fill: "hsl(var(--chart-4))" },
        // ];

        // const playTurnThisWeekData = [
        //     { game: "quiz", plays: 75, fill: "hsl(var(--chart-1))" },
        //     { game: "shake", plays: 100, fill: "hsl(var(--chart-4))" },
        // ];

        // const playTurnThisMonthData = [
        //     { game: "quiz", plays: 275, fill: "hsl(var(--chart-1))" },
        //     { game: "shake", plays: 500, fill: "hsl(var(--chart-4))" },
        // ];
    } catch (error: any) {
        // throw error;
        return [];
    }
};
