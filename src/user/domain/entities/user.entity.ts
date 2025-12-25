
import { AggregateRoot } from "../../../shared/domain/aggregate-root";
import { UUID } from "../../../shared/domain/value-objects/uuid.vo";
import { BirthDate } from "../value-objects/birth-date.vo";

export class User extends AggregateRoot {
    private constructor(
        private readonly id: UUID,
        private readonly email: string,
        private readonly name: string,
        private readonly lastName: string,
        private readonly birthDate: BirthDate,
        private readonly createdAt: Date = new Date(),
        private readonly updatedAt: Date = new Date(),
        
    )
    {
        super();
    }

    
    // No vive en el constructor, se calcula cada vez que alguien lo pide.
    // Para evitar inconsistencias actualizando la fecha de nacimiento.
    get type(): 'teen' | 'standard' | 'minor' {
        return this.birthDate.getUserType();
    }


   // 2. HYDRATE (Para cuando venís de la DB)
    static hydrate(props: {
        id: UUID;
        email: string;
        name: string;
        lastName: string;
        birthDate: BirthDate;
        createdAt: Date; // Usamos la de la DB
        updatedAt: Date; // Usamos la de la DB
    }): User {
        return new User(
            props.id,
            props.email,
            props.name,
            props.lastName,
            props.birthDate,
            props.createdAt,
            props.updatedAt
        );
    }
    
    



    static create(email: string, name: string, lastName: string, birthDate: BirthDate): User {
        const userType = birthDate.getUserType();
        
        // Validación opcional: no permitir menores de 13 años
        if (userType === 'minor') {
            throw new Error('USER_MUST_BE_AT_LEAST_13_YEARS_OLD');
        }

        return new User(
            UUID.random(),
            email,
            name,
            lastName,
            birthDate,
            new Date(),
            new Date(),
            
        );
    }
       
    get idValue(): string { return this.id.value; }
    get emailValue(): string { return this.email; }
    get nameValue(): string { return this.name; }
    get lastNameValue(): string { return this.lastName; }
    get birthDateValue(): BirthDate { return this.birthDate; }
    get createdAtValue(): Date { return this.createdAt; }
    get updatedAtValue(): Date { return this.updatedAt; }
    get typeValue(): 'teen' | 'standard' | 'minor' { return this.type; }

    // Métodos de conveniencia que delegan en el VO
    isTeen(): boolean {
        return this.birthDate.isTeen();
    }

    isStandard(): boolean {
        return this.birthDate.isStandard();
    }

get age(): number {
    return this.birthDate.age;
}
}