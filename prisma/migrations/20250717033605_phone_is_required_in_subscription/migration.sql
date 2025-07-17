/*
  Warnings:

  - Made the column `phone` on table `subscriptions` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "subscriptions" ALTER COLUMN "phone" SET NOT NULL;
