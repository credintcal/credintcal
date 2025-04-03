import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      isVerified?: boolean;
      discountEligible?: boolean;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    isVerified: boolean;
    discountEligible: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    isVerified?: boolean;
    discountEligible?: boolean;
  }
} 