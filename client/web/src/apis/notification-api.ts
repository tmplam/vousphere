import axios, { AxiosResponse } from "axios";
import { BASE_API } from "./constants";

/* Khiem workspace - Call notification apis */

export async function demoCallARequest(id: string): Promise<AxiosResponse<any>> {
    try {
        const result = await axios.get(`${BASE_API}/notification-service/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error;
    }
}
