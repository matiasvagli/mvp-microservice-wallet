import { User } from './user.entity';
import { BirthDate } from '../value-objects/birth-date.vo';

describe('User Entity', () => {
	it('debería crear un usuario válido (mayor de 13)', () => {
		const birthDate = BirthDate.create('2000-01-01');
		const user = User.create('test@mail.com', 'Juan', 'Pérez', birthDate);
		expect(user).toBeInstanceOf(User);
		expect(user.emailValue).toBe('test@mail.com');
		expect(user.nameValue).toBe('Juan');
		expect(user.lastNameValue).toBe('Pérez');
		expect(user.birthDateValue.age).toBeGreaterThanOrEqual(13);
	});

	it('debería lanzar error si el usuario es menor de 13 años', () => {
		const birthDate = BirthDate.create(new Date(Date.now() - 12 * 365 * 24 * 60 * 60 * 1000)); // ~12 años
		expect(() => {
			User.create('test@mail.com', 'Juan', 'Pérez', birthDate);
		}).toThrow('USER_MUST_BE_AT_LEAST_13_YEARS_OLD');
	});

	it('debería exponer los getters correctamente', () => {
		const birthDate = BirthDate.create('2005-05-05');
		const user = User.create('a@b.com', 'Ana', 'López', birthDate);
		expect(typeof user.idValue).toBe('string');
		expect(user.emailValue).toBe('a@b.com');
		expect(user.nameValue).toBe('Ana');
		expect(user.lastNameValue).toBe('López');
		expect(user.birthDateValue).toBeInstanceOf(BirthDate);
		expect(user.createdAtValue).toBeInstanceOf(Date);
		expect(user.updatedAtValue).toBeInstanceOf(Date);
		expect(['teen', 'standard']).toContain(user.typeValue);
	});

	it('debería calcular correctamente la edad', () => {
		const birthDate = BirthDate.create('2010-01-01');
		const user = User.create('c@d.com', 'Carlos', 'Martínez', birthDate);
		expect(user.age).toBeGreaterThanOrEqual(13);
	});
});
