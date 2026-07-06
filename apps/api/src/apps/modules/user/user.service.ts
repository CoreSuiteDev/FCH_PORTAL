import { prisma } from "../../../infrastructure/database/prisma.js"
import { UserStatus, MembershipType } from "../../../generated/prisma/client.js"
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
          subscriptions: {
            include: {
              payments: true,
            },
          },
        },
      }),
    ])

    return { totalCount, data }
  }

  /**
   * Update operational status of a user
   */
  static async updateUserStatus(id: string, status: UserStatus) {
    return prisma.user.update({
      where: { id },
      data: { status },
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
   * Delete a user from the database
   */
  static async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id },
    })
    return { success: true }
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

    // 1. Create the base User
    const user = await prisma.user.create({
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
                  expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 Year validity
                },
              },
            }
          : {}),
      },
    })

    // 2. Assign appropriate Role
    const roleName = data.tier === "PASTORAL" ? "PASTORAL" : "MEMBER"
    let role = await prisma.role.findUnique({
      where: { name: roleName },
    })

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: roleName,
          description: `Automatically created role for ${roleName}`,
        },
      })
    }

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    })

    // 3. Refetch complete record
    return UserService.findUserById(user.id)
  }

  /**
   * Update the user's role by clearing existing assignments and setting a new one
   */
  static async updateUserRole(userId: string, roleName: string) {
    const upperRoleName = roleName.toUpperCase()
    let role = await prisma.role.findUnique({
      where: { name: upperRoleName },
    })

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: upperRoleName,
          description: `Automatically created role for ${upperRoleName}`,
        },
      })
    }

    // Clear previous assignments
    await prisma.userRole.deleteMany({
      where: { userId },
    })

    // Assign new role
    await prisma.userRole.create({
      data: {
        userId,
        roleId: role.id,
      },
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

    const tempPassword = Math.random().toString(36).slice(-10) + "A1!"
    const context = await auth.$context
    const hashedPassword = await context.password.hash(tempPassword)

    // Create user with passwordChangeRequired: true
    const user = await prisma.user.create({
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

    // Assign BOARD role
    let role = await prisma.role.findUnique({
      where: { name: "BOARD" },
    })
    if (!role) {
      role = await prisma.role.create({
        data: {
          name: "BOARD",
          description: "Board Member Role",
        },
      })
    }

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    })

    // Send email with registration and temporary password
    try {
      const sendMail = (await import("../../../infrastructure/email/email.js")).default
      const subject = "Welcome to FCH Portal - Board Member Registration"
      const text = `Dear ${data.name},\n\n` +
        `A board member account has been created for you on the FCH Portal.\n\n` +
        `Your login credentials are:\n` +
        `Email: ${data.email}\n` +
        `Temporary Password: ${tempPassword}\n\n` +
        `Please log in using the board login page. You will be required to change your password upon your first login.\n\n` +
        `Best regards,\nFCH Portal Admin Team`
      await sendMail(data.email, subject, text)
      console.log(`[Email] Registration mail sent to new board member: ${data.email}`)
    } catch (emailError) {
      console.error(`[Email] Failed to send board member registration email to ${data.email}:`, emailError)
    }

    return UserService.findUserById(user.id)
  }
}

