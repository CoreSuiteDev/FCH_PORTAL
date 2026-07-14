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

  console.log("Seeding authors...")
  const authorsToSeed = [
    {
      name: "Luke Admin",
      slug: "luke-admin",
      designation: "FCH Board Member",
      bio: "Luke is the lead administrator for FCH, managing community outreach and platform updates.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      name: "Dr. Maria Gomez",
      slug: "maria-gomez",
      designation: "FCH Theologian & Educator",
      bio: "Dr. Maria Gomez is a theologian focusing on Hispanic faith formation and catechesis.",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
    },
    {
      name: "Bishop Oscar Cantu",
      slug: "oscar-cantu",
      designation: "Board Member & Advisor",
      bio: "Bishop Oscar Cantu provides spiritual guidance and pastoral leadership insights.",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150",
    },
  ]

  const seededAuthors: Record<string, any> = {}
  for (const author of authorsToSeed) {
    const existing = await prisma.author.findUnique({
      where: { slug: author.slug },
    })
    if (!existing) {
      const created = await prisma.author.create({
        data: author,
      })
      seededAuthors[author.slug] = created
      console.log(`Created author: ${author.name}`)
    } else {
      seededAuthors[author.slug] = existing
      console.log(`Author already exists: ${author.name}`)
    }
  }

  console.log("Seeding news and blogs...")
  const newsToSeed = [
    {
      title: "Augustine Institute Sponsors Fch At The La Conference",
      supTitle: "Community & Partnership",
      slug: "augustine-institute-sponsors-fch-la-conference",
      excerpt: "A big thank you to the Augustine Institute for sponsoring Rev. Yojaneider Garcia, FCH Theologian, to attend the Los Angeles Conference.",
      content: "A big thank you to the Augustine Institute for sponsoring Rev. Yojaneider Garcia, FCH Theologian, to attend the Los Angeles Religious Education Congress. This collaboration continues our mission of bringing quality catechesis and formation to the Hispanic community across the United States. We look forward to more partnerships that elevate our ministry leaders.\n\nOur presence at the LA Conference was marked by fruitful discussions and high attendance at our sessions. We thank everyone who came by our booth to learn more about the Federation for Catechesis with Hispanics.",
      status: "PUBLISHED" as const,
      newsType: "NEWS" as const,
      featuredImage: "/assets/news1.jpg",
      featuredImageAlt: "Augustine Institute Sponsor Event",
      publishedAt: new Date("2026-05-20T10:00:00Z"),
      authorSlug: "luke-admin",
      tags: ["partnership", "conference", "la-congress"]
    },
    {
      title: "Fch Joins Nuevo Momento Initiative At Boston College",
      supTitle: "Academic Collaboration",
      slug: "fch-joins-nuevo-momento-initiative-boston-college",
      excerpt: "FCH becomes part of the Nuevo Momento, a Boston College Initiative under the direction of Dr. Hosffman Ospino to empower pastoral leaders.",
      content: "FCH is proud to announce its participation in the Nuevo Momento Initiative at Boston College, directed by Dr. Hosffman Ospino. This initiative focuses on empowering pastoral leaders and building robust religious education frameworks tailored to Hispanic Catholic contexts.\n\nThrough this partnership, FCH will contribute to research, resource sharing, and community engagement. We will gather data on best practices from across our network and use these insights to train next-generation catechists.",
      status: "PUBLISHED" as const,
      newsType: "NEWS" as const,
      featuredImage: "/assets/news2.jpg",
      featuredImageAlt: "Boston College Nuevo Momento",
      publishedAt: new Date("2026-05-22T10:00:00Z"),
      authorSlug: "maria-gomez",
      tags: ["education", "boston-college", "leadership"]
    },
    {
      title: "Pope Francis 1936-2025: A Legacy of Pastoral Love",
      supTitle: "Vatican Tributes",
      slug: "pope-francis-legacy-pastoral-love",
      excerpt: "May God's love and peace be a comfort to all those who knew, loved, and were blessed by the ministry of Pope Francis.",
      content: "We reflect on the profound legacy of Pope Francis, whose ministry emphasized mercy, dialogue, and closeness to the marginalized. His teachings, particularly in Evangelii Gaudium, continue to inspire our catechetical mission. Let us pray for his eternal rest and continue the path of pastoral accompaniment he so beautifully paved.\n\nFCH members are encouraged to host prayer circles and study groups on the encyclicals and pastoral instructions that defined his historic pontificate.",
      status: "PUBLISHED" as const,
      newsType: "NEWS" as const,
      featuredImage: "/assets/news3.jpg",
      featuredImageAlt: "Pope Francis Portrait",
      publishedAt: new Date("2026-05-25T10:00:00Z"),
      authorSlug: "oscar-cantu",
      tags: ["pope-francis", "vatican", "tribute"]
    },
    {
      title: "Global Unity Initiative Launched",
      supTitle: "Global Outreach",
      slug: "global-unity-initiative-launched",
      excerpt: "A major global initiative promoting unity and collaboration across diverse communities.",
      content: "A new global initiative has been launched to promote unity, mutual support, and collaborative ministry across diverse Catholic communities. The program focuses on sharing resources, coordinating digital events, and establishing mentorship connections for physical classes or virtual groups. FCH is excited to be at the forefront of this initiative.\n\nWe will collaborate with organizations in Europe and Latin America to run monthly seminars on intercultural formation and shared faith experiences.",
      status: "PUBLISHED" as const,
      newsType: "BLOG" as const,
      featuredImage: "https://picsum.photos/seed/unity/800/600",
      featuredImageAlt: "Global Unity",
      publishedAt: new Date("2026-06-01T10:00:00Z"),
      authorSlug: "luke-admin",
      tags: ["global", "unity", "collaboration"]
    },
    {
      title: "Daily Readings & Spiritual Reflections",
      supTitle: "Spiritual Life",
      slug: "daily-readings-spiritual-reflections",
      excerpt: "Access daily spiritual readings and reflections from Vatican sources for personal and parish growth.",
      content: "Nurturing daily faith requires consistent reflection. We are happy to share that our portal will now feature curated daily readings and spiritual reflections aligned with the liturgical calendar. These resources are designed for personal prayer as well as group study within your parish communities.\n\nCatechists can use these reading plans as daily warm-ups or closing prayers during faith formation sessions.",
      status: "PUBLISHED" as const,
      newsType: "ANNOUNCEMENT" as const,
      featuredImage: "https://picsum.photos/seed/readings/800/600",
      featuredImageAlt: "Daily Bible Readings",
      publishedAt: new Date("2026-06-05T10:00:00Z"),
      authorSlug: "maria-gomez",
      tags: ["readings", "spirituality", "vatican"]
    },
    {
      title: "Saint of the Day and Catechetical Lessons",
      supTitle: "Faith Education",
      slug: "saint-of-the-day-catechetical-lessons",
      excerpt: "Learn about the saint of the day and their teachings for modern ministry.",
      content: "The lives of the saints offer a rich tapestry of faith, courage, and dedication. FCH is launching a weekly series highlighting the 'Saint of the Day' with accompanying lesson plans that catechists can easily download and use in their classrooms.\n\nFrom St. Teresa of Avila to St. Oscar Romero, discover how the saints can inspire contemporary discipleship in our communities.",
      status: "PUBLISHED" as const,
      newsType: "BLOG" as const,
      featuredImage: "https://picsum.photos/seed/saint/800/600",
      featuredImageAlt: "Stained Glass Saints",
      publishedAt: new Date("2026-06-10T10:00:00Z"),
      authorSlug: "oscar-cantu",
      tags: ["saints", "lessons", "catechesis"]
    }
  ]

  for (const item of newsToSeed) {
    const existing = await prisma.news.findUnique({
      where: { slug: item.slug },
    })

    if (!existing) {
      const author = seededAuthors[item.authorSlug]
      if (!author) {
        console.error(`Could not find author for slug: ${item.authorSlug}. Skipping news: ${item.title}`)
        continue
      }

      const { authorSlug, tags, ...newsData } = item
      await prisma.news.create({
        data: {
          ...newsData,
          authorId: author.id,
          tags: {
            connectOrCreate: tags.map(tag => ({
              where: { slug: tag },
              create: { name: tag.charAt(0).toUpperCase() + tag.slice(1), slug: tag }
            }))
          }
        }
      })
      console.log(`Created news: ${item.title}`)
    } else {
      console.log(`News already exists: ${item.title}`)
    }
  }
  console.log("Seeding authors and news completed.")

  console.log("Seeding complete!")
}

main().catch((e) => {
  console.error("Error seeding:", e)
  process.exit(1)
})
