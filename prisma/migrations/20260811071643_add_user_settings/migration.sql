-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reduceMotion" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "aiReadingSuggestions" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "autoGenerateSummaries" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "readingStreakReminders" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "weeklyDigest" BOOLEAN NOT NULL DEFAULT false;
