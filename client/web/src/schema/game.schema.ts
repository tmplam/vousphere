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
        type: z.string(),
        allowTrading: z.boolean(),
        guide: z
            .string()
            .trim()
            .min(10, {
                message: "Guide is too short",
            })
            .max(2000, {
                message: "Guide must not exceed 2000 characters",
            }),
    })
    .strict();
export type UpdateGameRequestDTO = z.infer<typeof UpdateGameRequestSchema>;

export type GameType = {
    id: string;
    name: string;
    type: string;
    image: string;
    allowTrading: boolean;
    guide: string;
};

export type EventGameType = {
    id: number;
    name: string;
    image: string;
    voucherCount: number;
    startTime: string;
    endTime: string;
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
