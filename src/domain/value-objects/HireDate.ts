export class HireDate {
  constructor(private readonly _value: Date) {
    this.ensureValidDate(_value);
  }

  get value(): Date {
    return this._value;
  }

  private ensureValidDate(date: Date): void {
    if (!date) {
      throw new Error('Hire date cannot be null or undefined');
    }
    if (isNaN(date.getTime())) {
      throw new Error('Hire date must be a valid date');
    }
    const now = new Date();
    if (date > now) {
      throw new Error('Hire date cannot be in the future');
    }
  }

  static create(date: Date): HireDate {
    return new HireDate(date);
  }

  static createFromString(dateString: string): HireDate {
    const date = new Date(dateString);
    return new HireDate(date);
  }

  equals(other: HireDate): boolean {
    return this._value.getTime() === other._value.getTime();
  }

  toString(): string {
    return this._value.toISOString();
  }
} 