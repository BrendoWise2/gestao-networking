/*
  Warnings:

  - Added the required column `senha` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "members" ADD COLUMN     "senha" TEXT NOT NULL;
