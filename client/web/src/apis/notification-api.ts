import axios, { AxiosResponse } from "axios";
import { BASE_API } from "./constants";

export async function demoCallARequest(id: string): Promise<AxiosResponse<any>> {
    try {
        const result = await axios.patch(`${BASE_API}/notification-service/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error;
    }
}
