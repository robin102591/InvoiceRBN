import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Nodemailer from "next-auth/providers/nodemailer";
import prisma from "@/app/utils/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Nodemailer({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  pages: {
    verifyRequest: "/verify"
  }
});
