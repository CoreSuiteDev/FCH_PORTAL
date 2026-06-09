import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { emailOTP } from "better-auth/plugins"
import { prisma } from "../infrastructure/database/prisma.js"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  user: {
    additionalFields: {
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
      },
    },
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword({ user, url, token }) {
      console.log(`[Reset Password] Link generated for ${user.email}: ${url} (Token: ${token})`);
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "placeholder-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder-google-client-secret",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "placeholder-github-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "placeholder-github-client-secret",
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log(`[OTP] Sent to ${email}: Code is ${otp} (Type: ${type})`);
      },
    }),
  ],
})

