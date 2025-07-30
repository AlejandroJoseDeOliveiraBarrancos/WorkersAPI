export class VacationStartDate {
  constructor(private readonly _value: Date) {
    this.ensureValidDate(_value);
  }

  get value(): Date {
    return this._value;
  }

  private ensureValidDate(date: Date): void {
    if (!date) {
      throw new Error('Vacation start date cannot be null or undefined');
    }
    if (isNaN(date.getTime())) {
      throw new Error('Vacation start date must be a valid date');
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      throw new Error('Vacation start date cannot be in the past');
    }
  }

  static create(date: Date): VacationStartDate {
    return new VacationStartDate(date);
  }

  static createFromString(dateString: string): VacationStartDate {
    const date = new Date(dateString);
    return new VacationStartDate(date);
  }

  equals(other: VacationStartDate): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this._value.toISOString();
  }
} 