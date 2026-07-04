import { TRPCError } from "@trpc/server"
import { UserService } from "./user.service.js"
import { UserStatus, MembershipType } from "../../../generated/prisma/client.js"

export class UserController {
  /**
   * Controller for resolving a single user's details
   */
  static async getUserProfile({ userId }: { userId: string }) {
    const user = await UserService.findUserById(userId)
    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: `User with ID ${userId} not found`,
      })
    }
    return user
  }

  /**
   * Controller for listing all users (paginated)
   */
  static async listAllMembers(params: { page: number; limit: number }) {
    return UserService.findAllUsers(params)
  }

  /**
   * Controller for updating user status
   */
  static async updateUserStatus({
    userId,
    status,
  }: {
    userId: string
    status: UserStatus
  }) {
    try {
      const updatedUser = await UserService.updateUserStatus(userId, status)
      return { success: true, status: updatedUser.status }
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to update user status: ${error.message}`,
      })
    }
  }

  /**
   * Controller for deleting a user account
   */
  static async deleteUser({ userId }: { userId: string }) {
    try {
      return await UserService.deleteUser(userId)
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to delete user: ${error.message}`,
      })
    }
  }

  /**
   * Controller for provisioning a new user member
   */
  static async createMember(input: {
    name: string
    email: string
    status?: UserStatus
    tier?: MembershipType
  }) {
    try {
      const user = await UserService.createMember(input)
      if (!user) {
        throw new Error("User creation succeeded but lookup failed")
      }
      return user
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to create user member: ${error.message}`,
      })
    }
  }

  /**
   * Controller for updating user roles
   */
  static async updateUserRole({
    userId,
    role,
  }: {
    userId: string
    role: string
  }) {
    try {
      return await UserService.updateUserRole(userId, role)
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to update user role: ${error.message}`,
      })
    }
  }
}

