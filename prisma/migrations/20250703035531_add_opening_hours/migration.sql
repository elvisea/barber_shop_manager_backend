-- CreateTable
CREATE TABLE "opening_hours" (
    "id" TEXT NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "opening_time" TEXT NOT NULL,
    "closing_time" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opening_hours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "opening_hours_establishment_id_day_of_week_key" ON "opening_hours"("establishment_id", "day_of_week");

-- AddForeignKey
ALTER TABLE "opening_hours" ADD CONSTRAINT "opening_hours_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
