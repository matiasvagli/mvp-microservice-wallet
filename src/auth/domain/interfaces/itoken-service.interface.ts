


export interface ITokenService {
  // El payload es lo único que le importa al dominio/aplicación
  generate(payload: Record<string, any>): Promise<string>;
  
  // Para verificar, solo necesitamos el token
  verify(token: string): Promise<Record<string, any> | string>;
}