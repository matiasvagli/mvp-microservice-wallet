import { Module } from '@nestjs/common';
import { PrismaService } from './infrastructure/persistence/prisma.service';
import { PrismaWalletRepository } from './infrastructure/persistence/prisma-wallet.repository';
import { DepositMoneyUseCase } from './application/use-cases/deposit-money.use-case';
import { CreateWalletUseCase } from './application/use-cases/create-wallet.use-case';
import { WithdrawWalletUseCase } from './application/use-cases/withdraw-wallet.use-case';
import { GetWalletUseCase } from './application/use-cases/get-wallet.use-case';
import { WalletController } from './infrastructure/controllers/wallet.controller';

@Module({
  controllers: [WalletController],
  providers: [
    PrismaService,
    CreateWalletUseCase,
    DepositMoneyUseCase,
    WithdrawWalletUseCase,
    GetWalletUseCase,
    {
      // Usamos un String como token para desacoplar la Interfaz de la Implementación
      provide: 'WalletRepository',
      useClass: PrismaWalletRepository,
    },
  ],
  // Exportamos el Use Case por si otro módulo (como Transactions) lo necesita
  exports: [
    CreateWalletUseCase,
    DepositMoneyUseCase,
    WithdrawWalletUseCase,
    GetWalletUseCase
  ],
})
export class WalletModule { }