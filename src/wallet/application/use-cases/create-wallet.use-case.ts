import { Inject, Injectable } from "@nestjs/common";

import type { WalletRepository } from "../../domain/repositories/wallet.repository.interface";
import { DepositMoneyDto } from "../dtos/deposit-money.dto";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";

import { Currency } from "../../domain/value-objects/currency";
import { CreateWalletDto } from "../dtos/create-wallet.dto";
import { Wallet } from "../../domain/entities/wallet.entity";
import { WalletType } from "../../domain/value-objects/wallet-type.vo";


@Injectable()
export class CreateWalletUseCase {
    constructor(
        @Inject("WalletRepository")
        private readonly walletRepository: WalletRepository,
    ) { }
    async execute(dto: CreateWalletDto): Promise<Wallet> {
        const ownerUUID = new UUID(dto.ownerId);

        // 1. VALIDACIÓN : ¿Ya existe?
        const existing = await this.walletRepository.findByOwnerId(ownerUUID);
        if (existing) throw new Error("Wallet already exists for this owner");

        // 2. LÓGICA DE CLASIFICACIÓN (Sin Else)
        const currency = Currency.fromCode(dto.currencyCode);

        // Si es TEEN, resolvemos y retornamos/guardamos temprano
        if (dto.type === 'teen') {
            if (!dto.parentWalletId) {
                throw new Error("Teen wallets must be linked to a parent wallet");
            }

            //validar que la wallet padre exista
            const parentWallet = await this.walletRepository.findById(new UUID(dto.parentWalletId));
            if (!parentWallet) {
                throw new Error("Parent wallet not found");
            }
            // validar que la wallet padre sea STANDARD
            if (parentWallet.isTeen()) {
                throw new Error("Parent wallet must be a standard wallet");
            }


            // Opcional: Validar que el padre existe aquí (Consulta al Repo)

            const wallet = Wallet.createTeen(ownerUUID, new UUID(dto.parentWalletId), currency);
            await this.walletRepository.save(wallet);
            return wallet;
        }

        // Si llegamos acá, es porque es STANDARD (el camino por defecto)
        const wallet = Wallet.createStandard(ownerUUID, currency);
        await this.walletRepository.save(wallet);
        return wallet;
    }
}