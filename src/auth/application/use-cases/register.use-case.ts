import { Inject, Injectable } from "@nestjs/common";
import type { AuthUserRepository } from "../../domain/repositories/auth-user.repository";
import { AuthUser } from "../../domain/entities/auth-user.entity";
import { UserId } from "../../../user/domain/value-objects/user-id.vo";
import { UserPassword } from "../../domain/user-password.vo";
import type { PasswordHasher } from "../../domain/interfaces/password-hasher.interface.";
import { RegisterDto } from "../dtos/register.dto";


@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject('AuthUserRepository')
    private readonly repository: AuthUserRepository,
    @Inject('PasswordHasher')
    private readonly hasher: PasswordHasher
  ) { }

  async execute(dto: RegisterDto): Promise<void> {
    // 1. Verificamos si el usuario ya existe (Regla de negocio)
    const existingUser = await this.repository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // 2. Validamos la password plana con el VO (Regla de negocio)
    // Esto dispara el error de "Password too short" si no cumple
    const validPassword = UserPassword.create(dto.password);

    // 3. Hasheamos la password (Infraestructura)
    const passwordHash = await this.hasher.hash(validPassword.getValue);

    // 4. Creamos la entidad AuthUser (Dominio)
    const newUser = AuthUser.hydrate({
      id: UserId.random(), // Generamos un ID nuevo
      email: dto.email,
      passwordHash: UserPassword.fromValue(passwordHash)
    });

    // 5. Persistimos (Infraestructura)
    await this.repository.save(newUser);
  }
}
