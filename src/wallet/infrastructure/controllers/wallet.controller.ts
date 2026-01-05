import { Controller, Post, Body, Get, Param, Inject } from '@nestjs/common';
import { CreateWalletUseCase } from '../../application/use-cases/create-wallet.use-case';
import { DepositMoneyUseCase } from '../../application/use-cases/deposit-money.use-case';
import { WithdrawWalletUseCase } from '../../application/use-cases/withdraw-wallet.use-case';
import { GetWalletUseCase } from '../../application/use-cases/get-wallet.use-case';
import { CreateWalletDto } from '../../application/dtos/create-wallet.dto';
import { DepositMoneyDto } from '../../application/dtos/deposit-money.dto';
import { WithdrawWalletDto } from '../../application/dtos/withdraw-wallet';

@Controller('wallets')
export class WalletController {
    constructor(
        private readonly createWalletUseCase: CreateWalletUseCase,
        private readonly depositMoneyUseCase: DepositMoneyUseCase,
        private readonly withdrawWalletUseCase: WithdrawWalletUseCase,
        private readonly getWalletUseCase: GetWalletUseCase,
    ) { }

    @Post()
    async create(@Body() dto: CreateWalletDto) {
        const wallet = await this.createWalletUseCase.execute(dto);
        return {
            id: wallet.idValue,
            balance: wallet.balanceAmount,
            currency: wallet.currencyValue
        };
    }

    @Get(':id')
    async get(@Param('id') id: string) {
        const wallet = await this.getWalletUseCase.execute(id);
        return {
            id: wallet.idValue,
            balance: wallet.balanceAmount,
            currency: wallet.currencyValue
        };
    }

    @Post(':id/deposit')
    async deposit(@Param('id') id: string, @Body() body: { amount: number, currency: string, ownerId: string }) {
        // Nota: Aquí adaptamos el body al DTO que espera el caso de uso
        const dto: DepositMoneyDto = {
            ownerId: body.ownerId,
            amount: body.amount,
            currencyCode: body.currency
        };
        await this.depositMoneyUseCase.execute(dto);
        return { message: 'Deposit successful' };
    }

    @Post(':id/withdraw')
    async withdraw(@Param('id') id: string, @Body() body: { amount: number, currency: string }) {
        const dto: WithdrawWalletDto = {
            walletId: id,
            amount: body.amount,
            currencyCode: body.currency
        };
        await this.withdrawWalletUseCase.execute(dto);
        return { message: 'Withdraw successful' };
    }
}
