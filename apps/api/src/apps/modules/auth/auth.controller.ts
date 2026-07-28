import type { Response as ExpressResponse, Request } from "express"
import { TRPCError } from "@trpc/server"
import { AuthService } from "./auth.service.js"
import { prisma } from "../../../infrastructure/database/prisma.js"
import { auth } from "../../../lib/auth.js"

export class AuthController {
  private static copyCookies(
    webResponse: Response,
    expressRes: ExpressResponse
  ) {
    const setCookies = webResponse.headers.getSetCookie()
    if (setCookies.length > 0) {
      expressRes.setHeader("set-cookie", setCookies)
    }
  }

  private static async handleResponse(
    webResponse: Response,
    expressRes: ExpressResponse
  ) {
    AuthController.copyCookies(webResponse, expressRes)
    if (!webResponse.ok) {
      const text = await webResponse.text()
      let message = "Authentication operation failed"
      try {
        const json = JSON.parse(text)
        message = json.message || json.error?.message || json.error || message
      } catch (e) {
        message = text || message
      }
      throw new Error(message)
    }
    if (webResponse.status === 204) {
      return { success: true }
    }
    const bodyText = await webResponse.text()
    try {
      return JSON.parse(bodyText)
    } catch (e) {
      return { success: true, raw: bodyText }
    }
  }

  static async getSessionStatus({ userId }: { userId: string }) {
    return AuthService.checkAuthStatus(userId)
  }

  static async signUp(input: {
    name: string
    email: string
    password: string
    req: Request
    res: ExpressResponse
  }) {
    const response = await AuthService.signUp({
      name: input.name,
      email: input.email,
      password: input.password,
      req: input.req,
    })
    return AuthController.handleResponse(response, input.res)
  }

  static async signIn(input: {
    email: string
    password: string
    otp?: string
    req: Request
    res: ExpressResponse
  }) {
    if (input.otp) {
      const verifyResponse = await AuthService.checkVerificationOTP({
        email: input.email,
        otp: input.otp,
        type: "sign-in",
        req: input.req,
      });

      if (!verifyResponse.ok) {
        return AuthController.handleResponse(verifyResponse, input.res);
      }

      const loginResponse = await AuthService.signInEmailOTP({
        email: input.email,
        otp: input.otp,
        req: input.req,
      });
      return AuthController.handleResponse(loginResponse, input.res);
    }

    // Verify user credentials first
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        accounts: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found, please register first." });
    }

