/*
  Warnings:

  - Changed the type of `mood` on the `moodTracking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('Happy', 'Sad', 'Neutral');

-- AlterTable
ALTER TABLE "moodTracking" DROP COLUMN "mood",
ADD COLUMN     "mood" "Mood" NOT NULL;
