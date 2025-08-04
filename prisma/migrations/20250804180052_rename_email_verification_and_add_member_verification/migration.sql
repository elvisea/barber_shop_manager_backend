/*
  Warnings:

  - You are about to drop the `email_verifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "email_verifications" DROP CONSTRAINT "email_verifications_user_id_fkey";

-- DropTable
DROP TABLE "email_verifications";

-- CreateTable
CREATE TABLE "user_email_verifications" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_email_verifications" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" TEXT NOT NULL,

    CONSTRAINT "member_email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_verifications_token_key" ON "user_email_verifications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_verifications_user_id_key" ON "user_email_verifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_email_verifications_token_key" ON "member_email_verifications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "member_email_verifications_member_id_key" ON "member_email_verifications"("member_id");

-- AddForeignKey
ALTER TABLE "user_email_verifications" ADD CONSTRAINT "user_email_verifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_email_verifications" ADD CONSTRAINT "member_email_verifications_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
