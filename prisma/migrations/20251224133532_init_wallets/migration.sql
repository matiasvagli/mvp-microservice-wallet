-- CreateTable
CREATE TABLE "wallets" (
    "id" UUID NOT NULL,
    "ownerId" UUID NOT NULL,
    "type" TEXT NOT NULL,
    "balanceAmount" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL,
    "parentWalletId" UUID,
    "whiteList" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);
