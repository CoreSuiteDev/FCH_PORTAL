import { prisma } from "../../../infrastructure/database/prisma.js";

export class InqueryService {
  /**
   * Create a new contact inquiry
   */
  static async createInquery(data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) {
    return prisma.contactInquery.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      },
    });
  }

  /**
   * Fetch a single contact inquiry by ID
   */
  static async findInqueryById(id: string) {
    return prisma.contactInquery.findUnique({
      where: { id },
    });
  }

  /**
   * Fetch all contact inquiries (paginated)
   */
  static async findAllInqueries(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [totalCount, data] = await prisma.$transaction([
      prisma.contactInquery.count(),
      prisma.contactInquery.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return { totalCount, data };
  }

  /**
   * Update details of an existing inquiry
   */
  static async updateInquery(
    id: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
    }
  ) {
    return prisma.contactInquery.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete an inquiry from the database
   */
  static async deleteInquery(id: string) {
    await prisma.contactInquery.delete({
      where: { id },
    });
    return { success: true };
  }
}