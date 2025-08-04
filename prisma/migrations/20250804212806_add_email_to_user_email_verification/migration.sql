/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user_email_verifications` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `user_email_verifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_email_verifications_token_key";

-- AlterTable
ALTER TABLE "user_email_verifications" ADD COLUMN     "email" TEXT;

-- Update existing records with email from users table
UPDATE "user_email_verifications" 
SET "email" = "users"."email" 
FROM "users" 
WHERE "user_email_verifications"."user_id" = "users"."id";

-- Make email column NOT NULL after populating it
ALTER TABLE "user_email_verifications" ALTER COLUMN "email" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_email_verifications_email_key" ON "user_email_verifications"("email");

-- CreateIndex
CREATE INDEX "user_email_verifications_email_idx" ON "user_email_verifications"("email");
