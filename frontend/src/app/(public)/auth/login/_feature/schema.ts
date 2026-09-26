import z from "zod"

export const loginSchema = z.object({
    password: z.string().min(8),
    email: z.email()
})
export type loginType = z.infer<typeof loginSchema>
