import { z } from "zod";

// userId SENGAJA tidak ada di sini. userId harus diambil dari req.user (token JWT),
// bukan dari body request client — kalau dari body, orang lain bisa
// "menempel" artikel jadi milik user lain.
export const CreatePostSchema = z.object({
  categoryId: z.coerce.number().int().positive().optional(),

  title: z
    .string()
    .min(3, "title minimal 3 karakter")
    .max(225, "title maximal 225 karakter"),

  content: z.string().min(7, "content minimal 7 karakter"),
});

// Untuk edit artikel, semua field boleh dikirim sebagian saja (partial update)
export const UpdatePostSchema = CreatePostSchema.partial();