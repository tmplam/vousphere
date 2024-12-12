import { ErrorResponse, SuccessResponse } from "@/schema/http.schema";
import { LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO, RegisterResponseDTO } from "@/schema/auth.schema";
import { UserType } from "@/schema/user.schema";
import axios from "axios";
const BASE_API = process.env.NEXT_PUBLIC_API_ENDPOINT;

export const getUserById = async (): Promise<UserType | null> => {
    try {
        const userId = localStorage.getItem("userId");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        if (!accessToken || !refreshToken || !userId) return null;
        const result = await axios.get(`${BASE_API}/user/info/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        const successResponse = result.data as SuccessResponse<UserType>;
        return successResponse.data as UserType;
    } catch (error: any) {
        // throw error;
        return null;
    }
};

export const callRegisterRequest = async (payload: RegisterRequestDTO): Promise<SuccessResponse<any>> => {
    try {
        // return (await axios.post(`${BASE_API}/auth/register`, payload));
        return {
            statusCode: 200,
            message: "Success",
            data: null,
            others: null,
        };
    } catch (error: any) {
        throw error;
    }
};

export const callLoginRequest = async (values: LoginRequestDTO): Promise<LoginResponseDTO> => {
    try {
        // const result = (await axios.post(`${BASE_API}/auth/login`, values)).data;
        // return result as LoginResponseDTO;
        return {
            message: "Success",
            data: {
                accessToken: "accessToken",
                refreshToken: "refreshToken",
                user: {
                    id: "AEESX-UUID", // UUID
                    name: "name",
                    username: "adminAccount",
                    phone: "phone",
                    email: "admin@gmail.com",
                    roles: [
                        {
                            id: 1,
                            name: values.email === "admin@gmail.com" ? "admin" : "counterpart",
                            description: "admin",
                        },
                    ],
                    status: true,
                },
            },
        };
    } catch (error: any) {
        throw error;
    }
};
