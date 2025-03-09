import { z } from "zod";
import { passwordValidation } from "./signUpSchema";

export const signInSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: passwordValidation,
});
