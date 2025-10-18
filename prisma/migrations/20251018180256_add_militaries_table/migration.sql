-- CreateTable
CREATE TABLE "militaries" (
    "id" TEXT NOT NULL,
    "nomeCompleto" TEXT NOT NULL,
    "postoGrad" TEXT NOT NULL,
    "funcao" TEXT NOT NULL,
    "cnh" TEXT,
    "companhiaSecao" TEXT NOT NULL,
    "veiculo" TEXT,
    "situacao" TEXT NOT NULL DEFAULT 'Ativo',
    "profileImage" TEXT,
    "qrCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "militaries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "militaries_qrCode_key" ON "militaries"("qrCode");
