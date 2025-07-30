export type VacationRequestStatusValue = 'pending' | 'approved' | 'rejected';

export class VacationRequestStatus {
  constructor(private readonly _value: VacationRequestStatusValue) {
    this.ensureValidStatus(_value);
  }

  get value(): VacationRequestStatusValue {
    return this._value;
  }

  private ensureValidStatus(status: VacationRequestStatusValue): void {
    const validStatuses: VacationRequestStatusValue[] = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid vacation request status: ${status}`);
    }
  }

  static create(status: VacationRequestStatusValue): VacationRequestStatus {
    return new VacationRequestStatus(status);
  }

  equals(other: VacationRequestStatus): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 