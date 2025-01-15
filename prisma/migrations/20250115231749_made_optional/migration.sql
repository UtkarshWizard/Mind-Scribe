-- AlterTable
ALTER TABLE "JournalEntry" ALTER COLUMN "sentiment" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "mindfullnessExercise" ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "moodTracking" ALTER COLUMN "notes" DROP NOT NULL;
