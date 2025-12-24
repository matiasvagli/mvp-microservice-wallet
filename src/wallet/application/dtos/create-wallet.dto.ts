

export class CreateWalletDto {
  readonly ownerId: string;
  readonly currencyCode: string; // Recibimos string, no el VO
  readonly type?: string; // Tipo de wallet, opcional
  readonly parentWalletId?: string; // ID de la wallet padre, opcional
}
