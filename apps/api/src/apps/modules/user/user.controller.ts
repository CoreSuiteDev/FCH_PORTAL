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

  /**
   * Controller for provisioning a new board member
   */
  static async createBoardMember(input: { name: string; email: string }) {
    try {
      const user = await UserService.createBoardMember(input)
      if (!user) {
        throw new Error("Board member user creation succeeded but lookup failed")
      }
      return user
    } catch (error: any) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: `Failed to create board member: ${error.message}`,
      })
    }
  }

  /**
   * Controller for filtering and listing users dynamically
   */
  static async filterUser(params: Parameters<typeof UserService.filterUser>[0]) {
    return UserService.filterUser(params)
  }

  /**
   * Controller for retrieving user matrix stats
   */
  static async getUserMatrix() {
    try {
      return await UserService.getUserMatrix()
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch user metrics matrix: ${error.message}`,
      })
    }
  }

  /**
   * Controller for retrieving detailed profile, activities, and transaction history of a single member
   */
  static async getMemberDetails({ userId }: { userId: string }) {
    try {
      const details = await UserService.getMemberDetails(userId)
      if (!details) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `User member with ID '${userId}' not found`,
        })
      }
      return details
    } catch (error: any) {
      if (error instanceof TRPCError) throw error
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to retrieve member details: ${error.message}`,
      })
    }
  }

  /**
   * Controller for retrieving aggregated overview statistics for the admin dashboard
   */
  static async getAdminOverview() {
    try {
      return await UserService.getAdminOverview()
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to fetch admin overview statistics: ${error.message}`,
      })
    }
  }
}

