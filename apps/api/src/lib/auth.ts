import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { emailOTP } from "better-auth/plugins"
import { prisma } from "../infrastructure/database/prisma.js"
import config from "../utils/config.js"

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
  secret: config.betterAuth.secret,
  baseURL: config.betterAuth.url,
  trustedOrigins: config.betterAuth.trustedOrigins,
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 300, // 5 minutes cache
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword({ user, url, token }) {
      console.log(`[Reset Password] Link generated for ${user.email}: ${url} (Token: ${token})`);
    },
  },
  socialProviders: {
    google: {
      clientId: config.betterAuth.google.clientId || "placeholder-google-client-id",
      clientSecret: config.betterAuth.google.clientSecret || "placeholder-google-client-secret",
    },
    github: {
      clientId: config.betterAuth.github.clientId || "placeholder-github-client-id",
      clientSecret: config.betterAuth.github.clientSecret || "placeholder-github-client-secret",
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

