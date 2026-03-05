-- CreateEnum
CREATE TYPE "KdfTypes" AS ENUM ('BCRYPT', 'SCRYPT', 'ARGON2ID');

-- CreateTable
CREATE TABLE "Users" (
    "id" BIGSERIAL NOT NULL,
    "uid" UUID NOT NULL,
    "login" CHAR(16) NOT NULL,
    "password" JSONB NOT NULL,
    "passwordKdfType" "KdfTypes" NOT NULL,
    "pepperVersion" SMALLINT NOT NULL,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "agreements" JSONB NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_login_key" ON "Users"("login");
