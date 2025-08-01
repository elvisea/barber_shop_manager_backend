-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'OWNER';

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "new_member_id" TEXT;

-- AlterTable
ALTER TABLE "member_absence_periods" ADD COLUMN     "new_member_id" TEXT;

-- AlterTable
ALTER TABLE "member_products" ADD COLUMN     "new_member_id" TEXT;

-- AlterTable
ALTER TABLE "member_services" ADD COLUMN     "new_member_id" TEXT;

-- AlterTable
ALTER TABLE "member_working_hours" ADD COLUMN     "new_member_id" TEXT;

-- AlterTable
ALTER TABLE "payment_orders" ADD COLUMN     "new_member_id" TEXT;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "new_member_id" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "new_member_id" TEXT;

-- CreateTable
CREATE TABLE "members" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "establishment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "member_id" TEXT NOT NULL,

    CONSTRAINT "member_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_establishment_id_email_key" ON "members"("establishment_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "members_establishment_id_phone_key" ON "members"("establishment_id", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "member_refresh_tokens_token_key" ON "member_refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_new_member_id_fkey" FOREIGN KEY ("new_member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_products" ADD CONSTRAINT "member_products_new_member_id_fkey" FOREIGN KEY ("new_member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_services" ADD CONSTRAINT "member_services_new_member_id_fkey" FOREIGN KEY ("new_member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_working_hours" ADD CONSTRAINT "member_working_hours_new_member_id_fkey" FOREIGN KEY ("new_member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_absence_periods" ADD CONSTRAINT "member_absence_periods_new_member_id_fkey" FOREIGN KEY ("new_member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_new_member_id_fkey" FOREIGN KEY ("new_member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_new_member_id_fkey" FOREIGN KEY ("new_member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_orders" ADD CONSTRAINT "payment_orders_new_member_id_fkey" FOREIGN KEY ("new_member_id") REFERENCES "members"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_refresh_tokens" ADD CONSTRAINT "member_refresh_tokens_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
