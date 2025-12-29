import { UserId } from "src/user/domain/value-objects/user-id.vo";
import { PasswordHasher } from "../interfaces/password-hasher.interface.";
import { UserPassword } from "../user-password.vo";


type AuthUserProps = {
  id: UserId;
  email: string;
  passwordHash: UserPassword  ;

};
export class AuthUser {
  private constructor(
    private readonly id: UserId,
    private readonly email: string,
    private readonly passwordHash: UserPassword
  ) {}

  static hydrate(props: AuthUserProps): AuthUser {
    return new AuthUser(props.id, props.email, props.passwordHash);
  }

  get idValue(): UserId {
    return this.id;
  }

  get emailValue(): string {
    return this.email;
  }

  get passwordHashValue(): string {
    return this.passwordHash.getValue;
  }

  async validatePassword(
    plainPassword: string,
    hasher: PasswordHasher
  ): Promise<boolean> {
    return hasher.compare(plainPassword, this.passwordHash.getValue);
  }
}