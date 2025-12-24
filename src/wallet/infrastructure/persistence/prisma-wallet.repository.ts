import { Injectable } from '@nestjs/common';
import { WalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { Wallet } from '../../domain/entities/wallet.entity';
import { PrismaService } from './prisma.service';
import { WalletMapper } from '../mappers/wallet.mapper';
import { UUID } from '../../../shared/domain/value-objects/uuid.vo';

@Injectable()
export class PrismaWalletRepository implements WalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByOwnerId(ownerId: UUID): Promise<Wallet | null> {
    const rawWallet = await this.prisma.wallet.findFirst({
      where: { ownerId: ownerId.value },
    });

    if (!rawWallet) return null;

    // El Mapper es vital: convierte el modelo de Prisma en nuestra Entidad con lógica
    return WalletMapper.toDomain(rawWallet);
  }

  async save(wallet: Wallet): Promise<void> {
    const persistenceModel = WalletMapper.toPersistence(wallet);
    
    await this.prisma.wallet.upsert({
      where: { id: wallet.idValue },
      update: persistenceModel,
      create: persistenceModel,
    });
  }

async findById(id: UUID): Promise<Wallet | null> {
  const rawWallet = await this.prisma.wallet.findUnique({
    where: { id: id.value }, // Prisma usa findUnique para la Primary Key (@id)
  });

  if (!rawWallet) return null;

  return WalletMapper.toDomain(rawWallet);
}

}
