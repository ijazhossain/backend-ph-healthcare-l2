-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "icon" VARCHAR(225),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3)
);

-- CreateIndex
CREATE UNIQUE INDEX "specialties_id_key" ON "specialties"("id");

-- CreateIndex
CREATE INDEX "idx_specialty_isDeleted" ON "specialties"("isDeleted");

-- CreateIndex
CREATE INDEX "idx_specialty_title" ON "specialties"("title");
