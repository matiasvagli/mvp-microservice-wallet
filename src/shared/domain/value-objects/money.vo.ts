import { Currency } from './currency';

export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: Currency,
  ) {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (currency === null || currency === undefined) {
      throw new Error('Currency must be provided');
    }
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): Currency {
    return this.currency;
  }

  add(other: Money): Money {
    if (!this.currency.equals(other.getCurrency())) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.getAmount(), this.currency);
  }

  subtract(other: Money): Money {
    if (!this.currency.equals(other.getCurrency())) {
      throw new Error('Cannot subtract money with different currencies');
    }
    return new Money(this.amount - other.getAmount(), this.currency);
  }
}