import { UserRole } from "@prisma/client";
import * as z from "zod";

export const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(1)),
    newPassword: z
      .string()
      .min(8, { message: "Must have at least 8 character eg:= Capital3*" })
      .regex(
        new RegExp(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        ),
        {
          message:
            "Minimum 8 Characters Required(1.lowerCase, 1.UpperCase, 1.Number, 1.Special-Character) for eg:- John_123*#",
        }
      ),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    {
      message: "New Password Required",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Password Required",
      path: ["password"],
    }
  );

export const NewPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Must have at least 1 character" })
    .regex(
      new RegExp(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
      ),
      {
        message:
          "Minimum 8 Characters Required(1.lowerCase, 1.UpperCase, 1.Number, 1.Special-Character) for eg:- John_123*#",
      }
    ),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email Required!",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email Required!",
  }),
  password: z.string().min(1, {
    message: "Password Required!",
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email Required!",
  }),
  name: z
    .string()
    .min(2, {
      message: "Minimum 2 Characters Required!",
    })
    .max(25, {
      message: "Maximum 25 characters allowed for name",
    }),
  password: z
    .string()
    .min(8, { message: "Must have at least 8 character eg:= Capital3*" })
    .regex(passwordValidation, {
      message:
        "Minimum 8 Characters Required(1.lowerCase, 1.UpperCase, 1.Number, 1.Special-Character) for eg:- John_123*#",
    }),
});

export const profileSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmNewPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });
