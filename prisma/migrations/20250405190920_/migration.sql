/*
  Warnings:

  - A unique constraint covering the columns `[botConnectionId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "botConnectionId" TEXT;

-- CreateTable
CREATE TABLE "bot_conections" (
    "id" TEXT NOT NULL,
    "isConnected" BOOLEAN NOT NULL DEFAULT false,
    "isRunning" BOOLEAN NOT NULL DEFAULT false,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bot_conections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_botConnectionId_key" ON "users"("botConnectionId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_botConnectionId_fkey" FOREIGN KEY ("botConnectionId") REFERENCES "bot_conections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
