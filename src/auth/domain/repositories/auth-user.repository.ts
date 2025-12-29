import { AuthUser } from '../entities/auth-user.entity';

export interface AuthUserRepository {
  /**
   * Guarda o actualiza un AuthUser y despacha sus eventos de dominio.
   */
  save(authUser: AuthUser): Promise<void>;

  /**
   * Busca un AuthUser por su ID único.
   */
  findById(id: string): Promise<AuthUser | null>;

  /**
   * Busca un AuthUser por su email.
   */
  findByEmail(email: string): Promise<AuthUser | null>;
}