import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';
import { LoginDto } from '../../application/dtos/logjn.dto';
import { RegisterDto } from '../../application/dtos/register.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase,
    ) { }

    @Post('register')
    async register(@Body() dto: RegisterDto) {
        await this.registerUseCase.execute(dto);
        return { message: 'User registered successfully' };
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto) {
        const result = await this.loginUseCase.execute(dto);
        return {
            user: {
                id: result.user.idValue.value,
                email: result.user.emailValue
            },
            token: result.token
        };
    }
}
