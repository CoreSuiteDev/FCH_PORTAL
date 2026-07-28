/*
  Warnings:

  - Added the required column `phone` to the `contact_inqueries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `contact_inqueries` table without a default value. This is not possible if the table is not empty.
  - Made the column `message` on table `contact_inqueries` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "contact_inqueries" ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "message" SET NOT NULL;
