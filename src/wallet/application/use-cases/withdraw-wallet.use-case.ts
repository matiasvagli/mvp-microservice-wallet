import { Inject, Injectable } from "@nestjs/common";

import type { WalletRepository } from "../../domain/repositories/wallet.repository.interface";
import { WithdrawWalletDto } from "../dtos/withdraw-wallet";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";
import { Money } from "../../../shared/domain/value-objects/money.vo";
import { Currency } from "../../domain/value-objects/currency";
;

@Injectable()
export class WithdrawWalletUseCase {
    constructor(
        @Inject("WalletRepository")
        private readonly walletRepository: WalletRepository
    ) { }

    async execute(dto: WithdrawWalletDto): Promise<void> {
        const wallet = await this.walletRepository.findById(new UUID(dto.walletId));
        if (!wallet) {
            throw new Error("Wallet not found");
        }
        const money = new Money(dto.amount, Currency.fromCode(dto.currencyCode));
        wallet.withdraw(money);
        try {
            await this.walletRepository.save(wallet);
        } catch (error) {
            wallet.clearEvents();
            throw error;
        }
    }
}

