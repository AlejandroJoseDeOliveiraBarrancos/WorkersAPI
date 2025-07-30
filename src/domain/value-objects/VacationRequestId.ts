import { v4 as uuidv4 } from 'uuid';

export class VacationRequestId {
  constructor(private readonly _value: string) {
    this.ensureValidId(_value);
  }

  get value(): string {
    return this._value;
  }

  private ensureValidId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error('Vacation request ID cannot be empty');
    }
  }

  static create(id: string): VacationRequestId {
    return new VacationRequestId(id);
  }

  static generate(): VacationRequestId {
    return new VacationRequestId(uuidv4());
  }

  equals(other: VacationRequestId): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 