export class VacationDays {
  constructor(private readonly _value: number) {
    this.ensureValidDays(_value);
  }

  get value(): number {
    return this._value;
  }

  private ensureValidDays(days: number): void {
    if (days < 0) {
      throw new Error('Vacation days cannot be negative');
    }
    if (days > 365) {
      throw new Error('Vacation days cannot exceed 365');
    }
    if (!Number.isInteger(days)) {
      throw new Error('Vacation days must be an integer');
    }
  }

  static create(days: number): VacationDays {
    return new VacationDays(days);
  }

  equals(other: VacationDays): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
} 