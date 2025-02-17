import { z } from "zod";

export const teacherValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(64, { message: "Name must be at most 64 characters long" }),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, {
    message:
      "Invalid phone number. Please enter a phone number with only digits and an optional leading '+', containing between 7 and 15 digits.",
  }),
});

export const studentValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(64, { message: "Name must be at most 64 characters long" }),
  email: z.union([z.literal(""), z.string().email()]),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, {
    message:
      "Invalid phone number. Please enter a phone number with only digits and an optional leading '+', containing between 7 and 15 digits.",
  }),
  address: z.string(),
});

export const parentValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(64, { message: "Name must be at most 64 characters long" }),
  email: z.union([z.literal(""), z.string().email()]),
  phone: z.string().regex(/^\+?[0-9]{7,15}$/, {
    message:
      "Invalid phone number. Please enter a phone number with only digits and an optional leading '+', containing between 7 and 15 digits.",
  }),
  address: z.string(),
});
