-- AlterTable
ALTER TABLE "User" ADD COLUMN     "readingStreakDays" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "readingChallengeGoal" INTEGER NOT NULL DEFAULT 60;
