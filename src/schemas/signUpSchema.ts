import { z } from "zod";

export const nameValidation = z
  .string()
  .min(3, { message: "Name must be at least 3 characters" })
  .max(20, { message: "Name must be at most 20 characters" })
  .regex(/^[a-zA-Z\s]+$/, {
    message: "Name must only contain letters and spaces",
  });

export const emailValidation = z
  .string()
  .email({ message: "Invalid email address" })
  .min(3, { message: "Email must be at least 3 characters" })
  .max(50, { message: "Email must be at most 50 characters" });

export const passwordValidation = z
  .string()
  .min(8, { message: "Password must be at least 8 characters" })
  .max(20, { message: "Password must be at most 20 characters" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    }
  );

export const signUpSchema = z.object({
  username: nameValidation,
  email: emailValidation,
  password: passwordValidation,
});
