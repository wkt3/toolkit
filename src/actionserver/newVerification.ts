"use server";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/lib/verification.token";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    //means we cannot verify your account
    return { error: "Token Does Not Exists" };
  }
  //check if token expires means user clicked link in his email after token validity expiry time
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token Expired!!" };
  }
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not Exits" };
  }
  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });
  await db.verificationToken.delete({
    where:{id : existingToken.id}
  })
  return {success:"Email Verified Successfully"}
};
