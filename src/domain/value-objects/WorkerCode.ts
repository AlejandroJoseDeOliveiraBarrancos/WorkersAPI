export class WorkerCode {
  constructor(private readonly _value: string) {
    this.ensureValidCode(_value);
  }

  get value(): string {
    return this._value;
  }

  private ensureValidCode(code: string): void {
    if (!code || code.trim().length === 0) {
      throw new Error('Worker code cannot be empty');
    }
    if (code.length < 3) {
      throw new Error('Worker code must be at least 3 characters long');
    }
  }

  static create(code: string): WorkerCode {
    return new WorkerCode(code);
  }

  equals(other: WorkerCode): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
} 