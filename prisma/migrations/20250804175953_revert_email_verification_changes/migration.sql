/*
  Warnings:

  - You are about to drop the `member_email_verifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "member_email_verifications" DROP CONSTRAINT "member_email_verifications_member_id_fkey";

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email_verified" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "member_email_verifications";
