import { z } from "zod";

export type BrandType = {
    id: number | null;
    brandName: string | null;
    lat: number | null;
    long: number | null;
    address: string | null;
    domain: string | null;
};

export type Customer = {
    id: string;
    name: string;
    email: string;
    image_url: string;
};

export const UpdateGameRequestSchema = z
    .object({
        name: z
            .string({
                required_error: "Invalid full name",
            })
            .trim()
            .min(2, {
                message: "Full name is invalid",
            })
            .max(70, {
                message: "Full name must not exceed 70 characters",
            })
            .regex(/\w+\s\w+/, { message: "Full name must be at least first name and last name" }),
        // type: z.string(),
        // allowTrading: z.boolean(),
        description: z
            .string()
            .trim()
            .min(10, {
                message: "Guide is too short",
            })
            .max(2000, {
                message: "Guide must not exceed 2000 characters",
            }),
        imageId: z.string({
            required_error: "Image is required",
        }),
    })
    .strict();
export type UpdateGameRequestDTO = z.infer<typeof UpdateGameRequestSchema>;

export type GameType = {
    id: string;
    name: string;
    image: string;
    imageId: string;
    type: string;
    description: string;
};

export type VoucherType = {
    code: string;
    qrCode: string;
    image: string;
    value: number;
    description: string;
    expiryDate: string;
    status: boolean;
};

export type QuizListType = {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
    data: QuizQuestionType[];
};

export type QuizType = {
    id: string;
    brandId: string;
    name: string;
    description: string;
};

export type QuestionOptionType = {
    id: string;
    content: string;
    isCorrect: boolean;
};

export type QuestionType = {
    id: string;
    content: string;
    options: QuestionOptionType[];
};

export type QuizQuestionType = QuizType & {
    questions: QuestionType[];
};

export type GameAndQuizListType = {
    games: GameType[] | null;
    quizzes: QuizQuestionType[] | null;
};

export const CreateQuizRequestSchema = z.object({
    name: z
        .string({
            required_error: "Invalid name",
        })
        .trim()
        .min(10, {
            message: "Name is too short",
        })
        .max(200, {
            message: "Name must not exceed 200 characters",
        })
        .regex(/\w+\s\w+/, { message: "Name is too short" }),
    description: z
        .string({
            required_error: "Description is required",
        })
        .trim()
        .min(10, {
            message: "Description is too short",
        })
        .max(2000, {
            message: "Description must not exceed 2000 characters",
        })
        .regex(/^\w+\s\w+\s\w+/, { message: "Description is too short" }),
});

export type CreateQuizRequestDTO = z.infer<typeof CreateQuizRequestSchema>;

export const UpdateQuizRequestSchema = CreateQuizRequestSchema.extend({
    quizId: z.string({
        required_error: "Invalid quiz id",
    }),
});

export type UpdateQuizRequestDTO = z.infer<typeof UpdateQuizRequestSchema>;

export const CreateQuestionRequestSchema = z.object({
    content: z.string().regex(/^\w+\s\w+/, { message: "Content is too short" }),
    options: z.array(
        z.object({
            content: z.string().regex(/^\w+\s\w+/, { message: "Content is too short" }),
            isCorrect: z.boolean(),
        })
    ),
});

export type CreateQuestionRequestDTO = z.infer<typeof CreateQuestionRequestSchema>;

export type UpdateQuestionRequestDTO = CreateQuestionRequestDTO;

export type CreateQuizResponseDTO = {
    quizId: string;
};
