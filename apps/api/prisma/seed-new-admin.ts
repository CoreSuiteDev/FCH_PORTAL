import { prisma } from "../src/infrastructure/database/prisma.js"
import { auth } from "../src/lib/auth.js"

async function main() {
  const email = "smmasrafi01@gmail.com"
  const password = "admin@123"
  const name = "Super Admin"

  console.log(`Checking if user ${email} exists...`)
  let user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  })

  const context = await auth.$context
  const hashedPassword = await context.password.hash(password)

  if (!user) {
    console.log(`Creating super admin user: ${email}`)
    user = await prisma.user.create({
      data: {
        email,
        name,
        emailVerified: true,
        accounts: {
          create: {
            accountId: email,
            providerId: "credential",
            password: hashedPassword,
          },
        },
      },
      include: { accounts: true },
    })
    console.log(`Successfully created admin user: ${email}`)
  } else {
    console.log(`Admin user already exists: ${email}. Updating password...`)
    const credentialAcc = user.accounts.find((a) => a.providerId === "credential")
    await prisma.account.upsert({
      where: {
        providerId_accountId: {
          providerId: "credential",
          accountId: credentialAcc?.accountId || email,
        },
      },
      update: { password: hashedPassword },
      create: {
        accountId: email,
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
      },
    })
  }

  let superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } })
  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: { name: "SUPER_ADMIN", description: "Super Administrator Role" }
    })
  }

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: user.id,
        roleId: superAdminRole.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: superAdminRole.id,
    },
  })
  console.log(`Admin user ${email} successfully linked to SUPER_ADMIN role.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
