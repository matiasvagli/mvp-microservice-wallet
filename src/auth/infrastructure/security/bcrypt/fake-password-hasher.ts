import { PasswordHasher } from "src/auth/domain/interfaces/password-hasher.interface.";

export class FakePasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    // En un entorno de pruebas, agregamos un prefijo para simular el hash
    return `fake_hashed_${password}`;
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    // Comparamos el password hasheado con el prefix
    return `fake_hashed_${password}` === hashedPassword;
  }
}   