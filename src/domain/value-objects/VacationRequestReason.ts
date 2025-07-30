export class VacationRequestReason {
  constructor(private readonly _value: string) {
    this.ensureValidReason(_value);
  }

  get value(): string {
    return this._value;
  }

  private ensureValidReason(reason: string): void {
    if (!reason || reason.trim().length === 0) {
      throw new Error('Vacation request reason cannot be empty');
    }
    if (reason.length < 10) {
      throw new Error('Vacation request reason must be at least 10 characters long');
    }
    if (reason.length > 500) {
      throw new Error('Vacation request reason cannot exceed 500 characters');
    }
  }

  static create(reason: string): VacationRequestReason {
    return new VacationRequestReason(reason.trim());
  }

  equals(other: VacationRequestReason): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 