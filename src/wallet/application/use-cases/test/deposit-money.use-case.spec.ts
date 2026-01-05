
import { DepositMoneyUseCase } from "../deposit-money.use-case";
import { WalletRepository } from "../../../domain/repositories/wallet.repository.interface";
import { Wallet } from "../../../domain/entities/wallet.entity";
import { UUID } from "../../../../shared/domain/value-objects/uuid.vo";
import { Money } from "../../../../shared/domain/value-objects/money.vo";
import { Currency } from "../../../domain/value-objects/currency";



describe("DepositMoneyUseCase", () => {
    let useCase: DepositMoneyUseCase;
    let mockWalletRepository: jest.Mocked<WalletRepository>;

    beforeEach(() => {
        mockWalletRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findByOwnerId: jest.fn(),
        };
        useCase = new DepositMoneyUseCase(mockWalletRepository);
    });

    it("should deposit money successfully", async () => {
        // Arrange
        const dto = {
            ownerId: "123e4567-e89b-12d3-a456-426614174000",
            amount: 100,
            currencyCode: "USD"
        };

        const existingWallet = Wallet.createStandard(new UUID(dto.ownerId), Currency.fromCode("USD"));
        mockWalletRepository.findByOwnerId.mockResolvedValue(existingWallet);

        // Act
        await useCase.execute(dto);

        // Assert
        expect(existingWallet.balanceAmount).toBe(100);
        expect(mockWalletRepository.save).toHaveBeenCalledWith(existingWallet);
    });

    it("should throw error if wallet not found", async () => {
        // Arrange
        const dto = {
            ownerId: "123e4567-e89b-12d3-a456-426614174000",
            amount: 100,
            currencyCode: "USD"
        };

        mockWalletRepository.findByOwnerId.mockResolvedValue(null);

        // Act & Assert
        await expect(useCase.execute(dto)).rejects.toThrow(/Wallet not found/);
        expect(mockWalletRepository.save).not.toHaveBeenCalled();
    });
});
