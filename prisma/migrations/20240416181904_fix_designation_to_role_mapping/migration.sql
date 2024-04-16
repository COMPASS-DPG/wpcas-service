/*
  Warnings:

  - You are about to drop the column `designationId` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the `Designation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "roles_designationId_fkey";

-- AlterTable
ALTER TABLE "roles" DROP COLUMN "designationId";

-- DropTable
DROP TABLE "Designation";

-- CreateTable
CREATE TABLE "designations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "designations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignationToRole" (
    "designationId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "DesignationToRole_pkey" PRIMARY KEY ("designationId","roleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "designations_name_key" ON "designations"("name");

-- AddForeignKey
ALTER TABLE "DesignationToRole" ADD CONSTRAINT "DesignationToRole_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "designations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DesignationToRole" ADD CONSTRAINT "DesignationToRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
