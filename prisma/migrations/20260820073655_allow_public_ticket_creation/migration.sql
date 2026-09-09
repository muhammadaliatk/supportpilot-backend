-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_createdById_fkey";

-- DropForeignKey
ALTER TABLE "TicketActivity" DROP CONSTRAINT "TicketActivity_userId_fkey";

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "createdById" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TicketActivity" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketActivity" ADD CONSTRAINT "TicketActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
