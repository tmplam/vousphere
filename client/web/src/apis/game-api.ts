import { BASE_API } from "@/apis/constants";
import {
    CreateQuestionRequestDTO,
    CreateQuizRequestDTO,
    CreateQuizResponseDTO,
    GameAndQuizListType,
    GameType,
    QuizQuestionType,
    QuizType,
    UpdateGameRequestDTO,
    UpdateQuestionRequestDTO,
    UpdateQuizRequestDTO,
} from "@/schema/game.schema";
import { SuccessResponse } from "@/schema/http.schema";
import { PaginationV2Type } from "@/schema/types/common";
import axios, { AxiosResponse } from "axios";

export async function getAllGames(): Promise<GameType[] | null> {
    try {
        const result = (
            await axios.get(`${BASE_API}/game-service/api/games`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<any>;
        return result.data.games as GameType[];
    } catch (error: any) {
        return null;
    }
}

export async function getGameById(id: string): Promise<GameType> {
    try {
        const result = (
            await axios.get(`${BASE_API}/game-service/api/games/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<GameType>;
        return result.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export async function getAllQuizzes(
    page: number = 1,
    perPage: number = 10,
    includeQuestions: boolean = false
): Promise<PaginationV2Type<QuizQuestionType> | null> {
    try {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("perPage", perPage.toString());
        params.append("includeQuestions", includeQuestions.toString());
        const result = (
            await axios.get(`${BASE_API}/game-service/api/quizzes?${params.toString()}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<PaginationV2Type<QuizQuestionType>>;
        return result.data;
    } catch (error: any) {
        return null;
    }
}

export async function getQuizById(id: string): Promise<QuizQuestionType | null> {
    try {
        const result = (
            await axios.get(`${BASE_API}/game-service/api/quizzes/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<QuizQuestionType>;
        return result.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export async function getQuizQuestionById(id: string): Promise<QuizQuestionType | null> {
    try {
        const result = (
            await axios.get(`${BASE_API}/game-service/api/quizzes/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<QuizQuestionType>;
        return result.data;
    } catch (error: any) {
        return error.response.data;
    }
}

export async function callCreateQuizRequest(
    values: CreateQuizRequestDTO
): Promise<SuccessResponse<CreateQuizResponseDTO>> {
    try {
        const result = (
            await axios.post(`${BASE_API}/game-service/api/quizzes`, values, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<any>;
        return result;
    } catch (error: any) {
        return error.response.data;
    }
}

export async function callUpdateQuizRequest(
    values: UpdateQuizRequestDTO
): Promise<SuccessResponse<CreateQuizResponseDTO>> {
    try {
        const result = (
            await axios.patch(`${BASE_API}/game-service/api/quizzes/${values.quizId}`, values, {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            })
        ).data as SuccessResponse<any>;
        return result;
    } catch (error: any) {
        return error.response.data;
    }
}

export async function callCreateQuizQuestionRequest(
    quizId: string,
    values: CreateQuestionRequestDTO
): Promise<AxiosResponse<any, any>> {
    try {
        const result = await axios.post(`${BASE_API}/game-service/api/quizzes/${quizId}/questions`, values, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error;
    }
}

export async function callUpdateQuizQuestionRequest(
    quizId: string,
    quizQuesionId: string,
    values: UpdateQuestionRequestDTO
): Promise<AxiosResponse<any, any>> {
    try {
        const result = await axios.put(
            `${BASE_API}/game-service/api/quizzes/${quizId}/questions/${quizQuesionId}`,
            values,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
            }
        );
        return result;
    } catch (error: any) {
        return error;
    }
}

export async function callDeleteQuizQuestionRequest(
    quizId: string,
    quizQuesionId: string
): Promise<AxiosResponse<any, any>> {
    try {
        const result = await axios.delete(`${BASE_API}/game-service/api/quizzes/${quizId}/questions/${quizQuesionId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error;
    }
}

export async function callDeleteQuizRequest(quizId: string): Promise<AxiosResponse<any, any>> {
    try {
        const result = await axios.delete(`${BASE_API}/game-service/api/quizzes/${quizId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error;
    }
}

export async function callUpdateGameRequest(
    id: string,
    values: UpdateGameRequestDTO
): Promise<AxiosResponse<any, any>> {
    try {
        const result = await axios.put(`${BASE_API}/game-service/api/games/${id}`, values, {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        return result;
    } catch (error: any) {
        return error.response.data;
    }
}

export async function getAllGamesAndQuizzes(): Promise<GameAndQuizListType | null> {
    try {
        const games = await getAllGames();
        const quizzesRes = await getAllQuizzes();
        const quizzes = quizzesRes ? quizzesRes.data : null;
        return { games, quizzes };
    } catch (error: any) {
        return null;
    }
}
