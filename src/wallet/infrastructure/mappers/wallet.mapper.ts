import { Wallet } from "../../domain/entities/wallet.entity";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { Currency } from "../../domain/value-objects/currency";

export class WalletMapper {
  static toDomain(raw: any): Wallet {
    // Usamos el hydrate que preparamos en la entidad
    return Wallet.hydrate({
      id: raw.id,
      ownerId: raw.userId, // Schema uses userId
      type: raw.type,
      // Ojo: raw.balance suele venir de la DB como un número y un string
      balance: new Money(Number(raw.balance), Currency.fromCode(raw.currency)),
      parentWalletId: raw.parentWalletId,
      whiteList: raw.whiteList
    });
  }

  static toPersistence(wallet: Wallet): any {
    return {
      id: wallet.idValue,
      userId: wallet.ownerIdValue, // Schema uses userId
      type: wallet.typeValue,
      balance: wallet.balanceAmount,
      currency: wallet.currencyValue,
      parentWalletId: wallet.parentWalletIdValue,
      whiteList: wallet.whiteList
    };
  }
}
