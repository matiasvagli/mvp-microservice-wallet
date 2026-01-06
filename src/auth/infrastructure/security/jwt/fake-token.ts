import { ITokenService } from "src/auth/domain/interfaces/itoken-service.interface";


export class FakeTokenService implements ITokenService {
  generate(payload: Record<string, any>): Promise<string> {
    throw new Error("Method not implemented.");
  }
  verify(token: string): Promise<Record<string, any> | string> {
    throw new Error("Method not implemented.");
  }
  generateToken(payload: object, secret: string, expiresIn: string): string {
    // En un entorno de pruebas, devolvemos un token fijo
    return "fake-jwt-token";
  }

  verifyToken(token: string, secret: string): object | string {
    // En un entorno de pruebas, devolvemos un payload fijo si el token es el esperado
    if (token === "fake-jwt-token") {
      return { userId: "fake-user-id", email: "fake-user-email" };
    } else {
      return "Invalid token";
    }
  }
}   
