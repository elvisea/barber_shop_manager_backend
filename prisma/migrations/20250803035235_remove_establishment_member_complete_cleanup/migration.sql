/*
  Warnings:

  - You are about to drop the column `new_member_id` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_id` on the `member_absence_periods` table. All the data in the column will be lost.
  - You are about to drop the column `new_member_id` on the `member_absence_periods` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `member_absence_periods` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_id` on the `member_working_hours` table. All the data in the column will be lost.
  - You are about to drop the column `new_member_id` on the `member_working_hours` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `member_working_hours` table. All the data in the column will be lost.
  - You are about to drop the column `new_member_id` on the `payment_orders` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_member_establishment_id` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `establishment_member_user_id` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `new_member_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `establishment_members` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[member_id,day_of_week]` on the table `member_working_hours` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `member_id` to the `member_absence_periods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `member_id` to the `member_working_hours` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_member_id_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_new_member_id_fkey";

-- DropForeignKey
ALTER TABLE "establishment_members" DROP CONSTRAINT "establishment_members_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "establishment_members" DROP CONSTRAINT "establishment_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "member_absence_periods" DROP CONSTRAINT "member_absence_periods_new_member_id_fkey";

-- DropForeignKey
ALTER TABLE "member_absence_periods" DROP CONSTRAINT "member_absence_periods_user_id_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "member_working_hours" DROP CONSTRAINT "member_working_hours_new_member_id_fkey";

-- DropForeignKey
ALTER TABLE "member_working_hours" DROP CONSTRAINT "member_working_hours_user_id_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_orders" DROP CONSTRAINT "payment_orders_member_id_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_orders" DROP CONSTRAINT "payment_orders_new_member_id_fkey";

-- DropForeignKey
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_establishment_member_user_id_establishment_m_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_member_id_establishment_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_new_member_id_fkey";

-- DropIndex
DROP INDEX "member_working_hours_user_id_establishment_id_day_of_week_key";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "new_member_id";

-- AlterTable
ALTER TABLE "member_absence_periods" DROP COLUMN "establishment_id",
DROP COLUMN "new_member_id",
DROP COLUMN "user_id",
ADD COLUMN     "member_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "member_working_hours" DROP COLUMN "establishment_id",
DROP COLUMN "new_member_id",
DROP COLUMN "user_id",
ADD COLUMN     "member_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "payment_orders" DROP COLUMN "new_member_id";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "establishment_member_establishment_id",
DROP COLUMN "establishment_member_user_id";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "new_member_id";

-- DropTable
DROP TABLE "establishment_members";

-- CreateIndex
CREATE UNIQUE INDEX "member_working_hours_member_id_day_of_week_key" ON "member_working_hours"("member_id", "day_of_week");

-- AddForeignKey
ALTER TABLE "member_working_hours" ADD CONSTRAINT "member_working_hours_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_absence_periods" ADD CONSTRAINT "member_absence_periods_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
