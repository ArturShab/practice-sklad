-- CreateTable
CREATE TABLE "CharValue" (
    "id" SERIAL NOT NULL,
    "characteristic" INTEGER NOT NULL,
    "item" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "CharValue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CharValue_id_key" ON "CharValue"("id");

-- AddForeignKey
ALTER TABLE "CharValue" ADD CONSTRAINT "CharValue_characteristic_fkey" FOREIGN KEY ("characteristic") REFERENCES "Characteristic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharValue" ADD CONSTRAINT "CharValue_item_fkey" FOREIGN KEY ("item") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
