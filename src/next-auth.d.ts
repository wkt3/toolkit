import { type DefaultSession } from "next-auth";

export type AdapterUser = DefaultSession["user"] & {
  role: "ADMIN" | "USER" | "SUPERADMIN" | "GUEST" | "MANAGER" | "INCHARGE";
  id: string | undefined;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: AdapterUser &
      User & {
        role: "ADMIN" | "USER" | "SUPERADMIN"| "GUEST" | "MANAGER" | "INCHARGE";
        email: string | null;
        name: string | null;
        id: string | undefined;
        isTwoFactorEnabled: boolean;
        isOAuth: boolean;
      };
  }
}

//add fields here to fetch on server frontend ui

declare module "next-auth/jwt" {
  interface JWT {
    sub: string;
    role: "ADMIN" | "USER" | "SUPERADMIN" | "GUEST";
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
    name: string | null;
    email: string | null;
  }
}