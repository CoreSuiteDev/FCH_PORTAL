import { prisma } from "../../../infrastructure/database/prisma.js"
import { auth } from "../../../lib/auth.js"
import type { Request } from "express"

export class AuthService {
  /**
   * Check authentication status in DB
   */
  static async checkAuthStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    })
    const roleName = user?.userRoles?.[0]?.role?.name || (user ? "MEMBER" : "GUEST")
    return {
      authenticated: !!user,
      userId,
      role: roleName,
    }
  }

  private static getHeaders(req: Request): Headers {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.set(key, value);
        }
      }
    }
    return headers;
  }

  static async signUp(input: { name: string; email: string; password: string; req: Request }) {
    return auth.api.signUpEmail({
      body: {
        email: input.email,
        password: input.password,
        name: input.name,
      },
      headers: AuthService.getHeaders(input.req),
      asResponse: true,
    })
  }

  static async signIn(input: { email: string; password: string; req: Request }) {
    return auth.api.signInEmail({
      body: {
        email: input.email,
        password: input.password,
      },
      headers: AuthService.getHeaders(input.req),
      asResponse: true,
    })
  }

  static async forgetPassword(input: { email: string; redirectTo?: string; req: Request }) {
    return auth.api.requestPasswordReset({
      body: {
        email: input.email,
        redirectTo: input.redirectTo,
      },
      headers: AuthService.getHeaders(input.req),
      asResponse: true,
    })
  }

  static async resetPassword(input: { newPassword: string; token: string; req: Request }) {
    return auth.api.resetPassword({
      body: {
        newPassword: input.newPassword,
        token: input.token,
      },
      headers: AuthService.getHeaders(input.req),
      asResponse: true,
    })
  }

  static async sendVerificationOTP(input: { email: string; type: "sign-in" | "email-verification" | "forget-password"; req: Request }) {
    return auth.api.sendVerificationOTP({
      body: {
        email: input.email,
        type: input.type,
      },
      headers: AuthService.getHeaders(input.req),
      asResponse: true,
    })
  }

  static async signInEmailOTP(input: { email: string; otp: string; req: Request }) {
    return auth.api.signInEmailOTP({
      body: {
        email: input.email,
        otp: input.otp,
      },
      headers: AuthService.getHeaders(input.req),
      asResponse: true,
    })
  }

  static async verifyEmailOTP(input: { email: string; otp: string; req: Request }) {
    return auth.api.verifyEmailOTP({
      body: {
        email: input.email,
        otp: input.otp,
      },
      headers: AuthService.getHeaders(input.req),
      asResponse: true,
    })
  }

  static async checkVerificationOTP(input: { email: string; otp: string; type: "sign-in" | "email-verification" | "forget-password"; req: Request }) {
    return auth.api.checkVerificationOTP({
      body: {
        email: input.email,
        otp: input.otp,
        type: input.type,
      },
      headers: AuthService.getHeaders(input.req),
      asResponse: true,
    })
  }

  static async resetPasswordEmailOTP(input: { email: string; otp: string; newPassword: string; req: Request }) {
    return auth.api.resetPasswordEmailOTP({
      body: {
        email: input.email,
        otp: input.otp,
        password: input.newPassword,
      },
      headers: AuthService.getHeaders(input.req),
      asResponse: true,
    })
  }

  static async getCurrentSession(input: { req: Request }) {
    return auth.api.getSession({
      headers: AuthService.getHeaders(input.req),
      asResponse: true,
    })
  }
}

