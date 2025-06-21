import { v4 as uuidV4 } from "uuid";
import { getVerificationTokenByEmail } from "./verification.token";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/passwordResetToken";
import crypto from "crypto";
import { getTwoFactorTokenByEmail } from "@/data/twoFactorToken";

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
//TODO:Later time changed to 5 minutes
  const expires = new Date(new Date().getTime() + 5 *60* 1000);
  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db.twoFactorToken.delete({
      where: { id: existingToken.id },
    });
  }
  const twoFactorToken = await db.twoFactorToken.create({
    //here token is 6 digits code generated
    data: {
      email,
      token,
      expires,
    },
  });
  return twoFactorToken;
};

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidV4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await db.passwordResetToken.delete({
      where: { id: existingToken.id },
    });
  }
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidV4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
  return verificationToken;
};
