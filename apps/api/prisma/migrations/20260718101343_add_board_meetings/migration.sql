-- CreateEnum
CREATE TYPE "MeetingType" AS ENUM ('ONE_TO_ONE', 'ONE_TO_MANY');

-- CreateEnum
CREATE TYPE "MeetingRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "board_meeting" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "meetingLink" TEXT,
    "meetingType" "MeetingType" NOT NULL DEFAULT 'ONE_TO_MANY',
    "requestId" TEXT,

    CONSTRAINT "board_meeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board_meeting_attendee" (
    "id" TEXT NOT NULL,
    "meetingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "board_meeting_attendee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meeting_request" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "MeetingRequestStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "meeting_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "board_meeting_requestId_key" ON "board_meeting"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "board_meeting_attendee_meetingId_userId_key" ON "board_meeting_attendee"("meetingId", "userId");

-- AddForeignKey
ALTER TABLE "board_meeting" ADD CONSTRAINT "board_meeting_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "meeting_request"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_meeting_attendee" ADD CONSTRAINT "board_meeting_attendee_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "board_meeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "board_meeting_attendee" ADD CONSTRAINT "board_meeting_attendee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "meeting_request" ADD CONSTRAINT "meeting_request_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
