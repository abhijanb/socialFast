import z from "zod"

export const postSchema = z.object({
    text: z.string().min(1, "Text is required").max(255, "Text must be at most 255 characters"),
    title: z.string().max(255, "Title must be at most 255 characters").optional(),
    image: z.custom<FileList>().optional(),
})
export type postType = z.infer<typeof postSchema>
