import { Wallet } from "../../domain/entities/wallet.entity";
import { Money } from "../../../shared/domain/value-objects/money.vo";

export class WalletMapper {
  static toDomain(raw: any): Wallet {
    // Usamos el hydrate que preparamos en la entidad
    return Wallet.hydrate({
      id: raw.id,
      ownerId: raw.ownerId,
      type: raw.type,
      // Ojo: raw.balance suele venir de la DB como un número y un string
      balance: new Money(raw.balanceAmount, raw.currency), 
      parentWalletId: raw.parentWalletId,
      whiteList: raw.whiteList
    });
  }

  static toPersistence(wallet: Wallet): any {
    return {
      id: wallet.idValue,
      ownerId: wallet.ownerIdValue,
      type: wallet.typeValue,
      balance: wallet.balanceAmount,
      currency: wallet.currencyValue,
      parentWalletId: wallet.parentWalletIdValue,
      whiteList: wallet.whiteList 
    };
  }
}
