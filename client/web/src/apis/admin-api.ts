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
        await new Promise((resolve) => setTimeout(resolve, 4000));
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
