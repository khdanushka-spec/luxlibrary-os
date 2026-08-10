-- AlterTable
ALTER TABLE "Community" ADD COLUMN "singletonKey" TEXT NOT NULL DEFAULT 'bringbooks-community';

-- CreateIndex
CREATE UNIQUE INDEX "Community_singletonKey_key" ON "Community"("singletonKey");
