/*
  Warnings:

  - You are about to drop the `Donation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Donator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sponsor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SponsorPlans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SponsorShip` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'BANK_TRANSFER', 'CASH', 'OTHER');

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_donatorId_fkey";

-- DropForeignKey
ALTER TABLE "Donation" DROP CONSTRAINT "Donation_userId_fkey";

-- DropForeignKey
ALTER TABLE "SponsorShip" DROP CONSTRAINT "SponsorShip_sponsorId_fkey";

-- DropForeignKey
ALTER TABLE "SponsorShip" DROP CONSTRAINT "SponsorShip_userId_fkey";

-- DropTable
DROP TABLE "Donation";

-- DropTable
DROP TABLE "Donator";

-- DropTable
DROP TABLE "Sponsor";

-- DropTable
DROP TABLE "SponsorPlans";

-- DropTable
DROP TABLE "SponsorShip";

-- CreateTable
CREATE TABLE "donations" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CARD',
    "paymentIntentId" TEXT,
    "paymentTransactionId" TEXT,
    "stripeChargeId" TEXT,
    "cardLast4" TEXT,
    "cardBrand" TEXT,
    "receiptUrl" TEXT,
    "invoiceUrl" TEXT,
    "failureReason" TEXT,
    "refundedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "refundedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "message" TEXT,
    "donatorId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donators" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "stripeCustomerId" TEXT,
    "totalDonationAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalDonationCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "donators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsor_plans" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" VARCHAR(100) NOT NULL,
    "slug" TEXT NOT NULL,
    "tier" "Tier" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "description" TEXT,
    "benefits" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sponsor_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsorships" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "planId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMethod" "PaymentMethod",
    "paymentIntentId" TEXT,
    "paymentTransactionId" TEXT,
    "stripeChargeId" TEXT,
    "stripeCustomerId" TEXT,
    "cardBrand" TEXT,
    "cardLast4" TEXT,
    "receiptUrl" TEXT,
    "invoiceUrl" TEXT,
    "errorMessage" TEXT,
    "refundedAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "refundedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "sponsorId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "sponsorships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "name" VARCHAR(120) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" VARCHAR(20),
    "company" TEXT,
    "website" TEXT,
    "logo" TEXT,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "donations_paymentIntentId_key" ON "donations"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "donations_paymentTransactionId_key" ON "donations"("paymentTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "donations_stripeChargeId_key" ON "donations"("stripeChargeId");

-- CreateIndex
CREATE INDEX "donations_status_idx" ON "donations"("status");

-- CreateIndex
CREATE INDEX "donations_currency_idx" ON "donations"("currency");

-- CreateIndex
CREATE INDEX "donations_createdAt_idx" ON "donations"("createdAt");

-- CreateIndex
CREATE INDEX "donations_donatorId_idx" ON "donations"("donatorId");

-- CreateIndex
CREATE INDEX "donations_userId_idx" ON "donations"("userId");

-- CreateIndex
CREATE INDEX "donations_status_createdAt_idx" ON "donations"("status", "createdAt");

-- CreateIndex
CREATE INDEX "donations_donatorId_createdAt_idx" ON "donations"("donatorId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "donators_stripeCustomerId_key" ON "donators"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "donators_email_idx" ON "donators"("email");

-- CreateIndex
CREATE INDEX "donators_stripeCustomerId_idx" ON "donators"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "donators_email_key" ON "donators"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sponsor_plans_slug_key" ON "sponsor_plans"("slug");

-- CreateIndex
CREATE INDEX "sponsor_plans_tier_idx" ON "sponsor_plans"("tier");

-- CreateIndex
CREATE INDEX "sponsor_plans_isActive_idx" ON "sponsor_plans"("isActive");

-- CreateIndex
CREATE INDEX "sponsor_plans_sortOrder_idx" ON "sponsor_plans"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "sponsorships_paymentIntentId_key" ON "sponsorships"("paymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "sponsorships_paymentTransactionId_key" ON "sponsorships"("paymentTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "sponsorships_stripeChargeId_key" ON "sponsorships"("stripeChargeId");

-- CreateIndex
CREATE INDEX "sponsorships_planId_idx" ON "sponsorships"("planId");

-- CreateIndex
CREATE INDEX "sponsorships_sponsorId_idx" ON "sponsorships"("sponsorId");

-- CreateIndex
CREATE INDEX "sponsorships_userId_idx" ON "sponsorships"("userId");

-- CreateIndex
CREATE INDEX "sponsorships_status_idx" ON "sponsorships"("status");

-- CreateIndex
CREATE INDEX "sponsorships_createdAt_idx" ON "sponsorships"("createdAt");

-- CreateIndex
CREATE INDEX "sponsorships_status_createdAt_idx" ON "sponsorships"("status", "createdAt");

-- CreateIndex
CREATE INDEX "sponsorships_sponsorId_createdAt_idx" ON "sponsorships"("sponsorId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_email_key" ON "sponsors"("email");

-- CreateIndex
CREATE INDEX "sponsors_email_idx" ON "sponsors"("email");

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donatorId_fkey" FOREIGN KEY ("donatorId") REFERENCES "donators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_planId_fkey" FOREIGN KEY ("planId") REFERENCES "sponsor_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_sponsorId_fkey" FOREIGN KEY ("sponsorId") REFERENCES "sponsors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sponsorships" ADD CONSTRAINT "sponsorships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
