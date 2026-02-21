/*
  Warnings:

  - Added the required column `plainText` to the `JournalEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "JournalEntry" ADD COLUMN     "plainText" TEXT NOT NULL;
