import { AuthService } from "./auth.service.js";

export class AuthController {
  /**
   * Controller for resolving authentication session check
   */
  static async getSessionStatus({ userId }: { userId: string }) {
    return AuthService.checkAuthStatus(userId);
  }
}
