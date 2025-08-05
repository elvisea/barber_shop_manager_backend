/*
  Warnings:

  - Changed the type of `role` on the `members` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'ROOT');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('RECEPTIONIST', 'HAIRDRESSER', 'BARBER');

-- AlterTable
ALTER TABLE "members" DROP COLUMN "role",
ADD COLUMN     "role" "MemberRole" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'OWNER';

-- DropEnum
DROP TYPE "Role";
