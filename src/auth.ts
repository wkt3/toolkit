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
    async signOut(event) {
      const token = "token" in event ? event.token : undefined;
      if (token?.sub) {
        await db.user.update({
          where: { id: token.sub },
          data: { online: false },
        });
      }
    },
  },
  callbacks: {
    authorized: ({ auth }) => auth?.user?.role === "SUPERADMIN",
    async signIn({ user, account }) {
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

      // Ensure user.id is defined
      if (!user.id) return false;

      const ip = "unknown"; // Could be replaced with actual IP if available in context
      const ua = "unknown"; // Could be replaced with actual UA if available in context

      await db.loginLog.create({
        data: {
          userId: user.id,
          ipAddress: ip,
          userAgent: ua,
          location: "Detect via IP API LATER",
          browser: ua,
          os: ua, // Detect via user-agent parser LATER
          device: ua, // Detect via user-agent parser LATER,
          loggedInAt: new Date(now()),
          loggedOutAt: null,
          action: "LOGIN",
          status: "SUCCESS",
          timestamp: new Date(now()),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          browserVersion: ua, // Detect via user-agent parser LATER
          createdAt: new Date(now()),
        },
      });
      await db.user.update({
        where: { id: user.id },
        data: {
          loginCount: { increment: 1 },
          currentLogin: new Date(now()),
          provider: account?.provider || "credentials",
        },
      });
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
      }
      if (token?.sub) {
        await db.user.update({
          where: { id: token.sub },
          data: { online: true },
        });
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
