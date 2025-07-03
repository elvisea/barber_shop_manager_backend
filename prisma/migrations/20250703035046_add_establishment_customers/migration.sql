-- CreateTable
CREATE TABLE "establishment_customers" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "establishment_id" TEXT NOT NULL,

    CONSTRAINT "establishment_customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "establishment_customers_establishment_id_email_key" ON "establishment_customers"("establishment_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "establishment_customers_establishment_id_phone_key" ON "establishment_customers"("establishment_id", "phone");

-- AddForeignKey
ALTER TABLE "establishment_customers" ADD CONSTRAINT "establishment_customers_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
