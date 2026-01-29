/*
  Warnings:

  - You are about to drop the column `imageName` on the `Departamento` table. All the data in the column will be lost.
  - You are about to drop the column `departamentoId` on the `UserPermission` table. All the data in the column will be lost.
  - Added the required column `puesto` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subDepartamentoId` to the `UserPermission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "SubDepartamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "departamentoId" INTEGER NOT NULL,
    CONSTRAINT "SubDepartamento_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Departamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "areaId" INTEGER NOT NULL,
    CONSTRAINT "Departamento_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Departamento" ("areaId", "id", "nombre") SELECT "areaId", "id", "nombre" FROM "Departamento";
DROP TABLE "Departamento";
ALTER TABLE "new_Departamento" RENAME TO "Departamento";
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "puesto" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'NIVEL 4'
);
INSERT INTO "new_User" ("id", "nombre", "password", "role", "username") SELECT "id", "nombre", "password", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE TABLE "new_UserPermission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "subDepartamentoId" INTEGER NOT NULL,
    CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserPermission_subDepartamentoId_fkey" FOREIGN KEY ("subDepartamentoId") REFERENCES "SubDepartamento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserPermission" ("id", "userId") SELECT "id", "userId" FROM "UserPermission";
DROP TABLE "UserPermission";
ALTER TABLE "new_UserPermission" RENAME TO "UserPermission";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
