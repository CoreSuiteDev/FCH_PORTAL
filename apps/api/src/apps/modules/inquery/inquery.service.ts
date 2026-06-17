import { prisma } from "../../../infrastructure/database/prisma.js";

export class InqueryService {

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


  static async findInqueryById(id: string) {
    return prisma.contactInquery.findUnique({
      where: { id },
    });
  }


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

  static async deleteInquery(id: string) {
    await prisma.contactInquery.delete({
      where: { id },
    });
    return { success: true };
  }
}
