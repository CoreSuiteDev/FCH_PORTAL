// import { prisma } from "../src/infrastructure/database/prisma.js"
// import { auth } from "../src/lib/auth.js"

// async function main() {
//   console.log("Seeding admin user...")
//   const adminEmail = "smmasrafi2003@gmail.com"
//   const adminPassword = "AdminPassword123!"
//   const adminName = "Admin User"

//   let user = await prisma.user.findUnique({
//     where: { email: adminEmail },
//     include: { accounts: true },
//   })

//   if (!user) {
//     console.log(`Creating admin user: ${adminEmail}`)
//     try {
//       await auth.api.signUpEmail({
//         body: {
//           email: adminEmail,
//           password: adminPassword,
//           name: adminName,
//         },
//       })

//       user = await prisma.user.findUnique({
//         where: { email: adminEmail },
//         include: { accounts: true },
//       })
//     } catch (err) {
//       console.error("Failed to sign up admin user:", err)
//     }
//   } else {
//     console.log(`Admin user already exists: ${adminEmail}`)
//   }

//   if (!user) {
//     console.error("Could not find or create admin user. Aborting.")
//     process.exit(1)
//   }

//   // Ensure a credential account exists for password login
//   const credentialAccount = user.accounts.find(
//     (a) => a.providerId === "credential"
//   )
//   if (!credentialAccount) {
//     console.log("No credential account found. Creating one directly...")
//     const context = await auth.$context
//     const hashedPassword = await context.password.hash(adminPassword)

//     await prisma.account.upsert({
//       where: {
//         providerId_accountId: {
//           providerId: "credential",
//           accountId: user.id,
//         },
//       },
//       update: { password: hashedPassword },
//       create: {
//         accountId: user.id,
//         providerId: "credential",
//         userId: user.id,
//         password: hashedPassword,
//       },
//     })
//     console.log("Credential account created for admin user.")
//   } else {
//     console.log("Credential account already exists.")
//   }

//   console.log("Seeding ADMIN role and associating with user...")
//   const adminRole = await prisma.role.upsert({
//     where: { name: "ADMIN" },
//     update: {},
//     create: {
//       name: "ADMIN",
//       description: "Administrator Role with full access",
//     },
//   })

//   await prisma.userRole.upsert({
//     where: {
//       userId_roleId: {
//         userId: user.id,
//         roleId: adminRole.id,
//       },
//     },
//     update: {},
//     create: {
//       userId: user.id,
//       roleId: adminRole.id,
//     },
//   })
//   console.log(`Admin user ${adminEmail} successfully linked to ADMIN role.`)

//   console.log("Seeding complete!")
// }

// main()
//   .catch((e) => {
//     console.error("Error seeding:", e)
//     process.exit(1)
//   })
