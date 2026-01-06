// auth/application/dtos/register.dto.ts

/* export interface RegisterDto {
  readonly email: string;
  readonly password: string; // Esta llega en texto plano desde el cliente
} */

export class RegisterDto {
  readonly email: string;
  readonly password: string; // Esta llega en texto plano desde el cliente
}