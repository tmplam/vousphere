import { ErrorResponse, SuccessResponse } from "@/schema/http.schema";
import {
    LoginRequestDTO,
    LoginResponseDTO,
    RegisterRequestDTO,
    RegisterResponseDTO,
    ReSendOTPRequestDTO,
    ReSentOTPResponseDTO,
    SendOTPRequestDTO,
    SentOTPResponseDTO,
} from "@/schema/auth.schema";
import { UserListType, UserType } from "@/schema/user.schema";
import axios from "axios";
import { BASE_API } from "@/apis/constants";

export const callRegisterRequest = async (
    payload: RegisterRequestDTO
): Promise<RegisterResponseDTO | ErrorResponse> => {
    try {
        const result = (await axios.post(`${BASE_API}/user-service/api/users/sign-up`, payload)).data;
        console.log(result);
        return result as RegisterResponseDTO;
    } catch (error: any) {
        return error.response.data as ErrorResponse;
    }
};

export const callLoginRequest = async (values: LoginRequestDTO): Promise<LoginResponseDTO | ErrorResponse> => {
    try {
        const result = (await axios.post(`${BASE_API}/user-service/api/users/sign-in`, values)).data;
        console.log(result);
        return result as LoginResponseDTO;
    } catch (error: any) {
        return error.response.data as ErrorResponse;
    }
};

export const callSendOTPRequest = async (values: SendOTPRequestDTO): Promise<SentOTPResponseDTO | ErrorResponse> => {
    try {
        const result = (await axios.patch(`${BASE_API}/user-service/api/users/verify-email`, values)).data;
        console.log(result);
        return result as SentOTPResponseDTO;
    } catch (error: any) {
        return error.response.data as ErrorResponse;
    }
};

export const callReSendOTPRequest = async (
    values: ReSendOTPRequestDTO
): Promise<ReSentOTPResponseDTO | ErrorResponse> => {
    try {
        const result = await axios.post(`${BASE_API}/user-service/api/users/resend-otp`, values);
        console.log(result);
        return { data: result.data, statusCode: result.status } as ReSentOTPResponseDTO;
    } catch (error: any) {
        return error.response.data as ErrorResponse;
    }
};

export const getUserInfo = async (): Promise<UserType | null> => {
    try {
        const result = (
            await axios.get(`${BASE_API}/user-service/api/users/profile`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<UserType>;
        return result.data;
    } catch (error: any) {
        return null;
    }
};

export async function getUserList(
    currentPage: number,
    perPage: number,
    keyword?: string,
    role?: string
): Promise<UserListType | null> {
    try {
        const params = new URLSearchParams({
            page: currentPage.toString(),
            perPage: perPage.toString(),
        });
        if (keyword) params.set("keyword", keyword);
        if (role) params.set("role", role.charAt(0).toUpperCase() + role.slice(1));
        const result = (
            await axios.get(`${BASE_API}/user-service/api/users?${params.toString()}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<UserListType>;
        return result.data as UserListType;
    } catch (error) {
        return null;
    }
}

export async function toggleBlockUser(userId: string): Promise<SuccessResponse<any> | ErrorResponse> {
    try {
        const result = (
            await axios.patch(`${BASE_API}/user-service/api/users/${userId}/toggle-block`, null, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<any>;
        return result;
    } catch (error: any) {
        return error.response.data as ErrorResponse;
    }
}

export async function getUserById(id: string): Promise<UserType | null> {
    try {
        const result = (
            await axios.get(`${BASE_API}/user-service/api/users/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<UserType>;
        return result.data;
    } catch (error: any) {
        return null;
    }
}
