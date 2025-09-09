-- AlterTable
ALTER TABLE "closure_periods" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "member_absence_periods" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "member_refresh_tokens" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "member_working_hours" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "opening_hours" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "deleted_by" TEXT,
ADD COLUMN     "is_deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "closure_periods_deleted_at_idx" ON "closure_periods"("deleted_at");

-- CreateIndex
CREATE INDEX "closure_periods_is_deleted_idx" ON "closure_periods"("is_deleted");

-- CreateIndex
CREATE INDEX "member_absence_periods_deleted_at_idx" ON "member_absence_periods"("deleted_at");

-- CreateIndex
CREATE INDEX "member_absence_periods_is_deleted_idx" ON "member_absence_periods"("is_deleted");

-- CreateIndex
CREATE INDEX "member_refresh_tokens_deleted_at_idx" ON "member_refresh_tokens"("deleted_at");

-- CreateIndex
CREATE INDEX "member_refresh_tokens_is_deleted_idx" ON "member_refresh_tokens"("is_deleted");

-- CreateIndex
CREATE INDEX "member_working_hours_deleted_at_idx" ON "member_working_hours"("deleted_at");

-- CreateIndex
CREATE INDEX "member_working_hours_is_deleted_idx" ON "member_working_hours"("is_deleted");

-- CreateIndex
CREATE INDEX "opening_hours_deleted_at_idx" ON "opening_hours"("deleted_at");

-- CreateIndex
CREATE INDEX "opening_hours_is_deleted_idx" ON "opening_hours"("is_deleted");

-- CreateIndex
CREATE INDEX "refresh_tokens_deleted_at_idx" ON "refresh_tokens"("deleted_at");

-- CreateIndex
CREATE INDEX "refresh_tokens_is_deleted_idx" ON "refresh_tokens"("is_deleted");
