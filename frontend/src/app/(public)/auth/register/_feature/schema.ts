import z from "zod"

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

export const registerSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
    email: z.email(),
    avatar: z
        .custom<FileList>()
        .optional()
        .refine((files) => {
            if (!files || files.length === 0) return true;
            const file = files[0];
            return file.size <= MAX_IMAGE_BYTES;
        }, "Image must be smaller than 5MB")
        .refine((files) => {
            if (!files || files.length === 0) return true;
            const file = files[0];
            return (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(file.type);
        }, "Image must be JPEG, PNG or WebP"),
})
export type registerType = z.infer<typeof registerSchema>
