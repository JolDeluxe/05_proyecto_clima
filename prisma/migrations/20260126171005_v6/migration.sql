-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Departamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 1,
    "areaId" INTEGER NOT NULL,
    CONSTRAINT "Departamento_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Departamento" ("areaId", "id", "nombre") SELECT "areaId", "id", "nombre" FROM "Departamento";
DROP TABLE "Departamento";
ALTER TABLE "new_Departamento" RENAME TO "Departamento";
CREATE TABLE "new_SubDepartamento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "imageName" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 1,
    "departamentoId" INTEGER NOT NULL,
    CONSTRAINT "SubDepartamento_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SubDepartamento" ("departamentoId", "id", "imageName", "nombre") SELECT "departamentoId", "id", "imageName", "nombre" FROM "SubDepartamento";
DROP TABLE "SubDepartamento";
ALTER TABLE "new_SubDepartamento" RENAME TO "SubDepartamento";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
