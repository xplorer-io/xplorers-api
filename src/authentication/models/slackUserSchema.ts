import z from "zod";

export const slackUserQuerySchema = z.object({
    userId: z.string().optional(),
    email: z.string().email().optional(),
    userName: z.string().optional(),
});
