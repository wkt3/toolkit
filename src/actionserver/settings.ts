"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/nodemailer";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser();

  if (!user) {
    return { error: "UnAuthorized" };
  }
  const dbUser = await getUserById(user.id);
  if (!dbUser) {
    return { error: "UnAuthorized" };
  }
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword =undefined;
    values.isTwoFactorEnabled = undefined;
  }
  //if user wants to update email with its another email that registered with us with some 
  //other provider we will not allow them to update r link accounts with already existing email
  if (values.email && values.email !== user.email) {
    const exisitingUser = await getUserByEmail(values.email);

    if (exisitingUser && exisitingUser.id !== user.id) {
      return { error: "Email Already Used!" };
    }
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Verification Email Sent!" };
  }
  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordMatch) {
      return { error: "Incorrect Password!" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }
  await db.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  });

  return { success: "Settings Updated" };
};
