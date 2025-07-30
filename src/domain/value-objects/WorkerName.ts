export class WorkerName {
  constructor(private readonly _value: string) {
    this.ensureValidName(_value);
  }

  get value(): string {
    return this._value;
  }

  private ensureValidName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Worker name cannot be empty');
    }
    if (name.length < 2) {
      throw new Error('Worker name must be at least 2 characters long');
    }
    if (name.length > 100) {
      throw new Error('Worker name cannot exceed 100 characters');
    }
  }

  static create(name: string): WorkerName {
    return new WorkerName(name.trim());
  }

  equals(other: WorkerName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 