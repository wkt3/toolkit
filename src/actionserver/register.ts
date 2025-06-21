"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/nodemailer";
import { authRegisterSliceSchema } from "@/store/slices/authRegisterSliceSchema";

export const register = async (
  values: z.infer<typeof authRegisterSliceSchema>
) => {
  const validatedFields = authRegisterSliceSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }
  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email Already Taken" };
  }
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  // TODO:send verification token email
  //here lib/token generate here
  const verificationToken = await generateVerificationToken(email);
  //after generating token we recieve email token from sendVerificationEmail
  //note first parameter should be email n then token
  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return { success: "Confirmation Email Sent!!" };
};
