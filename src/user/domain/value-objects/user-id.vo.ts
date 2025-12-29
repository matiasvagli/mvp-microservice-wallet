
import { UUID } from '../../../shared/domain/value-objects/uuid.vo';

// Extendemos para que sea un tipo específico
// aca nos queda un trade-off entre simplicidad y claridad
// pero en dominios más complejos es preferible la claridad
// seria mejor tener un UserId con composición en lugar de herencia
export class UserId extends UUID {}