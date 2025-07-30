export class WorkerPosition {
  constructor(private readonly _value: string) {
    this.ensureValidPosition(_value);
  }

  get value(): string {
    return this._value;
  }

  private ensureValidPosition(position: string): void {
    if (!position || position.trim().length === 0) {
      throw new Error('Worker position cannot be empty');
    }
    if (position.length < 2) {
      throw new Error('Worker position must be at least 2 characters long');
    }
    if (position.length > 50) {
      throw new Error('Worker position cannot exceed 50 characters');
    }
  }

  static create(position: string): WorkerPosition {
    return new WorkerPosition(position.trim());
  }

  equals(other: WorkerPosition): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 