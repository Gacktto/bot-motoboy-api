/*
  Warnings:

  - You are about to drop the `UserEnterpriseContact` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `EnterpriseContacts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserEnterpriseContact" DROP CONSTRAINT "UserEnterpriseContact_enterpriseContactId_fkey";

-- DropForeignKey
ALTER TABLE "UserEnterpriseContact" DROP CONSTRAINT "UserEnterpriseContact_userId_fkey";

-- AlterTable
ALTER TABLE "EnterpriseContacts" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserEnterpriseContact";

-- AddForeignKey
ALTER TABLE "EnterpriseContacts" ADD CONSTRAINT "EnterpriseContacts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
