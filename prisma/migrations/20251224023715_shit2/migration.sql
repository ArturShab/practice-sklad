-- DropForeignKey
ALTER TABLE "CharValue" DROP CONSTRAINT "CharValue_characteristic_fkey";

-- DropForeignKey
ALTER TABLE "CharValue" DROP CONSTRAINT "CharValue_item_fkey";

-- DropForeignKey
ALTER TABLE "Characteristic" DROP CONSTRAINT "Characteristic_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Characteristic" ADD CONSTRAINT "Characteristic_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharValue" ADD CONSTRAINT "CharValue_characteristic_fkey" FOREIGN KEY ("characteristic") REFERENCES "Characteristic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharValue" ADD CONSTRAINT "CharValue_item_fkey" FOREIGN KEY ("item") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
