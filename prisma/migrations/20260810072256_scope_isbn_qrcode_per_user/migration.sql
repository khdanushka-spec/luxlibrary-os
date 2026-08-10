-- DropIndex
DROP INDEX "Book_isbn13_key";

-- DropIndex
DROP INDEX "Book_qrCode_key";

-- CreateIndex
CREATE UNIQUE INDEX "Book_userId_isbn13_key" ON "Book"("userId", "isbn13");

-- CreateIndex
CREATE UNIQUE INDEX "Book_userId_qrCode_key" ON "Book"("userId", "qrCode");
