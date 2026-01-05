import { WalletRepository } from "src/wallet/domain/repositories/wallet.repository.interface";
import { Wallet } from "src/wallet/domain/entities/wallet.entity";
import { UUID } from "src/shared/domain/value-objects/uuid.vo";

export class InMemoryWalletRepository implements WalletRepository {
  private wallets: Wallet[] = [];


  async findByOwnerId(ownerId: UUID): Promise<Wallet | null> {
    const wallet = this.wallets.find((w) => w.ownerIdValue === ownerId.value);
    return wallet || null;
  }

  async findById(id: UUID): Promise<Wallet | null> {
    console.log(`[Repo] Buscando wallet por ID: ${id.value}`);
    console.log(`[Repo] Wallets disponibles: ${this.wallets.map(w => w.idValue).join(', ')}`);
    const wallet = this.wallets.find((w) => w.idValue === id.value);
    console.log(`[Repo] Wallet encontrada: ${wallet ? wallet.idValue : 'null'}`);
    return wallet || null;
  }
  async save(wallet: Wallet): Promise<void> {
    const index = this.wallets.findIndex(
      (w) => w.idValue === wallet.idValue
    );
    if (index !== -1) {
      this.wallets[index] = wallet;
    } else {
      this.wallets.push(wallet);
    }



    console.log(`[Repo] Wallet persistida: ${wallet.idValue}`);

  }
}