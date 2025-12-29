import { ItokenService } from "src/auth/domain/interfaces/itoken-service.interface";


export class FakeTokenService implements ItokenService {
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
