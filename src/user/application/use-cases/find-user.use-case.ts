import { Inject, Injectable } from "@nestjs/common";
import type { UserRepository } from "../../domain/repositories/user.repository.interface";
import { User } from "../../domain/entities/user.entity";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";

@Injectable()
export class FindUserUseCase {
    constructor(
        @Inject('UserRepository')
        private readonly userRepository: UserRepository
    ) { }

    async execute(id: string): Promise<User> {
        const user = await this.userRepository.findById(new UUID(id));
        if (!user) throw new Error("User not found");
        return user;
    }
}
