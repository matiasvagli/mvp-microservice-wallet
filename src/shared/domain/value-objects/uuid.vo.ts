// Usamos require para evitar el problema del 'export' en Jest
const uuidLib = require('uuid');

export class UUID {
  constructor(public readonly value: string) {
    if (!uuidLib.validate(value)) {
      throw new Error(`Invalid UUID: ${value}`);
    }
  }

  static random(): UUID {
    return new UUID(uuidLib.v4());
  }
}