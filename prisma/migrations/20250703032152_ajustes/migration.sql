/*
  Warnings:

  - The primary key for the `establishment_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `establishmentId` on the `establishment_members` table. All the data in the column will be lost.
  - You are about to drop the column `joined_at` on the `establishment_members` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `establishment_members` table. All the data in the column will be lost.
  - Added the required column `establishment_id` to the `establishment_members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `establishment_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "establishment_members" DROP CONSTRAINT "establishment_members_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "establishment_members" DROP CONSTRAINT "establishment_members_userId_fkey";

-- AlterTable
ALTER TABLE "establishment_members" DROP CONSTRAINT "establishment_members_pkey",
DROP COLUMN "establishmentId",
DROP COLUMN "joined_at",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "establishment_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL,
ADD CONSTRAINT "establishment_members_pkey" PRIMARY KEY ("user_id", "establishment_id");

-- AddForeignKey
ALTER TABLE "establishment_members" ADD CONSTRAINT "establishment_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_members" ADD CONSTRAINT "establishment_members_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
