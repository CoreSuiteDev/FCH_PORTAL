import path from "node:path"
import fs from "node:fs"
import { defineConfig } from "prisma/config"
import dotenv from "dotenv"

// Load env file from current directory or root directory
if (fs.existsSync(path.join(process.cwd(), ".env"))) {
  dotenv.config({ path: path.join(process.cwd(), ".env") })
} else if (fs.existsSync(path.join(process.cwd(), "../../.env"))) {
  dotenv.config({ path: path.join(process.cwd(), "../../.env") })
} else {
  dotenv.config()
}

export default defineConfig({
  schema: path.join("prisma", "schema"),
  migrations: {
    path: "prisma/migrations",
    seed: "bun prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/fch_portal?sslmode=disable",
  },
})
