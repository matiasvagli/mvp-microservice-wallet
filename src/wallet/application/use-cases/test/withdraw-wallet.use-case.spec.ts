
import { WithdrawWalletUseCase } from "../withdraw-wallet.use-case";
import { WalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { Wallet } from "../../../domain/entities/wallet.entity";
import { UUID } from "../../../../shared/domain/value-objects/uuid.vo";
import { Money } from "../../../../shared/domain/value-objects/money.vo";
import { Currency } from "../../../domain/value-objects/currency";

describe("WithdrawWalletUseCase", () => {
    let useCase: WithdrawWalletUseCase;
    let mockWalletRepository: jest.Mocked<WalletRepository>;

    beforeEach(() => {
        mockWalletRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findByOwnerId: jest.fn(),
        };
        useCase = new WithdrawWalletUseCase(mockWalletRepository);
    });

    it("should withdraw money successfully", async () => {
        // Arrange
        const walletId = "123e4567-e89b-12d3-a456-426614174000";
        const ownerId = "123e4567-e89b-12d3-a456-426614174001";
        const dto = {
            walletId: walletId,
            amount: 50,
            currencyCode: "USD"
        };

        const existingWallet = Wallet.createStandard(new UUID(ownerId), Currency.fromCode("USD"));
        // Add initial funds
        existingWallet.deposit(new Money(100, Currency.fromCode("USD")));

        mockWalletRepository.findById.mockResolvedValue(existingWallet);

        // Act
        await useCase.execute(dto);

        // Assert
        expect(existingWallet.balanceAmount).toBe(50); // 100 - 50 = 50
        expect(mockWalletRepository.save).toHaveBeenCalledWith(existingWallet);
    });

    it("should throw error if wallet not found", async () => {
        // Arrange
        const dto = {
            walletId: "123e4567-e89b-12d3-a456-426614174000",
            amount: 50,
            currencyCode: "USD"
        };

        mockWalletRepository.findById.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute(dto)).rejects.toThrow("Wallet not found");
        expect(mockWalletRepository.save).not.toHaveBeenCalled();
    });

    it("should throw error if insufficient funds", async () => {
        const walletId = "123e4567-e89b-12d3-a456-426614174000";
        const ownerId = "123e4567-e89b-12d3-a456-426614174001";
        const dto = {
            walletId: walletId,
            amount: 500, // More than balance
            currencyCode: "USD"
        };

        const existingWallet = Wallet.createStandard(new UUID(ownerId), Currency.fromCode("USD"));
        existingWallet.deposit(new Money(100, Currency.fromCode("USD")));

        mockWalletRepository.findById.mockResolvedValue(existingWallet);

        // Act & Assert
        await expect(useCase.execute(dto)).rejects.toThrow("Insufficient funds for this operation");
        // Verify save was NOT called with the invalid state
        expect(mockWalletRepository.save).not.toHaveBeenCalled();
        // Verify balance remained same
        expect(existingWallet.balanceAmount).toBe(100);
    });
});
