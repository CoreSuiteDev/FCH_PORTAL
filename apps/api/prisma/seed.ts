import { prisma } from "../src/infrastructure/database/prisma.js"
import { auth } from "../src/lib/auth.js"

async function main() {
  console.log("Seeding admin user...")
  const adminEmail = "smmasrafi01@gmail.com"
  const adminPassword = "admin@123"
  const adminName = "Admin User"

  let user = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { accounts: true },
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

      user = await prisma.user.findUnique({
        where: { email: adminEmail },
        include: { accounts: true },
      })
    } catch (err) {
      console.error("Failed to sign up admin user:", err)
    }
  } else {
    console.log(`Admin user already exists: ${adminEmail}`)
  }

  if (!user) {
    console.error("Could not find or create admin user. Aborting.")
    process.exit(1)
  }

  // Ensure a credential account exists for password login
  const credentialAccount = user.accounts.find(
    (a) => a.providerId === "credential"
  )
  if (!credentialAccount) {
    console.log("No credential account found. Creating one directly...")
    const context = await auth.$context
    const hashedPassword = await context.password.hash(adminPassword)

    await prisma.account.upsert({
      where: {
        providerId_accountId: {
          providerId: "credential",
          accountId: user.id,
        },
      },
      update: { password: hashedPassword },
      create: {
        accountId: user.id,
        providerId: "credential",
        userId: user.id,
        password: hashedPassword,
      },
    })
    console.log("Credential account created for admin user.")
  } else {
    console.log("Credential account already exists.")
  }

  console.log("Seeding SUPER_ADMIN role and associating with user...")
  const superAdminRole = await prisma.role.upsert({
    where: { name: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "SUPER_ADMIN",
      description: "Super Administrator Role with full access",
    },
  })

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
  console.log(`Admin user ${adminEmail} successfully linked to SUPER_ADMIN role.`)

  console.log("Seeding membership packages...")
  const packagesToSeed = [
    {
      name: "General Membership",
      slug: "general-monthly",
      type: "GENERAL" as const,
      billingCycle: "MONTHLY" as const,
      price: 19.00,
      currency: "USD" as const,
      subTitle: "Community access, member updates, events, and standard webinars.",
      description: "Designed for individuals who want to stay connected with the FCH network, participate in member events, receive important updates, and access standard webinars and community resources.",
      features: [
        "Member Dashboard access",
        "Newsletter and communication updates",
        "Member Events Calendar",
        "Access to standard FCH webinars",
        "Basic member resources"
      ],
      isPopular: false,
      sortOrder: 1,
      isActive: true
    },
    {
      name: "Pastoral Membership",
      slug: "pastoral-monthly",
      type: "PASTORAL" as const,
      billingCycle: "MONTHLY" as const,
      price: 49.00,
      currency: "USD" as const,
      subTitle: "Advanced formation, pastoral resources, ministry tools, and leadership support.",
      description: "Designed for catechetical leaders, parish teams, diocesan staff, ministry coordinators, educators, and organizations serving Hispanic Catholic communities.",
      features: [
        "Everything in General Membership",
        "Advanced webinar access",
        "Pastoral Resources Library",
        "Catechetical resources",
        "Parish and Diocese resources",
        "Access to general FCH documents and archives"
      ],
      isPopular: true,
      sortOrder: 2,
      isActive: true
    },
    {
      name: "General Membership",
      slug: "general-yearly",
      type: "GENERAL" as const,
      billingCycle: "YEARLY" as const,
      price: 190.00,
      currency: "USD" as const,
      subTitle: "Community access, member updates, events, and standard webinars.",
      description: "Designed for individuals who want to stay connected with the FCH network, participate in member events, receive important updates, and access standard webinars and community resources.",
      features: [
        "Member Dashboard access",
        "Newsletter and communication updates",
        "Member Events Calendar",
        "Access to standard FCH webinars",
        "Basic member resources"
      ],
      isPopular: false,
      sortOrder: 3,
      isActive: true
    },
    {
      name: "Pastoral Membership",
      slug: "pastoral-yearly",
      type: "PASTORAL" as const,
      billingCycle: "YEARLY" as const,
      price: 490.00,
      currency: "USD" as const,
      subTitle: "Advanced formation, pastoral resources, ministry tools, and leadership support.",
      description: "Designed for catechetical leaders, parish teams, diocesan staff, ministry coordinators, educators, and organizations serving Hispanic Catholic communities.",
      features: [
        "Everything in General Membership",
        "Advanced webinar access",
        "Pastoral Resources Library",
        "Catechetical resources",
        "Parish and Diocese resources",
        "Access to general FCH documents and archives"
      ],
      isPopular: true,
      sortOrder: 4,
      isActive: true
    }
  ]

  for (const pkg of packagesToSeed) {
    await prisma.membershipPackage.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    })
  }
  console.log("Seeding membership packages completed.")

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error("Error seeding:", e)
    process.exit(1)
  })
