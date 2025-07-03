-- CreateTable
CREATE TABLE "establishment_products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "commission" DECIMAL(5,4) NOT NULL,
    "stock" INTEGER NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "establishment_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "establishment_services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "commission" DECIMAL(5,4) NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "establishment_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "establishment_products_establishment_id_name_key" ON "establishment_products"("establishment_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "establishment_services_establishment_id_name_key" ON "establishment_services"("establishment_id", "name");

-- AddForeignKey
ALTER TABLE "establishment_products" ADD CONSTRAINT "establishment_products_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "establishment_services" ADD CONSTRAINT "establishment_services_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "establishments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
