import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { getUserByEmail } from "./data/user";
import bcrypt from "bcryptjs";
import { authLoginSliceSchema } from "./store/slices/authLoginSliceSchema";


export default {
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = authLoginSliceSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          // here user wants login without password as oauth github,google that
          //users are handled by 3 party
          if (!user || !user.password) return null;
          //user registered on our platform password will be compared to grant access his Profile
          const passwordsMatch = await bcrypt.compare(
            //1st user entered password then matched with hashed password stored in db while creating user Account
            password,
            user.password
          );
          //password match grant access to user account
          if (passwordsMatch) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
