import { PrismaPg } from "@prisma/adapter-pg"
import "dotenv/config"
import pg from "pg"
import { PrismaClient, Prisma } from "../../generated/prisma/client.js"

const connectionString = `${process.env.DATABASE_URL}`

const pool = new pg.Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  keepAlive: true,
})

const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

export { prisma, Prisma }
