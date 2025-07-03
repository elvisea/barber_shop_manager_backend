-- CreateTable
CREATE TABLE "member_products" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "commission" DECIMAL(5,4) NOT NULL,
    "user_id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "member_services" (
    "id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "commission" DECIMAL(5,4) NOT NULL,
    "duration" INTEGER NOT NULL,
    "user_id" TEXT NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "member_services_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "member_products_user_id_establishment_id_product_id_key" ON "member_products"("user_id", "establishment_id", "product_id");

-- CreateIndex
CREATE UNIQUE INDEX "member_services_user_id_establishment_id_service_id_key" ON "member_services"("user_id", "establishment_id", "service_id");

-- AddForeignKey
ALTER TABLE "member_products" ADD CONSTRAINT "member_products_user_id_establishment_id_fkey" FOREIGN KEY ("user_id", "establishment_id") REFERENCES "establishment_members"("user_id", "establishment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_products" ADD CONSTRAINT "member_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "establishment_products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_services" ADD CONSTRAINT "member_services_user_id_establishment_id_fkey" FOREIGN KEY ("user_id", "establishment_id") REFERENCES "establishment_members"("user_id", "establishment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "member_services" ADD CONSTRAINT "member_services_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "establishment_services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
