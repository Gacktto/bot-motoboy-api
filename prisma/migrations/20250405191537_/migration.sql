/*
  Warnings:

  - You are about to drop the column `botConnectionId` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `bot_conections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `bot_conections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_botConnectionId_fkey";

-- DropIndex
DROP INDEX "users_botConnectionId_key";

-- AlterTable
ALTER TABLE "bot_conections" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "botConnectionId";

-- CreateIndex
CREATE UNIQUE INDEX "bot_conections_userId_key" ON "bot_conections"("userId");

-- AddForeignKey
ALTER TABLE "bot_conections" ADD CONSTRAINT "bot_conections_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
