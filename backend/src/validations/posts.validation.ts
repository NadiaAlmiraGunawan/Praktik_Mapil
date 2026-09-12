import {z} from "zod";

export const CreatePostSchema = z.object({
    userId : z.coerce.number().int().positive(),

    title: z
        .string()
        .min(3, "title minimal 3 karakter")
        .max(225, "title maximal 225 karakter"),

    content: z
        .string()
        .min(7, "content minimal 7 karakter"),
});