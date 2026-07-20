import { auth } from "../src/lib/auth.js";
import { prisma } from "../src/infrastructure/database/prisma.js";

async function main() {
  console.log("Seeding SUPER_ADMIN user...");
  try {
    const email = "smmasrafi01@gmail.com";
    const password = "admin@123";

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`User ${email} not found. Creating...`);
      // Programmatically sign up the user via better-auth
      const res = await auth.api.signUpEmail({
        body: {
          email,
          password,
          name: "Super Admin",
        },
      });
      console.log(`User created successfully.`);
      
      user = await prisma.user.findUnique({
        where: { email },
      });
      
      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { emailVerified: true },
        });
      }
    } else {
      console.log(`User ${email} already exists.`);
      // Optional: Update password?
      // For now we just ensure they have the SUPER_ADMIN role.
    }

    if (user) {
      // Ensure SUPER_ADMIN role exists
      let role = await prisma.role.findUnique({
        where: { name: "SUPER_ADMIN" },
      });

      if (!role) {
        role = await prisma.role.create({
          data: {
            name: "SUPER_ADMIN",
            description: "Super Administrator Role with full access",
          },
        });
        console.log("Created SUPER_ADMIN role.");
      }

      // Check if user already has the role
      const userRole = await prisma.userRole.findUnique({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
      });

      if (!userRole) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: role.id,
          },
        });
        console.log("Assigned SUPER_ADMIN role to user.");
      } else {
        console.log("User already has SUPER_ADMIN role.");
      }
    }
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
