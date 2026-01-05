import { Injectable } from '@nestjs/common';
import type { UserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { PrismaService } from '../../../wallet/infrastructure/persistence/prisma.service'; // Reusamos el de wallet por ahora? Debería estar en shared/infra?
import { UUID } from '../../../shared/domain/value-objects/uuid.vo';
import { BirthDate } from '../../domain/value-objects/birth-date.vo';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: UUID): Promise<User | null> {
        const rawUser = await this.prisma.user.findUnique({
            where: { id: id.value },
            include: { account: true }, // Necesitamos account para el email
        });

        if (!rawUser || !rawUser.account) return null; // Si no tiene account, no tenemos email, data corrupta para nuestro dominio?

        return User.hydrate({
            id: new UUID(rawUser.id),
            email: rawUser.account.email,
            name: rawUser.name,
            lastName: '', // Schema no tiene lastName! Usamos placeholder o name split?
            birthDate: BirthDate.create(new Date('2000-01-01')), // Schema no tiene birthDate!
            createdAt: rawUser.createdAt,
            updatedAt: rawUser.updatedAt,
        });
    }

    async findByEmail(email: string): Promise<User | null> {
        const rawAccount = await this.prisma.account.findUnique({
            where: { email },
            include: { user: true },
        });

        if (!rawAccount || !rawAccount.user) return null;

        return User.hydrate({
            id: new UUID(rawAccount.user.id),
            email: rawAccount.email,
            name: rawAccount.user.name,
            lastName: '',
            birthDate: BirthDate.create(new Date('2000-01-01')),
            createdAt: rawAccount.user.createdAt,
            updatedAt: rawAccount.user.updatedAt,
        });
    }

    async save(user: User): Promise<void> {
        // Guardar User y Account?
        // Por ahora solo actualizamos User, asumimos que Account se crea en Auth
        await this.prisma.user.upsert({
            where: { id: user.idValue },
            update: {
                name: user.nameValue,
                // lastName y birthDate no existen en schema
            },
            create: {
                id: user.idValue,
                name: user.nameValue,
                username: user.emailValue.split('@')[0] + Math.floor(Math.random() * 1000), // Generamos username
                // Falta vincular account? 
            }
        });
    }
}
