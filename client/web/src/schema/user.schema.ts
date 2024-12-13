import z from "zod";

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(4).max(256),
    username: z.string().min(4).max(256),
    email: z.string().email(),
    phone: z.string().regex(/^\d{10}$/, { message: "Phone number is invalid" }),
    roles: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
        })
    ),
    image: z.string().url().nullable(),
    status: z.boolean().default(true),
});

export type UserType = z.TypeOf<typeof UserSchema>;

export const CreateUserRequestSchema = z
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
        phone: z.string().regex(/^\d{10}$/, { message: "Phone number is invalid" }),
        // username: z.string().min(6).max(30),
        roleId: z.string().regex(/^\d+$/, { message: "Invalid role" }),
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
        // confirmPassword: z.string().min(6).max(100),
    })
    .strict();
export type CreateUserRequestDTO = z.infer<typeof CreateUserRequestSchema>;
