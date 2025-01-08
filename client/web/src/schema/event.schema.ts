import { BrandType, GameType } from "@/schema/game.schema";
import z, { string } from "zod";

export const CreateVoucherRequestSchema = z.object({
    // image: z.any().default(null),
    total: z.coerce.number().min(1, {
        message: "The amount of vouchers must be at least 1",
    }),
    discount: z.coerce
        .number()
        .min(1, {
            message: "Value must be at least 1",
        })
        .max(100, {
            message: "Value must not exceed 100",
        }),
    // description: z.string().regex(/^\w+\s\w+/, { message: "Description is too short" }),
    // expiryDate: z.string({
    //     required_error: "Expiry date is required",
    // }),
});
// .superRefine(({ expiryDate }, ctx) => {
//     if (new Date(expiryDate) < new Date()) {
//         ctx.addIssue({
//             code: "custom",
//             message: "Expiry date must be in the future",
//             path: ["expiryDate"],
//         });
//     }
// });
export type VoucherRequest = z.infer<typeof CreateVoucherRequestSchema>;
export type VoucherAmount = VoucherRequest;

export type CreateVoucherRequestDTO = VoucherRequest & {
    amount: number;
};

export const UpdateVoucherRequestSchema = z.object({
    // image: z.any().default(null),
    discount: z.coerce
        .number()
        .min(1, {
            message: "Value must be at least 1",
        })
        .max(100, {
            message: "Value must not exceed 100",
        }),
    // description: z.string().regex(/^\w+\s\w+/, { message: "Description is too short" }),
    // expiryDate: z.string({
    //     required_error: "Expiry date is required",
    // }),
    total: z.coerce
        .number({ required_error: "The amount of vouchers is required" })
        .min(1, { message: "The amount of vouchers must be at least 1" }),
});
// .superRefine(({ expiryDate }, ctx) => {
//     if (new Date(expiryDate) < new Date()) {
//         ctx.addIssue({
//             code: "custom",
//             message: "Expiry date must be in the future",
//             path: ["expiryDate"],
//         });
//     }
// });
export type UpdateVoucherRequestDTO = z.infer<typeof UpdateVoucherRequestSchema>;

export type VoucherType = z.infer<typeof CreateVoucherRequestSchema> & {
    code: string;
    qrCode: string;
    status: boolean;
};

export type VoucherEventType = {
    amount: number;
    voucher: {
        code: string;
        qrCode: string;
        image: string;
        value: number;
        description: string;
        expiryDate: string;
        status: boolean;
    };
};

export type VoucherEventItemType = {
    id: string;
    discount: number;
    total: number;
    remaining: number;
};
export type GameQuizItemType = {
    gameId: string;
    popUpItemsEnabled: boolean;
    quizzCollectionId: string | null;
};

export type CollectionItemType = {
    imageId: string;
    image: string;
    numberPieces: number;
};

export type EventGameType = {
    id: string;
    name: string;
    description: string;
    imageId: string;
    image: string;
    status: string;
    comment: string | null;
    createdAt: string;
    startTime: string;
    endTime: string;
    brandId: string;
    brand: BrandType | null;
    voucherTypes: VoucherEventItemType[];
    totalVouchers: number;
    totalPublishedVouchers: number;
    games: GameQuizItemType[];
    item: CollectionItemType | null;
};

export type EventGameListType = {
    page: number;
    perPage: number;
    total: number;
    totalPage: number;
    data: EventGameType[];
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

export const UpdateEventRequestSchema = z
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
        totalVoucher: z.array(
            z.object({
                code: z.string(),
                qrCode: z.string(),
                image: z.string(),
                value: z.number(),
                description: z.string(),
                expiryDate: z.string(),
                status: z.boolean(),
            })
        ),
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

export type UpdateEventRequestDTO = z.infer<typeof UpdateEventRequestSchema>;

export const SubscriptionRequestSchema = z.object({
    name: z
        .string({
            required_error: "Invalid name",
        })
        .trim()
        .min(2, {
            message: "Name is invalid",
        })
        .max(200, {
            message: "Name must not exceed 200 characters",
        })
        .regex(/\w+\s\w+/, { message: "Name is too short" }),
    phoneNumber: z.string().regex(/^\d{10}$/, { message: "Phone number is invalid" }),
    domain: z.string({
        required_error: "Domain is required",
    }),
    address: z.string({
        required_error: "Address is required",
    }),
    location: z.array(z.number(), { required_error: "Location is required" }).length(2, {
        message: "Location is required",
    }),
});

export type SubscriptionRequestDTO = z.infer<typeof SubscriptionRequestSchema>;
export type SubscriptionType = Omit<SubscriptionRequestDTO, "areaId"> & {
    id: string;
    area: { id: string; name: string };
};

export const UpdateSubscriptionRequestSchema = z.object({
    id: z
        .string({
            required_error: "Invalid subscription!",
        })
        .nonempty(),
    name: z
        .string({
            required_error: "Invalid name",
        })
        .trim()
        .min(2, {
            message: "Name is invalid",
        })
        .max(200, {
            message: "Name must not exceed 200 characters",
        })
        .regex(/\w+\s\w+/, { message: "Name is too short" }),
    domain: z.string({
        required_error: "Domain is required",
    }),
    phoneNumber: z.string().regex(/^\d{10}$/, { message: "Phone number is invalid" }),
    address: z.string({
        required_error: "Address is required",
    }),
    location: z.array(z.number(), { required_error: "Location is required" }).length(2, {
        message: "Location is required",
    }),
});

export type UpdateSubscriptionRequestDTO = z.infer<typeof UpdateSubscriptionRequestSchema>;

export type SubscriptionEventType = Omit<SubscriptionType, "location"> & {
    latitude: number;
    longitude: number;
};
