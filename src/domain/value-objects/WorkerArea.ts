export class WorkerArea {
  constructor(private readonly _value: string) {
    this.ensureValidArea(_value);
  }

  get value(): string {
    return this._value;
  }

  private ensureValidArea(area: string): void {
    if (!area || area.trim().length === 0) {
      throw new Error('Worker area cannot be empty');
    }
    if (area.length < 2) {
      throw new Error('Worker area must be at least 2 characters long');
    }
    if (area.length > 50) {
      throw new Error('Worker area cannot exceed 50 characters');
    }
  }

  static create(area: string): WorkerArea {
    return new WorkerArea(area.trim());
  }

  equals(other: WorkerArea): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 