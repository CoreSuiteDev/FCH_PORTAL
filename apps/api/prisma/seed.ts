import { prisma } from "../src/infrastructure/database/prisma.js"
import { auth } from "../src/lib/auth.js"

async function main() {

  console.log("Seeding admin user...")
  const adminEmail = "smmasrafi2003@gmail.com"
  const adminPassword = "AdminPassword123!"
  const adminName = "Admin User"

  let user = await prisma.user.findUnique({
    where: { email: adminEmail },
  })

  if (!user) {
    console.log(`Creating admin user: ${adminEmail}`)
    try {
      await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      })

      // Fetch the newly created user
      user = await prisma.user.findUnique({
        where: { email: adminEmail },
      })
    } catch (err) {
      console.error("Failed to sign up admin user:", err)
    }
  } else {
    console.log(`Admin user already exists: ${adminEmail}`)
  }

  if (user) {
    console.log("Seeding ADMIN role and associating with user...")
    const adminRole = await prisma.role.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: {
        name: "ADMIN",
        description: "Administrator Role with full access",
      },
    })

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: adminRole.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: adminRole.id,
      },
    })
    console.log(`Admin user ${adminEmail} successfully linked to ADMIN role.`)
  }

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error("Error seeding:", e)
    process.exit(1)
  })
