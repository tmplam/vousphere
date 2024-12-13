import z from "zod";

export const UserSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(4).max(256),
    username: z.string().min(4).max(256),
    email: z.string().email(),
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

export const ProductSchema = z.object({
    id: z.number(),
    name: z.string(),
    price: z.number(),
    description: z.string(),
    image: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
