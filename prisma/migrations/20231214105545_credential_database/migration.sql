-- CreateTable
CREATE TABLE "credential_did" (
    "id" SERIAL NOT NULL,
    "authorDid" TEXT NOT NULL,
    "schemaDid" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL,

    CONSTRAINT "credential_did_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credential_did_schemaDid_schemaVersion_key" ON "credential_did"("schemaDid", "schemaVersion");
