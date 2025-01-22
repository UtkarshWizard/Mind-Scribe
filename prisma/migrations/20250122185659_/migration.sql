/*
  Warnings:

  - The `sentiment` column on the `JournalEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "sentiment",
ADD COLUMN     "sentiment" JSONB;
