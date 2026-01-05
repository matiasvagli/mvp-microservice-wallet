import { Inject, Injectable } from "@nestjs/common";
import type { WalletRepository } from "../../domain/repositories/wallet.repository.interface";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";
import { Wallet } from "../../domain/entities/wallet.entity";

@Injectable()
export class GetWalletUseCase {
    constructor(
        @Inject("WalletRepository")
        private readonly walletRepository: WalletRepository
    ) { }

    async execute(walletId: string): Promise<Wallet> {
        const wallet = await this.walletRepository.findById(new UUID(walletId));
        if (!wallet) throw new Error("Wallet not found");
        return wallet;
    }
}