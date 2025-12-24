import { AggregateRoot } from "../../../shared/domain/aggregate-root";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";
import { WalletType } from "../../../shared/domain/value-objects/wallet-type.vo";
import { MoneyDepositedEvent } from "../events/money-deposited.event";

export class Wallet extends AggregateRoot {
  private constructor(
    private readonly id: UUID,
    private readonly ownerId: UUID,
    private _type: WalletType, // No es readonly porque puede cambiar (upgrade)
    private _balance: Money,
    private readonly parentWalletId?: UUID,
    private readonly _whiteList: string[] = [] // IDs de billeteras permitidas para transferir
  ) {
    super();
    this.validateIntegrity();
  }

  // --- Factory Methods ---
  static createStandard(ownerId: UUID, currency: any): Wallet {
    return new Wallet(UUID.random(), ownerId, WalletType.standard(), new Money(0, currency));
  }

  static createTeen(ownerId: UUID, parentId: UUID, currency: any): Wallet {
    return new Wallet(UUID.random(), ownerId, WalletType.teen(), new Money(0, currency), parentId);
  }

  static hydrate(props: any): Wallet {
    return new Wallet(
      new UUID(props.id),
      new UUID(props.ownerId),
      WalletType.fromCode(props.type),
      props.balance,
      props.parentWalletId ? new UUID(props.parentWalletId) : undefined,
      props.whiteList
    );
  }

  // --- Reglas de Negocio ---
  
  deposit(amount: Money): void {
    this._balance = this._balance.add(amount);
    this.addDomainEvent(new MoneyDepositedEvent(this.id.value, amount.getAmount()));
  }

  withdraw(amount: Money): void {
    this.ensureCanSpend(amount);
    this._balance = this._balance.subtract(amount);
  }

  // Nuevo método para transferencia con validación de lista blanca
  transfer(amount: Money, destinationWalletId: UUID): void {
    this.ensureCanSpend(amount);
    
    if (this._type.isTeen() && !this._whiteList.includes(destinationWalletId.value)) {
      throw new Error("Target wallet is not in the whitelist for this teen account");
    }

    this._balance = this._balance.subtract(amount);
  }

  // --- Validaciones Privadas (Invariantes) ---


  public isTeen(): boolean {
    return this._type.isTeen();
  }

  public isStandard(): boolean {
    return !this._type.isTeen();
  }


  private validateIntegrity(): void {
    if (this._type.isTeen() && !this.parentWalletId) {
      throw new Error("Teen wallets must be linked to a parent wallet");
    }
  }

  private ensureCanSpend(amount: Money): void {
    if (amount.getAmount() > this._balance.getAmount()) {
      throw new Error("Insufficient funds for this operation");
    }
  }

  // --- Getters para el Mapper (Infraestructura) ---
  get idValue(): string { return this.id.value; }
  get ownerIdValue(): string { return this.ownerId.value; }
  get balance(): Money { return this._balance; }
  get typeValue(): string { return this._type.toString(); }
  get whiteList(): string[] { return [...this._whiteList]; }
  get parentIdValue(): string | undefined { return this.parentWalletId?.value; }
  get balanceAmount(): number { return this._balance.getAmount(); }
  get currencyValue(): string { return this._balance.getCurrency().value; }
  get parentWalletIdValue(): string | undefined { return this.parentWalletId?.value; } 
 
}
