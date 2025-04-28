/*
  Warnings:

  - You are about to drop the column `adminNumber` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isWhatsappSynced` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappGroupId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `whatsappSyncTime` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "users_adminNumber_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "adminNumber",
DROP COLUMN "isWhatsappSynced",
DROP COLUMN "paymentStatus",
DROP COLUMN "whatsappGroupId",
DROP COLUMN "whatsappSyncTime",
ADD COLUMN     "phone" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");
