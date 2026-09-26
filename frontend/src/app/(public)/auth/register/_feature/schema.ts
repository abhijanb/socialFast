import z from "zod"

export const registerSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(8),
    email: z.email()
})
export type registerType = z.infer<typeof registerSchema>
