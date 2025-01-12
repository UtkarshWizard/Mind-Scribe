-- CreateEnum
CREATE TYPE "ExerciseType" AS ENUM ('Breathing', 'Meditation', 'Music');

-- CreateTable
CREATE TABLE "moodTracking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mood" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "moodTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mindfullnessExercise" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentUrl" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "ExerciseType" NOT NULL,

    CONSTRAINT "mindfullnessExercise_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "moodTracking" ADD CONSTRAINT "moodTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
