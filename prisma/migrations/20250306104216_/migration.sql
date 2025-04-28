/*
  Warnings:

  - A unique constraint covering the columns `[name,phone,userId]` on the table `EnterpriseContacts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'PROGRESS', 'COMPLETED', 'CANCELED');

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "enterpriseContactsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EnterpriseContacts_name_phone_userId_key" ON "EnterpriseContacts"("name", "phone", "userId");

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_enterpriseContactsId_fkey" FOREIGN KEY ("enterpriseContactsId") REFERENCES "EnterpriseContacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
