import { AuthUser } from "./auth-user.entity";
import { FakePasswordHasher } from "../../infrastructure/security/bcrypt/fake-password-hasher";

describe('AuthUser Entity', () => {
  const mockUserId = { toString: () => 'user-123' } as any;
  const mockEmail = 'test@example.com';
  const mockPasswordHash = 'hashed-password';   
  const mockUserPassword = {  
    getValue: mockPasswordHash,
  } as any;

  it('should hydrate an AuthUser correctly', () => {
    const authUser = AuthUser.hydrate({
      id: mockUserId,
      email: mockEmail,
      passwordHash: mockUserPassword,
    });

    expect(authUser).toBeInstanceOf(AuthUser);
    expect(authUser.idValue).toBe(mockUserId);
    expect(authUser.emailValue).toBe(mockEmail);
    expect(authUser.passwordHashValue).toBe(mockPasswordHash);
    });

    it('should validate password correctly using the hasher', async () => {
    // 1. Configuramos el escenario
    const plainPassword = 'secret123';
    const hashedPassword = 'fake_hashed_secret123'; // Con FakePasswordHasher, agrega prefijo
    const mockUserPassword = { getValue: hashedPassword } as any;
    
    const authUser = AuthUser.hydrate({
      id: mockUserId,
      email: mockEmail,
      passwordHash: mockUserPassword,
    });

    const hasher = new FakePasswordHasher();

    // 2. Ejecutamos la acción y verificamos el comportamiento
    const isValid = await authUser.validatePassword(plainPassword, hasher);
    const isInvalid = await authUser.validatePassword('wrong_password', hasher);

    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
});
});
