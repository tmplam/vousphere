import z from "zod";

export const RegisterRequestSchema = z
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
        email: z.string().email(),
        password: z
            .string({
                required_error: "Invalid password",
            })
            .min(6, {
                message: "Password must be at least 6 characters",
            })
            .max(30, {
                message: "Password must not exceed 30 characters",
            }),
        // .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, {
        //     message:
        //         "Password must contain one first uppercase letter, at least one number and one special character",
        // })
        confirmPassword: z.string().min(6).max(100),
    })
    .strict()
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["confirmPassword"],
            });
        }
    });

export type RegisterRequestDTO = z.infer<typeof RegisterRequestSchema>;

export const RegisterResponseSchema = z.object({
    data: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
        user: z.object({
            id: z.string().uuid(),
            name: z.string(),
            username: z.string(),
            phone: z.string(),
            email: z.string(),
            roles: z.array(
                z.object({
                    id: z.number(),
                    name: z.string(),
                    description: z.string(),
                })
            ),
            status: z.boolean(),
        }),
    }),
    message: z.string(),
});

export type RegisterResponseDTO = z.infer<typeof RegisterResponseSchema>;

export const LoginRequestSchema = z
    .object({
        email: z.string().email(),
        password: z
            .string({
                required_error: "Invalid password",
            })
            .min(6, {
                message: "Password must be at least 6 characters",
            })
            .max(30, {
                message: "Password must not exceed 30 characters",
            }),
        // .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, {
        //     message:
        //         "Password must contain one first uppercase letter, at least one number and one special character",
        // }),
    })
    .strict();

export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;

export const LoginResponseSchema = RegisterResponseSchema;

export type LoginResponseDTO = z.infer<typeof LoginResponseSchema>;

export type UserType = LoginResponseDTO["data"]["user"];
