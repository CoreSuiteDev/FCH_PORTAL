import { prisma } from "../src/infrastructure/database/prisma.js"

async function main() {
  console.log("Seeding membership packages...")

  const packages = [
    {
      name: "General Monthly",
      slug: "general-monthly",
      type: "GENERAL" as const,
      billingCycle: "MONTHLY" as const,
      price: 10.0,
      currency: "USD" as const,
      oktaGroup: "FCH-General-Monthly",
      description: "General membership billed monthly",
      isActive: true,
    },
    {
      name: "General Yearly",
      slug: "general-yearly",
      type: "GENERAL" as const,
      billingCycle: "YEARLY" as const,
      price: 100.0,
      currency: "USD" as const,
      oktaGroup: "FCH-General-Yearly",
      description: "General membership billed annually",
      isActive: true,
    },
    {
      name: "Pastoral Monthly",
      slug: "pastoral-monthly",
      type: "PASTORAL" as const,
      billingCycle: "MONTHLY" as const,
      price: 20.0,
      currency: "USD" as const,
      oktaGroup: "FCH-Pastoral-Monthly",
      description: "Pastoral membership billed monthly",
      isActive: true,
    },
    {
      name: "Pastoral Yearly",
      slug: "pastoral-yearly",
      type: "PASTORAL" as const,
      billingCycle: "YEARLY" as const,
      price: 200.0,
      currency: "USD" as const,
      oktaGroup: "FCH-Pastoral-Yearly",
      description: "Pastoral membership billed annually",
      isActive: true,
    },
  ]

  for (const pkg of packages) {
    const upserted = await prisma.membershipPackage.upsert({
      where: { slug: pkg.slug },
      update: {
        name: pkg.name,
        type: pkg.type,
        billingCycle: pkg.billingCycle,
        price: pkg.price,
        currency: pkg.currency,
        oktaGroup: pkg.oktaGroup,
        description: pkg.description,
        isActive: pkg.isActive,
      },
      create: pkg,
    })
    console.log(`Upserted package: ${upserted.name} (${upserted.slug})`)
  }

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error("Error seeding:", e)
    process.exit(1)
  })
