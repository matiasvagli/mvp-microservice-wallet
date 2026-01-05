import { Module } from '@nestjs/common';
import { PrismaService } from '../wallet/infrastructure/persistence/prisma.service'; // Reuse
import { PrismaUserRepository } from './infrastructure/persistence/prisma-user.repository';
import { FindUserUseCase } from './application/use-cases/find-user.use-case';

@Module({
    providers: [
        PrismaService,
        FindUserUseCase,
        {
            provide: 'UserRepository',
            useClass: PrismaUserRepository,
        },
    ],
    exports: [FindUserUseCase],
})
export class UserModule { }
