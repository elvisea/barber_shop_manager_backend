/*
  Warnings:

  - You are about to drop the column `establishmentMemberEstablishmentId` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `establishmentMemberUserId` on the `subscriptions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_establishmentMemberUserId_establishmentMembe_fkey";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "establishmentMemberEstablishmentId",
DROP COLUMN "establishmentMemberUserId",
ADD COLUMN     "establishment_member_establishment_id" TEXT,
ADD COLUMN     "establishment_member_user_id" TEXT;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_establishment_member_user_id_establishment_m_fkey" FOREIGN KEY ("establishment_member_user_id", "establishment_member_establishment_id") REFERENCES "establishment_members"("user_id", "establishment_id") ON DELETE SET NULL ON UPDATE CASCADE;
