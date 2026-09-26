import z from "zod"

// Keep in sync with backend: backend/src/post/router.py
// MAX_IMAGE_BYTES = 5MB, extensions .jpg/.jpeg/.png/.webp
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
] as const;

export const createPostSchema = z.object({
    text: z.string().trim().min(1, "Text is required").max(255, "Text must be at most 255 characters"),
    // Empty string from the input should behave like "no title" (backend default is None).
    title: z.string().trim().max(255, "Title must be at most 255 characters").optional().or(z.literal("")),
    image: z
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
export type CreatePostInput = z.infer<typeof createPostSchema>;

// Backwards-compatible aliases (existing hook imports these names).
export const postSchema = createPostSchema;
export type postType = CreatePostInput;
