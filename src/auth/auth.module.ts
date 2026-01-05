import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { InMemoryAuthRepository } from './infrastructure/persistence/in-memory-auth.repository';
import { FakePasswordHasher } from './infrastructure/security/bcrypt/fake-password-hasher';
import { FakeTokenService } from './infrastructure/security/jwt/fake-token';

@Module({
    controllers: [AuthController],
    providers: [
        LoginUseCase,
        RegisterUseCase,
        {
            provide: 'AuthUserRepository',
            useClass: InMemoryAuthRepository,
        },
        {
            provide: 'PasswordHasher',
            useClass: FakePasswordHasher,
        },
        {
            provide: 'ITokenService',
            useClass: FakeTokenService,
        },
    ],
    exports: [LoginUseCase, RegisterUseCase],
})
export class AuthModule { }
