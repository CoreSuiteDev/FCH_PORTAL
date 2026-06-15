import { z } from "zod";
import { router, publicProcedure } from "../../../server/trpc.js";
import { AuthController } from "./auth.controller.js";
import { ZCICAuthResponseSchema, ZCICMeResponseSchema } from "@workspace/types";

export const authRouter = router({
  session: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/session/{userId}",
        tags: ["auth"],
        summary: "Check authentication session status (Legacy)",
        description: "Returns authentication status and role of a user"
      },
    })
    .input(z.object({ userId: z.string() }))
    .output(z.object({
      authenticated: z.boolean(),
      userId: z.string(),
      role: z.string(),
    }))
    .query(async ({ input }) => {
      return AuthController.getSessionStatus({ userId: input.userId });
    }),

  signup: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/signup",
        tags: ["auth"],
        summary: "User signup",
        description: "Registers a new user using email & password"
      },
    })
    .input(z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    }))
    .output(ZCICAuthResponseSchema)
    .mutation(async ({ input, ctx }) => {
      return AuthController.signUp({
        name: input.name,
        email: input.email,
        password: input.password,
        req: ctx.req,
        res: ctx.res,
      });
    }),

  login: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/login",
        tags: ["auth"],
        summary: "User login",
        description: "Authenticates a user using email & password"
      },
    })
    .input(z.object({
      email: z.string(),
      password: z.string(),
    }))
    .output(ZCICAuthResponseSchema)
    .mutation(async ({ input, ctx }) => {
      return AuthController.signIn({
        email: input.email,
        password: input.password,
        req: ctx.req,
        res: ctx.res,
      });
    }),

  forgotPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/forgot-password",
        tags: ["auth"],
        summary: "Request password reset link",
        description: "Sends a password reset link to the user's email"
      },
    })
    .input(z.object({
      email: z.string(),
      redirectTo: z.string().optional(),
    }))
    .output(z.any())
    .mutation(async ({ input, ctx }) => {
      return AuthController.forgetPassword({
        email: input.email,
        redirectTo: input.redirectTo,
        req: ctx.req,
        res: ctx.res,
      });
    }),

  resetPassword: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/reset-password",
        tags: ["auth"],
        summary: "Reset password with token",
        description: "Resets the user's password using the token sent in the reset link"
      },
    })
    .input(z.object({
      newPassword: z.string(),
      token: z.string(),
    }))
    .output(z.any())
    .mutation(async ({ input, ctx }) => {
      return AuthController.resetPassword({
        newPassword: input.newPassword,
        token: input.token,
        req: ctx.req,
        res: ctx.res,
      });
    }),

  sendOtp: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/send-otp",
        tags: ["auth"],
        summary: "Send OTP to email",
        description: "Sends an OTP to the user's email for sign-in, verification, or password reset"
      },
    })
    .input(z.object({
      email: z.string(),
      type: z.enum(["sign-in", "email-verification", "forget-password"]),
    }))
    .output(z.any())
    .mutation(async ({ input, ctx }) => {
      return AuthController.sendVerificationOTP({
        email: input.email,
        type: input.type,
        req: ctx.req,
        res: ctx.res,
      });
    }),

  verifyOtp: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/verify-otp",
        tags: ["auth"],
        summary: "Verify OTP",
        description: "Verifies the OTP sent to the email and processes sign-in, verification, or check depending on type"
      },
    })
    .input(z.object({
      email: z.string(),
      otp: z.string(),
      type: z.enum(["sign-in", "email-verification", "forget-password"]),
    }))
    .output(z.any())
    .mutation(async ({ input, ctx }) => {
      if (input.type === "sign-in") {
        return AuthController.signInEmailOTP({
          email: input.email,
          otp: input.otp,
          req: ctx.req,
          res: ctx.res,
        });
      } else if (input.type === "email-verification") {
        return AuthController.verifyEmailOTP({
          email: input.email,
          otp: input.otp,
          req: ctx.req,
          res: ctx.res,
        });
      } else {
        return AuthController.checkVerificationOTP({
          email: input.email,
          otp: input.otp,
          type: input.type,
          req: ctx.req,
          res: ctx.res,
        });
      }
    }),

  resetPasswordWithOtp: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/reset-password-otp",
        tags: ["auth"],
        summary: "Reset password with OTP",
        description: "Resets the user's password using the email OTP code"
      },
    })
    .input(z.object({
      email: z.string(),
      otp: z.string(),
      newPassword: z.string(),
    }))
    .output(z.any())
    .mutation(async ({ input, ctx }) => {
      return AuthController.resetPasswordEmailOTP({
        email: input.email,
        otp: input.otp,
        newPassword: input.newPassword,
        req: ctx.req,
        res: ctx.res,
      });
    }),
  
  logout: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/auth/logout",
        tags: ["auth"],
        summary: "User logout",
        description: "Logs out the currently authenticated user"
      },
    })
    .input(z.object({}))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      return AuthController.signOut({
        req: ctx.req,
      });
    }),

  me: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/auth/me",
        tags: ["auth"],
        summary: "Get current session",
        description: "Fetches details of the currently authenticated user session"
      },
    })
    .input(z.object({}))
    .output(ZCICMeResponseSchema)
    .query(async ({ ctx }) => {
      return AuthController.getCurrentSession({
        req: ctx.req,
        res: ctx.res,
      });
    }),
});

