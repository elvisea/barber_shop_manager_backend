/*
  Warnings:

  - You are about to drop the column `new_member_id` on the `member_products` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `member_products` table. All the data in the column will be lost.
  - You are about to drop the column `new_member_id` on the `member_services` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `member_services` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[member_id,establishment_id,product_id]` on the table `member_products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[member_id,establishment_id,service_id]` on the table `member_services` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `member_id` to the `member_products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_id` to the `member_services` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "member_products" DROP CONSTRAINT "member_products_new_member_id_fkey";

-- DropForeignKey
ALTER TABLE "member_products" DROP CONSTRAINT "member_products_user_id_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "member_services" DROP CONSTRAINT "member_services_new_member_id_fkey";

-- DropForeignKey
ALTER TABLE "member_services" DROP CONSTRAINT "member_services_user_id_establishment_id_fkey";

-- DropIndex
DROP INDEX "member_products_user_id_establishment_id_product_id_key";

-- DropIndex
DROP INDEX "member_services_user_id_establishment_id_service_id_key";

-- AlterTable
ALTER TABLE "member_products" DROP COLUMN "new_member_id",
DROP COLUMN "user_id",
ADD COLUMN     "member_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "member_services" DROP COLUMN "new_member_id",
DROP COLUMN "user_id",
ADD COLUMN     "member_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "member_products_member_id_establishment_id_product_id_key" ON "member_products"("member_id", "establishment_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_services_member_id_establishment_id_service_id_key" ON "member_services"("member_id", "establishment_id", "service_id");

-- AddForeignKey
ALTER TABLE "member_products" ADD CONSTRAINT "member_products_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_services" ADD CONSTRAINT "member_services_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
