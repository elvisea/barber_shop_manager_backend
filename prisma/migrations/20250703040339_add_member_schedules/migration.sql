-- CreateTable
CREATE TABLE "member_working_hours" (
    "id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_working_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_absence_periods" (
    "id" TEXT NOT NULL,
    "reason" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_absence_periods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_working_hours_user_id_establishment_id_day_of_week_key" ON "member_working_hours"("user_id", "establishment_id", "day_of_week");

-- AddForeignKey
ALTER TABLE "member_working_hours" ADD CONSTRAINT "member_working_hours_user_id_establishment_id_fkey" FOREIGN KEY ("user_id", "establishment_id") REFERENCES "establishment_members"("user_id", "establishment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_absence_periods" ADD CONSTRAINT "member_absence_periods_user_id_establishment_id_fkey" FOREIGN KEY ("user_id", "establishment_id") REFERENCES "establishment_members"("user_id", "establishment_id") ON DELETE CASCADE ON UPDATE CASCADE;
