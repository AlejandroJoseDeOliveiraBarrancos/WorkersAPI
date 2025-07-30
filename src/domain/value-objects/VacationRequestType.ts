export type VacationRequestTypeValue = 'days' | 'hours';

export class VacationRequestType {
  constructor(private readonly _value: VacationRequestTypeValue) {
    this.ensureValidType(_value);
  }

  get value(): VacationRequestTypeValue {
    return this._value;
  }

  private ensureValidType(type: VacationRequestTypeValue): void {
    const validTypes: VacationRequestTypeValue[] = ['days', 'hours'];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid vacation request type: ${type}`);
    }
  }

  static create(type: VacationRequestTypeValue): VacationRequestType {
    return new VacationRequestType(type);
  }

  equals(other: VacationRequestType): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 