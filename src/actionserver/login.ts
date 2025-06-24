"use server";
import * as z from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import {
  sendVerificationEmail,
  sendTwoFactorTokenEmail,
} from "@/lib/nodemailer";
import { authLoginSliceSchema } from './../store/slices/authLoginSliceSchema';
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation";
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken";
import bcrypt from "bcryptjs";

export const login = async (values: z.infer<typeof authLoginSliceSchema>) => {
  const validatedFields = authLoginSliceSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields" };
  }
  //destructure email,pass from validatedFields.data
  const { email, password, code } = validatedFields.data;
  //restrict user to login as verification token is sent to his email
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email Does Not Exsits" };
  }
  const isPasswordValid = await bcrypt.compare(password, existingUser?.password);
  if (!isPasswordValid) return {error:"Invalid Password"} // ⛔ Stop here if password is wrong

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    //have to use same sendVerficationEmail to login with link that is also configured in register too
    //after that you are not allowed to login with password as email link is resend again
    //note first parameter should be email n then token
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Re-Confirmation Email Sent!!" };
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      //TODO:VERIFY CODE
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: "2FA Code Invalid" };
      }
      if (twoFactorToken.token !== code) {
        return { error: "2FA is Not Correct" };
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if (hasExpired) {
        return { error: "2FA Code Expired" };
      }
      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }
  try {
    //user log in with email n pass provided creating account
    //if ok redirect using middleware default login to "/settings"
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    // Type guard to check if error has a 'code' property
    function hasCodeProperty(err: unknown): err is { code: string } {
      return typeof err === "object" && err !== null && "code" in err && typeof (err as any).code === "string";
    }

    if (error instanceof AuthError && hasCodeProperty(error)) {
      switch (error.code) {
        case "CredentialsSignin":
          return { error: "Invalid Credentails" };
        default:
          return { error: "Provide latest Reset Password 🧾🧾🧾!!" };
      }
    }
    throw error;
  }
};
