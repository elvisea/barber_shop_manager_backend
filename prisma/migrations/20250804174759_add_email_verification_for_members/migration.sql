/*
  Warnings:

  - You are about to drop the column `email_verified` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "members" DROP COLUMN "email_verified";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email_verified";

-- CreateTable
CREATE TABLE "member_email_verifications" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" TEXT NOT NULL,

    CONSTRAINT "member_email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_email_verifications_token_key" ON "member_email_verifications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "member_email_verifications_member_id_key" ON "member_email_verifications"("member_id");

-- AddForeignKey
ALTER TABLE "member_email_verifications" ADD CONSTRAINT "member_email_verifications_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
