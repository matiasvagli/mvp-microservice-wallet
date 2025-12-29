


export class ItokenService {}export interface ITokenService {
  generateToken(payload: object, secret: string, expiresIn: string): string;
  verifyToken(token: string, secret: string): object | string;
}
