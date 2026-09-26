import z from "zod";

const envSchema = z.object({
  API_URL: z
    .string("NEXT_PUBLIC_API_URL is missing. Add it to frontend/.env.local")
    .min(1, "NEXT_PUBLIC_API_URL is missing. Add it to frontend/.env.local")
    .refine(
      (v) => {
        try {
          new URL(v);
          return true;
        } catch {
          return false;
        }
      },
      {
        message:
          "NEXT_PUBLIC_API_URL must be a valid URL, e.g. http://localhost:8000",
      },
    ),
});

export const env = envSchema.parse({
  API_URL: process.env.NEXT_PUBLIC_API_URL,
});

export type Env = z.infer<typeof envSchema>;
