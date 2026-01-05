import { User } from "../entities/user.entity";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";

export interface UserRepository {
    save(user: User): Promise<void>;
    findById(id: UUID): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}
