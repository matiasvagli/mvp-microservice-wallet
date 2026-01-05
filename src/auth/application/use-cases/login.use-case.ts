import { Inject, Injectable } from "@nestjs/common";
import type { AuthUserRepository } from "../../domain/repositories/auth-user.repository";
import { AuthUser } from "../../domain/entities/auth-user.entity";
import { UserId } from "../../../user/domain/value-objects/user-id.vo";
import { UserPassword } from "../../domain/user-password.vo";
import type { PasswordHasher } from "../../domain/interfaces/password-hasher.interface.";
import { LoginDto } from "../dtos/logjn.dto";
import type { ITokenService } from "../../domain/interfaces/itoken-service.interface";
import { access } from "node:fs";

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('AuthUserRepository')
    private readonly repository: AuthUserRepository,
    @Inject('PasswordHasher')
    private readonly hasher: PasswordHasher,
    @Inject('ITokenService')
    private readonly tokenService: ITokenService
  ) { }

  async execute(dto: LoginDto): Promise<{ user: AuthUser; token: string }> {
    // 1. Buscamos el usuario por email (Regla de negocio)
    const existingUser = await this.repository.findByEmail(dto.email);
    if (!existingUser) {
      throw new Error("Invalid credentials");
    }

    // 2. Verificamos la password (Regla de negocio)
    const isPasswordValid = await existingUser.validatePassword(dto.password, this.hasher);

    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // generamos token y lo asignamos al usuario
    const token = await this.tokenService.generate({
      userId: existingUser.idValue.value,
      email: existingUser.emailValue
    });


    //aca dude en devolver user / token o hacer un dto
    //por ahora devuelvo ambos en un objeto para enviarlos al cliente en header y body respectivamente

    return {
      user: existingUser,
      token
    };
  }
}   