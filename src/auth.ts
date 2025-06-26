import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import { getUserById } from "./data/user";
import { getAccountByUserId } from "./data/account";
import { getTwoFactorConfirmationByUserId } from "./data/twoFactorConfirmation";
import authConfig from "./authConfig";
import { now } from "lodash";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    authorized: ({ auth }) => auth?.user?.role === "SUPERADMIN",
    async signIn({ user, account, req }) {
      // Allow signIn for superadmin
      if (req.auth?.user?.role === "SUPERADMIN") return true;
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      // Dynamically import ua-parser-js to avoid top-level import error
      const { default: UAParser } = await import("ua-parser-js");
      const ua = UAParser(req.headers["user-agent"] || "").getResult();
      // Log the sign-in attempt
      await db.loginLog.create({
        data: {
          userId: user?.id || "",
          ipAddress: ip as string,
          os: ua.os.name || "",
          browser: ua.browser.name || "",
          device: ua.device.type || "",
          status: "attempted",
          timestamp: new Date(now()),
          userAgentDetails: JSON.stringify({
            os: ua.os.name || "",
            browser: ua.browser.name || "",
            device: ua.device.type || "",
          }),
        },
      });
      await db.user.update({
        where: { id: user?.id as string },
        data: { emailVerified: new Date(), online: true },
      });
      // Log the successful sign-in
      await db.loginLog.create({
        data: {
          userId: user?.id || "",
          ipAddress: ip as string,
          os: ua.os.name || "",
          browser: ua.browser.name || "",
          device: ua.device.type || "",
          status: "success",
          timestamp: new Date(now()),
          userAgentDetails: JSON.stringify({
            os: ua.os.name || "",
            browser: ua.browser.name || "",
            device: ua.device.type || "",
          }),
        },
      });

      // If the user is signing in with OAuth, check if email verification is required
      // and if the user has verified their email.
      // If the user is signing in with credentials, allow sign-in without email verification.
      // Note: This is a security measure to prevent unauthorized access.
      //  Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const exisitingUser = await getUserById(user?.id as string);
      //Note:Prevent signIn without email verification
      if (!exisitingUser?.emailVerified) return false;

      if (exisitingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          exisitingUser.id
        );
        if (!twoFactorConfirmation) return false;
        // delete 2fa confirmation for next signin
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }
      return true;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOAuth = token.isOAuth;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const exisitingUser = await getUserById(token.sub);
      if (!exisitingUser) return token;

      const exisitingAccount = await getAccountByUserId(exisitingUser.id);
      token.isOAuth = !!exisitingAccount;
      token.name = exisitingUser.name;
      token.email = exisitingUser.email;
      token.role = exisitingUser.role;
      token.isTwoFactorEnabled = exisitingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
export type { AdapterUser } from "./next-auth.d";