    const credentialAccount = user.accounts.find(a => a.providerId === "credential");
    if (!credentialAccount || !credentialAccount.password) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
    }

    const context = await auth.$context;
    const isValid = await context.password.verify({
      password: input.password,
      hash: credentialAccount.password
    });

    if (!isValid) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password." });
    }

    const roles = user.userRoles.map((ur) => ur.role.name);
    const isSuperAdmin = roles.includes("SUPER_ADMIN");
    const isBoard = roles.includes("BOARD");

    if (isSuperAdmin || isBoard) {
      // Bypass OTP for Super Admin & Board, log them in immediately!
      const loginResponse = await AuthService.signIn({
        email: input.email,
        password: input.password,
        req: input.req,
      });
      return AuthController.handleResponse(loginResponse, input.res);
    }

    // Credentials are correct, send OTP
    const sendOtpResponse = await AuthService.sendVerificationOTP({
      email: input.email,
      type: "sign-in",
      req: input.req,
    });

    if (!sendOtpResponse.ok) {
      return AuthController.handleResponse(sendOtpResponse, input.res);
    }

    return {
      requiresOtp: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    };
  }

  static async forgetPassword(input: {
    email: string
    redirectTo?: string
    req: Request
    res: ExpressResponse
  }) {
    const response = await AuthService.forgetPassword({
      email: input.email,
      redirectTo: input.redirectTo,
      req: input.req,
    })
    return AuthController.handleResponse(response, input.res)
  }

  static async resetPassword(input: {
    newPassword: string
    token: string
    req: Request
    res: ExpressResponse
  }) {
    const response = await AuthService.resetPassword({
      newPassword: input.newPassword,
      token: input.token,
      req: input.req,
    })
    return AuthController.handleResponse(response, input.res)
  }

  static async sendVerificationOTP(input: {
    email: string
    type: "sign-in" | "email-verification" | "forget-password"
    req: Request
    res: ExpressResponse
  }) {
    const response = await AuthService.sendVerificationOTP({
      email: input.email,
      type: input.type,
      req: input.req,
    })
    return AuthController.handleResponse(response, input.res)
  }

  static async signInEmailOTP(input: {
    email: string
    otp: string
    req: Request
    res: ExpressResponse
  }) {
    const response = await AuthService.signInEmailOTP({
      email: input.email,
      otp: input.otp,
      req: input.req,
    })
    return AuthController.handleResponse(response, input.res)
  }

  static async verifyEmailOTP(input: {
    email: string
    otp: string
    req: Request
    res: ExpressResponse
  }) {
    const response = await AuthService.verifyEmailOTP({
      email: input.email,
      otp: input.otp,
      req: input.req,
    })
    return AuthController.handleResponse(response, input.res)
  }

  static async checkVerificationOTP(input: {
    email: string
    otp: string
    type: "sign-in" | "email-verification" | "forget-password"
    req: Request
    res: ExpressResponse
  }) {
    const response = await AuthService.checkVerificationOTP({
      email: input.email,
      otp: input.otp,
      type: input.type,
      req: input.req,
    })
    return AuthController.handleResponse(response, input.res)
  }

  static async resetPasswordEmailOTP(input: {
    email: string
    otp: string
    newPassword: string
    req: Request
    res: ExpressResponse
  }) {
    const response = await AuthService.resetPasswordEmailOTP({
      email: input.email,
      otp: input.otp,
      newPassword: input.newPassword,
      req: input.req,
    })
    return AuthController.handleResponse(response, input.res)
  }

  static async getCurrentSession(input: {
    req: Request
    res: ExpressResponse
  }) {
    const result = await AuthService.getCurrentSession({
      req: input.req,
    })
    if (!result) return null
    return {
      session: result.session,
      user: {
        ...result.user,
        status: (result.user.status || "ACTIVE") as
          | "ACTIVE"
          | "RESTRICTED"
          | "SUSPENDED"
          | "BANNED",
      },
    }
  }

  static async signOut(input: { req: Request }) {
    const response = await AuthService.signOut({
      req: input.req,
    })
    // We don't need to process body or set-cookie since we control the headers in the service.
    if (!response.ok) {
      const text = await response.text()
      let message = "Sign out failed"
      try {
        const json = JSON.parse(text)
        message = json.message || json.error?.message || json.error || message
      } catch (e) {
        message = text || message
      }
      throw new Error(message)
    }
    // Sign out should result in empty session, so we don't expect a body or cookies to forward in the same way.
    return { success: true }
  }

  static async changePasswordForced(input: {
    email: string
    currentPassword: string
    newPassword: string
  }) {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: { accounts: true },
    })

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "User not found." })
    }

    if (!user.passwordChangeRequired) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "First-time password change is not required for this account.",
      })
    }

    const credentialAccount = user.accounts.find((a) => a.providerId === "credential")
    if (!credentialAccount || !credentialAccount.password) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Account credentials not found." })
    }

    const context = await auth.$context
    const isValid = await context.password.verify({
      password: input.currentPassword,
      hash: credentialAccount.password,
    })

    if (!isValid) {
      throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid current password." })
    }

    const hashedNewPassword = await context.password.hash(input.newPassword)

    await prisma.$transaction([
      prisma.account.update({
        where: { id: credentialAccount.id },
        data: { password: hashedNewPassword },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { passwordChangeRequired: false },
      }),
    ])

    return { success: true }
  }
}
