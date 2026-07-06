import { prisma } from "../../../infrastructure/database/prisma.js"

export class NewsletterService {
  static async subscribe(data: { firstName: string; lastName?: string; email: string }) {

    const isEmailExists = await prisma.newsletterSubscriber.findUnique({
      where: { email: data.email },
    });

    if (isEmailExists) {
      throw new Error("Email already exists");
    }

    const name = data.firstName + " " + data.lastName

    return prisma.newsletterSubscriber.create({
      data: {
        name,
        email: data.email,
      },
    })
  }

  static async findAllSubscribers(params: { page: number; limit: number }) {
    const { page, limit } = params;
    const skip = (page - 1) * limit;

    const [totalCount, data] = await prisma.$transaction([
      prisma.newsletterSubscriber.count(),
      prisma.newsletterSubscriber.findMany({
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return { totalCount, data };
  }

  static async deleteSubscriber(id: string) {
    await prisma.newsletterSubscriber.delete({
      where: { id },
    });
    return { success: true };
  }
}
