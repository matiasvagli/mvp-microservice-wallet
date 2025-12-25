export class Currency {
  private static readonly ALLOWED_CODES = ['USD', 'EUR', 'ARS'];

  private constructor(private readonly code: string) {}

  static fromCode(code: string): Currency {
    if (!this.ALLOWED_CODES.includes(code)) {
      throw new Error(`Currency code ${code} is not supported`);
    }
    return new Currency(code);
  }

  get value(): string {
    return this.code;
  }

  equals(other: Currency): boolean {
    return this.code === other.value;
  }
}