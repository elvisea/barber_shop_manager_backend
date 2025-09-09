-- AlterTable
ALTER TABLE "appointment_services" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "establishment_customers" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "establishment_products" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "establishment_services" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "establishments" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "member_email_verifications" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "member_products" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "member_services" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "payment_orders" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "plans" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "transaction_items" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user_email_verifications" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "appointment_services_deleted_at_idx" ON "appointment_services"("deleted_at");

-- CreateIndex
CREATE INDEX "appointment_services_is_deleted_idx" ON "appointment_services"("is_deleted");

-- CreateIndex
CREATE INDEX "appointments_deleted_at_idx" ON "appointments"("deleted_at");

-- CreateIndex
CREATE INDEX "appointments_is_deleted_idx" ON "appointments"("is_deleted");

-- CreateIndex
CREATE INDEX "establishment_customers_deleted_at_idx" ON "establishment_customers"("deleted_at");

-- CreateIndex
CREATE INDEX "establishment_customers_is_deleted_idx" ON "establishment_customers"("is_deleted");

-- CreateIndex
CREATE INDEX "establishment_products_deleted_at_idx" ON "establishment_products"("deleted_at");

-- CreateIndex
CREATE INDEX "establishment_products_is_deleted_idx" ON "establishment_products"("is_deleted");

-- CreateIndex
CREATE INDEX "establishment_services_deleted_at_idx" ON "establishment_services"("deleted_at");

-- CreateIndex
CREATE INDEX "establishment_services_is_deleted_idx" ON "establishment_services"("is_deleted");

-- CreateIndex
CREATE INDEX "establishments_deleted_at_idx" ON "establishments"("deleted_at");

-- CreateIndex
CREATE INDEX "establishments_is_deleted_idx" ON "establishments"("is_deleted");

-- CreateIndex
CREATE INDEX "member_email_verifications_deleted_at_idx" ON "member_email_verifications"("deleted_at");

-- CreateIndex
CREATE INDEX "member_email_verifications_is_deleted_idx" ON "member_email_verifications"("is_deleted");

-- CreateIndex
CREATE INDEX "member_products_deleted_at_idx" ON "member_products"("deleted_at");

-- CreateIndex
CREATE INDEX "member_products_is_deleted_idx" ON "member_products"("is_deleted");

-- CreateIndex
CREATE INDEX "member_services_deleted_at_idx" ON "member_services"("deleted_at");

-- CreateIndex
CREATE INDEX "member_services_is_deleted_idx" ON "member_services"("is_deleted");

-- CreateIndex
CREATE INDEX "members_deleted_at_idx" ON "members"("deleted_at");

-- CreateIndex
CREATE INDEX "members_is_deleted_idx" ON "members"("is_deleted");

-- CreateIndex
CREATE INDEX "payment_orders_deleted_at_idx" ON "payment_orders"("deleted_at");

-- CreateIndex
CREATE INDEX "payment_orders_is_deleted_idx" ON "payment_orders"("is_deleted");

-- CreateIndex
CREATE INDEX "plans_deleted_at_idx" ON "plans"("deleted_at");

-- CreateIndex
CREATE INDEX "plans_is_deleted_idx" ON "plans"("is_deleted");

-- CreateIndex
CREATE INDEX "subscriptions_deleted_at_idx" ON "subscriptions"("deleted_at");

-- CreateIndex
CREATE INDEX "subscriptions_is_deleted_idx" ON "subscriptions"("is_deleted");

-- CreateIndex
CREATE INDEX "transaction_items_deleted_at_idx" ON "transaction_items"("deleted_at");

-- CreateIndex
CREATE INDEX "transaction_items_is_deleted_idx" ON "transaction_items"("is_deleted");

-- CreateIndex
CREATE INDEX "transactions_deleted_at_idx" ON "transactions"("deleted_at");

-- CreateIndex
CREATE INDEX "transactions_is_deleted_idx" ON "transactions"("is_deleted");

-- CreateIndex
CREATE INDEX "user_email_verifications_deleted_at_idx" ON "user_email_verifications"("deleted_at");

-- CreateIndex
CREATE INDEX "user_email_verifications_is_deleted_idx" ON "user_email_verifications"("is_deleted");

-- CreateIndex
CREATE INDEX "users_deleted_at_idx" ON "users"("deleted_at");

-- CreateIndex
CREATE INDEX "users_is_deleted_idx" ON "users"("is_deleted");
