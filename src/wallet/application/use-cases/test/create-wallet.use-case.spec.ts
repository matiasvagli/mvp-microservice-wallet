
import { CreateWalletUseCase } from "../create-wallet.use-case";
import { WalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { Wallet } from '../../../domain/entities/wallet.entity';
import { UUID } from "../../../../shared/domain/value-objects/uuid.vo";
import { Money } from "../../../../shared/domain/value-objects/money.vo";
import { WalletType } from "../../../domain/value-objects/wallet-type.vo";
import { Currency } from "../../../domain/value-objects/currency";
import { InMemoryWalletRepository } from "../../../infrastructure/persistence/in-memory-wallet.repository";

describe("CreateWalletUseCase", () => {
    let useCase: CreateWalletUseCase;
    let walletRepository: WalletRepository;

    beforeEach(() => {
        walletRepository = new InMemoryWalletRepository();
        useCase = new CreateWalletUseCase(walletRepository);
    });

    it("should create a standard wallet successfully", async () => {
        // Arrange
        const dto = {
            ownerId: "123e4567-e89b-12d3-a456-426614174000",
            currencyCode: "USD",
            type: "standard" as const,
        };
        const saveSpy = jest.spyOn(walletRepository, 'save');

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(result).toBeDefined();
        expect(result.ownerIdValue).toBe(dto.ownerId);
        expect(result.isStandard()).toBe(true);
        expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it("should throw error if wallet already exists", async () => {
        // Arrange
        const dto = {
            ownerId: "123e4567-e89b-12d3-a456-426614174000",
            currencyCode: "USD",
            type: "standard" as const,
        };
        // Pre-carga la wallet existente en el repo in-memory
        const existingWallet = Wallet.createStandard(new UUID(dto.ownerId), Currency.fromCode("USD"));
        await walletRepository.save(existingWallet);
        // Espía después de la precarga
        const saveSpy = jest.spyOn(walletRepository, 'save');

        // Act & Assert
        await expect(useCase.execute(dto)).rejects.toThrow("Wallet already exists for this owner");
        expect(saveSpy).not.toHaveBeenCalled();
    });

    it("should create a teen wallet successfully", async () => {
        // Arrange
        const parentOwnerId = "123e4567-e89b-12d3-a456-426614174001";

        // Pre-carga la wallet padre en el repo in-memory
        const parentWallet = Wallet.createStandard(new UUID(parentOwnerId), Currency.fromCode("USD"));
        await walletRepository.save(parentWallet);

        // Usar el ID real de la wallet padre, no el ownerId
        const dto = {
            ownerId: "123e4567-e89b-12d3-a456-426614174000",
            currencyCode: "USD",
            type: "teen" as const,
            parentWalletId: parentWallet.idValue
        };

        // Espía después de la precarga
        const saveSpy = jest.spyOn(walletRepository, 'save');

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(result.isTeen()).toBe(true);
        expect(result.parentWalletIdValue).toBe(parentWallet.idValue);
        expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it("should throw error if teen wallet has no parent", async () => {
        const dto = {
            ownerId: "123e4567-e89b-12d3-a456-426614174000",
            currencyCode: "USD",
            type: "teen" as const,
            // parentWalletId is missing
        };
        // Espía antes de ejecutar el caso de uso
        const saveSpy = jest.spyOn(walletRepository, 'save');
        // No se precarga nada, el repo está vacío
        await expect(useCase.execute(dto as any)).rejects.toThrow("Teen wallets must be linked to a parent wallet");
        expect(saveSpy).not.toHaveBeenCalled();
    });
});
