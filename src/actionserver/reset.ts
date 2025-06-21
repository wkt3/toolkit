"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/nodemailer";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Email" };
  }
  // destructure data from validated fields
  const { email } = validatedFields.data;
  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not Found" };
  }

  //TODO:GENERATE TOKEN and send email
  const passwordResetToken = await generatePasswordResetToken(email);
  //note parameters should always bs first pReToken(email) and after pReToken(token)
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Password Reset Email Sent!!" };
};
