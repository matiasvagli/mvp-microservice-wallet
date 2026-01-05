import { RegisterUseCase } from "../register.use-case";
import { AuthUserRepository } from "../../../domain/repositories/auth-user.repository";
import { InMemoryAuthRepository } from "../../../infrastructure/persistence/in-memory-auth.repository";
import { PasswordHasher } from "../../../domain/interfaces/password-hasher.interface.";
import { RegisterDto } from "../../dtos/register.dto";
import { FakePasswordHasher } from "../../../infrastructure/security/bcrypt/fake-password-hasher";
import { LoginUseCase } from "../login.use-case";
import { LoginDto } from "../../dtos/logjn.dto";
import { ITokenService } from "src/auth/domain/interfaces/itoken-service.interface";
import { AuthUser } from "../../../domain/entities/auth-user.entity";

describe("LoginUseCase", () => {
  let loginUseCase: LoginUseCase;
  let authRepository: AuthUserRepository;
  let passwordHasher: PasswordHasher;
  const tokenService: ITokenService = {
    async generate(payload: Record<string, any>): Promise<string> {
      return "fake-jwt-token";
    },
    async verify(token: string): Promise<Record<string, any> | string> {
      return { userId: "fake-user-id", email: "test@example.com" };
    }
  };

  beforeEach(() => {
    authRepository = new InMemoryAuthRepository();
    passwordHasher = new FakePasswordHasher();
    loginUseCase = new LoginUseCase(authRepository, passwordHasher , tokenService);
  });

  it("should login an existing user successfully", async () => {
    const registerDto: RegisterDto = {
      email: "test@example.com",
      password: "securePassword123"
    };
    const registerUseCase = new RegisterUseCase(authRepository, passwordHasher);
    await registerUseCase.execute(registerDto); 
    const loginDto: LoginDto = {
      email: "test@example.com",
      password: "securePassword123"
    };
    const authenticatedUser = await loginUseCase.execute(loginDto);
    expect(authenticatedUser).toEqual({
     user: expect.any(AuthUser),
     token: "fake-jwt-token"
    });  
  });

  it("should throw error for invalid credentials", async () => {
    const loginDto: LoginDto = {
      email: "invalid@example.com",
      password: "invalidPassword"
    };
    await expect(loginUseCase.execute(loginDto)).rejects.toThrow("Invalid credentials");
  });
});


 

  

