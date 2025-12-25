


export class BirthDate {
  private readonly _value: Date;

  private constructor(value: Date) {
    this._value = value;
  }

  static create(dateInput: string | Date): BirthDate {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
      throw new Error('INVALID_DATE_FORMAT');
    }

    if (date > new Date()) {
      throw new Error('BIRTH_DATE_CANNOT_BE_IN_FUTURE');
    }

    return new BirthDate(date);
  }

  get age(): number {
    const today = new Date();
    let age = today.getFullYear() - this._value.getFullYear();
    const monthDiff = today.getMonth() - this._value.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this._value.getDate())) {
      age--;
    }
    return age;
  }

  isTeen(): boolean {
    const age = this.age;
    return age >= 13 && age <= 17;
  }

  isStandard(): boolean {
    return this.age >= 18;
  }

  getUserType(): 'teen' | 'standard' | 'minor' {
    if (this.age < 13) return 'minor';
    if (this.isTeen()) return 'teen';
    return 'standard';
  }

  get value(): Date {
    return new Date(this._value); // Retornamos copia para mantener inmutabilidad
  }
}