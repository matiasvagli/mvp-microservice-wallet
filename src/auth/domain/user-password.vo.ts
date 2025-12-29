export class UserPassword {
  private readonly value: string;

  // El constructor es privado para forzar el uso de métodos estáticos (Factory Methods)
  private constructor(value: string) {
    this.value = value;
  }

  // Este método se usa cuando el usuario se registra (Password plana)
  static create(plainPassword: string): UserPassword {
    // 1. Validamos reglas de negocio (Lo que ya tenías)
    if (plainPassword.length < 8) {
      throw new Error('Password too short');
    }
    
    // Devolvemos el VO con la password plana (momento efímero)
    return new UserPassword(plainPassword);
  }

  // Este método se usa cuando traemos la data de la DB (Ya hasheada)
  static fromValue(hashedPassword: string): UserPassword {
    return new UserPassword(hashedPassword);
  }

  get getValue(): string {
    return this.value;
  }
}