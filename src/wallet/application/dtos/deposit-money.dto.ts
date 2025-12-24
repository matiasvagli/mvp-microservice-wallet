
export interface DepositMoneyDto {
  ownerId: string;
  amount: number;
  currencyCode: string; // Recibimos string, no el VO
}
