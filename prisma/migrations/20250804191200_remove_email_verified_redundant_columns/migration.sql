/*
  Warnings:

  - You are about to drop the column `email_verified` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "email_verified";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_verified";
