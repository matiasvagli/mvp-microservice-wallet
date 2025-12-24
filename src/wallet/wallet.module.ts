import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/persistence/prisma.service';
import { PrismaWalletRepository } from './infrastructure/persistence/prisma-wallet.repository';
import { DepositMoneyUseCase } from './application/use-cases/deposit-money.use-case';

@Module({
  providers: [
    PrismaService,
    DepositMoneyUseCase,
    {
      // Usamos un String como token para desacoplar la Interfaz de la Implementación
      provide: 'WalletRepository', 
      useClass: PrismaWalletRepository,
    },
  ],
  // Exportamos el Use Case por si otro módulo (como Transactions) lo necesita
  exports: [DepositMoneyUseCase],
})
export class WalletModule {}