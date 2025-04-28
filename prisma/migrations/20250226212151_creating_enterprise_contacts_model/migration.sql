/*
  Warnings:

  - You are about to drop the `_UserCompanies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `companies_contacts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `deliveries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_companies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserCompanies" DROP CONSTRAINT "_UserCompanies_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserCompanies" DROP CONSTRAINT "_UserCompanies_B_fkey";

-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_companyId_fkey";

-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_companies" DROP CONSTRAINT "user_companies_companiesContactId_fkey";

-- DropForeignKey
ALTER TABLE "user_companies" DROP CONSTRAINT "user_companies_userId_fkey";

-- DropTable
DROP TABLE "_UserCompanies";

-- DropTable
DROP TABLE "companies_contacts";

-- DropTable
DROP TABLE "deliveries";

-- DropTable
DROP TABLE "user_companies";

-- DropEnum
DROP TYPE "DeliveryStatus";

-- CreateTable
CREATE TABLE "EnterpriseContacts" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "EnterpriseContacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserEnterpriseContact" (
    "userId" TEXT NOT NULL,
    "enterpriseContactId" TEXT NOT NULL,

    CONSTRAINT "UserEnterpriseContact_pkey" PRIMARY KEY ("userId","enterpriseContactId")
);

-- AddForeignKey
ALTER TABLE "UserEnterpriseContact" ADD CONSTRAINT "UserEnterpriseContact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEnterpriseContact" ADD CONSTRAINT "UserEnterpriseContact_enterpriseContactId_fkey" FOREIGN KEY ("enterpriseContactId") REFERENCES "EnterpriseContacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
