import { prisma } from "../src/infrastructure/database/prisma.js"
import { EventVisibility, EventType, EventStatus } from "../src/generated/prisma/client.js"

async function main() {
  console.log("Seeding Roles...")
  const roles = ["SUPER_ADMIN", "BOARD", "PASTORAL", "MEMBER"]
  const dbRoles: Record<string, any> = {}

  for (const roleName of roles) {
    const role = await prisma.role.upsert({
      where: { name: roleName },
      update: {},
      create: { name: roleName },
    })
    dbRoles[roleName] = role
    console.log(`Role seeded: ${role.name}`)
  }

  // Find the developer user (masrafi000@gmail.com) and grant them SUPER_ADMIN
  const devEmail = "masrafi000@gmail.com"
  const devUser = await prisma.user.findUnique({
    where: { email: devEmail },
  })

  if (devUser) {
    console.log(`Assigning SUPER_ADMIN role to dev user: ${devEmail}`)
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: devUser.id,
          roleId: dbRoles["SUPER_ADMIN"].id,
        },
      },
      update: {},
      create: {
        userId: devUser.id,
        roleId: dbRoles["SUPER_ADMIN"].id,
      },
    })
    console.log(`SUPER_ADMIN assigned successfully to ${devEmail}`)
  } else {
    console.log(`Dev user ${devEmail} not found. Creating a test admin user.`)
    const testAdmin = await prisma.user.upsert({
      where: { email: "admin@fch.org" },
      update: {},
      create: {
        name: "Admin User",
        email: "admin@fch.org",
        emailVerified: true,
      },
    })
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: testAdmin.id,
          roleId: dbRoles["SUPER_ADMIN"].id,
        },
      },
      update: {},
      create: {
        userId: testAdmin.id,
        roleId: dbRoles["SUPER_ADMIN"].id,
      },
    })
    console.log(`Test admin user created: admin@fch.org`)
  }

  console.log("Seeding Events...")
  const now = new Date()

  const eventsData = [
    {
      title: "Public Open House Q&A",
      description: "A public information session for anyone interested in FCH.",
      startDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: "Zoom Online",
      maxCapacity: 100,
      meetingLink: "https://zoom.us/j/public-qa",
      visibility: EventVisibility.PUBLIC,
      eventType: EventType.EVENT,
      status: EventStatus.UPCOMING,
    },
    {
      title: "How to Build with Next.js & Bun",
      description: "A free webinar showing best practices in modern web development.",
      startDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000), // in 4 days
      endDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
      location: "Zoom Online Webinar",
      maxCapacity: 250,
      meetingLink: "https://zoom.us/j/webinar-nextjs",
      visibility: EventVisibility.FREE_WEBINAR,
      eventType: EventType.WEBINAR,
      status: EventStatus.UPCOMING,
      webinarSpeaker: "Jane Doe",
      webinarCategory: "Technology",
    },
    {
      title: "Exclusive Member Networking Mixer",
      description: "Connect and network with fellow FCH General Members.",
      startDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // in 7 days
      endDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      location: "New York Conference Center / Discord",
      maxCapacity: 50,
      meetingLink: "https://discord.gg/members-only",
      visibility: EventVisibility.MEMBER_ONLY,
      eventType: EventType.EVENT,
      status: EventStatus.UPCOMING,
    },
    {
      title: "Pastoral Support Summit",
      description: "Strategic planning and mental health resources discussion for Pastors.",
      startDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // in 10 days
      endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      location: "Pastoral Retreat House",
      maxCapacity: 30,
      meetingLink: "https://zoom.us/j/pastors-only",
      visibility: EventVisibility.PASTORAL_ONLY,
      eventType: EventType.EVENT,
      status: EventStatus.UPCOMING,
    },
    {
      title: "Q3 Board of Directors Meeting",
      description: "Quarterly alignment and budgeting review. Internal attendance only.",
      startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // in 15 days
      endDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      location: "HQ Executive Boardroom",
      maxCapacity: 15,
      meetingLink: "https://teams.microsoft.com/board-room",
      visibility: EventVisibility.BOARD_ONLY,
      eventType: EventType.EVENT,
      status: EventStatus.UPCOMING,
    },
  ]

  for (const item of eventsData) {
    const { webinarSpeaker, webinarCategory, ...eventFields } = item as any
    const event = await prisma.event.create({
      data: {
        ...eventFields,
        isActive: true,
        ...(eventFields.eventType === EventType.WEBINAR
          ? {
              webinar: {
                create: {
                  speakers: webinarSpeaker ? [webinarSpeaker] : [],
                },
              },
            }
          : {}),
      },
    })
    console.log(`Created event: ${event.title} (Visibility: ${event.visibility})`)
  }

  console.log("Seeding events complete!")
}

main()
  .catch((e) => {
    console.error("Error seeding events:", e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
