/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `member_email_verifications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `member_email_verifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "member_email_verifications_token_key";

-- AlterTable
ALTER TABLE "member_email_verifications" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "member_email_verifications_email_key" ON "member_email_verifications"("email");

-- CreateIndex
CREATE INDEX "member_email_verifications_email_idx" ON "member_email_verifications"("email");
