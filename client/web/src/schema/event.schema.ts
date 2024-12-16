import z from "zod";

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

export const RegisterEventSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(5, {
                message: "Full name is invalid",
            })
            .max(70, {
                message: "Full name must not exceed 70 characters",
            }),
        image: z
            .any()
            .refine((file) => file instanceof File && file.size > 0, {
                message: "File is required",
            })
            .refine((file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type), {
                message: "Only .jpg, .png, .jpeg file is supported",
            }),
        voucherCount: z
            .number()
            .min(1, {
                message: "Voucher count must be at least 1",
            })
            .max(100, {
                message: "Voucher count must not exceed 100",
            }),
        startTime: z.string(),
        endTime: z.string(),
    })
    .strict()
    .superRefine(({ startTime, endTime }, ctx) => {
        if (!(startTime > endTime)) {
            ctx.addIssue({
                code: "custom",
                message: "End time must be after the start time",
                path: ["endTime"],
            });
        }
    });

export type RegisterEventDTO = z.infer<typeof RegisterEventSchema>;

export const SubscriptionRequestSchema = z.object({
    name: z
        .string({
            required_error: "Invalid name",
        })
        .trim()
        .min(2, {
            message: "Name is invalid",
        })
        .max(70, {
            message: "Name must not exceed 70 characters",
        })
        .regex(/\w+\s\w+/, { message: "Name is too short" }),
    area: z.string({
        required_error: "Area is required",
    }),
    address: z.string(),
    location: z.array(z.number(), { required_error: "Location is required" }).length(2, {
        message: "Location is required",
    }),
    status: z.boolean().default(true),
});

export type SubscriptionRequestDTO = z.infer<typeof SubscriptionRequestSchema>;
export type SubscriptionType = SubscriptionRequestDTO & { id: string };
