import { RegisterUseCase } from "../register.use-case";
import { AuthUserRepository } from "../../../domain/repositories/auth-user.repository";
import { InMemoryAuthRepository } from "../../../infrastructure/persistence/in-memory-auth.repository";
import { PasswordHasher } from "../../../domain/interfaces/password-hasher.interface.";
import { RegisterDto } from "../../dtos/register.dto";
import { FakePasswordHasher } from "../../../infrastructure/security/bcrypt/fake-password-hasher";


describe("RegisterUseCase", () => {
  let registerUseCase: RegisterUseCase;
  let authRepository: AuthUserRepository;
  let passwordHasher: PasswordHasher;

  beforeEach(() => {
    authRepository = new InMemoryAuthRepository();
    passwordHasher = new FakePasswordHasher();
    registerUseCase = new RegisterUseCase(authRepository, passwordHasher);
  });

  it("should register a new user successfully", async () => {
    // Arreglar (Arrange)
    const dto: RegisterDto = {
      email: "test@example.com",
      password: "securePassword123"
    };  

    // Actuar (Act)
    await registerUseCase.execute(dto);

    // Afirmar (Assert)
    const savedUser = await authRepository.findByEmail(dto.email);
    
    expect(savedUser).toBeDefined();
    expect(savedUser?.emailValue).toBe(dto.email);
    
    // VERIFICACIÓN SENIOR: 
    // ¿La contraseña se guardó como hash? 
    // (Nuestro FakePasswordHasher le agrega un prefijo)
    expect(savedUser?.passwordHashValue).not.toBe(dto.password);
    expect(savedUser?.passwordHashValue).toContain("fake_hashed_");
 });
});

    