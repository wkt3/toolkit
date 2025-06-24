import { type DefaultSession } from "next-auth";

export type AdapterUser = DefaultSession["user"] & {
  role: "ADMIN" | "USER";
  id: string | undefined;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: AdapterUser &
      User & {
        role: "ADMIN" | "USER";
        id: string | undefined;
        isTwoFactorEnabled: boolean;
        isOAuth: boolean;
      };
  }
}

//add fields here to fetch on server frontend ui


