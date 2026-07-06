/*
  Warnings:

  - You are about to drop the column `phone` on the `contact_inqueries` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `contact_inqueries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "contact_inqueries" DROP COLUMN "phone",
DROP COLUMN "updatedAt",
ALTER COLUMN "message" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "passwordChangeRequired" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "newsletter_subscribers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletter_subscribers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "newsletter_subscribers_email_key" ON "newsletter_subscribers"("email");

-- CreateIndex
CREATE INDEX "newsletter_subscribers_createdAt_idx" ON "newsletter_subscribers"("createdAt");
