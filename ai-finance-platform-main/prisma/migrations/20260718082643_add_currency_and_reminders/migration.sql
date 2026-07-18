-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR';

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "reminderSentAt" TIMESTAMP(3);
