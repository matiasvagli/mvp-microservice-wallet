// auth/infrastructure/persistence/in-memory-auth.repository.ts
import { AuthUserRepository } from "../../domain/repositories/auth-user.repository";
import { AuthUser } from "../../domain/entities/auth-user.entity";  

export class InMemoryAuthRepository implements AuthUserRepository {
  private users: AuthUser[] = [];

  // Implementamos findByEmail como pide tu contrato
  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = this.users.find((u) => u.emailValue === email);
    return user || null;
  }

  // Implementamos findById como pide tu contrato
  async findById(id: string): Promise<AuthUser | null> {
    const user = this.users.find((u) => u.idValue.value === id);
    return user || null;
  }

  // Implementamos save como pide tu contrato
  async save(authUser: AuthUser): Promise<void> {
    const index = this.users.findIndex(
      (u) => u.idValue.value === authUser.idValue.value
    );

    if (index !== -1) {
      this.users[index] = authUser;
    } else {
      this.users.push(authUser);
    }
    
    // Aquí es donde en el futuro "despacharíamos los eventos de dominio"
    // que mencionaste en el comentario de la interfaz.
    console.log(`[Repo] Usuario persistido: ${authUser.emailValue}`);
  }
}
