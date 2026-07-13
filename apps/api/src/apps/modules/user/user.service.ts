import crypto from "crypto"
import { addYears } from "date-fns"
import { MembershipType, UserStatus } from "../../../generated/prisma/client.js"
import { prisma } from "../../../infrastructure/database/prisma.js"
import { emailQueue } from "../../../infrastructure/redis/emailQueue.js"
import { auth } from "../../../lib/auth.js"

export class UserService {
  /**
   * Fetch a single user by their ID, including roles, memberships, and payments
   */
  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
        subscriptions: {
          include: {
            payments: true,
          },
        },
      },
    })
  }

  /**
   * Fetch all registered users, including roles, memberships, and payments (paginated)
   */
  static async findAllUsers(params: { page: number; limit: number }) {
    const { page, limit } = params
    const skip = (page - 1) * limit

    const [totalCount, data] = await prisma.$transaction([
      prisma.user.count(),
      prisma.user.findMany({
        skip,
        take: limit,
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ])

    return { totalCount, data }
  }

  /**
   * Update operational status of a user
   */
  static async updateUserStatus(id: string, status: UserStatus) {
    try {
      return await prisma.user.update({
        where: { id },
        data: { status },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
        },
      })
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error(`Target user with ID '${id}' does not exist.`)
      }
      throw error
    }
  }

  /**
   * Delete a user from the database
   */
  static async deleteUser(id: string) {
    try {
      await prisma.user.delete({
        where: { id },
      })
      return { success: true }
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new Error(`Target user with ID '${id}' does not exist.`)
      }
      throw error
    }
  }

  /**
   * Create a new member user with optional membership and role mapping
   */
  static async createMember(data: {
    name: string
    email: string
    status?: UserStatus
    tier?: MembershipType
  }) {
    const status = data.status || "ACTIVE"

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existingUser)
      throw new Error("A user with this email address already exists.")

    const roleName = data.tier === "PASTORAL" ? "PASTORAL" : "MEMBER"

    let role = await prisma.role.findUnique({ where: { name: roleName } })

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: roleName,
          description: `${roleName} Role`,
        },
      })
    }

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          status,
          ...(data.tier
            ? {
                memberships: {
                  create: {
                    type: data.tier,
                    status: "ACTIVE",
                    startsAt: new Date(),
                    expiresAt: addYears(new Date(), 1),
                  },
                },
              }
            : {}),
        },
      })

      await tx.userRole.create({
        data: {
          userId: newUser.id,
          roleId: role.id,
        },
      })

      return newUser
    })

    return UserService.findUserById(user.id)
  }

  /**
   * Update the user's role by clearing existing assignments and setting a new one
   */
  static async updateUserRole(userId: string, roleName: string) {
    const upperRoleName = roleName.toUpperCase()

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    })

    if (!userExists) throw new Error(`User with ID '${userId}' not found`)

    let role = await prisma.role.findUnique({
      where: { name: upperRoleName },
    })

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: upperRoleName,
          description: `${upperRoleName} Role`,
        },
      })
    }

    await prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({
        where: { userId },
      })

      await tx.userRole.create({
        data: { userId, roleId: role.id },
      })
    })

    return { success: true, role: upperRoleName }
  }

  /**
   * Create a new board member user with temporary password and passwordChangeRequired flag
   */
  static async createBoardMember(data: { name: string; email: string }) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existingUser) {
      throw new Error("User with this email already registered.")
    }

    const tempPassword = crypto.randomBytes(6).toString("hex") + "A1!"
    const context = await auth.$context
    const hashedPassword = await context.password.hash(tempPassword)

    let role = await prisma.role.findUnique({ where: { name: "BOARD" } })
    if (!role) {
      role = await prisma.role.create({
        data: {
          name: "BOARD",
          description: "BOARD Role",
        },
      })
    }

    const completedUser = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          status: "ACTIVE",
          passwordChangeRequired: true,
          accounts: {
            create: {
              providerId: "credential",
              accountId: data.email,
              password: hashedPassword,
            },
          },
        },
      })

      await tx.userRole.create({
        data: { userId: newUser.id, roleId: role.id },
      })

      // Inline the fetch into the transactional context
      return tx.user.findUnique({
        where: { id: newUser.id },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
          subscriptions: {
            include: {
              payments: true,
            },
          },
        },
      })
    })

    const subject = "Welcome to FCH Portal - Board Member Registration"
    const text =
      `Dear ${data.name},\n\n` +
      `Your login credentials are:\n` +
      `Email: ${data.email}\n` +
      `Temporary Password: ${tempPassword}\n\n` +
      `Best regards,\nFCH Portal Admin Team`

    // Fire-and-forget directly into Redis
    await emailQueue
      .add(
        "sendWelcomeEmail",
        { to: data.email, subject, text },
        {
          attempts: 3,
          backoff: { type: "exponential", delay: 5000 },
        }
      )
      .catch((err) =>
        console.error("[Queue Intercept] Failed pushing background job:", err)
      )

    return completedUser
  }


  static async filterUser(params: {
    page: number
    limit: number
    skip?: number
    search?: string
    status?: UserStatus
    role?: string
    createdAt?: string
  }) {
    const { page, limit, skip, search, status, role, createdAt } = params
    const computedSkip = skip ?? (page - 1) * limit

    const where: any = {}

    // Status Filter
    if (status && status !== "ALL" as any) {
      where.status = status
    }

    // Role Filter
    if (role && role !== "ALL") {
      where.userRoles = {
        some: {
          role: {
            name: role.toUpperCase(),
          },
        },
      }
    }

    // Search Filter (name, email, phone)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
        { id: { contains: search } },
      ]
    }

    // Date Filter (createdAt)
    if (createdAt) {
      where.createdAt = {
        gte: new Date(createdAt),
      }
    }

    const [totalCount, data] = await prisma.$transaction([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip: computedSkip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          userRoles: {
            include: {
              role: true,
            },
          },
          subscriptions: {
            include: {
              package: true,
              payments: true,
            },
          },
        },
      }),
    ])

    return {
      data,
      totalCount,
    }
  }
}
