import { prisma } from "../src/infrastructure/database/prisma.js"
import { auth } from "../src/lib/auth.js"

async function main() {
  console.log("Seeding admin user...")
  const adminEmail = "win.masrafi000@gmail.com"
  const adminPassword = "masrafi@123"
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

  console.log("Seeding system roles...")
  const rolesToSeed = [
    {
      name: "SUPER_ADMIN",
      description: "Super Administrator Role with full access",
    },
    { name: "ADMIN", description: "Administrator Role" },
    { name: "BOARD", description: "Board Member Role" },
    { name: "PASTORAL", description: "Pastoral Member Role" },
    { name: "MEMBER", description: "General Member Role" },
    { name: "USER", description: "General Registered User Role" },
  ]

  const seededRoles: Record<string, any> = {}

  for (const roleInfo of rolesToSeed) {
    const role = await prisma.role.upsert({
      where: { name: roleInfo.name },
      update: {},
      create: roleInfo,
    })
    seededRoles[roleInfo.name] = role
    console.log(`Role '${roleInfo.name}' seeded.`)
  }

  const superAdminRole = seededRoles["SUPER_ADMIN"]

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
  console.log(
    `Admin user ${adminEmail} successfully linked to SUPER_ADMIN role.`
  )

  console.log("Seeding membership packages...")
  const packagesToSeed = [
    {
      name: "General Membership",
      slug: "general-monthly",
      type: "GENERAL" as const,
      billingCycle: "MONTHLY" as const,
      price: 19.0,
      currency: "USD" as const,
      subTitle:
        "Community access, member updates, events, and standard webinars.",
      description:
        "Designed for individuals who want to stay connected with the FCH network, participate in member events, receive important updates, and access standard webinars and community resources.",
      features: [
        "Member Dashboard access",
        "Newsletter and communication updates",
        "Member Events Calendar",
        "Access to standard FCH webinars",
        "Basic member resources",
      ],
      isPopular: false,
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Pastoral Membership",
      slug: "pastoral-monthly",
      type: "PASTORAL" as const,
      billingCycle: "MONTHLY" as const,
      price: 49.0,
      currency: "USD" as const,
      subTitle:
        "Advanced formation, pastoral resources, ministry tools, and leadership support.",
      description:
        "Designed for catechetical leaders, parish teams, diocesan staff, ministry coordinators, educators, and organizations serving Hispanic Catholic communities.",
      features: [
        "Everything in General Membership",
        "Advanced webinar access",
        "Pastoral Resources Library",
        "Catechetical resources",
        "Parish and Diocese resources",
        "Access to general FCH documents and archives",
      ],
      isPopular: true,
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "General Membership",
      slug: "general-yearly",
      type: "GENERAL" as const,
      billingCycle: "YEARLY" as const,
      price: 190.0,
      currency: "USD" as const,
      subTitle:
        "Community access, member updates, events, and standard webinars.",
      description:
        "Designed for individuals who want to stay connected with the FCH network, participate in member events, receive important updates, and access standard webinars and community resources.",
      features: [
        "Member Dashboard access",
        "Newsletter and communication updates",
        "Member Events Calendar",
        "Access to standard FCH webinars",
        "Basic member resources",
      ],
      isPopular: false,
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Pastoral Membership",
      slug: "pastoral-yearly",
      type: "PASTORAL" as const,
      billingCycle: "YEARLY" as const,
      price: 490.0,
      currency: "USD" as const,
      subTitle:
        "Advanced formation, pastoral resources, ministry tools, and leadership support.",
      description:
        "Designed for catechetical leaders, parish teams, diocesan staff, ministry coordinators, educators, and organizations serving Hispanic Catholic communities.",
      features: [
        "Everything in General Membership",
        "Advanced webinar access",
        "Pastoral Resources Library",
        "Catechetical resources",
        "Parish and Diocese resources",
        "Access to general FCH documents and archives",
      ],
      isPopular: true,
      sortOrder: 4,
      isActive: true,
    },
  ]

  for (const pkg of packagesToSeed) {
    await prisma.membershipPackage.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    })
  }
  console.log("Seeding membership packages completed.")

  console.log("Seeding sponsor plans...")
  const sponsorPlansToSeed = [
    {
      id: "diamond",
      name: "Diamond Sponsor",
      slug: "diamond",
      tier: "DIAMOND" as const,
      amount: 10000.0,
      currency: "USD" as const,
      description:
        "Ultimate sponsorship package with premier recognition and maximum impact.",
      benefits: [
        "All benefits of Platinum Tier",
        "Banner on homepage",
        "Special acknowledgement at all annual events",
        "Lifetime recognition plaque",
      ],
      isActive: true,
      isFeatured: true,
      sortOrder: 1,
    },
    {
      id: "platinum",
      name: "Platinum Sponsor",
      slug: "platinum",
      tier: "PLATINUM" as const,
      amount: 5000.0,
      currency: "USD" as const,
      description:
        "Premier sponsorship package with major brand integration and VIP access.",
      benefits: [
        "All benefits of Gold Tier",
        "VIP invitations to all webinars",
        "Speaking opportunity at annual webinar",
        "Logo on all print publications",
      ],
      isActive: true,
      isFeatured: false,
      sortOrder: 2,
    },
    {
      id: "gold",
      name: "Gold Sponsor",
      slug: "gold",
      tier: "GOLD" as const,
      amount: 3000.0,
      currency: "USD" as const,
      description:
        "Significant sponsorship package offering robust branding and recognition.",
      benefits: [
        "All benefits of Silver Tier",
        "Logo in monthly newsletter",
        "10 complimentary general memberships",
      ],
      isActive: true,
      isFeatured: false,
      sortOrder: 3,
    },
    {
      id: "silver",
      name: "Silver Sponsor",
      slug: "silver",
      tier: "SILVER" as const,
      amount: 1500.0,
      currency: "USD" as const,
      description:
        "Mid-level sponsorship package providing great brand visibility.",
      benefits: [
        "All benefits of Bronze Tier",
        "Prominent logo placement on website",
        "Social media spotlight post",
      ],
      isActive: true,
      isFeatured: false,
      sortOrder: 4,
    },
    {
      id: "bronze",
      name: "Bronze Sponsor",
      slug: "bronze",
      tier: "BRONZE" as const,
      amount: 500.0,
      currency: "USD" as const,
      description: "Supporting sponsorship package with standard visibility.",
      benefits: [
        "Name/Logo on website sponsors page",
        "Mention in annual report",
        "Certificate of appreciation",
      ],
      isActive: true,
      isFeatured: false,
      sortOrder: 5,
    },
  ]

  for (const plan of sponsorPlansToSeed) {
    await prisma.sponsorPlan.upsert({
      where: { id: plan.id },
      update: plan,
      create: plan,
    })
  }
  console.log("Seeding sponsor plans completed.")

  console.log("Seeding event categories...")
  const webinarCategory = await prisma.eventCategory.upsert({
    where: { name: "Webinars" },
    update: {},
    create: {
      name: "Webinars",
      description:
        "Online seminars, lectures, and interactive training sessions.",
    },
  })
  console.log(`Webinar category seeded: ${webinarCategory.name}`)

  const basicEventCategory = await prisma.eventCategory.upsert({
    where: { name: "Basic Events" },
    update: {},
    create: {
      name: "Basic Events",
      description: "General summits, roundtables, and public community events.",
    },
  })
  console.log(`Basic Event category seeded: ${basicEventCategory.name}`)

  console.log("Seeding events and webinars...")
  const eventsToSeed = [
    {
      title: "FCH Summer Faith Summit 2026",
      description:
        "Join hundreds of faith leaders, ministry practitioners, and catechists for three days of fellowship, presentations, and workshops.",
      startDate: new Date("2026-07-12T09:00:00Z"),
      endDate: new Date("2026-07-14T17:00:00Z"),
      location: "Orlando Convention Center (Hybrid)",
      maxCapacity: 500,
      visibility: "PUBLIC" as const,
      eventType: "EVENT" as const,
      categoryName: "Basic Events",
    },
    {
      title: "Pastoral Leaders Roundtable Discussion",
      description:
        "An open roundtable for general and pastoral members focusing on parish community engagement post-pandemic.",
      startDate: new Date("2026-07-20T15:00:00Z"),
      endDate: new Date("2026-07-20T16:30:00Z"),
      location: "Online (Zoom)",
      maxCapacity: 100,
      visibility: "PASTORAL_ONLY" as const,
      eventType: "EVENT" as const,
      categoryName: "Basic Events",
    },
    {
      title: "Webinar: Intro to Catechesis in Spanish Communities",
      description:
        "An online seminar focusing on the fundamentals of catechesis within Spanish-speaking ministry settings.",
      startDate: new Date("2026-07-25T14:00:00Z"),
      endDate: new Date("2026-07-25T15:30:00Z"),
      location: "Zoom Online",
      maxCapacity: 250,
      visibility: "FREE_WEBINAR" as const,
      eventType: "WEBINAR" as const,
      meetingLink: "https://zoom.us/j/98765432101",
      speakers: ["Dr. Maria Gomez", "Fr. John Doe"],
      categoryName: "Webinars",
    },
    {
      title: "Pastoral Webinar: Advanced Parish Ministry & Leadership Tools",
      description:
        "Specialized webinar for pastoral members covering advanced planning, ministry tools, and leadership strategies.",
      startDate: new Date("2026-08-01T13:00:00Z"),
      endDate: new Date("2026-08-01T14:30:00Z"),
      location: "Zoom Online",
      maxCapacity: 150,
      visibility: "PASTORAL_ONLY" as const,
      eventType: "WEBINAR" as const,
      meetingLink: "https://zoom.us/j/12345678901",
      speakers: ["Bishop Oscar Cantu", "Sister Mary"],
      categoryName: "Webinars",
    },
    {
      title: "Pastoral Webinar: Mental Health Support in Modern Parishes",
      description:
        "A specialized training seminar for pastoral workers on identifying and addressing pastoral care and mental health issues in parish groups.",
      startDate: new Date("2026-08-15T15:00:00Z"),
      endDate: new Date("2026-08-15T16:30:00Z"),
      location: "Zoom Online",
      maxCapacity: 100,
      visibility: "PASTORAL_ONLY" as const,
      eventType: "WEBINAR" as const,
      meetingLink: "https://zoom.us/j/2468101214",
      speakers: ["Dr. Thomas Brown", "Fr. Joseph Kelly"],
      categoryName: "Webinars",
    },
    {
      title: "Members Exclusive: Catechetical Best Practices & Visual Media",
      description:
        "Discover how to utilize online slide decks, video materials, and visual tools to enhance parish faith education. Exclusively for registered members.",
      startDate: new Date("2026-08-20T14:00:00Z"),
      endDate: new Date("2026-08-20T15:30:00Z"),
      location: "Zoom Online",
      maxCapacity: 200,
      visibility: "MEMBER_ONLY" as const,
      eventType: "WEBINAR" as const,
      meetingLink: "https://zoom.us/j/1357913579",
      speakers: ["Sister Claire Adams", "Mark Davis"],
      categoryName: "Webinars",
    },
    {
      title: "Webinar: Launching Family Catechesis Programs",
      description:
        "Learn the foundational frameworks for parent-led religious education in families. Open to all parish practitioners and volunteers.",
      startDate: new Date("2026-08-25T10:00:00Z"),
      endDate: new Date("2026-08-25T11:30:00Z"),
      location: "Zoom Online",
      maxCapacity: 300,
      visibility: "FREE_WEBINAR" as const,
      eventType: "WEBINAR" as const,
      meetingLink: "https://zoom.us/j/99988877766",
      speakers: ["Maria Ramirez", "John Smith"],
      categoryName: "Webinars",
    },
  ]

  for (const item of eventsToSeed) {
    const existing = await prisma.event.findFirst({
      where: { title: item.title },
    })

    if (!existing) {
      const { speakers, categoryName, ...eventData } = item
      const category =
        categoryName === "Webinars" ? webinarCategory : basicEventCategory
      await prisma.event.create({
        data: {
          ...eventData,
          isActive: true,
          status: "UPCOMING",
          categories: {
            connect: { id: category.id },
          },
          ...(item.eventType === "WEBINAR" && {
            webinar: {
              create: {
                speakers: speakers || [],
              },
            },
          }),
        },
      })
      console.log(`Created event/webinar: ${item.title}`)
    } else {
      console.log(`Event/webinar already exists: ${item.title}`)
    }
  }
  console.log("Seeding events and webinars completed.")

  console.log("Seeding complete!")
}

main().catch((e) => {
  console.error("Error seeding:", e)
  process.exit(1)
})
