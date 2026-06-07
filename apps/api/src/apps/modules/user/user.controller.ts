import { TRPCError } from "@trpc/server";
import { UserService } from "./user.service.js";

export class UserController {
  /**
   * Controller for resolving a single user's details
   */
  static async getUserProfile({ userId }: { userId: string }) {
    const user = await UserService.findUserById(userId);
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User with ID ${userId} not found`,
      });
    }
    return user;
  }

  /**
   * Controller for listing all users
   */
  static async listAllMembers() {
    return UserService.findAllUsers();
  }
}
