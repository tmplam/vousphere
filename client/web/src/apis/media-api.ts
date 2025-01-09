import { BASE_API } from "@/apis/constants";
import { SuccessResponse } from "@/schema/http.schema";
import { ImageType } from "@/schema/types/common";
import axios from "axios";

export async function callUploadImage(payload: File): Promise<SuccessResponse<ImageType> | null> {
    try {
        const body = {
            file: payload,
        };
        const result = (
            await axios.post(`${BASE_API}/media-service/api/medias/upload-image`, body, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "multipart/form-data",
                },
            })
        ).data as SuccessResponse<ImageType>;
        return result;
    } catch (error: any) {
        return null;
    }
}
