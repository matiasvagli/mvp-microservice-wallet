import { Wallet } from '../entities/wallet.entity';
import { UUID } from '../../../shared/domain/value-objects/uuid.vo';

export interface WalletRepository {
  /**
   * Guarda o actualiza una wallet y despacha sus eventos de dominio.
   */
  save(wallet: Wallet): Promise<void>;

  /**
   * Busca una wallet por su ID único.
   */
  findById(id: UUID): Promise<Wallet | null>;

  /**
   * Busca la wallet de un usuario específico.
   */
  findByOwnerId(ownerId: UUID): Promise<Wallet | null>;
}