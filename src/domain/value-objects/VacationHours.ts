export class VacationHours {
  constructor(private readonly _value: number) {
    this.ensureValidHours(_value);
  }

  get value(): number {
    return this._value;
  }

  private ensureValidHours(hours: number): void {
    if (hours < 0) {
      throw new Error('Vacation hours cannot be negative');
    }
    if (hours > 2920) {
      throw new Error('Vacation hours cannot exceed 2920');
    }
    if (!Number.isInteger(hours)) {
      throw new Error('Vacation hours must be an integer');
    }
  }

  static create(hours: number): VacationHours {
    return new VacationHours(hours);
  }

  equals(other: VacationHours): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value.toString();
  }
} 