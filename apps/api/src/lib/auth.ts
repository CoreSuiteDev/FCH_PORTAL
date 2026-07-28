import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { emailOTP } from "better-auth/plugins"
import { prisma } from "../infrastructure/database/prisma.js"
import sendMail from "../infrastructure/email/email.js"
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
      passwordChangeRequired: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            const defaultRoleName = "USER"
            let role = await prisma.role.findUnique({
              where: { name: defaultRoleName },
            })
            if (!role) {
              role = await prisma.role.create({
                data: {
                  name: defaultRoleName,
                  description: "General User Role",
                },
              })
            }

            await prisma.userRole.create({
              data: {
                userId: user.id,
                roleId: role.id,
              },
            })
            console.log(`[Auth Hook] Assigned default role 'USER' to registered user: ${user.email}`)
          } catch (err) {
            console.error(`[Auth Hook] Error assigning default role to user: ${user.email}`, err)
          }
        },
      },
    },
  },
  secret: config.betterAuth.secret,
  baseURL: config.betterAuth.url,
  trustedOrigins: config.betterAuth.trustedOrigins,
  advanced: {
    crossSubDomainCookies: {
      enabled: process.env.NODE_ENV === "production",
      domain: process.env.NODE_ENV === "production" ? ".fch-catechesis.org" : undefined,
    },
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? ("none" as const) : ("lax" as const),
      secure: process.env.NODE_ENV === "production",
    },
  },
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
        
        let subject = "OTP Verification - FCH Portal";
        let text = `Your OTP verification code is: ${otp}.\n\nThis code will expire in 5 minutes.`;

        if (type === "forget-password") {
          subject = "Reset Your Password - FCH Portal";
          text = `You requested a password reset. Your OTP verification code is: ${otp}.\n\nThis code will expire in 5 minutes. If you did not request this, please ignore this email.`;
        } else if (type === "email-verification") {
          subject = "Verify Your Email - FCH Portal";
          text = `Thank you for signing up! Please verify your email address. Your OTP verification code is: ${otp}.\n\nThis code will expire in 5 minutes.`;
        } else if (type === "sign-in") {
          subject = "Sign In OTP - FCH Portal";
          text = `Your sign-in OTP verification code is: ${otp}.\n\nThis code will expire in 5 minutes.`;
        }

        try {
          await sendMail(email, subject, text);
          console.log(`[OTP] Email successfully sent to ${email}`);
        } catch (error) {
          console.error(`[OTP] Failed to send email to ${email}:`, error);
        }
      },
    }),
  ],
})

