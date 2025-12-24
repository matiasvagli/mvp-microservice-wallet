import { Inject } from "@nestjs/common";

import type { WalletRepository } from "../../domain/repositories/wallet.repository.interface"; 
import { DepositMoneyDto } from "../dtos/deposit-money.dto";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { Currency } from "src/shared/domain/value-objects/currency";
;
   

// wallet/application/use-cases/deposit-money.use-case.ts
export class DepositMoneyUseCase {
  constructor(
    @Inject("WalletRepository")
    private readonly walletRepository: WalletRepository
  ) {}

  async execute(dto: DepositMoneyDto): Promise<void> {
    const ownerUUID = new UUID(dto.ownerId);
    const wallet = await this.walletRepository.findByOwnerId(ownerUUID);

    if (!wallet) {
      // Senior Tip: Usar excepciones de dominio personalizadas
      throw new Error(`Wallet not found for owner ${dto.ownerId}`);
    }

    // Convertimos primitivos a Value Objects aquí
    const currency = Currency.fromCode(dto.currencyCode);
    const moneyToDeposit = new Money(dto.amount, currency);

    wallet.deposit(moneyToDeposit);

    try {
      await this.walletRepository.save(wallet);
      // Una vez salvado con éxito, el repositorio debería haber 
      // despachado los eventos y limpiado la lista en la entidad.
    } catch (error) {
      // Si falla el save, podrías querer limpiar los eventos para evitar
      // que se disparen si este mismo objeto Wallet se reintenta salvar.
      wallet.clearEvents(); 
      throw error; 
    }
  }
}