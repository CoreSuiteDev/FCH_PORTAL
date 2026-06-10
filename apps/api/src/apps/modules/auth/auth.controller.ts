import type { Request, Response as ExpressResponse } from "express";
import { AuthService } from "./auth.service.js";

export class AuthController {
  private static copyCookies(webResponse: Response, expressRes: ExpressResponse) {
    const setCookies = webResponse.headers.getSetCookie();
    if (setCookies.length > 0) {
      expressRes.setHeader("set-cookie", setCookies);
    }
  }

  private static async handleResponse(webResponse: Response, expressRes: ExpressResponse) {
    AuthController.copyCookies(webResponse, expressRes);
    if (!webResponse.ok) {
      const text = await webResponse.text();
      let message = "Authentication operation failed";
      try {
        const json = JSON.parse(text);
        message = json.message || json.error?.message || json.error || message;
      } catch (e) {
        message = text || message;
      }
      throw new Error(message);
    }
    if (webResponse.status === 204) {
      return { success: true };
    }
    const bodyText = await webResponse.text();
    try {
      return JSON.parse(bodyText);
    } catch (e) {
      return { success: true, raw: bodyText };
    }
  }

  static async getSessionStatus({ userId }: { userId: string }) {
    return AuthService.checkAuthStatus(userId);
  }

  static async signUp(input: { name: string; email: string; password: string; req: Request; res: ExpressResponse }) {
    const response = await AuthService.signUp({
      name: input.name,
      email: input.email,
      password: input.password,
      req: input.req,
    });
    return AuthController.handleResponse(response, input.res);
  }

  static async signIn(input: { email: string; password: string; req: Request; res: ExpressResponse }) {
    const response = await AuthService.signIn({
      email: input.email,
      password: input.password,
      req: input.req,
    });
    return AuthController.handleResponse(response, input.res);
  }

  static async forgetPassword(input: { email: string; redirectTo?: string; req: Request; res: ExpressResponse }) {
    const response = await AuthService.forgetPassword({
      email: input.email,
      redirectTo: input.redirectTo,
      req: input.req,
    });
    return AuthController.handleResponse(response, input.res);
  }

  static async resetPassword(input: { newPassword: string; token: string; req: Request; res: ExpressResponse }) {
    const response = await AuthService.resetPassword({
      newPassword: input.newPassword,
      token: input.token,
      req: input.req,
    });
    return AuthController.handleResponse(response, input.res);
  }

  static async sendVerificationOTP(input: { email: string; type: "sign-in" | "email-verification" | "forget-password"; req: Request; res: ExpressResponse }) {
    const response = await AuthService.sendVerificationOTP({
      email: input.email,
      type: input.type,
      req: input.req,
    });
    return AuthController.handleResponse(response, input.res);
  }

  static async signInEmailOTP(input: { email: string; otp: string; req: Request; res: ExpressResponse }) {
    const response = await AuthService.signInEmailOTP({
      email: input.email,
      otp: input.otp,
      req: input.req,
    });
    return AuthController.handleResponse(response, input.res);
  }

  static async verifyEmailOTP(input: { email: string; otp: string; req: Request; res: ExpressResponse }) {
    const response = await AuthService.verifyEmailOTP({
      email: input.email,
      otp: input.otp,
      req: input.req,
    });
    return AuthController.handleResponse(response, input.res);
  }

  static async checkVerificationOTP(input: { email: string; otp: string; type: "sign-in" | "email-verification" | "forget-password"; req: Request; res: ExpressResponse }) {
    const response = await AuthService.checkVerificationOTP({
      email: input.email,
      otp: input.otp,
      type: input.type,
      req: input.req,
    });
    return AuthController.handleResponse(response, input.res);
  }

  static async resetPasswordEmailOTP(input: { email: string; otp: string; newPassword: string; req: Request; res: ExpressResponse }) {
    const response = await AuthService.resetPasswordEmailOTP({
      email: input.email,
      otp: input.otp,
      newPassword: input.newPassword,
      req: input.req,
    });
    return AuthController.handleResponse(response, input.res);
  }

  static async getCurrentSession(input: { req: Request; res: ExpressResponse }) {
    const result = await AuthService.getCurrentSession({
      req: input.req,
    });
    if (!result) return null;
    return {
      session: result.session,
      user: {
        ...result.user,
        status: (result.user.status || "ACTIVE") as "ACTIVE" | "RESTRICTED" | "SUSPENDED" | "BANNED",
      },
    };
  }
}

