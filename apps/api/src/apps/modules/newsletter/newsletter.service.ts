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
}
