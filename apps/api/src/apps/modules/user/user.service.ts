import { prisma } from "../../../lib/prisma.js";

export class UserService {
  /**
   * Fetch a single user by their ID
   */
  static async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Fetch all registered users
   */
  static async findAllUsers() {
    return prisma.user.findMany();
  }
}
