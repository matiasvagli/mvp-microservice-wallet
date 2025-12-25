export enum WalletTypeEnum {
  STANDARD = 'STANDARD',
  TEEN = 'TEEN'
}

export class WalletType {
  private constructor(private readonly _value: WalletTypeEnum) {}

  static standard(): WalletType {
    return new WalletType(WalletTypeEnum.STANDARD);
  }

  static teen(): WalletType {
    return new WalletType(WalletTypeEnum.TEEN);
  }

  // Este es el método que te faltaba para el hydrate
  static fromCode(code: string): WalletType {
    const upperCode = code?.toUpperCase();
    if (upperCode === WalletTypeEnum.STANDARD) return WalletType.standard();
    if (upperCode === WalletTypeEnum.TEEN) return WalletType.teen();
    
    throw new Error(`Wallet type ${code} is not supported`);
  }

  isTeen(): boolean {
    return this._value === WalletTypeEnum.TEEN;
  }

  get value(): string {
    return this._value;
  }
}